import {
  ConditionalStatement,
  CustomCodeLocation,
  CustomCodeType,
} from "../final/script";
import { RawCreatureAbility } from "./ability";
import { Actions } from "./actions";
import { Triggers } from "./triggers";

export interface RawCustomCode {
  location: CustomCodeLocation;
  type: CustomCodeType;
  statements?: ConditionalStatement[];
  abilities?: RawCreatureAbility[];
}

export interface RawAdditionalCode {
  location: CustomCodeLocation;
  triggers?: Triggers.Trigger[];
  actions?: Actions.Action[];
}
