import { showingTimeSlot } from '../slots';
import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const findShowtimesByTimeIntent: IntentDefinition = {
  name: 'FindShowtimesByTime',
  description: 'Find movies with showtimes around a requested time.',
  sampleUtterances: [
    { utterance: 'What movies are playing at {ShowingTime}?' },
    { utterance: 'Show me a movie at {ShowingTime}' },
    { utterance: 'What is showing around {ShowingTime}?' },
    { utterance: 'Which films are playing at {ShowingTime}?' },
    { utterance: 'Find a showing at {ShowingTime}' },
  ],
  slots: [showingTimeSlot],
};
