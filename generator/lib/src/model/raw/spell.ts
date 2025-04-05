import { SpellIdentifiers } from "../ids/spell";
import { RawEffect } from "./effect";
import { RawEffectTypeEnum } from "./effect.type";
import {
  RawItemAbilityLocation,
  RawItemAbilitySecondaryType,
  RawItemAbilityTarget,
  RawItemAbilityType,
  RawSpellFlagEnum,
  RawSpellType,
} from "./enum";

export type RawSpell = RawAlterSpell | RawCreateSpell;

export interface RawAlterSpell extends RawBaseSpell {
  /**
   * Create a spell from another one
   */
  copyFrom: SpellIdentifiers | string;

  /**
   * String reference, must be referenced in TRA files
   */
  stringRef?: number | string;
}

export interface RawCreateSpell extends RawBaseSpell {
  /**
   * String reference, must be referenced in TRA files
   */
  stringRef: number | string;
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

  description?: string[];

  spellType?: RawSpellType;

  castingSound?: string;

  castingAnimation?: string;

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
  flags?: RawSpellFlagEnum[];
  effects?: RawEffect[];
  removeOpcodes?: RawEffectTypeEnum[];
}

export interface RawMemorizedSpell {
  /**
   * Filename for SPL file (without extension)
   */
  file: string;

  memorizedCount?: number;
}
