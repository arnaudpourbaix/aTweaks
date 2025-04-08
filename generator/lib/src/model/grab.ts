import { EffectDamageTypeEnum } from "./final/enums";
import { RawEffect } from "./raw/effect";
import {
  RawItemAbilityLocation,
  RawItemAbilitySecondaryType,
  RawItemAbilityTarget,
  RawItemAbilityType,
  RawSaveType,
  RawSpellType,
} from "./raw/enum";

export interface GrabFullConfig extends GrabConfig {
  grabState: string;
  grabDisplayStringRef: number;
  grabbedDisplayStringRef: number;
  startSound: string;
  endSound: string;
  visualEffect: string;
}

export interface GrabConfig {
  /**
   * Filename for SPL file (without extension)
   */
  file: string;

  /**
   * Weapon file that is able to grab
   */
  weaponFile: string;

  /**
   * Probability for triggering on hit
   */
  probability: number;

  saveTypes: RawSaveType[];
  saveBonus: number;

  /**
   * Grab duration (in seconds, should be a multiple of 6)
   */
  duration: number;

  /**
   * Damage per round
   */
  damagePerRound?: {
    diceThrown: number;
    diceSize: number;
    type: EffectDamageTypeEnum;
  };
}

export interface GrabSpellConfig {
  /**
   * String reference, must be referenced in TRA files
   */
  stringRefSpellName: number;

  spellType: RawSpellType;

  secondaryType: RawItemAbilitySecondaryType;

  spellLevel: number;

  type: RawItemAbilityType;

  /**
   * Range (feet)
   */
  range: number;
  target: RawItemAbilityTarget;
  location: RawItemAbilityLocation;
  effects: RawEffect[];
  /**
   * Damage per round
   */
  damagePerRound?: {
    diceThrown: number;
    diceSize: number;
    type: EffectDamageTypeEnum;
  };
}
