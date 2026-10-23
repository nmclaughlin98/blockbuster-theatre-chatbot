import { movieNameSlot } from '../slots';
import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const findShowtimesByMovieIntent: IntentDefinition = {
  name: 'FindShowtimesByMovie',
  description: 'Find showtimes for a named movie.',
  sampleUtterances: [
    'When is {MovieName} playing?',
    'Show me showtimes for {MovieName}',
    'What times is {MovieName} showing?',
  ],
  slots: [movieNameSlot],
};
