import type { Message as AwsLexMessage } from '@aws-sdk/client-lex-runtime-v2';
import type { LexIntent } from './LexIntent';
import type { LexSessionState } from './LexSessionState';

type FulfilledLexIntent = LexIntent & {
  readonly state: 'Fulfilled';
};

type FulfilledLexSessionState = LexSessionState & {
  readonly dialogAction: NonNullable<LexSessionState['dialogAction']> & {
    readonly type: 'Close';
  };
  readonly intent: FulfilledLexIntent;
};

type PlainTextLexMessage = AwsLexMessage & {
    readonly contentType: 'PlainText';
    readonly content: string;
  };

export interface LexFulfillmentResponse {
  readonly sessionState: FulfilledLexSessionState;
  readonly messages: PlainTextLexMessage[];
}
