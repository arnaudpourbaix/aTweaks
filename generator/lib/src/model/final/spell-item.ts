import { ImmunityName } from "../../../config/immunity-name";
import { TranslationKey } from "../../translations/i18n";
import { Effect } from "./effect";
import {
  AbilityDamageTypeEnum,
  ItemAbilityCastingAnimationEnum,
  ItemAbilityFlagEnum,
  ItemAbilityLocationEnum,
  ItemAbilityPrimaryTypeEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  ItemAnimationEnum,
  ItemCategoryEnum,
  ItemFlagEnum,
  ItemSlot,
  ProficiencyTypeEnum,
  SpellExclusionFlagEnum,
  SpellFlagEnum,
  SpellTypeEnum,
} from "./effect.enums";
import { EffectTypeEnum } from "./effect.type";

export interface Spell {
  /**
   * Filename for SPL file (without extension)
   */
  file: string;

  name: TranslationKey;

  /**
   * Create a spell from another one
   */
  copyFrom?: string;

  /**
   * Spellbook icon
   */
  icon?: string;
  description?: TranslationKey;
  spellType?: SpellTypeEnum;
  castingSound?: string;
  castingAnimation?: ItemAbilityCastingAnimationEnum;
  primaryType?: ItemAbilityPrimaryTypeEnum;
  secondaryType?: ItemAbilitySecondaryTypeEnum;
  spellLevel?: number;
  flags?: SpellFlagEnum[];
  exclusionFlags?: SpellExclusionFlagEnum[];
  effects: Effect[];
  headers: SpellHeader[];
  /**
   * Array of min levels or boolean
   */
  deleteHeaders?: number[] | boolean;
  deleteOpcodes?: EffectTypeEnum[];
  changes?: {
    spellType?: SpellTypeEnum;
    castingTime?: number;
    removeInvisbilityOnCast?: boolean;
    renew?: boolean;
  };
  memorizedCount?: number;
}

export interface Item {
  /**
   * Filename for ITM file (without extension)
   */
  file: string;
  /**
   * Create a spell from another one
   */
  copyFrom?: string;
  stringRef?: TranslationKey;
  description?: TranslationKey;
  immunities: ImmunityName[];
  enchantment?: number;
  animation?: ItemAnimationEnum;
  category?: ItemCategoryEnum;
  proficiency?: ProficiencyTypeEnum;
  icon?: string;
  flags?: ItemFlagEnum[];
  effects: Effect[];
  header: ItemHeader;
  equippedSlot: ItemSlot[];
}

export interface ItemSpellHeader {
  type?: ItemAbilityTypeEnum;
  range?: number;
  speed?: number;
  target?: ItemAbilityTargetEnum;
  location?: ItemAbilityLocationEnum;
  projectile?: string;
  /**
   * Memorized icon for spells
   */
  icon?: string;
  effects: Effect[];
}

export interface SpellHeader extends ItemSpellHeader {
  minLevel?: number;
}

export interface ItemHeader extends ItemSpellHeader {
  diceSize?: number;
  diceThrown?: number;
  bonusToHit?: number;
  damageBonus?: number;
  damageType?: AbilityDamageTypeEnum;
  abilityflags?: ItemAbilityFlagEnum[];
  animationSwing?: { overhand: number; backhand: number; thrust: number };
}

export type MemorizedSpellType = "priest" | "wizard" | "innate";

export interface EquippedItem {
  /**
   * Filename for ITM file (without extension)
   */
  file: string;
  slot: ItemSlot | ItemSlot[];
  /**
   * default: 1
   */
  quantity?: number;
  /**
   * default: false
   */
  unstealable?: boolean;
  /**
   * default: true
   */
  undroppable?: boolean;
}
