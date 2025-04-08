import { Actions } from "./actions";
import { RawTargetList } from "./target";
import { Triggers } from "./triggers";

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
  | "randomWalkNoCombat"
  | "randomWalkCombat"
  | "noActionOutsideOfCombat";

export type CustomCodeType = "insertBefore" | "insertAfter" | "replace";
