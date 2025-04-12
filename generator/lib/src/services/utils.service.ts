import { GLOBAL_CONFIG } from "../../config/generate";
import { ImmunityName } from "../../config/immunity-name";
import { ImmunityConfig } from "../model/final/immunity";
import { SpellIdentifier } from "../model/ids/spell";
import { StringReference } from "../model/misc";
import { Actions } from "../model/raw/actions";
import { Response } from "../model/raw/script";
import { Triggers } from "../model/raw/triggers";
import { State } from "../state";

export class UtilsService {
  static instance = new UtilsService();

  replaceParamTokens(
    params: (string | number)[],
    tokens: { key: string; value: string }[]
  ): void {
    for (let i = 0; i < params.length; i++) {
      const p = params[i];
      if (typeof p === "string") {
        for (const token of tokens)
          params[i] = p.replace(token.key, token.value);
      }
    }
  }

  replaceResponseTokens(
    responses: Response[],
    tokens: { key: string; value: string }[]
  ): Response[] {
    return responses.map((r) => ({
      ...r,
      actions: this.replaceActionTokens(r.actions, tokens),
    }));
  }

  replaceActionTokens(
    actions: Actions.Action[],
    tokens: { key: string; value: string }[]
  ): Actions.Action[] {
    const results = structuredClone(actions);
    for (const action of results) {
      if ("params" in action) this.replaceParamTokens(action.params, tokens);
    }
    return results;
  }

  replaceTriggerTokens(
    triggers: Triggers.Trigger[],
    tokens: { key: string; value: string }[]
  ): Triggers.Trigger[] {
    const results = structuredClone(triggers);
    for (const trigger of results) {
      if ("triggers" in trigger) {
        this.replaceTriggerTokens(trigger.triggers, tokens);
      } else if ("params" in trigger) {
        this.replaceParamTokens(trigger.params, tokens);
      }
    }
    return results;
  }

  inverseNegation(trigger: Triggers.Trigger): Triggers.Trigger {
    return { ...trigger, negation: !trigger.negation };
  }

  inverseNegations(triggers: Triggers.Trigger[]): Triggers.Trigger[] {
    return triggers.reduce((acc, trigger) => {
      if ("triggers" in trigger) {
        acc.push(
          ...(this.inverseNegations(trigger.triggers) as Triggers.Trigger[])
        );
      } else {
        acc.push(this.inverseNegation(trigger));
      }
      return acc;
    }, [] as Triggers.Trigger[]);
  }

  getStringReference(value: StringReference): string {
    if (typeof value === "string") {
      return "";
    } else {
      return "";
    }
  }

  getSpellResourceFromIds(ids: string): string {
    const type = ids.substring(0, 1);
    const num = ids.substring(1);
    let prefix = "";
    if (type === "1") prefix = "SPPR";
    else if (type === "2") prefix = "SPWI";
    else if (type === "3") prefix = "SPIN";
    else if (type === "4") prefix = "SPCL";
    return `${prefix}${num}`;
  }

  getImmunityFunctionName(immunity: ImmunityConfig | ImmunityName | string) {
    return `${
      typeof immunity === "string" ? immunity : immunity.name
    }_immunity`;
  }

  hasImmunity(
    immunities: (ImmunityName | string)[],
    name: ImmunityName | string
  ): boolean {
    let found = false;
    for (let i = 0; i < immunities.length && !found; i++) {
      if (immunities[i] === name) found = true;
      else {
        const immunity = State.immunities.find(
          (im) => im.name === immunities[i]
        ) as ImmunityConfig;
        found = this.hasImmunity(immunity.immunities, name);
      }
    }
    return found;
  }

  getFile(path: string): { file: string; name: string; ext: string } {
    path = path.replace(/\\/g, "/");
    const file = path.substring(path.lastIndexOf("/") + 1);
    return {
      file,
      name: file.substring(0, file.indexOf(".")),
      ext: file.substring(file.indexOf(".") + 1),
    };
  }

  getSpellInfos(file: string): { type: string; level: number } {
    if (file.toUpperCase().includes("SPWI"))
      return { type: "wizard", level: +(file.at(4) as string) };
    else if (file.toUpperCase().includes("SPPR"))
      return { type: "priest", level: +(file.at(4) as string) };
    return { type: "innate", level: 1 };
  }

  getSpellResource(file?: SpellIdentifier | string): string | undefined {
    if (!file) return;
    try {
      // const ids = this.getIdsValue("spell", file) as string; //TODO:
      const ids = "toto";
      return this.getSpellResourceFromIds(ids);
    } catch {
      return file;
    }
  }
}
