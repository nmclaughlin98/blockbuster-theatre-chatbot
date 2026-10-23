import { showingDateSlot } from '../slots';
import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const findShowtimesByDateIntent: IntentDefinition = {
  name: 'FindShowtimesByDate',
  description: 'Find movies and showtimes for a date.',
  sampleUtterances: [
    { utterance: 'What movies are showing on {ShowingDate}' },
    { utterance: 'Showtimes for {ShowingDate}' },
    { utterance: 'What can I watch on {ShowingDate}' },
    { utterance: 'What is showing on {ShowingDate}' },
    { utterance: 'Find showtimes for {ShowingDate}' },
  ],
  slots: [showingDateSlot],
};
