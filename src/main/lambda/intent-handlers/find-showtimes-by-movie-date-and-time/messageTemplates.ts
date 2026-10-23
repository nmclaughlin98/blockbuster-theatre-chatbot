export const FIND_SHOWTIMES_BY_MOVIE_DATE_AND_TIME_DEFAULT_PROMPT = (
  movieName: string | undefined,
  showingDate: string | undefined,
  showingTime: string | undefined
): string =>
  `You are looking for ${movieName ?? 'that movie'} on ${showingDate ?? 'that date'} around ${showingTime ?? 'that time'}. The live theatre schedule is not connected yet.`;
