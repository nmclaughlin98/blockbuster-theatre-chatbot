import * as cdk from 'aws-cdk-lib';
import { BlockbusterTheatreChatbotStack } from '../stack-configuration';

const app = new cdk.App();

new BlockbusterTheatreChatbotStack(app, 'BlockbusterTheatreChatbotStack', {
  description: 'Blockbuster Theatre Lex V2 chatbot',
});

app.synth();
