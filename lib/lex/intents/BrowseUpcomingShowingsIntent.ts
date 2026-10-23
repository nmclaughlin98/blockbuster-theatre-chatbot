import type { IntentDefinition } from '../../interfaces/lex/IntentDefinition';

export const browseUpcomingShowingsIntent: IntentDefinition = {
  name: 'BrowseUpcomingShowings',
  description: 'Browse upcoming movies and showings.',
  sampleUtterances: [
    { utterance: 'What movies are showing?' },
    { utterance: 'Show me upcoming showtimes' },
    { utterance: 'What is playing at the theatre?' },
    { utterance: 'What can I watch?' },
    { utterance: 'Show upcoming movies' },
    { utterance: 'List upcoming showings' },
  ],
};
