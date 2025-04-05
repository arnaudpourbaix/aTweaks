import { Action, Trigger } from "./script";
import { RawTargetList } from "./target";

export interface RawCreatureAbility {
    name: string;
    target: RawTargetList;
    /**
     * Is it a targetted spell ? (which requires specific triggers)
     */
    isTargetSpell?: boolean;
    /**
     * Ability range (if applicable)
     */
    range?: number;
    /**
     * For ability that can be cast every n seconds (one hour is 300)
     */
    timer?: { name: string; value: number; };
    triggers?: Trigger[];
    actions: Action[];
    /**
     * If true, disable interrupt (false by default)
     */
    disableInterrupt?: boolean;
}
