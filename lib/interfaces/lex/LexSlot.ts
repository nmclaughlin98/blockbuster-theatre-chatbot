import type { Slot as AwsLexSlot } from '@aws-sdk/client-lex-runtime-v2';
import type { LexSlotValue } from './LexSlotValue';

export interface LexSlot extends Omit<AwsLexSlot, 'value'> {
  readonly value?: LexSlotValue;
}
