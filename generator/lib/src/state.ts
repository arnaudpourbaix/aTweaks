import { GenericScriptData } from "./model/final/data";
import { ImmunityConfig } from "./model/final/immunity";

export class State {
  static actions: GenericScriptData[] = [];
  static triggers: GenericScriptData[] = [];
  static immunities: ImmunityConfig[] = [];
  static modFolder: string;
}
