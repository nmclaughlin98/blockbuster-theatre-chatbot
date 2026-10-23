import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const viewMyBookingsIntent: IntentDefinition = {
  name: 'ViewMyBookings',
  description: 'Reserved for looking up the signed-in customer bookings after login is implemented.',
  sampleUtterances: [
    { utterance: 'Show my bookings' },
    { utterance: 'View my tickets' },
    { utterance: 'What movies have I booked?' },
  ],
};
