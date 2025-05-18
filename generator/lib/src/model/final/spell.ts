import { TraStringReferenceEnum } from "../../../config/stringRef";
import { StringReference } from "../misc";
import { Effect } from "./effect";
import { EffectTypeEnum } from "./effect.type";
import {
  ItemAbilityCastingAnimationEnum,
  ItemAbilityLocationEnum,
  ItemAbilityPrimaryTypeEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  SpellExclusionFlagEnum,
  SpellFlagEnum,
  SpellTypeEnum,
} from "./enums";

export interface Spell {
  /**
   * Only for TPA readibility
   */
  name: string;

  /**
   * Filename for SPL file (without extension)
   */
  file: string;

  /**
   * Create a spell from another one
   */
  copyFrom?: string;

  /**
   * String reference, must be referenced in TRA files
   */
  stringRef?: StringReference;

  spellbookIcon?: string;
  description?: string[] | TraStringReferenceEnum;
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
  deleteHeaders: number[] | boolean;
  deleteOpcodes: EffectTypeEnum[];
  makeInnate?: {
    castingTime?: number;
    removeInvisbilityOnCast?: boolean;
    renew?: boolean;
  };
}

export interface SpellHeader {
  type?: ItemAbilityTypeEnum;
  memorizedIcon?: string;
  range?: number;
  speed?: number;
  minLevel?: number;
  target?: ItemAbilityTargetEnum;
  location?: ItemAbilityLocationEnum;
  projectile?: string;
  effects: Effect[];
}
