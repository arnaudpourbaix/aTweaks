import { ImmunityName } from "../../../config/immunity-config";
import { SpellGroupName } from "../../../config/spell-group-name";
import { TranslationKey } from "../../../translations/i18n";
import { EquippedItem } from "../creature/item";
import { Effect } from "../spell-item/effect";
import { PortraitIconEnum } from "../spell-item/effect.enums";
import { EffectTypeEnum } from "../spell-item/effect.type";
import { StringReference } from "./stringref";

export interface ImmunityConfig {
  name: string;
  type: "trait" | "immunity" | "resistance";
  stringRef?: TranslationKey;
  description?: StringReference;
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
  itemSlot?: EquippedItem;
}
