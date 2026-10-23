import type { SlotDefinition } from '../../interfaces/lex/SlotDefinition';

export const movieNameSlot: SlotDefinition = {
  name: 'MovieName',
  description: 'The title of the movie the customer wants to see.',
  slotTypeName: 'AMAZON.AlphaNumeric',
  valueElicitationSetting: {
    slotConstraint: 'Required',
    promptSpecification: {
      maxRetries: 2,
      messageGroupsList: [
        {
          message: {
            plainTextMessage: { value: 'Which movie would you like to see?' },
          },
        },
      ],
    },
    sampleUtterances: [
      { utterance: 'The Matrix' },
      { utterance: 'Inception' },
      { utterance: 'Jurassic Park' },
      { utterance: 'The Wizard of Oz' },
    ],
  },
};
