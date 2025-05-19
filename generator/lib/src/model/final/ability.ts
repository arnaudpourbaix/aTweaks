import { Actions } from "../raw/actions";
import { RawTargetList } from "../raw/target";
import { Triggers } from "../raw/triggers";

export interface CreatureAbility {
  name: string;
  target?: RawTargetList[];
  isSpell: boolean;
  /**
   * Ability range (if applicable)
   */
  range?: number;
  /**
   * For ability that can be cast every n seconds (one hour is 300)
   */
  timer?: { name: string; value: number };
  /**
   * Ability doesn't share common round timer
   */
  noRoundTimer?: boolean;
  triggers: Triggers.Trigger[];
  actions: Actions.Action[];
  /**
   * If true, disable interrupt (false by default)
   */
  disableInterrupt: boolean;
  /**
   * Can't be cast when silenced (false by default)
   */
  requireVocal: boolean;
  /**
   * Can use ability when polymorphed (false by default)
   */
  canUseWhenPolymorphed: boolean;
}
