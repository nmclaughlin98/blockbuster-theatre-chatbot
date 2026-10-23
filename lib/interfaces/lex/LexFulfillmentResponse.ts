export interface LexFulfillmentResponse {
  readonly sessionState: {
    readonly dialogAction: { readonly type: 'Close' };
    readonly intent: {
      readonly name: string;
      readonly state: 'Fulfilled';
    };
  };
  readonly messages: ReadonlyArray<{
    readonly contentType: 'PlainText';
    readonly content: string;
  }>;
}
