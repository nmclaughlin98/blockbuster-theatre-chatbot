import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ApplicationStack } from '../../../lib/stack';

describe('Example Lambda stack', () => {
  it('creates one Node.js Lambda with the configured defaults', () => {
    const app = new cdk.App();
    const stack = new ApplicationStack(app, 'TestStack');
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Runtime: 'nodejs24.x',
      MemorySize: 256,
      Timeout: 10,
    });
  });
});
