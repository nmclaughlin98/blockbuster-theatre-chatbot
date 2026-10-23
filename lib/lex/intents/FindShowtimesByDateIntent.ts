import { showingDateSlot } from '../slots';
import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const findShowtimesByDateIntent: IntentDefinition = {
  name: 'FindShowtimesByDate',
  description: 'Find movies and showtimes for a date.',
  sampleUtterances: [
    'What movies are showing on {ShowingDate}?',
    'Showtimes for {ShowingDate}',
    'What can I watch on {ShowingDate}?',
  ],
  slots: [showingDateSlot],
};
