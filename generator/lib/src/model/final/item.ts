import { ImmunityName } from "../../../config/immunity-name";
import { ItemSlot } from "../raw/enum";
import { Effect } from "./effect";
import {
  AbilityDamageTypeEnum,
  ItemAbilityFlagEnum,
  ItemAbilityLocationEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  ItemAnimationEnum,
  ItemCategoryEnum,
  ItemFlagEnum,
  ProficiencyTypeEnum,
} from "./enums";

export interface Item {
  /**
   * Filename for ITM file (without extension)
   */
  file: string;
  /**
   * Create an item from another one
   */
  copyFrom?: ImmunityName | string;
  name?: string;
  description?: string[];
  immunities: ImmunityName[];
  enchantment?: number;
  animation?: ItemAnimationEnum;
  category?: ItemCategoryEnum;
  proficiency?: ProficiencyTypeEnum;
  icon?: string;
  animationSwing?: { overhand: number; backhand: number; thrust: number };
  flags?: ItemFlagEnum[];

  type?: ItemAbilityTypeEnum;
  /**
   * Range (feet)
   */
  range?: number;
  speed?: number;
  target: ItemAbilityTargetEnum;
  location: ItemAbilityLocationEnum;
  diceSize: number;
  diceThrown: number;
  bonusToHit?: number;
  damageBonus?: number;
  damageType: AbilityDamageTypeEnum;
  projectile?: string;
  abilityflags?: ItemAbilityFlagEnum[];
  effects: Effect[];
  equippedSlot?: ItemSlot;
}
