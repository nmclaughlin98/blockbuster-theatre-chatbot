import type { LexIntentHandler } from '../../../../../lib/interfaces/lex/LexIntentHandler';
import type { LexFulfillmentEvent } from '../../../../../lib/interfaces/lex/LexFulfillmentEvent';
import { getSlotValue } from '../../handlers/get-slot-value';
import { FIND_SHOWTIMES_BY_TIME_DEFAULT_PROMPT } from './messageTemplates';

export class FindShowtimesByTimeIntentHandler implements LexIntentHandler {
  handle(event: LexFulfillmentEvent): string {
    const showingTime = getSlotValue(event, 'ShowingTime');

    return FIND_SHOWTIMES_BY_TIME_DEFAULT_PROMPT(showingTime);
  }
}
