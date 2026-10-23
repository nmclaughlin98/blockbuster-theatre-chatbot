import type { LexFulfillmentEvent } from '../../../../lib/interfaces/lex/LexFulfillmentEvent';
import type { LexIntentHandlerMap } from '../../../../lib/interfaces/lex/LexIntentHandlerMap';
import { BrowseUpcomingShowingsIntentHandler } from './browse-upcoming-showings/handler';
import { FallbackIntentHandler } from './fallback-intent/handler';
import { FindShowtimesByDateIntentHandler } from './find-showtimes-by-date/handler';
import { FindShowtimesByMovieAndDateIntentHandler } from './find-showtimes-by-movie-and-date/handler';
import { FindShowtimesByMovieDateAndTimeIntentHandler } from './find-showtimes-by-movie-date-and-time/handler';
import { FindShowtimesByMovieIntentHandler } from './find-showtimes-by-movie/handler';
import { FindShowtimesByTimeIntentHandler } from './find-showtimes-by-time/handler';
import { ViewMyBookingsIntentHandler } from './view-my-bookings/handler';

const fallbackIntentHandler = new FallbackIntentHandler();
const intentHandlers: LexIntentHandlerMap = {
  BrowseUpcomingShowings: new BrowseUpcomingShowingsIntentHandler(),
  FindShowtimesByMovie: new FindShowtimesByMovieIntentHandler(),
  FindShowtimesByDate: new FindShowtimesByDateIntentHandler(),
  FindShowtimesByTime: new FindShowtimesByTimeIntentHandler(),
  FindShowtimesByMovieAndDate: new FindShowtimesByMovieAndDateIntentHandler(),
  FindShowtimesByMovieDateAndTime: new FindShowtimesByMovieDateAndTimeIntentHandler(),
  ViewMyBookings: new ViewMyBookingsIntentHandler(),
  FallbackIntent: fallbackIntentHandler,
};

export const getIntentMessage = async (event: LexFulfillmentEvent): Promise<string> => {
  const intentHandler = intentHandlers[event.sessionState.intent.name] ?? fallbackIntentHandler;

  return await intentHandler.handle(event);
};
