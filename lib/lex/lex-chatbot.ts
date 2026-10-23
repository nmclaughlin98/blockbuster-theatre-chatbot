import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lex from 'aws-cdk-lib/aws-lex';
import { Construct } from 'constructs';
import * as path from 'path';
import { lambdaSettings } from '../stack/lambda';
import { theatreIntents } from './intents';

export class LexChatbotConstruct extends Construct {
  public readonly bot: lex.CfnBot;
  public readonly botAlias: lex.CfnBotAlias;
  public readonly fulfillmentFunction: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const lexServiceRole = new iam.Role(this, 'LexServiceRole', {
      assumedBy: new iam.ServicePrincipal('lexv2.amazonaws.com').withConditions({
        StringEquals: {
          'aws:SourceAccount': cdk.Stack.of(this).account,
        },
      }),
    });
    const lexLogGroupArn = cdk.Stack.of(this).formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: '/aws/lex/*',
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    });
    lexServiceRole.addToPolicy(new iam.PolicyStatement({
      actions: ['logs:CreateLogGroup'],
      resources: [lexLogGroupArn],
    }));
    lexServiceRole.addToPolicy(new iam.PolicyStatement({
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: [`${lexLogGroupArn}:*`],
    }));

    this.fulfillmentFunction = new lambdaNodejs.NodejsFunction(this, 'FulfillmentFunction', {
      entry: path.join(
        __dirname,
        '..',
        '..',
        'src',
        'main',
        'lambda',
        'handlers',
        'lex-fulfillment-handler.ts'
      ),
      handler: 'handler',
      runtime: lambdaSettings.runtime,
      memorySize: lambdaSettings.memorySize,
      timeout: cdk.Duration.seconds(lambdaSettings.timeoutSeconds),
      environment: {
        THEATRE_BACKEND_API_URL:
          process.env.THEATRE_BACKEND_API_URL ??
          'https://api.blockbuster-theatre.nml-applications.com',
      },
    });

    this.bot = new lex.CfnBot(this, 'Bot', {
      name: 'BlockbusterTheatreBot',
      description: 'Text chatbot for Blockbuster Theatre movie showtimes.',
      roleArn: lexServiceRole.roleArn,
      dataPrivacy: { ChildDirected: false },
      idleSessionTtlInSeconds: 300,
      autoBuildBotLocales: true,
      errorLogSettings: { enabled: true },
      botLocales: [
        {
          localeId: 'en_US',
          description: 'English (United States)',
          nluConfidenceThreshold: 0.4,
          intents: theatreIntents,
        },
      ],
    });

    const botVersion = new lex.CfnBotVersion(this, 'BotVersion', {
      botId: this.bot.ref,
      description: 'Initial Blockbuster Theatre chatbot version.',
      botVersionLocaleSpecification: [
        {
          localeId: 'en_US',
          botVersionLocaleDetails: { sourceBotVersion: 'DRAFT' },
        },
      ],
    });

    this.botAlias = new lex.CfnBotAlias(this, 'BotAlias', {
      botAliasName: 'Live',
      description: 'Text-chat alias for the Blockbuster Theatre website.',
      botId: this.bot.ref,
      botVersion: botVersion.attrBotVersion,
      botAliasLocaleSettings: [
        {
          localeId: 'en_US',
          botAliasLocaleSetting: {
            enabled: true,
            codeHookSpecification: {
              lambdaCodeHook: {
                lambdaArn: this.fulfillmentFunction.functionArn,
                codeHookInterfaceVersion: '1.0',
              },
            },
          },
        },
      ],
    });

    const allowLexInvokeFulfillment = new lambda.CfnPermission(
      this,
      'AllowLexInvokeFulfillment',
      {
        action: 'lambda:InvokeFunction',
        functionName: this.fulfillmentFunction.functionArn,
        principal: 'lexv2.amazonaws.com',
        sourceArn: cdk.Stack.of(this).formatArn({
          service: 'lex',
          resource: 'bot-alias',
          resourceName: `${this.bot.ref}/*`,
          arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
        }),
      }
    );
    this.botAlias.addResourceDependency(allowLexInvokeFulfillment);
  }
}
