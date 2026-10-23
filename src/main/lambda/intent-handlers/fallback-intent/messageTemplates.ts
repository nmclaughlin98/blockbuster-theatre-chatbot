import { getRandomCommonGreeting } from './common-greetings';

export const FALLBACK_INTENT_DEFAULT_PROMPT = (): string => {
  const greeting = getRandomCommonGreeting();

  return `${greeting} I can help with upcoming showings and searches by movie, date, or time. Booking lookup is not available yet.`;
};
