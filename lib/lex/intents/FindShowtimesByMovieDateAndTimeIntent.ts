import { movieNameSlot, showingDateSlot, showingTimeSlot } from '../slots';
import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const findShowtimesByMovieDateAndTimeIntent: IntentDefinition = {
  name: 'FindShowtimesByMovieDateAndTime',
  description: 'Find a movie showing around a requested time on a particular date.',
  sampleUtterances: [
    { utterance: 'When is {MovieName} playing on {ShowingDate} around {ShowingTime}' },
    { utterance: 'Show {MovieName} on {ShowingDate} at {ShowingTime}' },
    { utterance: 'Find {MovieName} on {ShowingDate} at {ShowingTime}' },
    { utterance: 'Are there showings of {MovieName} on {ShowingDate} around {ShowingTime}' },
  ],
  slots: [movieNameSlot, showingDateSlot, showingTimeSlot],
};
