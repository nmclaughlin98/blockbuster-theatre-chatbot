import { handler } from '../../main/lambda/handlers/lex-fulfillment-handler';
import type { LexFulfillmentEvent } from '../../../lib/interfaces/lex/LexFulfillmentEvent';

const eventFor = (
  name: string,
  slots?: LexFulfillmentEvent['sessionState']['intent']['slots']
): LexFulfillmentEvent => ({
  sessionState: { intent: { name, slots } },
});

type IntentHandlerScenario = {
  readonly intentName: string;
  readonly slots: NonNullable<LexFulfillmentEvent['sessionState']['intent']['slots']>;
  readonly expectedMessage: string;
};

const intentHandlerScenarios: IntentHandlerScenario[] = [
  {
    intentName: 'FindShowtimesByMovie',
    slots: { MovieName: { value: { originalValue: 'The Example Movie' } } },
    expectedMessage:
      'You are looking for showtimes for The Example Movie. The live theatre schedule is not connected yet.',
  },
  {
    intentName: 'FindShowtimesByDate',
    slots: { ShowingDate: { value: { interpretedValue: '2026-10-24' } } },
    expectedMessage:
      'You are looking for showtimes on 2026-10-24. The live theatre schedule is not connected yet.',
  },
  {
    intentName: 'FindShowtimesByTime',
    slots: { ShowingTime: { value: { originalValue: '7 PM' } } },
    expectedMessage:
      'You are looking for showtimes around 7 PM. The live theatre schedule is not connected yet.',
  },
  {
    intentName: 'FindShowtimesByMovieAndDate',
    slots: {
      MovieName: { value: { originalValue: 'The Example Movie' } },
      ShowingDate: { value: { interpretedValue: '2026-10-24' } },
    },
    expectedMessage:
      'You are looking for The Example Movie on 2026-10-24. The live theatre schedule is not connected yet.',
  },
];

describe('Lex fulfillment handler', () => {
  it('returns the Lex V2 fulfilled response for upcoming showings', async () => {
    await expect(handler(eventFor('BrowseUpcomingShowings'))).resolves.toEqual({
      sessionState: {
        dialogAction: { type: 'Close' },
        intent: { name: 'BrowseUpcomingShowings', state: 'Fulfilled' },
      },
      messages: [
        {
          contentType: 'PlainText',
          content: 'I can help you browse upcoming showings, but the live theatre schedule is not connected yet.',
        },
      ],
    });
  });

  it('includes requested movie, date, and time values in the response', async () => {
    const event = eventFor('FindShowtimesByMovieDateAndTime', {
      MovieName: { value: { originalValue: 'The Example Movie' } },
      ShowingDate: { value: { interpretedValue: '2026-10-24' } },
      ShowingTime: { value: { originalValue: '7 PM' } },
    });

    await expect(handler(event)).resolves.toMatchObject({
      messages: [
        {
          content:
            'You are looking for The Example Movie on 2026-10-24 around 7 PM. The live theatre schedule is not connected yet.',
        },
      ],
    });
  });

  it.each(intentHandlerScenarios)(
    'dispatches $intentName to its intent handler',
    async ({ intentName, slots, expectedMessage }) => {
      await expect(handler(eventFor(intentName, slots))).resolves.toMatchObject({
        messages: [{ content: expectedMessage }],
      });
    }
  );

  it('explains that booking lookup requires login functionality', async () => {
    await expect(handler(eventFor('ViewMyBookings'))).resolves.toMatchObject({
      messages: [
        {
          content:
            'Booking lookup is not available yet because customer login and account linking are not implemented.',
        },
      ],
    });
  });

  it('returns a fallback response for unrecognized intents', async () => {
    await expect(handler(eventFor('UnknownIntent'))).resolves.toMatchObject({
      messages: [
        {
          content:
            'I can help with upcoming showings and searches by movie, date, or time. Booking lookup is not available yet.',
        },
      ],
    });
  });
});
