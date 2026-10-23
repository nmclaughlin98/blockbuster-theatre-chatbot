export const FIND_SHOWTIMES_BY_MOVIE_AND_DATE_DEFAULT_PROMPT = (
  movieName: string | undefined,
  showingDate: string | undefined
): string =>
  `You are looking for ${movieName ?? 'that movie'} on ${showingDate ?? 'that date'}. The live theatre schedule is not connected yet.`;
