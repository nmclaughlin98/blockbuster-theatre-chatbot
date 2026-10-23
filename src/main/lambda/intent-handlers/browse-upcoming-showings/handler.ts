import type { LexIntentHandler } from '../../../../../lib/interfaces/lex/LexIntentHandler';
import { BROWSE_UPCOMING_SHOWINGS_DEFAULT_PROMPT } from './messageTemplates';

export class BrowseUpcomingShowingsIntentHandler implements LexIntentHandler {
  handle(): string {

    return BROWSE_UPCOMING_SHOWINGS_DEFAULT_PROMPT;
  }
}
