import * as cdk from 'aws-cdk-lib';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';
import { lambdaSettings } from '../../../lib/stack/lambda';

export class LambdaConstruct extends Construct {
  public readonly exampleFunction: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.exampleFunction = new lambdaNodejs.NodejsFunction(this, 'ExampleFunction', {
      entry: path.join(__dirname, 'handlers', 'hello-handler.ts'),
      handler: 'handler',
      runtime: lambdaSettings.runtime,
      memorySize: lambdaSettings.memorySize,
      timeout: cdk.Duration.seconds(lambdaSettings.timeoutSeconds),
    });
  }
}
