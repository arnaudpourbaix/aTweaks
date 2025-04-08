import { ImmunityName } from "../../../config/immunity-name";
import { SpellIdentifier } from "../ids/spell";
import { RawEffect } from "../raw/effect";
import { RawItemSlot } from "../raw/item";
import { EffectTypeEnum } from "./effect.type";
import { PortraitIconEnum } from "./enums";

export interface ImmunityConfig {
  name: ImmunityName | string;
  type: "trait" | "immunity";
  description: string[];
  immunities: (ImmunityName | string)[];
  preventEffects: EffectTypeEnum[];
  preventIcons: PortraitIconEnum[];
  displayIcons: PortraitIconEnum[];
  strings: number[];
  animations: string[];
  idsSpells: { id: SpellIdentifier | string; suffixes?: string[] }[];
  spells: string[];
  displaySpellIneffective: boolean;
  /**
   * All effects are permanent (spl) or while equiped (itm)
   */
  effects: RawEffect[];
  /**
   * Will create an item and add it into chosen slot
   */
  itemSlot?: RawItemSlot;
}
