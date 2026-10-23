import type { LexIntentHandler } from '../../../../../lib/interfaces/lex/LexIntentHandler';
import type { LexFulfillmentEvent } from '../../../../../lib/interfaces/lex/LexFulfillmentEvent';
import { getSlotValue } from '../../handlers/get-slot-value';
import { FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_DEFAULT_PROMPT } from './messageTemplates';

export class FindShowtimesByMovieDateAndTimeIntentHandler implements LexIntentHandler {
  handle(event: LexFulfillmentEvent): string {
    const movieName = getSlotValue(event, 'MovieName');
    const showingDate = getSlotValue(event, 'ShowingDate');
    const showingTime = getSlotValue(event, 'ShowingTime');

    return FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_DEFAULT_PROMPT(
      movieName,
      showingDate,
      showingTime
    );
  }
}
