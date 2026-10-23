import { showingTimeSlot } from '../slots';
import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const findShowtimesByTimeIntent: IntentDefinition = {
  name: 'FindShowtimesByTime',
  description: 'Find movies with showtimes around a requested time.',
  sampleUtterances: [
    'What movies are playing at {ShowingTime}?',
    'Show me a movie at {ShowingTime}',
    'What is showing around {ShowingTime}?',
  ],
  slots: [showingTimeSlot],
};
