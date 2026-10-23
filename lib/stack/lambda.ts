import * as lambda from 'aws-cdk-lib/aws-lambda';

export const lambdaSettings = {
  runtime: lambda.Runtime.NODEJS_24_X,
  memorySize: 256,
  timeoutSeconds: 20,
} as const;
