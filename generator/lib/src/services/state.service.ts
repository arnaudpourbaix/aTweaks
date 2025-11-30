import { IMMUNITIES, RESISTANCES, TRAITS } from "../../config/immunity-config";
import { GenericScriptParameterData } from "../model/script/data";
import { ImmunityConfig } from "../model/final/immunity";
import { Actions } from "../model/script/actions";
import { Triggers } from "../model/script/triggers";
import { State } from "../state";
import descriptionService from "./description.service";
import effectService from "./effects/effect.service";
import {
  EffectTargetEnum,
  EffectTimingEnum,
} from "../model/spell-item/effect.enums";

class StateService {
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
    State.immunities = [...IMMUNITIES, ...RESISTANCES, ...TRAITS].map((i) => {
      const result: ImmunityConfig = {
        ...i,
        doc: i.doc ?? true,
        immunities: i.immunities ?? [],
        preventEffects: i.preventEffects ?? [],
        preventIcons: i.preventIcons ?? [],
        displayIcons: i.displayIcons ?? [],
        strings: i.strings ?? [],
        animations: i.animations ?? [],
        spellGroups: i.spellGroups ?? [],
        displaySpellIneffective: !!i.displaySpellIneffective,
        effects: effectService.getEffects(i.effects ?? [], {
          base: {
            target: EffectTargetEnum.Self,
            timing: EffectTimingEnum.InstantWhileEquipped,
          },
        }),
        overrides: i.overrides ?? [],
      };
      return result;
    });
    for (const i of State.immunities) {
      if (i.type !== "resistance") {
        descriptionService.generateImmunity(i);
      }
    }
  }
}

const stateService = new StateService();
export default stateService;
