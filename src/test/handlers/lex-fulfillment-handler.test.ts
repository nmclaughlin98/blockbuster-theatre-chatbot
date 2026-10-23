import { handler } from '../../main/lambda/handlers/lex-fulfillment-handler';
import type { LexFulfillmentEvent } from '../../../lib/interfaces/lex/LexFulfillmentEvent';

const backendMovies = [
  {
    movieId: 101,
    title: 'The Example Movie',
    visible: true,
    isComingSoon: false,
    showtimes: {
      Friday: [
        { screen: '1', time: '08:30' },
        { screen: '2', time: '11:30' },
        { screen: '3', time: '19:30' },
      ],
      Saturday: [
        { screen: '2', time: '13:00' },
        { screen: '3', time: '19:00' },
      ],
    },
  },
  {
    movieId: 202,
    title: 'Another Film',
    visible: true,
    isComingSoon: false,
    showtimes: {
      Friday: [{ screen: '4', time: '19:30' }],
      Saturday: [{ screen: '5', time: '19:00' }],
    },
  },
];

const backendResponse = (): Response =>
  new Response(JSON.stringify({ movies: backendMovies, nextToken: null }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });

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
    expectedMessage: 'Showtimes for The Example Movie in the next 7 days:',
  },
  {
    intentName: 'FindShowtimesByDate',
    slots: {
      ShowingDate: {
        value: { originalValue: 'tomorrow', interpretedValue: '2026-10-24' },
      },
    },
    expectedMessage: 'Showtimes for tomorrow:',
  },
  {
    intentName: 'FindShowtimesByTime',
    slots: {
      ShowingTime: {
        value: { originalValue: '7 PM', interpretedValue: '19:00' },
      },
    },
    expectedMessage: 'Showtimes at 7 PM in the next 7 days:',
  },
  {
    intentName: 'FindShowtimesByMovieAndDate',
    slots: {
      MovieName: { value: { originalValue: 'The Example Movie' } },
      ShowingDate: {
        value: { originalValue: 'tomorrow', interpretedValue: '2026-10-24' },
      },
    },
    expectedMessage: 'Showtimes for The Example Movie on tomorrow:',
  },
];

describe('Lex fulfillment handler', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-23T08:00:00.000Z'));
  });

  beforeEach(() => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(backendResponse());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns the Lex V2 fulfilled response for upcoming showings', async () => {
    await expect(handler(eventFor('BrowseUpcomingShowings'))).resolves.toEqual({
      sessionState: {
        dialogAction: { type: 'Close' },
        intent: { name: 'BrowseUpcomingShowings', state: 'Fulfilled' },
      },
      messages: [
        {
          contentType: 'PlainText',
          content:
            'Upcoming showtimes for the next 7 days:\n' +
            'Fri, 23 Oct 2026 — The Example Movie: 11:30 (Screen 2)\n' +
            'Fri, 23 Oct 2026 — Another Film: 19:30 (Screen 4)\n' +
            'Fri, 23 Oct 2026 — The Example Movie: 19:30 (Screen 3)\n' +
            'Sat, 24 Oct 2026 — The Example Movie: 13:00 (Screen 2)\n' +
            'Sat, 24 Oct 2026 — Another Film: 19:00 (Screen 5)\n' +
            'Sat, 24 Oct 2026 — The Example Movie: 19:00 (Screen 3)',
        },
      ],
    });
  });

  it('includes requested movie, date, and time values in the response', async () => {
    const event = eventFor('FindShowtimesByMovieDateAndTime', {
      MovieName: { value: { originalValue: 'The Example Movie' } },
      ShowingDate: {
        value: { originalValue: 'tomorrow', interpretedValue: '2026-10-24' },
      },
      ShowingTime: {
        value: { originalValue: '7 PM', interpretedValue: '19:00' },
      },
    });

    await expect(handler(event)).resolves.toMatchObject({
      messages: [
        {
          content:
            'Showtimes for The Example Movie on tomorrow at 7 PM:\n' +
            'Sat, 24 Oct 2026 — The Example Movie: 19:00 (Screen 3)',
        },
      ],
    });
  });

  it.each(intentHandlerScenarios)(
    'dispatches $intentName to its intent handler',
    async ({ intentName, slots, expectedMessage }) => {
      await expect(handler(eventFor(intentName, slots))).resolves.toMatchObject({
        messages: [{ content: expect.stringContaining(expectedMessage) }],
      });
    }
  );

  it('returns a clear response when the backend is unavailable', async () => {
    jest.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('offline'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(handler(eventFor('FindShowtimesByDate', {
      ShowingDate: { value: { interpretedValue: '2026-10-24' } },
    }))).resolves.toMatchObject({
      messages: [
        {
          content:
            'I could not retrieve showtimes right now. Please try again later.',
        },
      ],
    });
  });

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
