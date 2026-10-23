import type { LexIntentHandler } from '../../../../../lib/interfaces/lex/LexIntentHandler';
import type { LexFulfillmentEvent } from '../../../../../lib/interfaces/lex/LexFulfillmentEvent';
import {
  getInterpretedSlotValue,
  getSlotValue,
} from '../../handlers/get-slot-value';
import { theatreShowtimeService } from '../../services/theatre-showtime-service';
import { withTheatreBackendErrorPrompt } from '../../services/with-theatre-backend-error';
import {
  FIND_SHOWTIMES_BY_MOVIE_AND_DATE_AMBIGUOUS_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_AND_DATE_BACKEND_ERROR_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_AND_DATE_INVALID_DATE_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_AND_DATE_MISSING_TITLE_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_AND_DATE_NO_SHOWINGS_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_AND_DATE_NOT_FOUND_PROMPT,
  FIND_SHOWTIMES_BY_MOVIE_AND_DATE_RESULTS_PROMPT,
} from './messageTemplates';

export class FindShowtimesByMovieAndDateIntentHandler implements LexIntentHandler {
  handle(event: LexFulfillmentEvent): Promise<string> {
    const movieName = getSlotValue(event, 'MovieName');
    const showingDate = getSlotValue(event, 'ShowingDate');
    const normalizedDate = getInterpretedSlotValue(event, 'ShowingDate');

    return withTheatreBackendErrorPrompt(async () => {
      const result = await theatreShowtimeService.getShowingsForMovie(
        movieName,
        { date: normalizedDate }
      );

      if (result.kind === 'missing-movie') {

        return FIND_SHOWTIMES_BY_MOVIE_AND_DATE_MISSING_TITLE_PROMPT;
      }

      if (result.kind === 'invalid-date') {

        return FIND_SHOWTIMES_BY_MOVIE_AND_DATE_INVALID_DATE_PROMPT;
      }

      if (result.kind === 'movie-not-found') {

        return FIND_SHOWTIMES_BY_MOVIE_AND_DATE_NOT_FOUND_PROMPT(movieName ?? '');
      }

      if (result.kind === 'ambiguous-movie') {

        return FIND_SHOWTIMES_BY_MOVIE_AND_DATE_AMBIGUOUS_PROMPT(
          movieName ?? '',
          result.matchingTitles
        );
      }

      if (result.showings.length === 0) {

        return FIND_SHOWTIMES_BY_MOVIE_AND_DATE_NO_SHOWINGS_PROMPT(
          result.movieTitle,
          showingDate ?? normalizedDate ?? ''
        );
      }

      return FIND_SHOWTIMES_BY_MOVIE_AND_DATE_RESULTS_PROMPT(
        result.movieTitle,
        showingDate ?? normalizedDate ?? '',
        result.showings
      );
    }, FIND_SHOWTIMES_BY_MOVIE_AND_DATE_BACKEND_ERROR_PROMPT);
  }
}
