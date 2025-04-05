import { GenericScriptData } from "./model/final/data";
import { ImmunityConfig } from "./model/final/immunity";
import { GenerateConfig } from "./model/raw/generate.config";

export class State {
    static actions: GenericScriptData[] = [];
    static triggers: GenericScriptData[] = [];
    static immunities: ImmunityConfig[] = [];
    static modFolder: string;
    static config: GenerateConfig;
}