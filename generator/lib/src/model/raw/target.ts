import { TargetListName, TargetStatusName } from "../../../config/target-name";
import { AllegianceIdentifier } from "../ids/allegiance";
import { ObjectIdentifier } from "../ids/object";
import { Triggers } from "./triggers";

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
  includeStatus?: TargetStatusName[];
  excludeStatus?: TargetStatusName[];
  triggers?: Triggers.Trigger[];
}

export interface TargetStatus {
  status: TargetStatusName;
  canOnlyTargetPlayer: boolean;
  targetTriggers: Triggers.Trigger[];
  triggers: Triggers.Trigger[];
}

/**
 * These objects can't have any parameter
 */
export const TARGET_PARAMLESS_OBJECTS: ObjectIdentifier[] = [
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
