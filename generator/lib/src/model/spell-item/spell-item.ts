import { TranslationKey } from "../../../translations/i18n";
import { PartialCreatureAbility } from "../creature/ability";
import { ItemSlot } from "../creature/item";
import { ImmunityName } from "../final/immunity";
import { StringReference } from "../final/stringref";
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
import { PartialProjectile, Projectile } from "./projectile";

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
   * Will appear in documentation (default: true)
   */
  doc: boolean;

  /**
   * Spellbook icon
   */
  icon?: string;
  description?: StringReference;
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
    /**
     * add racial resistances when it is relevant (default: true)
     */
    addRacialResistances?: boolean;
  };
  memorizedCount?: number;
  effectFiles: EffectFile[];
  projectiles: Projectile[];
  ability?: PartialCreatureAbility;
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
  /**
   * Will appear in documentation (default: true)
   */
  doc: boolean;
  stringRef?: StringReference;
  description?: StringReference;
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
  projectiles: Projectile[];
  /**
   * Creature's trait (use for documentation)
   */
  trait: boolean;
}

export interface ItemSpellHeader {
  type: ItemAbilityTypeEnum;
  range?: number;
  speed?: number;
  target?: ItemAbilityTargetEnum;
  location?: ItemAbilityLocationEnum;
  projectile?: string | PartialProjectile;
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

export type PartialSpellHeader = PartialBy<SpellHeader, "effects">;

export type PartialSpell = PartialBy<
  Omit<Spell, "file" | "headers">,
  "icon" | "effects" | "effectFiles" | "projectiles" | "doc"
> & { headers?: PartialSpellHeader[] };

export type PartialItemHeader = PartialBy<ItemHeader, "effects">;

export type PartialItem = PartialBy<
  Omit<Item, "file" | "header">,
  "immunities" | "effects" | "projectiles" | "equippedSlot" | "doc" | "trait"
> & { header?: PartialItemHeader };

export type PartialWeapon = PartialBy<
  Omit<Item, "file" | "header">,
  "immunities" | "effects" | "projectiles" | "doc" | "trait"
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
