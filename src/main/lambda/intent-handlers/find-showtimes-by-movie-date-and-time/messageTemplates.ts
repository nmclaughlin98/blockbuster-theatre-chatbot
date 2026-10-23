import type { TheatreShowtimeOccurrence } from '../../../../../lib/interfaces/backend/TheatreShowtimeOccurrence';
import { formatMovieBullets } from '../../services/showtime-message-formatting';

export const FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_RESULTS_PROMPT = (
  movieName: string | undefined,
  showingDate: string,
  showingTime: string,
  showings: readonly TheatreShowtimeOccurrence[]
): string =>
  `Showtimes for ${movieName} on ${showingDate} at ${showingTime}:\n${formatMovieBullets(showings)}`;

export const FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_NO_SHOWINGS_PROMPT = (
  movieName: string,
  showingDate: string,
  showingTime: string
): string =>
  `No showtimes were found for ${movieName} on ${showingDate} at ${showingTime}.`;

export const FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_INVALID_DATE_PROMPT =
  'I could not understand that date. Please try a specific date.';

export const FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_INVALID_TIME_PROMPT =
  'I could not understand that time. Please try a time such as 7:30 PM.';

export const FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_MISSING_TITLE_PROMPT =
  'Please tell me the movie title you want showtimes for.';

export const FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_NOT_FOUND_PROMPT = (
  movieQuery: string
): string => `I could not find a movie matching "${movieQuery}".`;

export const FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_AMBIGUOUS_PROMPT = (
  movieQuery: string,
  matchingTitles: readonly string[]
): string =>
  `I found several movies matching "${movieQuery}": ${matchingTitles.join(', ')}. Please specify the full title.`;

export const FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_BACKEND_ERROR_PROMPT =
  'I could not retrieve showtimes right now. Please try again later.';
