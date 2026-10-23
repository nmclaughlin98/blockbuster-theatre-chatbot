import { aws_lex as lex } from 'aws-cdk-lib';
import type { SlotDefinition } from '../../interfaces/lex/SlotDefinition';

export { movieNameSlot } from './MovieNameSlot';
export { showingDateSlot } from './ShowingDateSlot';
export { showingTimeSlot } from './ShowingTimeSlot';
export type { BuiltInSlotTypeName, SlotDefinition } from '../../interfaces/lex/SlotDefinition';

export const toCfnSlot = (slot: SlotDefinition): lex.CfnBot.SlotProperty => ({
  name: slot.name,
  slotTypeName: slot.slotTypeName,
  valueElicitationSetting: {
    slotConstraint: 'Required',
    promptSpecification: {
      maxRetries: 2,
      messageGroupsList: [
        {
          message: {
            plainTextMessage: { value: slot.prompt },
          },
        },
      ],
    },
  },
});
