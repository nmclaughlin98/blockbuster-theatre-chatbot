import { movieNameSlot } from '../slots';
import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const findShowtimesByMovieIntent: IntentDefinition = {
  name: 'FindShowtimesByMovie',
  description: 'Find showtimes for a named movie.',
  sampleUtterances: [
    { utterance: 'When is {MovieName} playing?' },
    { utterance: 'Show me showtimes for {MovieName}' },
    { utterance: 'What times is {MovieName} showing?' },
    { utterance: 'When can I watch {MovieName}?' },
    { utterance: 'Is {MovieName} showing?' },
  ],
  slots: [movieNameSlot],
};
