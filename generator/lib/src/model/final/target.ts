import { TargetListName, TargetStatusName } from "../../../config/target-name";

/**
 * Target Priority
 * For each target list, go through all status
 */
export interface TargetPriority {
  targets: TargetListName[];
  status: TargetStatusName[];
}
