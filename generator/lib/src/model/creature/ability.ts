import { Actions } from "../raw/actions";
import { Triggers } from "../raw/triggers";
import { TargetList } from "../script/target";

export interface CreatureAbility {
  name: string;
  target?: TargetList[];
  isSpell: boolean;
  /**
   * Ability maximum range (if applicable)
   */
  range?: number;
  /**
   * Ability minimum range (if applicable)
   */
  minRange?: number;
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
