import { SpellIdentifier } from "../ids/spell";
import { Effect } from "./effect";
import { EffectTypeEnum } from "./effect.type";
import {
  ItemAbilityLocationEnum,
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
  copyFrom?: SpellIdentifier | string;

  /**
   * String reference, must be referenced in TRA files
   */
  stringRef?: number | string;

  description?: string[];

  spellType?: SpellTypeEnum;

  castingSound?: string;

  castingAnimation?: string;

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
