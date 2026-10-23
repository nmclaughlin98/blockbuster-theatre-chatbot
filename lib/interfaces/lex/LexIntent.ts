import type { LexSlot } from './LexSlot';

export interface LexIntent {
  readonly name: string;
  readonly slots?: Record<string, LexSlot | null>;
}
