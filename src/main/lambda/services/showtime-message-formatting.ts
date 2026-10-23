import type { TheatreShowtimeOccurrence } from '../../../../lib/interfaces/backend/TheatreShowtimeOccurrence';

export const formatMovieBullets = (
  showings: readonly TheatreShowtimeOccurrence[]
): string => {

  return [
    ...new Set(showings.map((showing) => showing.movieTitle)),
  ]
    .sort((firstTitle, secondTitle) =>
      firstTitle.localeCompare(secondTitle, 'en-GB', { sensitivity: 'base' })
    )
    .map((movieTitle) => `- ${movieTitle}`)
    .join('\n');
};
