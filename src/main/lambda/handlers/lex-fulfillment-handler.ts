import { getIntentMessage } from '../intent-handlers';
import type { LexFulfillmentEvent } from '../../../../lib/interfaces/lex/LexFulfillmentEvent';
import type { LexFulfillmentResponse } from '../../../../lib/interfaces/lex/LexFulfillmentResponse';

export const handler = async (
  event: LexFulfillmentEvent
): Promise<LexFulfillmentResponse> => {
  const intentName = event.sessionState.intent.name;

  return {
    sessionState: {
      dialogAction: { type: 'Close' },
      intent: { name: intentName, state: 'Fulfilled' },
    },
    messages: [{ contentType: 'PlainText', content: getIntentMessage(event) }],
  };
};
