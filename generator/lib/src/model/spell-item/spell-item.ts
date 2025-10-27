import { ImmunityName } from "../../../config/immunity-name";
import { TranslationKey } from "../../../translations/i18n";
import { ItemSlot } from "../creature/item";
import { PartialBy, WithRequired } from "../utility-types";
import { Effect, EffectFile } from "./effect";
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
  ProficiencyTypeEnum,
  SaveTypeEnum,
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
  /**
   * Options are applied last using a WEIDU function
   */
  options?: {
    spellType?: SpellTypeEnum;
    castingTime?: number;
    removeInvisbilityOnCast?: boolean;
    /**
     * Spell will be removed and added again after set rounds, so you only need to memorize it once. (only work for innates)
     */
    renew?: number;
  };
  memorizedCount?: number;
  effectFiles: EffectFile[];
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
  header?: ItemHeader;
  equippedSlot: ItemSlot[];
}

export interface ItemSpellHeader {
  type: ItemAbilityTypeEnum;
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
  // racialResistances?: boolean;
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

export type PartialSpellHeader = PartialBy<SpellHeader, "effects">;

export type PartialSpell = PartialBy<
  Omit<Spell, "file" | "headers">,
  "icon" | "effects" | "effectFiles"
> & { headers?: PartialSpellHeader[] };

export type PartialItemHeader = PartialBy<ItemHeader, "effects">;

export type PartialItem = PartialBy<
  Omit<Item, "file" | "header">,
  "immunities" | "effects" | "equippedSlot"
> & { header?: PartialItemHeader };

export type PartialWeapon = PartialBy<
  Omit<Item, "file" | "header">,
  "immunities" | "effects"
> & { header: PartialItemHeader };

export type Weapon = WithRequired<Item, "header">;

export interface WeaponCastSpell {
  spell: PartialSpell;
  probability1?: number;
  probability2?: number;
  saveTypes?: SaveTypeEnum[];
  saveBonus?: number;
  /**
   * removes after cast
   */
  remove?: boolean;
}
