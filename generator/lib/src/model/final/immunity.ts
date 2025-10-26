import { ImmunityName } from "../../../config/immunity-name";
import { SpellGroupName } from "../../../config/spell-group-name";
import { TranslationKey } from "../../../translations/i18n";
import { Effect } from "../spell-item/effect";
import { PortraitIconEnum } from "../spell-item/effect.enums";
import { EffectTypeEnum } from "../spell-item/effect.type";
import { EquippedItem } from "../spell-item/spell-item";

export interface ImmunityConfig {
  name: ImmunityName | string;
  type: "trait" | "immunity" | "resistance";
  stringRef: TranslationKey;
  description?: TranslationKey;
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
