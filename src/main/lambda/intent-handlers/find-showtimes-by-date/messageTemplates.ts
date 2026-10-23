export const FIND_SHOWTIMES_BY_DATE_DEFAULT_PROMPT = (showingDate: string | undefined): string =>
  `You are looking for showtimes on ${showingDate ?? 'that date'}. The live theatre schedule is not connected yet.`;
