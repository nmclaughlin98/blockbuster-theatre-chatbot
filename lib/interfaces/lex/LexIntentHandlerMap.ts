import type { LexIntentHandler } from './LexIntentHandler';

export interface LexIntentHandlerMap {
  readonly [intentName: string]: LexIntentHandler;
}
