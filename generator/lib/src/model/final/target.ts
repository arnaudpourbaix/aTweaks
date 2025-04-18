import { TargetListName, TargetStatusName } from "../../../config/target-name";
import { AllegianceIdentifier } from "../ids/allegiance";
import { ObjectIdentifier } from "../ids/object";
import { Triggers } from "../raw/triggers";

export interface TargetList {
  name: ObjectIdentifier | AllegianceIdentifier | TargetListName;
  /**
   * Reverse target list
   */
  reverse: boolean;
  /**
   * Random targetting (default: false)
   */
  random?: boolean;
  /**
   * Limit target list length
   */
  limit: number;
  /**
   * Target must have one these status
   */
  includeStatus: TargetStatusName[];
  excludeStatus: TargetStatusName[];
  triggers: Triggers.Trigger[];
}

/**
 * Target Priority
 * For each target list, go through all status
 */
export interface TargetPriority {
  targets: TargetListName[];
  status: TargetStatusName[];
}
