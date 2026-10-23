import { getIntentMessage } from '../intent-handlers';
import { splitLexMessages } from '../services/split-lex-messages';
import type { LexFulfillmentEvent } from '../../../../lib/interfaces/lex/LexFulfillmentEvent';
import type { LexFulfillmentResponse } from '../../../../lib/interfaces/lex/LexFulfillmentResponse';

export const handler = async (
  event: LexFulfillmentEvent
): Promise<LexFulfillmentResponse> => {
  const intentName = event.sessionState.intent.name;
  const responseText = await getIntentMessage(event);

  return {
    sessionState: {
      dialogAction: { type: 'Close' },
      intent: { name: intentName, state: 'Fulfilled' },
    },
    messages: splitLexMessages(responseText).map((content) => ({
      contentType: 'PlainText',
      content,
    })),
  };
};
