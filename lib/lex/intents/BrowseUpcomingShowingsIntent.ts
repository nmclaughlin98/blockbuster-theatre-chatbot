import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const browseUpcomingShowingsIntent: IntentDefinition = {
  name: 'BrowseUpcomingShowings',
  description: 'Browse upcoming movies and showings.',
  sampleUtterances: [
    'What movies are showing?',
    'Show me upcoming showtimes',
    'What is playing at the theatre?',
    'What can I watch?',
  ],
};
