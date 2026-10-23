import type { TheatreShowtimeOccurrence } from '../../../../../lib/interfaces/backend/TheatreShowtimeOccurrence';
import { formatMovieBullets } from '../../services/showtime-message-formatting';

export const BROWSE_UPCOMING_SHOWINGS_RESULTS_PROMPT = (
  showings: readonly TheatreShowtimeOccurrence[]
): string =>
  `Upcoming showtimes for the next 7 days:\n${formatMovieBullets(showings)}`;

export const BROWSE_UPCOMING_SHOWINGS_NO_SHOWINGS_PROMPT =
  'No showtimes were found for the next 7 days.';

export const BROWSE_UPCOMING_SHOWINGS_BACKEND_ERROR_PROMPT =
  'I could not retrieve showtimes right now. Please try again later.';
