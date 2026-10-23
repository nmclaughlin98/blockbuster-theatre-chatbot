import * as cdk from 'aws-cdk-lib';
import { ApplicationStack } from '../stack-configuration';

const app = new cdk.App();

new ApplicationStack(app, 'ApplicationStack', {
  description: 'Example AWS CDK stack with a Node.js Lambda',
});

app.synth();
