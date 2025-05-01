import { Actions } from "../raw/actions";
import { RawTargetList } from "../raw/target";
import { Triggers } from "../raw/triggers";
import { CreatureAbility } from "./ability";

export type Statements = ConditionalStatement[];

export interface ConditionalStatement {
  comment?: string;
  target?: RawTargetList;
  triggers: Triggers.Trigger[];
  responses: Response[];
}

export interface Response {
  weight: number;
  actions: Actions.Action[];
}

export interface CustomCode {
  location: CustomCodeLocation;
  type: CustomCodeType;
  statements: ConditionalStatement[];
  abilities: CreatureAbility[];
}

export interface AdditionalCode {
  location: CustomCodeLocation;
  triggers: Triggers.Trigger[];
  actions: Actions.Action[];
}

export type CustomCodeLocation =
  | "destroyUponDeath"
  | "dialog"
  | "init"
  | "rest"
  | "turnHostile"
  | "detectCombat"
  | "shouts"
  | "trackTargets"
  | "attack"
  | "handlePanic"
  | "followSummoner"
  | "creatureAbilities"
  | "potions"
  | "kitAbilities"
  | "randomWalkNoCombat"
  | "randomWalkCombat"
  | "noActionOutsideOfCombat";

export type CustomCodeType = "insertBefore" | "insertAfter" | "replace";
