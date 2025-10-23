// import { ImmunityName } from "../../../config/immunity-name";
// import { TranslationKey } from "../../translations/i18n";
// import { RawEffect } from "./effect";
// import {
//   ItemSlot,
//   RawAbilityDamageType,
//   RawItemAbilityFlag,
//   RawItemAbilityLocation,
//   RawItemAbilityTarget,
//   RawItemAbilityType,
//   RawItemAnimation,
//   RawItemCategory,
//   RawItemFlag,
//   RawProficiencyType,
// } from "./enum";

// export interface RawItem {
//   /**
//    * Filename for ITM file (without extension)
//    */
//   file: string;
//   /**
//    * String reference, must be referenced in TRA files
//    */
//   stringRef?: TranslationKey;
//   description?: string[];
//   immunities?: ImmunityName[];
//   equippedSlot?: ItemSlot | ItemSlot[];
//   enchantment?: number;
//   weight?: number;
//   animation?: RawItemAnimation;
//   category?: RawItemCategory;
//   proficiency?: RawProficiencyType;
//   icon?: string;
//   animationSwing?: { overhand: number; backhand: number; thrust: number };
//   flags?: RawItemFlag[];

//   type?: RawItemAbilityType;
//   /**
//    * Range (feet)
//    */
//   range?: number;
//   speed?: number;
//   target?: RawItemAbilityTarget;
//   location?: RawItemAbilityLocation;
//   diceSize?: number;
//   diceThrown?: number;
//   bonusToHit?: number;
//   damageBonus?: number;
//   damageType?: RawAbilityDamageType;
//   projectile?: string;
//   abilityFlags?: RawItemAbilityFlag[];
//   effects?: RawEffect[];
// }

// export interface RawItemSlot {
//   /**
//    * Filename for ITM file (without extension)
//    */
//   file: string;
//   slot: ItemSlot | ItemSlot[];
//   /**
//    * default: 1
//    */
//   quantity?: number;
//   /**
//    * default: false
//    */
//   unstealable?: boolean;
//   /**
//    * default: true
//    */
//   undroppable?: boolean;
// }
