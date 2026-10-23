import type { SlotDefinition } from '../../interfaces/lex/SlotDefinition';

export const showingTimeSlot: SlotDefinition = {
  name: 'ShowingTime',
  description: 'The time the customer would like to attend a showing.',
  slotTypeName: 'AMAZON.Time',
  valueElicitationSetting: {
    slotConstraint: 'Required',
    promptSpecification: {
      maxRetries: 2,
      messageGroupsList: [
        {
          message: {
            plainTextMessage: { value: 'What time would you like to see a movie?' },
          },
        },
      ],
    },
    sampleUtterances: [
      { utterance: '7 PM' },
      { utterance: '19:00' },
      { utterance: 'half past six' },
      { utterance: '8:30 PM' },
    ],
  },
};
