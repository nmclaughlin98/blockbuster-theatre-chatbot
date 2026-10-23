import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const viewMyBookingsIntent: IntentDefinition = {
  name: 'ViewMyBookings',
  description: 'Reserved for looking up the signed-in customer bookings after login is implemented.',
  sampleUtterances: ['Show my bookings', 'View my tickets', 'What movies have I booked?'],
};
