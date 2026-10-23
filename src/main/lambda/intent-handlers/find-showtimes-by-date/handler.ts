import type { LexIntentHandler } from '../../../../../lib/interfaces/lex/LexIntentHandler';
import type { LexFulfillmentEvent } from '../../../../../lib/interfaces/lex/LexFulfillmentEvent';
import { getSlotValue } from '../../handlers/get-slot-value';
import { FIND_SHOWTIMES_BY_DATE_DEFAULT_PROMPT } from './messageTemplates';

export class FindShowtimesByDateIntentHandler implements LexIntentHandler {
  handle(event: LexFulfillmentEvent): string {
    const showingDate = getSlotValue(event, 'ShowingDate');

    return FIND_SHOWTIMES_BY_DATE_DEFAULT_PROMPT(showingDate);
  }
}
