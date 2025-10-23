import { CreatureAttack } from "../final/attack";
import { CreatureSize } from "../final/effect.enums";
import { Item, Spell } from "../final/spell-item";
import { AlignIdentifier } from "../ids/align";
import { AnimationIdentifiers } from "../ids/animate";
import { ClassIdentifier } from "../ids/class";
import { GenderIdentifier } from "../ids/gender";
import { GeneralIdentifier } from "../ids/general";
import { KitIdentifier } from "../ids/kit";
import { RaceIdentifier } from "../ids/race";
import { RawCreatureAbility } from "../raw/ability";
import { RawAdditionalCode, RawCustomCode } from "../raw/script";
import { PartialBy } from "../utility-types";

export interface CreBehavior {
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

export interface CreData {
  level1?: number;
  level2?: number;
  level3?: number;
  strength?: number;
  exceptionalStrength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  movement?: number;
  hp?: number;
  /**
   * Bonus HP (+x). For example, Hit Dice 6+1, bonus is 1
   */
  bonusHp?: number;
  /**
   * Specific case when creature have more HP or can fight when HP is below 0 like some bears.
   */
  specialBonusHp?: number;
  ac?: number;
  thac0?: number;
  apr?: number;
  xpv?: number;
  hideShadow?: number;
  moveSilent?: number;
  alignment?: AlignIdentifier;
  saveDeath?: number;
  saveWand?: number;
  savePolymorph?: number;
  saveBreath?: number;
  saveSpell?: number;
  morale?: number;
  moraleBreak?: number;
  moraleRecovery?: number;
  general?: GeneralIdentifier;
  race?: RaceIdentifier;
  class?: ClassIdentifier;
  kit?: KitIdentifier;
  gender?: GenderIdentifier;
  size?: CreatureSize;
  animation?: AnimationIdentifiers;
  modAnimation?: string;
  metalColor?: number;
  minorColor?: number;
  majorColor?: number;
  skinColor?: number;
  leatherColor?: number;
  armorColor?: number;
  hairColor?: number;
}

export type CreSpell = PartialBy<
  Omit<Spell, "file">,
  "icon" | "effects" | "headers"
>;

export type CreItem = PartialBy<
  Omit<Item, "file">,
  "immunities" | "effects" | "equippedSlot"
>;
