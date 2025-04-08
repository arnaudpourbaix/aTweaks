import { TargetListName } from "../../../config/target";
import { AllegianceIdentifier } from "../ids/allegiance";
import { ObjectIdentifier } from "../ids/object";
import { Triggers } from "./triggers";

export interface TargetPriority {
  status: TargetStatus;
  canOnlyTargetPlayer: boolean;
  targetTriggers: Triggers.Trigger[];
  triggers: Triggers.Trigger[];
}

export type TargetStatus =
  | "Grabbed"
  | "Held"
  | "Stunned"
  | "Slowed"
  /**
   * panic, confused, feebleminded
   */
  | "PanicConfused"
  | "Sleep"
  /**
   * Not affected by any disabling status
   */
  | "Able"
  | "NoCheck";

export interface RawTargetList {
  name: ObjectIdentifier | AllegianceIdentifier | TargetListName;
  /**
   * Reverse target list
   */
  reverse?: boolean;
  /**
   * Random targetting (default: false)
   */
  random?: boolean;
  /**
   * Limit target list length
   */
  limit?: number;
  /**
   * Target must have one these status
   */
  includeStatus?: TargetStatus[];
  excludeStatus?: TargetStatus[];
  triggers?: Triggers.Trigger[];
}

/**
 * These objects can't have any parameter
 */
export const TARGET_FINAL_OBJECTS: ObjectIdentifier[] = [
  "Nothing",
  "Myself",
  "Player1",
  "Player2",
  "Player3",
  "Player4",
  "Player5",
  "Player6",
  "Protagonist",
  "StrongestOfMale",
  "Familiar",
  "FamiliarSummoner",
  "LastKilled",
];
