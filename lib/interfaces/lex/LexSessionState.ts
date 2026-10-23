import type { LexIntent } from './LexIntent';

export interface LexSessionState {
  readonly intent: LexIntent;
}
