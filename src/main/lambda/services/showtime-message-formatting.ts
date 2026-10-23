import type { TheatreShowtimeOccurrence } from '../../../../lib/interfaces/backend/TheatreShowtimeOccurrence';

export const formatShowtimeRows = (
  showings: readonly TheatreShowtimeOccurrence[]
): string => {

  return showings
    .map(
      (showing) =>
        `${showing.dateLabel} — ${showing.movieTitle}: ${showing.time} (Screen ${showing.screen})`
    )
    .join('\n');
};
