import type { LexIntentHandler } from '../../../../../lib/interfaces/lex/LexIntentHandler';
import type { LexFulfillmentEvent } from '../../../../../lib/interfaces/lex/LexFulfillmentEvent';
import {
  getInterpretedSlotValue,
  getSlotValue,
} from '../../handlers/get-slot-value';
import { theatreShowtimeService } from '../../services/theatre-showtime-service';
import { withTheatreBackendErrorPrompt } from '../../services/with-theatre-backend-error';
import {
  FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_AMBIGUOUS_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_BACKEND_ERROR_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_INVALID_DATE_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_INVALID_TIME_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_MISSING_TITLE_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_NO_SHOWINGS_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_NOT_FOUND_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_RESULTS_PROMPT,
} from './messageTemplates';

export class FindShowtimesByMovieDateAndTimeIntentHandler implements LexIntentHandler {
  handle(event: LexFulfillmentEvent): Promise<string> {
    const movieName = getSlotValue(event, 'MovieName');
    const showingDate = getSlotValue(event, 'ShowingDate');
    const showingTime = getSlotValue(event, 'ShowingTime');
    const normalizedDate = getInterpretedSlotValue(event, 'ShowingDate');
    const normalizedTime = getInterpretedSlotValue(event, 'ShowingTime');

    return withTheatreBackendErrorPrompt(async () => {
      const result = await theatreShowtimeService.getShowingsForMovie(
        movieName,
        { date: normalizedDate, time: normalizedTime }
      );

      if (result.kind === 'missing-movie') {

        return FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_MISSING_TITLE_PROMPT;
      }

      if (result.kind === 'invalid-date') {

        return FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_INVALID_DATE_PROMPT;
      }

      if (result.kind === 'invalid-time') {

        return FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_INVALID_TIME_PROMPT;
      }

      if (result.kind === 'movie-not-found') {

        return FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_NOT_FOUND_PROMPT(movieName ?? '');
      }

      if (result.kind === 'ambiguous-movie') {

        return FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_AMBIGUOUS_PROMPT(
          movieName ?? '',
          result.matchingTitles
        );
      }

      if (result.showings.length === 0) {

        return FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_NO_SHOWINGS_PROMPT(
          result.movieTitle,
          showingDate ?? normalizedDate ?? '',
          showingTime ?? normalizedTime ?? ''
        );
      }

      return FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_RESULTS_PROMPT(
        result.movieTitle,
        showingDate ?? normalizedDate ?? '',
        showingTime ?? normalizedTime ?? '',
        result.showings
      );
    }, FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_BACKEND_ERROR_PROMPT);
  }
}
