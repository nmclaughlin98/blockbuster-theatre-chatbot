import { movieNameSlot, showingDateSlot } from '../slots';
import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const findShowtimesByMovieAndDateIntent: IntentDefinition = {
  name: 'FindShowtimesByMovieAndDate',
  description: 'Find showtimes for a movie on a particular date.',
  sampleUtterances: [
    { utterance: 'When is {MovieName} playing on {ShowingDate}' },
    { utterance: 'Show {MovieName} on {ShowingDate}' },
    { utterance: 'What times is {MovieName} showing on {ShowingDate}' },
    { utterance: 'Find showtimes for {MovieName} on {ShowingDate}' },
    { utterance: 'Is {MovieName} showing on {ShowingDate}' },
  ],
  slots: [movieNameSlot, showingDateSlot],
};
