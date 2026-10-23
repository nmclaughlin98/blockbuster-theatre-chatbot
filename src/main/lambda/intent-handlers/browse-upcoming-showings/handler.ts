import type { LexIntentHandler } from '../../../../../lib/interfaces/lex/LexIntentHandler';
import { theatreShowtimeService } from '../../services/theatre-showtime-service';
import { withTheatreBackendErrorPrompt } from '../../services/with-theatre-backend-error';
import {
  BROWSE_UPCOMING_SHOWINGS_BACKEND_ERROR_PROMPT,
  BROWSE_UPCOMING_SHOWINGS_NO_SHOWINGS_PROMPT,
  BROWSE_UPCOMING_SHOWINGS_RESULTS_PROMPT,
} from './messageTemplates';

export class BrowseUpcomingShowingsIntentHandler implements LexIntentHandler {
  async handle(): Promise<string> {

    return withTheatreBackendErrorPrompt(async () => {
      const showings = await theatreShowtimeService.getUpcomingShowings();

      if (showings.length === 0) {

        return BROWSE_UPCOMING_SHOWINGS_NO_SHOWINGS_PROMPT;
      }

      return BROWSE_UPCOMING_SHOWINGS_RESULTS_PROMPT(showings);
    }, BROWSE_UPCOMING_SHOWINGS_BACKEND_ERROR_PROMPT);
  }
}
