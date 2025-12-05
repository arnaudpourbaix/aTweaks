import { ImmunityName } from "../final/immunity";
import { Effect } from "../spell-item/effect";
import { ProficiencyTypeEnum } from "../spell-item/effect.enums";
import { EffectTypeEnum } from "../spell-item/effect.type";
import { EquippedItem } from "./item";

export interface CreatureAdditionalData {
  /**
   * BAF scripts to remove from CRE
   */
  removeScripts: string[];
  /**
   * BAF Script location. Auto if empty, at the top tier possible.
   * Will raise an error at install if location was not empty (safety measure)
   * Use None to prevent from assigning a script
   */
  scriptLocation?: ScriptLocation;

  proficiencies: { type: ProficiencyTypeEnum; value: number }[];

  removeItems: string[];
  equippedItems: EquippedItem[];
  immunities: ImmunityName[];

  removeKnownSpells?: boolean;
  removeMemorizedSpells?: boolean;
  memorizedSpells: MemorizedSpell[];

  deleteEffectOpcodes: EffectTypeEnum[];
  removeEffects?: boolean;
  effects: Effect[];
  movement: { value: number; itemFile?: string };
}

export interface MemorizedSpell {
  /**
   * Filename for SPL file (without extension)
   */
  file: string;

  memorizedCount?: number;
}

export type ScriptLocation =
  | "Override"
  | "Class"
  | "Race"
  | "General"
  | "Default"
  | "None";

export const ADDITIONAL_DATA_DEFAULT: CreatureAdditionalData = {
  removeScripts: [],
  proficiencies: [],
  removeItems: [],
  equippedItems: [],
  immunities: [],
  removeKnownSpells: true,
  removeMemorizedSpells: true,
  memorizedSpells: [],
  deleteEffectOpcodes: [],
  removeEffects: true,
  effects: [],
  movement: { value: -1 },
};

export const ADJUSTMENT_ADDITIONAL_DATA_DEFAULT: CreatureAdditionalData = {
  ...ADDITIONAL_DATA_DEFAULT,
  removeKnownSpells: undefined,
  removeMemorizedSpells: undefined,
  removeEffects: undefined,
};
