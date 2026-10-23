import { aws_lex as lex } from 'aws-cdk-lib';
import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';
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

const toCfnIntent = ({
  slots,
  sampleUtterances,
  ...intent
}: IntentDefinition): lex.CfnBot.IntentProperty => {

  return {
    ...intent,
    ...(sampleUtterances?.length
      ? { sampleUtterances }
      : {}),
    ...(slots?.length
      ? {
          slots,
          slotPriorities: slots.map((slot, index) => ({
            priority: index + 1,
            slotName: slot.name,
          })),
        }
      : {}),
    fulfillmentCodeHook: { enabled: true },
  };
};

export const theatreIntents: lex.CfnBot.IntentProperty[] = intentDefinitions.map(toCfnIntent);
