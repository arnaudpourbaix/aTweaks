import { GenericScriptData } from "./model/script/data";
import { ImmunityConfig } from "./model/final/immunity";
import { Creature } from "./model/creature/creature";
import { Item, Spell } from "./model/spell-item/spell-item";

export class State {
  static actions: GenericScriptData[] = [];
  static triggers: GenericScriptData[] = [];
  static immunities: ImmunityConfig[] = [];
  static modFolder: string;
  static creatures: Creature[] = [];
  static spells: Spell[] = [];
  static items: Item[] = [];
}
