import type * as lex from 'aws-cdk-lib/aws-lex';

export type BuiltInSlotTypeName =
  | 'AMAZON.AlphaNumeric'
  | 'AMAZON.Date'
  | 'AMAZON.Time';

export interface SlotDefinition extends lex.CfnBot.SlotProperty {
  readonly description: string;
  readonly slotTypeName: BuiltInSlotTypeName;
  readonly valueElicitationSetting: lex.CfnBot.SlotValueElicitationSettingProperty;
}
