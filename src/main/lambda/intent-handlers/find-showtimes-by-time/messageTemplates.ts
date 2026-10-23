import type { TheatreShowtimeOccurrence } from '../../../../../lib/interfaces/backend/TheatreShowtimeOccurrence';
import { formatMovieBullets } from '../../services/showtime-message-formatting';

export const FIND_SHOWTIMES_BY_TIME_RESULTS_PROMPT = (
  showingTime: string,
  showings: readonly TheatreShowtimeOccurrence[]
): string =>
  `Showtimes at ${showingTime} in the next 7 days:\n${formatMovieBullets(showings)}`;

export const FIND_SHOWTIMES_BY_TIME_NO_SHOWINGS_PROMPT = (
  showingTime: string
): string => `No showtimes were found at ${showingTime} in the next 7 days.`;

export const FIND_SHOWTIMES_BY_TIME_INVALID_TIME_PROMPT =
  'I could not understand that time. Please try a time such as 7:30 PM.';

export const FIND_SHOWTIMES_BY_TIME_BACKEND_ERROR_PROMPT =
  'I could not retrieve showtimes right now. Please try again later.';
