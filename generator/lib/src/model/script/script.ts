import { CreatureAbility } from "../creature/ability";
import { Actions } from "./actions";
import { Triggers } from "./triggers";
import { PartialBy } from "../utility-types";
import { TargetList } from "./target";

export type Statements = ConditionalStatement[];

export interface ConditionalStatement {
  comment?: string;
  target?: TargetList;
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

export type PartialCustomCode = PartialBy<
  CustomCode,
  "statements" | "abilities"
>;

export interface AdditionalCode {
  location: CustomCodeLocation;
  triggers: Triggers.Trigger[];
  actions: Actions.Action[];
}

export type PartialAdditionalCode = PartialBy<
  AdditionalCode,
  "triggers" | "actions"
>;

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
