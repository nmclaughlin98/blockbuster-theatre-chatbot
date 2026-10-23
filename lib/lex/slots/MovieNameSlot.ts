import type { SlotDefinition } from '../../interfaces/lex/SlotDefinition';

export const movieNameSlot: SlotDefinition = {
  name: 'MovieName',
  slotTypeName: 'AMAZON.FreeFormInput',
  prompt: 'Which movie would you like to see?',
};
