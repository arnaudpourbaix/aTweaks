import { TargetListName } from "../../../config/target";
import { AllegianceIdentifier } from "../ids/allegiance";
import { ObjectIdentifier } from "../ids/object";
import { TargetStatus } from "../raw/target";
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
  includeStatus: TargetStatus[];
  excludeStatus: TargetStatus[];
  triggers: Triggers.Trigger[];
}
