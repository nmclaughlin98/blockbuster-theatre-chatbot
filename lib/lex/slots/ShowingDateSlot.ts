import type { SlotDefinition } from '../../interfaces/lex/SlotDefinition';

export const showingDateSlot: SlotDefinition = {
  name: 'ShowingDate',
  slotTypeName: 'AMAZON.Date',
  prompt: 'What day would you like to see a movie?',
};
