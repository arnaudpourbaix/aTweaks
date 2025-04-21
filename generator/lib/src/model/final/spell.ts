import { SpellIdentifier } from "../ids/spell";
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
   * Array of min levels
   */
  deleteHeaders: number[];

  /**
   * String reference, must be referenced in TRA files
   */
  stringRef?: StringReference;

  spellbookIcon?: string;
  memorizedIcon?: string;
  description?: string[];
  spellType?: SpellTypeEnum;
  castingSound?: string;
  castingAnimation?: ItemAbilityCastingAnimationEnum;
  primaryType?: ItemAbilityPrimaryTypeEnum;
  secondaryType?: ItemAbilitySecondaryTypeEnum;
  spellLevel?: number;

  type?: ItemAbilityTypeEnum;
  /**
   * Range (feet)
   */
  range?: number;
  speed?: number;
  target?: ItemAbilityTargetEnum;
  location?: ItemAbilityLocationEnum;
  projectile?: string;
  flags?: SpellFlagEnum[];
  effects: Effect[];
  removeOpcodes: EffectTypeEnum[];
}
