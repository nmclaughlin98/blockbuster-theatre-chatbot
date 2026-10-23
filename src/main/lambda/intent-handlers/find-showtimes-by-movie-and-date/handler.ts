import type { LexIntentHandler } from '../../../../../lib/interfaces/lex/LexIntentHandler';
import type { LexFulfillmentEvent } from '../../../../../lib/interfaces/lex/LexFulfillmentEvent';
import { getSlotValue } from '../../handlers/get-slot-value';
import { FIND_SHOWTIMES_BY_MOVIE_AND_DATE_DEFAULT_PROMPT } from './messageTemplates';

export class FindShowtimesByMovieAndDateIntentHandler implements LexIntentHandler {
  handle(event: LexFulfillmentEvent): string {
    const movieName = getSlotValue(event, 'MovieName');
    const showingDate = getSlotValue(event, 'ShowingDate');

    return FIND_SHOWTIMES_BY_MOVIE_AND_DATE_DEFAULT_PROMPT(movieName, showingDate);
  }
}
