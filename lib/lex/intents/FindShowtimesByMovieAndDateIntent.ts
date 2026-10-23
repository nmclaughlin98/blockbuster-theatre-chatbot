import { movieNameSlot, showingDateSlot } from '../slots';
import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const findShowtimesByMovieAndDateIntent: IntentDefinition = {
  name: 'FindShowtimesByMovieAndDate',
  description: 'Find showtimes for a movie on a particular date.',
  sampleUtterances: [
    'When is {MovieName} playing on {ShowingDate}?',
    'Show {MovieName} on {ShowingDate}',
    'What times is {MovieName} showing on {ShowingDate}?',
  ],
  slots: [movieNameSlot, showingDateSlot],
};
