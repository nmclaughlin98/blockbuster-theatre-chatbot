import type { SlotDefinition } from './SlotDefinition';

export interface IntentDefinition {
  readonly name: string;
  readonly description: string;
  readonly sampleUtterances: readonly string[];
  readonly slots?: readonly SlotDefinition[];
  readonly parentIntentSignature?: string;
}
