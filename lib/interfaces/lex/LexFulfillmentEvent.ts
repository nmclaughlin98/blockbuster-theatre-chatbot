import type { LexSessionState } from './LexSessionState';

export interface LexFulfillmentEvent {
  readonly sessionState: LexSessionState;
}
