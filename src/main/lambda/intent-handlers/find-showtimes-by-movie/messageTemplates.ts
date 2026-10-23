import type { TheatreShowtimeOccurrence } from '../../../../../lib/interfaces/backend/TheatreShowtimeOccurrence';
import { formatShowtimeRows } from '../../services/showtime-message-formatting';

export const FIND_SHOWTIMES_BY_MOVIE_RESULTS_PROMPT = (
  movieTitle: string,
  showings: readonly TheatreShowtimeOccurrence[]
): string =>
  `Showtimes for ${movieTitle} in the next 7 days:\n${formatShowtimeRows(showings)}`;

export const FIND_SHOWTIMES_BY_MOVIE_NO_SHOWINGS_PROMPT = (
  movieTitle: string
): string => `No upcoming showtimes were found for ${movieTitle}.`;

export const FIND_SHOWTIMES_BY_MOVIE_NOT_FOUND_PROMPT = (
  movieQuery: string
): string => `I could not find a movie matching "${movieQuery}".`;

export const FIND_SHOWTIMES_BY_MOVIE_AMBIGUOUS_PROMPT = (
  movieQuery: string,
  matchingTitles: readonly string[]
): string =>
  `I found several movies matching "${movieQuery}": ${matchingTitles.join(', ')}. Please specify the full title.`;

export const FIND_SHOWTIMES_BY_MOVIE_MISSING_TITLE_PROMPT =
  'Please tell me the movie title you want showtimes for.';

export const FIND_SHOWTIMES_BY_MOVIE_BACKEND_ERROR_PROMPT =
  'I could not retrieve showtimes right now. Please try again later.';
