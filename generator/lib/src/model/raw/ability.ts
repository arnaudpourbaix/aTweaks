import { SpellIdentifier } from "../ids/spell";
import { StateIdentifier } from "../ids/state";
import { StatsIdentifier } from "../ids/stats";
import { TargetList } from "../script/target";
import { Actions } from "./actions";
import { Triggers } from "./triggers";

export interface RawCreatureAbility {
  name?: string;
  /**
   * Will check for preset in ABILITIES_PRESETS
   */
  preset?: string;
  target?: TargetList | TargetList[];
  spell?: RawCreatureAbilitySpell;
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
  triggers?: Triggers.Trigger[];
  /**
   * Actions before casting a spell
   */
  actionsBefore?: Actions.Action[];
  /**
   * Actions after casting a spell
   */
  actionsAfter?: Actions.Action[];
  /**
   * If true, disable interrupt (false by default)
   */
  disableInterrupt?: boolean;
  /**
   * Can't be cast when silenced (false by default)
   */
  requireVocal?: boolean;
  /**
   * Can use ability when polymorphed (false by default)
   */
  canUseWhenPolymorphed?: boolean;
}

export interface RawCreatureAbilitySpell {
  id?: SpellIdentifier;
  resource?: string;
  type?: "normal" | "noDec" | "force" | "reallyForce";
  excludeStateChecks?: StateIdentifier[];
  excludeSpellStates?: string[];
  excludeStatsChecks?: StatsIdentifier[];
  /**
   * Probability (0-100)
   */
  probability?: number;
  /**
   * Target self with spell even if target is set
   */
  selfTarget?: boolean;
  /**
   * Is it an attack or a spell ? (default: false)
   * A spell can't target an improved invisible character while an attack can
   */
  isAttack?: boolean;
  /**
   * Target name when a spell is specifically cast at someone
   */
  targetName?: string;
  /**
   * Remove spell after use, only relevant is type is different than normal
   */
  remove?: boolean;
}
