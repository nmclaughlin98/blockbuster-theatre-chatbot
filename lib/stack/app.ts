import * as cdk from 'aws-cdk-lib';
import { ApplicationStack } from '../stack-configuration';

const app = new cdk.App();

new ApplicationStack(app, 'ApplicationStack', {
  description: 'Blockbuster Theatre Lex V2 chatbot',
});

app.synth();
