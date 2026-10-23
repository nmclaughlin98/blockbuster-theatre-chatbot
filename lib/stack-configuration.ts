import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaConstruct } from './stack';

export class ApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add('Project', 'blockbuster-theatre-chatbot');

    const lambda = new LambdaConstruct(this, 'ExampleLambda');

    new cdk.CfnOutput(this, 'ExampleLambdaFunctionArn', {
      value: lambda.exampleFunction.functionArn,
      description: 'ARN of the example Lambda function',
    });
  }
}
