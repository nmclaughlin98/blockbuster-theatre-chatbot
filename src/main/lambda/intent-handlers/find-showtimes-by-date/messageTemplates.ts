import type { TheatreShowtimeOccurrence } from '../../../../../lib/interfaces/backend/TheatreShowtimeOccurrence';
import { formatMovieBullets } from '../../services/showtime-message-formatting';

export const FIND_SHOWTIMES_BY_DATE_RESULTS_PROMPT = (
  showingDate: string,
  showings: readonly TheatreShowtimeOccurrence[]
): string =>
  `Showtimes for ${showingDate}:\n${formatMovieBullets(showings)}`;

export const FIND_SHOWTIMES_BY_DATE_NO_SHOWINGS_PROMPT = (
  showingDate: string
): string => `No showtimes were found for ${showingDate}.`;

export const FIND_SHOWTIMES_BY_DATE_INVALID_DATE_PROMPT =
  'I could not understand that date. Please try a specific date.';

export const FIND_SHOWTIMES_BY_DATE_BACKEND_ERROR_PROMPT =
  'I could not retrieve showtimes right now. Please try again later.';
