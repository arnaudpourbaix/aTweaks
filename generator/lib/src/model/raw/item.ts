import { ImmunityName } from "../../../config/immunity-name";
import { RawEffect } from "./effect";
import {
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
} from "./enum";

export type RawItem = RawAlterItem | RawCreateItem;

export interface RawAlterItem {
  /**
   * Filename for ITM file (without extension)
   */
  file: string;
  /**
   * Create an item from another one
   */
  copyFrom: ImmunityName | string;
  name?: string;
  description?: string[];
  immunities?: ImmunityName[];
  equippedSlot?: ItemSlot;
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
}

export interface RawCreateItem {
  /**
   * Filename for ITM file (without extension)
   */
  file: string;
  immunities?: ImmunityName[];
  name?: string;
  description?: string[];
  equippedSlot?: ItemSlot;
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
}

export interface RawItemSlot {
  /**
   * Filename for ITM file (without extension)
   */
  file: string;

  slot: ItemSlot;
}
