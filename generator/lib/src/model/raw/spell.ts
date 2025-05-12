import { SpellGroupName } from "../../../config/spell-group-name";
import { TraStringReferenceEnum } from "../../../config/stringRef";
import { SpellIdentifier } from "../ids/spell";
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

export interface RawSpell extends RawSpellHeader {
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
   * Spell will be removed and added again after use, so you only need to memorize it once (default: false).
   */
  infiniteUse?: boolean;
  headers?: RawSpellHeader[];
  /**
   * Array of min levels or boolean
   */
  deleteHeaders?: number[] | boolean;
  deleteOpcodes?: RawEffectOpcode[];
}

export interface RawSpellHeader {
  type?: RawItemAbilityType;
  location?: RawItemAbilityLocation;
  target?: RawItemAbilityTarget;
  range?: number;
  speed?: number;
  minLevel?: number;
  projectile?: string;
  effects?: RawEffect[];
}

export interface RawMemorizedSpell {
  /**
   * Filename for SPL file (without extension)
   */
  file: string;

  memorizedCount?: number;
}
