import { ImmunityName } from "../../../config/immunity-name";
import { SpellGroupName } from "../../../config/spell-group-name";
import { RawItemSlot } from "../raw/item";
import { Effect } from "./effect";
import { EffectTypeEnum } from "./effect.type";
import { PortraitIconEnum } from "./enums";

export interface ImmunityConfig {
  name: ImmunityName | string;
  type: "trait" | "immunity";
  description: string[];
  immunities: ImmunityName[];
  preventEffects: EffectTypeEnum[];
  preventIcons: PortraitIconEnum[];
  displayIcons: PortraitIconEnum[];
  strings: string[];
  animations: string[];
  spellGroups: SpellGroupName[];
  displaySpellIneffective: boolean;
  /**
   * All effects are permanent (spl) or while equiped (itm)
   */
  effects: Effect[];
  /**
   * Will create an item and add it into chosen slot
   */
  itemSlot?: RawItemSlot;
}
