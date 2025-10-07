import { TraStringReferenceEnum } from "../../../config/stringRef";
import { StringReference } from "../misc";
import { RawEffect } from "./effect";
import { RawEffectOpcode } from "./effect.type";
import {
  RawItemAbilityCastingAnimation,
  RawItemAbilityLocation,
  RawItemAbilityPrimaryType,
  RawItemAbilitySecondaryType,
  RawItemAbilityTarget,
  RawItemAbilityType,
  RawSpellExclusionFlag,
  RawSpellFlag,
  RawSpellType,
} from "./enum";

export interface RawSpell {
  /**
   * Only for TPA readibility
   */
  name: string;

  /**
   * Filename for SPL file (without extension)
   */
  file: string;

  /**
   * String reference, must be referenced in TRA files
   */
  stringRef?: StringReference;

  /**
   * Create a spell from another one
   */
  copyFrom?: string;

  memorizedCount?: number;
  /**
   * Shortcut for spellbook (suffix C) and memorized icon (suffix B)
   */
  icon?: string;
  spellbookIcon?: string;
  memorizedIcon?: string;
  description?: string[] | TraStringReferenceEnum;
  spellType?: RawSpellType;
  castingSound?: string;
  castingAnimation?: RawItemAbilityCastingAnimation;
  primaryType?: RawItemAbilityPrimaryType;
  secondaryType?: RawItemAbilitySecondaryType;
  spellLevel?: number;
  flags?: RawSpellFlag[];
  exclusionFlags?: RawSpellExclusionFlag[];
  /**
   * Spell will be removed and added again after set rounds, so you only need to memorize it once. (only work for innates)
   */
  infiniteUse?: number;
  effects?: RawEffect[];
  headers?: RawSpellHeader[];
  /**
   * Array of min levels or boolean
   */
  deleteHeaders?: number[] | boolean;
  deleteOpcodes?: RawEffectOpcode[];
  changes?: {
    spellType?: RawSpellType;
    castingTime?: number;
    removeInvisbilityOnCast?: boolean;
    renew?: boolean;
  };
}

export interface RawSpellHeader {
  type?: RawItemAbilityType;
  location?: RawItemAbilityLocation;
  target?: RawItemAbilityTarget;
  range?: number;
  speed?: number;
  minLevel?: number;
  projectile?: string;
  /**
   * Convenience to add sleep-charm resistance form elves et half-elves.
   */
  racialSleepCharmResistance?: boolean;
  effects?: RawEffect[];
}

export type RawMemorizedSpellType = "priest" | "wizard" | "innate";
export interface RawMemorizedSpell {
  /**
   * Filename for SPL file (without extension)
   */
  file: string;

  memorizedCount?: number;
}
