import type { SlotDefinition } from '../../interfaces/lex/SlotDefinition';

export const showingDateSlot: SlotDefinition = {
  name: 'ShowingDate',
  description: 'The date the customer wants to see a movie.',
  slotTypeName: 'AMAZON.Date',
  valueElicitationSetting: {
    slotConstraint: 'Required',
    promptSpecification: {
      maxRetries: 2,
      messageGroupsList: [
        {
          message: {
            plainTextMessage: { value: 'What day would you like to see a movie?' },
          },
        },
      ],
    },
    sampleUtterances: [
      { utterance: 'today' },
      { utterance: 'tomorrow' },
      { utterance: 'next Friday' },
      { utterance: '23 October' },
    ],
  },
};
