import type { LexIntentHandler } from '../../../../../lib/interfaces/lex/LexIntentHandler';
import { FALLBACK_INTENT_DEFAULT_PROMPT } from './messageTemplates';

export class FallbackIntentHandler implements LexIntentHandler {
  handle(): string {

    return FALLBACK_INTENT_DEFAULT_PROMPT();
  }
}
