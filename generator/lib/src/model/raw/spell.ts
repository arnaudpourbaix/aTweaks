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
  RawSpellFlag,
  RawSpellType,
} from "./enum";

export type RawSpell = RawAlterSpell | RawCreateSpell;

export interface RawAlterSpell extends RawBaseSpell {
  /**
   * Create a spell from another one
   */
  copyFrom: string;

  /**
   * String reference, must be referenced in TRA files
   */
  stringRef?: StringReference;

  /**
   * Array of min levels
   */
  deleteHeaders?: number[];

  deleteOpcodes?: RawEffectOpcode[];
}

export interface RawCreateSpell extends RawBaseSpell {
  /**
   * String reference, must be referenced in TRA files
   */
  stringRef: StringReference;
}

export interface RawBaseSpell {
  /**
   * Only for TPA readibility
   */
  name: string;

  /**
   * Filename for SPL file (without extension)
   */
  file: string;

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

  type?: RawItemAbilityType;
  /**
   * Range (feet)
   */
  range?: number;
  speed?: number;
  target?: RawItemAbilityTarget;
  location?: RawItemAbilityLocation;
  projectile?: string;
  flags?: RawSpellFlag[];
  effects?: RawEffect[];
  /**
   * Spell will be removed and added again after use, so you only need to memorize it once (default: false).
   */
  infiniteUse?: boolean;
}

export interface RawMemorizedSpell {
  /**
   * Filename for SPL file (without extension)
   */
  file: string;

  memorizedCount?: number;
}
