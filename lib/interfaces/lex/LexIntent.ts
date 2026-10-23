import type { Intent as AwsLexIntent } from '@aws-sdk/client-lex-runtime-v2';
import type { LexSlot } from './LexSlot';

export interface LexIntent extends Omit<AwsLexIntent, 'name' | 'slots'> {
  readonly name: NonNullable<AwsLexIntent['name']>;
  readonly slots?: Record<string, LexSlot | null>;
}
