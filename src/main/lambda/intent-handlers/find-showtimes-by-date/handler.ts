import type { LexIntentHandler } from '../../../../../lib/interfaces/lex/LexIntentHandler';
import type { LexFulfillmentEvent } from '../../../../../lib/interfaces/lex/LexFulfillmentEvent';
import {
  getInterpretedSlotValue,
  getSlotValue,
} from '../../handlers/get-slot-value';
import { theatreShowtimeService } from '../../services/theatre-showtime-service';
import { withTheatreBackendErrorPrompt } from '../../services/with-theatre-backend-error';
import {
  FIND_SHOWTIMES_BY_DATE_BACKEND_ERROR_PROMPT,
  FIND_SHOWTIMES_BY_DATE_INVALID_DATE_PROMPT,
  FIND_SHOWTIMES_BY_DATE_NO_SHOWINGS_PROMPT,
  FIND_SHOWTIMES_BY_DATE_RESULTS_PROMPT,
} from './messageTemplates';

export class FindShowtimesByDateIntentHandler implements LexIntentHandler {
  handle(event: LexFulfillmentEvent): Promise<string> {
    const showingDate = getSlotValue(event, 'ShowingDate');
    const normalizedDate = getInterpretedSlotValue(event, 'ShowingDate');

    return withTheatreBackendErrorPrompt(async () => {
      const result = await theatreShowtimeService.getShowingsByDate(normalizedDate);

      if (result.kind === 'invalid-date') {

        return FIND_SHOWTIMES_BY_DATE_INVALID_DATE_PROMPT;
      }

      if (result.showings.length === 0) {

        return FIND_SHOWTIMES_BY_DATE_NO_SHOWINGS_PROMPT(
          showingDate ?? normalizedDate ?? ''
        );
      }

      return FIND_SHOWTIMES_BY_DATE_RESULTS_PROMPT(
        showingDate ?? normalizedDate ?? '',
        result.showings
      );
    }, FIND_SHOWTIMES_BY_DATE_BACKEND_ERROR_PROMPT);
  }
}
