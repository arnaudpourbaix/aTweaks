import { ImmunityName } from "../../config/immunity-name";
import { SpellGroupName } from "../../config/spell-group-name";
import { SpellTypeEnum } from "../model/final/enums";
import { ImmunityConfig } from "../model/final/immunity";
import { Response } from "../model/final/script";
import { Spell } from "../model/final/spell";
import { StringReference } from "../model/misc";
import { Actions } from "../model/raw/actions";
import { SpellGroup } from "../model/raw/spell-group";
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
    if (typeof value === "string" && /^\d+$/.test(value)) return value;
    else if (typeof value === "string") return `~${value}~`;
    else return `@${value}`;
  }

  resolveStringRef(value: StringReference): string {
    if (typeof value === "string" && /^\d+$/.test(value)) return value;
    else if (typeof value === "string") return `RESOLVE_STR_REF(~${value}~)`;
    else return `RESOLVE_STR_REF(@${value})`;
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

  getSpellResourceFunctionName(group: SpellGroupName | SpellGroup) {
    return `get_${typeof group === "string" ? group : group.name}_resources`;
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
        );
        if (!immunity) throw new Error(`Immunity ${immunities[i]} not found !`);
        found = this.hasImmunity(immunity.immunities, name);
      }
    }
    return found;
  }

  hasCriticalHitImmunity(immunity: ImmunityConfig): boolean {
    let result =
      immunity.name === "criticalHit" ||
      immunity.immunities.some((i) => i === "criticalHit");
    if (result) return true;
    for (const t of immunity.immunities) {
      const tr = State.immunities.find((i) => i.name === t) as ImmunityConfig;
      result = result || this.hasCriticalHitImmunity(tr);
    }
    return result;
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

  getSpellInfos(
    file: string,
    spells: Spell[]
  ): { type: string; level: number } {
    const spell = spells.find((s) => s.file === file);
    if (file.toUpperCase().includes("SPWI"))
      return { type: "wizard", level: +(file.at(4) as string) };
    else if (file.toUpperCase().includes("SPPR"))
      return { type: "priest", level: +(file.at(4) as string) };
    else if (!spell) return { type: "innate", level: 1 };
    let type = "innate";
    switch (spell.spellType) {
      case SpellTypeEnum.Wizard:
        type = "wizard";
        break;
      case SpellTypeEnum.Priest:
        type = "priest";
        break;
    }
    return { type, level: spell.spellLevel ?? 1 };
  }

  /**
   * Fisher–Yates shuffle
   */
  shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = array.length - 1; i >= 1; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return result;
  }
}
