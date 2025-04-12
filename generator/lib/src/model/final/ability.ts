import { Actions } from "../raw/actions";
import { RawTargetList } from "../raw/target";
import { Triggers } from "../raw/triggers";

export interface CreatureAbility {
  name: string;
  target?: RawTargetList;
  /**
   * Is it a targetted spell ? (which requires specific triggers)
   */
  isTargetSpell: boolean;
  /**
   * Ability range (if applicable)
   */
  range?: number;
  /**
   * For ability that can be cast every n seconds (one hour is 300)
   */
  timer?: { name: string; value: number };
  triggers: Triggers.Trigger[];
  actions: Actions.Action[];
  /**
   * If true, disable interrupt (false by default)
   */
  disableInterrupt?: boolean;
}
