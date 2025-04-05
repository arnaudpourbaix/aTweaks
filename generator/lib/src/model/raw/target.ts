import { TargetListName } from "../../../config/target";
import { AllegianceIdentifiers } from "../ids/allegiance";
import { ObjectIdentifiers } from "../ids/object";
import { OrTrigger, Trigger } from "./script";

export interface TargetPriority {
  status: TargetStatus;
  canOnlyTargetPlayer: boolean;
  targetTriggers: (Trigger | OrTrigger)[];
  triggers: (Trigger | OrTrigger)[];
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
  name: ObjectIdentifiers | AllegianceIdentifiers | TargetListName;
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
  triggers?: Trigger[];
}

/**
 * These objects can't have any parameter
 */
export const TARGET_FINAL_OBJECTS = [
  ObjectIdentifiers.Nothing,
  ObjectIdentifiers.Myself,
  ObjectIdentifiers.Player1,
  ObjectIdentifiers.Player2,
  ObjectIdentifiers.Player3,
  ObjectIdentifiers.Player4,
  ObjectIdentifiers.Player5,
  ObjectIdentifiers.Player6,
  ObjectIdentifiers.Protagonist,
  ObjectIdentifiers.StrongestOfMale,
  ObjectIdentifiers.Familiar,
  ObjectIdentifiers.FamiliarSummoner,
  ObjectIdentifiers.LastKilled,
];
