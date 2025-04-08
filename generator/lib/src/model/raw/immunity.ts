import { ImmunityName } from "../../../config/immunity-name";
import { EffectTypeEnum } from "../final/effect.type";
import { PortraitIconEnum } from "../final/enums";
import { SpellIdentifier } from "../ids/spell";
import { RawEffect } from "./effect";
import { RawItemSlot } from "./item";

export interface RawImmunityConfig {
  name: ImmunityName | string;
  type: "trait" | "immunity";
  description: string[];
  immunities?: (ImmunityName | string)[];
  preventEffects?: EffectTypeEnum[];
  preventIcons?: PortraitIconEnum[];
  displayIcons?: PortraitIconEnum[];
  strings?: number[];
  animations?: string[];
  idsSpells?: {
    id: SpellIdentifier | string;
    suffixes?: string[];
    source?: string;
  }[];
  spells?: string[];
  displaySpellIneffective?: boolean;
  /**
   * All effects are permanent (spl) or while equiped (itm)
   */
  effects?: RawEffect[];
  /**
   * Will create an item and add it into chosen slot
   */
  itemSlot?: RawItemSlot;
}
