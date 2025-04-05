import { TargetListName } from "../../../config/target";
import { AllegianceIdentifiers } from "../ids/allegiance";
import { ObjectIdentifiers } from "../ids/object";
import { Trigger } from "../raw/script";
import { TargetStatusEnum } from "../raw/target";

export interface TargetList {
    name: ObjectIdentifiers | AllegianceIdentifiers | TargetListName;
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
    includeStatus: TargetStatusEnum[];
    excludeStatus: TargetStatusEnum[];
    triggers: Trigger[];
}