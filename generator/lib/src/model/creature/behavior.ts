import { RawCreatureAbility } from "../raw/ability";
import { RawAdditionalCode, RawCustomCode } from "../raw/script";

export interface CreatureBehavior {
  /**
   * Will initiate dialog (values are creature script name)
   */
  dialog: string[];

  /**
   * Asking or responding to help shouts (default: true)
   */
  help: boolean;

  /**
   * Can track enemies when no one in sight ? (default: true)
   */
  tracking: boolean;

  /**
   * Random walk outside of combat (default: false)
   */
  walk: boolean;

  /**
   * Random walk within combat when nothing else to do (default: true)
   */
  combatWalk: boolean;

  /**
   * Fully heal while resting (default: false)
   */
  restHeal: boolean;

  /**
   * Can use potions (default: false)
   */
  usePotions: boolean;

  /**
   * Can use kit abilities (default: false)
   */
  useKitAbilities: boolean;

  /**
   * Able to hide in shadows (default: false)
   */
  hideInShadows: boolean;

  canPolymorph: boolean;

  abilities: RawCreatureAbility[];
  customCode: RawCustomCode[];
  additionalCode: RawAdditionalCode[];
}
