import chalk from "chalk";
import * as fs from "fs";
import path from "path";
import { GLOBAL_CONFIG } from "../../config/generate";
import { IMMUNITIES } from "../../config/immunity-config";
import {
  GenericScriptParameterData,
  GenericScriptRawData,
} from "../model/final/data";
import { ImmunityConfig } from "../model/final/immunity";
import { State } from "../state";

export class StateService {
  static instance = new StateService();

  init(): Promise<void> {
    try {
      State.modFolder = "../..";
      this.loadActions();
      this.loadTriggers();
      this.loadGeneratorConfig();
      this.loadImmunities();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private loadActions(): void {
    const filename = "assets/actions.json";
    const file = fs.readFileSync(filename, { encoding: "utf8", flag: "r" });
    try {
      const content = JSON.parse(file) as GenericScriptRawData[];
      State.actions = content.map((c) => ({
        ...c,
        parameters: this.buildParameters(c.parameters),
      }));
    } catch (error: unknown) {
      console.error(chalk.red(`${filename} is not a valid json file!`));
      throw error;
    }
  }

  private loadTriggers(): void {
    const filename = "assets/triggers.json";
    const file = fs.readFileSync(filename, { encoding: "utf8", flag: "r" });
    try {
      const content = JSON.parse(file) as GenericScriptRawData[];
      State.triggers = content.map((c) => ({
        ...c,
        parameters: this.buildParameters(c.parameters),
      }));
    } catch (error: unknown) {
      console.error(chalk.red(`${filename} is not a valid json file!`));
      throw error;
    }
  }

  private buildParameters(params: string): GenericScriptParameterData[] {
    if (!params.length) return [];
    return params.split(",").map((p) => {
      const name = p.substring(p.indexOf(":") + 1, p.indexOf("*"));
      const isNumber = p.includes("I:");
      const isObject = p.includes("O:");
      return { raw: p, name, isNumber, isObject };
    });
  }

  private loadGeneratorConfig(): void {
    const config = GLOBAL_CONFIG;
    config.commonCreatureFile = path.join(
      State.modFolder,
      config.commonCreatureFile
    );
    config.commonFunctionsFile = path.join(
      State.modFolder,
      config.commonFunctionsFile
    );
    State.config = config;
  }

  private loadImmunities(): void {
    State.immunities = IMMUNITIES.map((i) => {
      const result: ImmunityConfig = {
        ...i,
        immunities: i.immunities ?? [],
        preventEffects: i.preventEffects ?? [],
        preventIcons: i.preventIcons ?? [],
        displayIcons: i.displayIcons ?? [],
        strings: (i.strings ?? []).map((s) => s[0]),
        animations: i.animations ?? [],
        idsSpells: i.idsSpells ?? [],
        spells: (i.spells ?? []).map((s) => s[0]),
        displaySpellIneffective: !!i.displaySpellIneffective,
        effects: i.effects ?? [],
      };
      return result;
    });
  }
}
