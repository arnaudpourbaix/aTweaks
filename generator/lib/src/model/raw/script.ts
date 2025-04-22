import {
  ConditionalStatement,
  CustomCodeLocation,
  CustomCodeType,
} from "../final/script";
import { RawCreatureAbility } from "./ability";

export interface RawCustomCode {
  location: CustomCodeLocation;
  type: CustomCodeType;
  statements?: ConditionalStatement[];
  abilities?: RawCreatureAbility[];
}
