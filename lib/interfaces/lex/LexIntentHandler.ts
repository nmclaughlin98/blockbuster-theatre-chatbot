import type { LexFulfillmentEvent } from './LexFulfillmentEvent';

export interface LexIntentHandler {
  handle(event: LexFulfillmentEvent): string;
}
