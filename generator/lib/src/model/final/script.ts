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

export type CustomCodeLocation =
  | "destroyUponDeath"
  | "init"
  | "rest"
  | "turnHostile"
  | "detectCombat"
  | "listenToShouts"
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
