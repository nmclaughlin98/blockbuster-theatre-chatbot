export type BuiltInSlotTypeName =
  | 'AMAZON.AlphaNumeric'
  | 'AMAZON.Date'
  | 'AMAZON.Time';

export interface SlotDefinition {
  readonly name: string;
  readonly slotTypeName: BuiltInSlotTypeName;
  readonly prompt: string;
}
