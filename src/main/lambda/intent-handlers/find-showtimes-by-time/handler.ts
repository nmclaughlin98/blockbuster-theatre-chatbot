import type { LexIntentHandler } from '../../../../../lib/interfaces/lex/LexIntentHandler';
import type { LexFulfillmentEvent } from '../../../../../lib/interfaces/lex/LexFulfillmentEvent';
import {
  getInterpretedSlotValue,
  getSlotValue,
} from '../../handlers/get-slot-value';
import { theatreShowtimeService } from '../../services/theatre-showtime-service';
import { withTheatreBackendErrorPrompt } from '../../services/with-theatre-backend-error';
import {
  FIND_SHOWTIMES_BY_TIME_BACKEND_ERROR_PROMPT,
  FIND_SHOWTIMES_BY_TIME_INVALID_TIME_PROMPT,
  FIND_SHOWTIMES_BY_TIME_NO_SHOWINGS_PROMPT,
  FIND_SHOWTIMES_BY_TIME_RESULTS_PROMPT,
} from './messageTemplates';

export class FindShowtimesByTimeIntentHandler implements LexIntentHandler {
  handle(event: LexFulfillmentEvent): Promise<string> {
    const showingTime = getSlotValue(event, 'ShowingTime');
    const normalizedTime = getInterpretedSlotValue(event, 'ShowingTime');

    return withTheatreBackendErrorPrompt(async () => {
      const result = await theatreShowtimeService.getShowingsByTime(normalizedTime);

      if (result.kind === 'invalid-time') {

        return FIND_SHOWTIMES_BY_TIME_INVALID_TIME_PROMPT;
      }

      if (result.showings.length === 0) {

        return FIND_SHOWTIMES_BY_TIME_NO_SHOWINGS_PROMPT(
          showingTime ?? normalizedTime ?? ''
        );
      }

      return FIND_SHOWTIMES_BY_TIME_RESULTS_PROMPT(
        showingTime ?? normalizedTime ?? '',
        result.showings
      );
    }, FIND_SHOWTIMES_BY_TIME_BACKEND_ERROR_PROMPT);
  }
}
