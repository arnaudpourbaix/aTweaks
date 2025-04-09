import { StringReferenceEnum } from "../../../config/stringRef";
import { SpellIdentifier } from "../ids/spell";
import { RawEffect } from "./effect";
import { RawEffectOpcode } from "./effect.type";
import {
  RawItemAbilityLocation,
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
  copyFrom: SpellIdentifier | string;

  /**
   * String reference, must be referenced in TRA files
   */
  stringRef?: number | string;
}

export interface RawCreateSpell extends RawBaseSpell {
  /**
   * String reference, must be referenced in TRA files
   */
  stringRef: StringReferenceEnum | string;
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
  flags?: RawSpellFlag[];
  effects?: RawEffect[];
  removeOpcodes?: RawEffectOpcode[];
}

export interface RawMemorizedSpell {
  /**
   * Filename for SPL file (without extension)
   */
  file: string;

  memorizedCount?: number;
}
