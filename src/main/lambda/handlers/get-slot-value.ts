import type { LexFulfillmentEvent } from '../../../../lib/interfaces/lex/LexFulfillmentEvent';

export const getSlotValue = (
  event: LexFulfillmentEvent,
  slotName: string
): string | undefined => {
  const slot = event.sessionState.intent.slots?.[slotName];

  return slot?.value?.originalValue ?? slot?.value?.interpretedValue;
};
