import { ImmunityName } from "../../config/immunity-name";
import { SpellGroupName } from "../../config/spell-group-name";
import { SpellTypeEnum } from "../model/final/enums";
import { ImmunityConfig } from "../model/final/immunity";
import { Response } from "../model/final/script";
import { Spell } from "../model/final/spell";
import { StringReference } from "../model/misc";
import { Actions } from "../model/raw/actions";
import { ItemSlot } from "../model/raw/enum";
import { RawItemSlot } from "../model/raw/item";
import { RawMemorizedSpellType } from "../model/raw/spell";
import { SpellGroup } from "../model/raw/spell-group";
import {
  SpellProtection,
  SpellProtectionStat,
} from "../model/raw/spell-protection";
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

  resolveStringRef(value: StringReference | undefined): string | undefined {
    if (value === undefined) return;
    else if (typeof value === "string" && /^\d+$/.test(value)) return value;
    else if (typeof value === "string") return `RESOLVE_STR_REF(~${value}~)`;
    else return `RESOLVE_STR_REF(@${value})`;
  }

  getSpellProtectionIndex(protection: SpellProtection): number {
    return 0;
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

  getSpellFunctionName(spell: Spell) {
    return `create_spell_${spell.name}`;
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

  getIdsFileFromSpellProtectionStat(stat: SpellProtectionStat): string {
    let file = "";
    switch (stat) {
      case SpellProtectionStat.Align:
        file = "align";
        break;
      case SpellProtectionStat.Areatype:
        file = "areatype";
        break;
      case SpellProtectionStat.Class:
        file = "class";
        break;
      case SpellProtectionStat.Ea:
        file = "ea";
        break;
      case SpellProtectionStat.Gender:
        file = "gender";
        break;
      case SpellProtectionStat.General:
        file = "general";
        break;
      case SpellProtectionStat.Race:
        file = "race";
        break;
      case SpellProtectionStat.Specific:
        file = "specific";
        break;
      case SpellProtectionStat.Splstate:
        file = "splstate";
        break;
      case SpellProtectionStat.State:
        file = "state";
        break;
    }
    return file;
  }

  getSpellInfos(
    file: string,
    spells: Spell[]
  ): { type: RawMemorizedSpellType; level: number } {
    let result = this.getSpellInfosByFilename(file);
    if (result) return result;
    const spell = spells.find((s) => s.file === file);
    if (!spell) return { type: "innate", level: 1 }; // unknown case, returns innate
    if (spell?.copyFrom) result = this.getSpellInfosByFilename(spell.copyFrom);
    let type = this.getMemorizedSpellType(spell.spellType);
    if (!type && spell.changes?.spellType)
      type = this.getMemorizedSpellType(spell.changes.spellType);
    if (!type && result) {
      // console.log(`${file} => fallback to copyFrom ${JSON.stringify(result)}`);
      return result;
    }
    // console.log(`${file} => type: ${type}, level: ${spell.spellLevel}`);
    return { type: type ?? "innate", level: spell.spellLevel ?? 1 };
  }

  getMemorizedSpellType(
    spellType?: SpellTypeEnum
  ): RawMemorizedSpellType | null {
    switch (spellType) {
      case SpellTypeEnum.Wizard:
        return "wizard";
      case SpellTypeEnum.Priest:
        return "priest";
      case SpellTypeEnum.Innate:
        return "innate";
    }
    return null;
  }

  getSpellInfosByFilename(
    filename: string
  ): { type: RawMemorizedSpellType; level: number } | null {
    const name = filename.toUpperCase();
    let result: { type: RawMemorizedSpellType; level: number } | null = null;
    if (name.startsWith("SPWI"))
      result = { type: "wizard", level: +(name.at(4) as string) };
    else if (name.startsWith("SPPR"))
      result = { type: "priest", level: +(name.at(4) as string) };
    else if (name.startsWith("SPIN") || name.startsWith("SPCL"))
      result = { type: "innate", level: 1 };
    return result;
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

  getItemSlots(slot: ItemSlot | ItemSlot[] | undefined): ItemSlot[] {
    const results: ItemSlot[] = Array.isArray(slot) ? slot : [];
    if (typeof slot === "string") results.push(slot);
    return results;
  }

  isSlotIncluded(
    itemSlots: RawItemSlot[],
    includedSlot: ItemSlot | ItemSlot[]
  ): boolean {
    if (Array.isArray(includedSlot)) return false;
    const list = itemSlots.map((i) => this.getItemSlots(i.slot)).flat(1);
    return list.includes(includedSlot);
  }
}
