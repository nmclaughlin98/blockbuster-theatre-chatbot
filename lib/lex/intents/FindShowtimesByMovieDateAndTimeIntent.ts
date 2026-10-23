import { movieNameSlot, showingDateSlot, showingTimeSlot } from '../slots';
import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const findShowtimesByMovieDateAndTimeIntent: IntentDefinition = {
  name: 'FindShowtimesByMovieDateAndTime',
  description: 'Find a movie showing around a requested time on a particular date.',
  sampleUtterances: [
    'When is {MovieName} playing on {ShowingDate} around {ShowingTime}?',
    'Show {MovieName} on {ShowingDate} at {ShowingTime}',
  ],
  slots: [movieNameSlot, showingDateSlot, showingTimeSlot],
};
