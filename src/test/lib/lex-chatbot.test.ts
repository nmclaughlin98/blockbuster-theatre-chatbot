import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { BlockbusterTheatreChatbotStack } from '../../../lib/stack-configuration';

describe('Blockbuster Theatre Lex chatbot stack', () => {
  const createTemplate = (): Template => {
    const app = new cdk.App();
    const stack = new BlockbusterTheatreChatbotStack(app, 'TestStack');

    return Template.fromStack(stack);
  };

  it('creates a Node.js fulfillment Lambda and Lex V2 bot resources', () => {
    const template = createTemplate();

    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Runtime: 'nodejs24.x',
      MemorySize: 256,
      Timeout: 20,
      Environment: {
        Variables: {
          THEATRE_BACKEND_API_URL:
            'https://api.blockbuster-theatre.nml-applications.com',
        },
      },
    });
    template.resourceCountIs('AWS::Lex::Bot', 1);
    template.hasResource(
      'AWS::Lex::Bot',
      Match.objectLike({
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
      })
    );
    template.resourceCountIs('AWS::Lex::BotVersion', 1);
    template.resourceCountIs('AWS::Lex::BotAlias', 1);
    template.resourceCountIs('AWS::Lambda::Permission', 1);
  });

  it('configures showtime, booking, and fallback intents with their required slots', () => {
    const template = createTemplate();

    template.hasResourceProperties('AWS::Lex::Bot', {
      BotLocales: Match.arrayWith([
        Match.objectLike({
          LocaleId: 'en_GB',
          Intents: Match.arrayWith([
            Match.objectLike({ Name: 'BrowseUpcomingShowings' }),
            Match.objectLike({
              Name: 'FindShowtimesByMovie',
              Slots: Match.arrayWith([
                Match.objectLike({
                  Name: 'MovieName',
                  SlotTypeName: 'AMAZON.AlphaNumeric',
                }),
              ]),
            }),
            Match.objectLike({
              Name: 'FindShowtimesByDate',
              Slots: Match.arrayWith([
                Match.objectLike({
                  Name: 'ShowingDate',
                  SlotTypeName: 'AMAZON.Date',
                }),
              ]),
            }),
            Match.objectLike({
              Name: 'FindShowtimesByTime',
              Slots: Match.arrayWith([
                Match.objectLike({
                  Name: 'ShowingTime',
                  SlotTypeName: 'AMAZON.Time',
                }),
              ]),
            }),
            Match.objectLike({
              Name: 'FindShowtimesByMovieAndDate',
              Slots: Match.arrayWith([
                Match.objectLike({ Name: 'MovieName' }),
                Match.objectLike({ Name: 'ShowingDate' }),
              ]),
            }),
            Match.objectLike({
              Name: 'FindShowtimesByMovieDateAndTime',
              Slots: Match.arrayWith([
                Match.objectLike({ Name: 'MovieName' }),
                Match.objectLike({ Name: 'ShowingDate' }),
                Match.objectLike({ Name: 'ShowingTime' }),
              ]),
            }),
            Match.objectLike({ Name: 'ViewMyBookings' }),
            Match.objectLike({
              Name: 'FallbackIntent',
              ParentIntentSignature: 'AMAZON.FallbackIntent',
            }),
          ]),
        }),
      ]),
    });
  });

  it('configures the alias to invoke the fulfillment Lambda and grants Lex permission', () => {
    const template = createTemplate();

    template.hasResourceProperties('AWS::Lex::BotAlias', {
      BotAliasName: 'Live',
      BotAliasLocaleSettings: Match.arrayWith([
        Match.objectLike({
          LocaleId: 'en_GB',
          BotAliasLocaleSetting: Match.objectLike({
            Enabled: true,
            CodeHookSpecification: Match.objectLike({
              LambdaCodeHook: Match.objectLike({
                CodeHookInterfaceVersion: '1.0',
                LambdaArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
              }),
            }),
          }),
        }),
      ]),
    });
    template.hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'lexv2.amazonaws.com',
      SourceArn: {
        'Fn::Join': Match.anyValue(),
      },
    });

    type ResourceWithDependencies = {
      Type?: string;
      DependsOn?: string | string[];
    };
    const resources = template.toJSON().Resources as Record<
      string,
      ResourceWithDependencies
    >;
    const botAlias = Object.entries(resources).find(
      ([, resource]) => resource.Type === 'AWS::Lex::BotAlias'
    );
    const lambdaPermission = Object.entries(resources).find(
      ([, resource]) => resource.Type === 'AWS::Lambda::Permission'
    );

    expect(botAlias).toBeDefined();
    expect(lambdaPermission).toBeDefined();
    expect(botAlias?.[1].DependsOn).toContain(lambdaPermission?.[0]);
  });

  it('scopes the Lex service role trust and CloudWatch log permissions', () => {
    const template = createTemplate();

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'sts:AssumeRole',
            Condition: {
              StringEquals: {
                'aws:SourceAccount': { Ref: 'AWS::AccountId' },
              },
            },
            Effect: 'Allow',
            Principal: { Service: 'lexv2.amazonaws.com' },
          }),
        ]),
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'logs:CreateLogGroup',
          }),
          Match.objectLike({
            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
          }),
        ]),
      },
    });

    type SynthesizedResource = {
      Type?: string;
      Properties?: {
        AssumeRolePolicyDocument?: {
          Statement?: Array<{ Principal?: { Service?: string } }>;
        };
        ManagedPolicyArns?: unknown;
        PolicyDocument?: unknown;
      };
    };
    const resources = Object.values(
      template.toJSON().Resources as Record<string, SynthesizedResource>
    );
    const lexRole = resources.find((resource) =>
      resource.Type === 'AWS::IAM::Role' &&
      resource.Properties?.AssumeRolePolicyDocument?.Statement?.some(
        (statement) => statement.Principal?.Service === 'lexv2.amazonaws.com'
      )
    );
    const lexPolicy = resources.find((resource) =>
      resource.Type === 'AWS::IAM::Policy' &&
      (JSON.stringify(resource.Properties?.PolicyDocument) ?? '').includes('logs:CreateLogGroup')
    );

    expect(lexRole?.Properties?.ManagedPolicyArns).toBeUndefined();
    expect(JSON.stringify(lexPolicy?.Properties?.PolicyDocument) ?? '').toContain(
      'log-group:/aws/lex/*'
    );
    expect(JSON.stringify(lexPolicy?.Properties?.PolicyDocument) ?? '').not.toContain(
      '"Resource":"*"'
    );
  });
});
