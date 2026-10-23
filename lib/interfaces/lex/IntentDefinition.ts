import type * as lex from 'aws-cdk-lib/aws-lex';
import type { SlotDefinition } from './SlotDefinition';

export interface IntentDefinition extends lex.CfnBot.IntentProperty {
  readonly description: string;
  readonly sampleUtterances?: lex.CfnBot.SampleUtteranceProperty[];
  readonly slots?: SlotDefinition[];
}
