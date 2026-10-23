import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const fallbackIntent: IntentDefinition = {
  name: 'FallbackIntent',
  description: 'Handles requests that do not match a supported theatre intent.',
  parentIntentSignature: 'AMAZON.FallbackIntent',
};
