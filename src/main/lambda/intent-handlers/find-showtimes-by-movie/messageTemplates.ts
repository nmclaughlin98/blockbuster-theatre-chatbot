export const FIND_SHOWTIMES_BY_MOVIE_DEFAULT_PROMPT = (movieName: string | undefined): string =>
  `You are looking for showtimes for ${movieName ?? 'that movie'}. The live theatre schedule is not connected yet.`;
