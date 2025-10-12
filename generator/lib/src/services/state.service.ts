import { IMMUNITIES } from "../../config/immunity-config";
import { GenericScriptParameterData } from "../model/final/data";
import { ImmunityConfig } from "../model/final/immunity";
import { Actions } from "../model/raw/actions";
import { Triggers } from "../model/raw/triggers";
import { State } from "../state";
import { DescriptionService } from "./description.service";
import { EffectService } from "./effect.service";

export class StateService {
  static instance = new StateService();

  private descriptionService = DescriptionService.instance;
  private effectService = EffectService.instance;

  init(): Promise<void> {
    try {
      State.modFolder = "..";
      this.loadActions();
      this.loadTriggers();
      this.loadImmunities();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private loadActions(): void {
    State.actions = Actions.ACTIONS.map((c) => ({
      ...c,
      parameters: this.buildParameters(c.parameters),
    }));
  }

  private loadTriggers(): void {
    State.triggers = Triggers.TRIGGERS.map((c) => ({
      ...c,
      parameters: this.buildParameters(c.parameters),
    }));
  }

  private buildParameters(params: string): GenericScriptParameterData[] {
    if (!params.length) return [];
    return params.split(",").map((p) => {
      const name = p.substring(p.indexOf(":") + 1, p.indexOf("*"));
      const isNumber = p.includes("I:") && p !== "I:Object*";
      const isObject = p.includes("O:") || p === "I:Object*";
      return { raw: p, name, isNumber, isObject };
    });
  }

  private loadImmunities(): void {
    State.immunities = IMMUNITIES.map((i) => {
      const result: ImmunityConfig = {
        ...i,
        description: i.description ?? [],
        immunities: i.immunities ?? [],
        preventEffects: i.preventEffects ?? [],
        preventIcons: i.preventIcons ?? [],
        displayIcons: i.displayIcons ?? [],
        strings: i.strings ?? [],
        animations: i.animations ?? [],
        spellGroups: i.spellGroups ?? [],
        displaySpellIneffective: !!i.displaySpellIneffective,
        effects: this.effectService.getEffects(i.effects ?? []),
      };
      return result;
    });
    for (const i of State.immunities) {
      this.descriptionService.generateImmunity(i);
    }
  }
}
