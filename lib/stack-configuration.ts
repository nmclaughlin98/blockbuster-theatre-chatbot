import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LexChatbotConstruct } from './lex/lex-chatbot';

export class ApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add('Project', 'blockbuster-theatre');

    const chatbot = new LexChatbotConstruct(this, 'BlockbusterTheatreChatbot');

    new cdk.CfnOutput(this, 'BotId', {
      value: chatbot.bot.ref,
      description: 'Amazon Lex V2 bot ID',
    });

    new cdk.CfnOutput(this, 'BotAliasId', {
      value: chatbot.botAlias.attrBotAliasId,
      description: 'Amazon Lex V2 bot alias ID for text conversations',
    });

    new cdk.CfnOutput(this, 'BotAliasArn', {
      value: chatbot.botAlias.attrArn,
      description: 'Amazon Lex V2 bot alias ARN',
    });

    new cdk.CfnOutput(this, 'BotLocaleId', {
      value: 'en_US',
      description: 'Locale configured for the chatbot',
    });

    new cdk.CfnOutput(this, 'FulfillmentLambdaArn', {
      value: chatbot.fulfillmentFunction.functionArn,
      description: 'ARN of the Lambda function that fulfills chatbot intents',
    });
  }
}
