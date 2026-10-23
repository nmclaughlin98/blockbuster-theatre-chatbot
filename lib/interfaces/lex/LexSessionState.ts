import type { RecognizeTextCommandOutput } from '@aws-sdk/client-lex-runtime-v2';
import type { LexIntent } from './LexIntent';

export interface LexSessionState
  extends Omit<
    NonNullable<RecognizeTextCommandOutput['sessionState']>,
    'intent'
  > {
  readonly intent: LexIntent;
}
