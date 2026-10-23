import type { LexIntentHandler } from '../../../../../lib/interfaces/lex/LexIntentHandler';
import { VIEW_MY_BOOKINGS_DEFAULT_PROMPT } from './messageTemplates';

export class ViewMyBookingsIntentHandler implements LexIntentHandler {
  handle(): string {

    return VIEW_MY_BOOKINGS_DEFAULT_PROMPT;
  }
}
