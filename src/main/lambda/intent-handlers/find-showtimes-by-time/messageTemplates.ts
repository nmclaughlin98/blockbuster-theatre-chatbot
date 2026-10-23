export const FIND_SHOWTIMES_BY_TIME_DEFAULT_PROMPT = (showingTime: string | undefined): string =>
  `You are looking for showtimes around ${showingTime ?? 'that time'}. The live theatre schedule is not connected yet.`;
