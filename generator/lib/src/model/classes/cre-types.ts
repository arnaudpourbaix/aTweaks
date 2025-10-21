import { ImmunityName } from "../../../config/immunity-name";
import { AlignIdentifier } from "../ids/align";
import { AnimationIdentifiers } from "../ids/animate";
import { ClassIdentifier } from "../ids/class";
import { GenderIdentifier } from "../ids/gender";
import { GeneralIdentifier } from "../ids/general";
import { KitIdentifier } from "../ids/kit";
import { RaceIdentifier } from "../ids/race";
import { StringReference } from "../misc";
import { RawEffect } from "../raw/effect";
import {
  CreatureSize,
  ItemSlot,
  RawAbilityDamageType,
  RawItemAbilityFlag,
  RawItemAbilityLocation,
  RawItemAbilityTarget,
  RawItemAbilityType,
  RawItemAnimation,
  RawItemCategory,
  RawItemFlag,
  RawProficiencyType,
} from "../raw/enum";

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

export interface CreItem {
  /**
   * Filename for ITM file (without extension)
   */
  file: string;
  /**
   * String reference, must be referenced in TRA files
   */
  stringRef?: StringReference;
  description?: string[];
  immunities?: ImmunityName[];
  equippedSlot?: ItemSlot | ItemSlot[];
  enchantment?: number;
  weight?: number;
  animation?: RawItemAnimation;
  category?: RawItemCategory;
  proficiency?: RawProficiencyType;
  icon?: string;
  animationSwing?: { overhand: number; backhand: number; thrust: number };
  flags?: RawItemFlag[];
  type?: RawItemAbilityType;
  /**
   * Range (feet)
   */
  range?: number;
  speed?: number;
  target?: RawItemAbilityTarget;
  location?: RawItemAbilityLocation;
  diceSize?: number;
  diceThrown?: number;
  bonusToHit?: number;
  damageBonus?: number;
  damageType?: RawAbilityDamageType;
  projectile?: string;
  abilityFlags?: RawItemAbilityFlag[];
  effects?: RawEffect[];
}

export interface CreWeapon {
  /**
   * String reference, must be referenced in TRA files
   */
  stringRef?: StringReference;
  description?: string[];
  equippedSlot?: "WEAPON1" | "WEAPON2" | "WEAPON3" | "WEAPON4" | "SHIELD";
  enchantment?: number;
  animation?: RawItemAnimation;
  category?: RawItemCategory;
  proficiency?: RawProficiencyType;
  icon?: string;
  animationSwing?: { overhand: number; backhand: number; thrust: number };
  flags?: RawItemFlag[];
  type?: RawItemAbilityType;
  /**
   * Range (feet)
   */
  range?: number;
  speed?: number;
  target?: RawItemAbilityTarget;
  location?: RawItemAbilityLocation;
  diceSize?: number;
  diceThrown?: number;
  bonusToHit?: number;
  damageBonus?: number;
  damageType?: RawAbilityDamageType;
  projectile?: string;
  abilityFlags?: RawItemAbilityFlag[];
  effects?: RawEffect[];
  immunities?: ImmunityName[];
}
