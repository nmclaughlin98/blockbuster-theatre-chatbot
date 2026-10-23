import { aws_lex as lex } from 'aws-cdk-lib';
import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';
import { toCfnSlot } from '../slots';
import { browseUpcomingShowingsIntent } from './BrowseUpcomingShowingsIntent';
import { fallbackIntent } from './FallbackIntent';
import { findShowtimesByDateIntent } from './FindShowtimesByDateIntent';
import { findShowtimesByMovieAndDateIntent } from './FindShowtimesByMovieAndDateIntent';
import { findShowtimesByMovieDateAndTimeIntent } from './FindShowtimesByMovieDateAndTimeIntent';
import { findShowtimesByMovieIntent } from './FindShowtimesByMovieIntent';
import { findShowtimesByTimeIntent } from './FindShowtimesByTimeIntent';
import { viewMyBookingsIntent } from './ViewMyBookingsIntent';

export {
  browseUpcomingShowingsIntent,
  fallbackIntent,
  findShowtimesByDateIntent,
  findShowtimesByMovieAndDateIntent,
  findShowtimesByMovieDateAndTimeIntent,
  findShowtimesByMovieIntent,
  findShowtimesByTimeIntent,
  viewMyBookingsIntent,
};
export type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

const intentDefinitions: IntentDefinition[] = [
  browseUpcomingShowingsIntent,
  findShowtimesByMovieIntent,
  findShowtimesByDateIntent,
  findShowtimesByTimeIntent,
  findShowtimesByMovieAndDateIntent,
  findShowtimesByMovieDateAndTimeIntent,
  viewMyBookingsIntent,
  fallbackIntent,
];

const toCfnIntent = (intent: IntentDefinition): lex.CfnBot.IntentProperty => {
  const slots = intent.slots?.map(toCfnSlot);

  return {
    name: intent.name,
    description: intent.description,
    ...(intent.sampleUtterances.length > 0
      ? { sampleUtterances: intent.sampleUtterances.map((utterance) => ({ utterance })) }
      : {}),
    ...(slots && slots.length > 0
      ? {
          slots,
          slotPriorities: slots.map((slot, index) => ({
            priority: index + 1,
            slotName: slot.name,
          })),
        }
      : {}),
    ...(intent.parentIntentSignature
      ? { parentIntentSignature: intent.parentIntentSignature }
      : {}),
    fulfillmentCodeHook: { enabled: true },
  };
};

export const theatreIntents: lex.CfnBot.IntentProperty[] = intentDefinitions.map(toCfnIntent);
