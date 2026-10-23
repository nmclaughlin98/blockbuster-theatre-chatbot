export const COMMON_GREETINGS = [
  'Hello!',
  'Hi there!',
  'Hey there!',
  'Welcome!',
  'Good to see you!',
] as const;

export const getRandomCommonGreeting = (): string =>
  COMMON_GREETINGS[Math.floor(Math.random() * COMMON_GREETINGS.length)];