import { GLOBAL_CONFIG } from "../../config/generate";
import { ImmunityName } from "../../config/immunity-name";
import { ImmunityConfig } from "../model/final/immunity";
import { SpellIdentifier } from "../model/ids/spell";
import { Triggers } from "../model/raw/triggers";
import { State } from "../state";

export class UtilsService {
  static instance = new UtilsService();

  // replaceParamsToken(
  //   params: unknown[] | undefined,
  //   token: string,
  //   value: string
  // ): unknown[] {
  //   return (params ?? []).map((p) =>
  //     typeof p === "string" ? p.replace(token, value) : p
  //   );
  // }
  replaceParamsToken(
    token: string,
    value: string,
    ...params: unknown[]
  ): unknown[] {
    return (params ?? []).map((p) =>
      typeof p === "string" ? p.replace(token, value) : p
    );
  }

  replaceTargetTokens<T extends { params: (string | number)[] }>(
    item: T,
    target: string
  ): T {
    return {
      ...item,
      params: this.replaceParamsToken(
        GLOBAL_CONFIG.tokens.target,
        target
        item.params,
      ),
    };
  }

  replaceTriggerToken(
    triggers: Triggers.Trigger[],
    token: string,
    value: string
  ): Triggers.Trigger[] {
    return triggers.map((t) => {
      if ("triggers" in t) {
        const res: Triggers.Trigger = {
          ...t,
          triggers: this.replaceTriggerToken(t.triggers, token, value),
        };
        return res;
      } else if ("params" in t) {
        const res: Triggers.Trigger = {
          ...t,
          params: this.replaceParamsToken(token, value, ...t.params),
        };
        return res;
      } else return t;
    });
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

  //   getIdsValue(ids: string, value: string) {
  //     const getId = (items: { id: string; value: string }[], value: string) => {
  //       const item = items.find((i) => i.value === value);
  //       if (!item) throw new Error(`Value ${value} not found in IDS`);
  //       return item.id;
  //     };
  //     switch (ids) {
  //       case "alignment":
  //         return Number(getId(alignIds, value));
  //       case "animation":
  //         return Number(getId(animationIds, value));
  //       case "general":
  //         return getId(generalIds, value);
  //       case "race":
  //         return getId(raceIds, value);
  //       case "class":
  //         return getId(classIds, value);
  //       case "gender":
  //         return getId(genderIds, value);
  //       case "spell":
  //         return getId(spellIds, value);
  //       case "stat":
  //         return getId(statIds, value);
  //       case "splstat":
  //         return getId(SplStateIds, value);
  //       default:
  //         throw new Error(`unhandled IDS: ${ids}`);
  //     }
  //   }

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
      const ids = this.getIdsValue("spell", file) as string;
      return this.getSpellResourceFromIds(ids);
    } catch {
      return file;
    }
  }
}
