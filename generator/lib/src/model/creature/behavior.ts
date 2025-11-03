import { AdditionalCode, CustomCode } from "../script/script";
import { CreatureAbility, RawCreatureAbility } from "./ability";

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

  abilities: CreatureAbility[];
  customCode: CustomCode[];
  additionalCode: AdditionalCode[];
}

export type PartialCreatureBehavior = Omit<
  Partial<CreatureBehavior>,
  "abilities" | "customCode" | "additionalCode"
> & { abilities?: RawCreatureAbility[] };
