import type { SlotDefinition } from '../../interfaces/lex/SlotDefinition';

export const showingTimeSlot: SlotDefinition = {
  name: 'ShowingTime',
  slotTypeName: 'AMAZON.Time',
  prompt: 'What time would you like to see a movie?',
};
