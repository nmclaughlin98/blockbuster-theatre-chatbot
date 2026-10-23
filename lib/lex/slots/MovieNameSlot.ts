import type { SlotDefinition } from '../../interfaces/lex/SlotDefinition';

export const movieNameSlot: SlotDefinition = {
  name: 'MovieName',
  slotTypeName: 'AMAZON.AlphaNumeric',
  prompt: 'Which movie would you like to see?',
};
