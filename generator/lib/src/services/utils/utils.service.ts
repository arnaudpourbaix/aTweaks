import * as fs from "fs";
import path from "path";
import { SpellGroupName } from "../../../config/spell-group-name";
import { MonsterFamilyEnum } from "../../../creatures/monster";
import { TranslationKey } from "../../../translations/i18n";
import { ImmunityConfig, ImmunityName } from "../../model/final/immunity";
import { StringReference } from "../../model/final/stringref";
import { Actions } from "../../model/script/actions";
import { Response } from "../../model/script/script";
import { Triggers } from "../../model/script/triggers";
import { SpellTypeEnum } from "../../model/spell-item/effect.enums";
import { SpellGroup } from "../../model/spell-item/spell-group";
import { MemorizedSpellType, Spell } from "../../model/spell-item/spell-item";
import { SpellProtectionStat } from "../../model/spell-item/spell-protection";
import { State } from "../../state";
import translationService from "./../translation.service";
import { FNP_SPELLS } from "../../../config/spell-names";

class UtilsService {
  objectKeys = <T extends object>(obj: T): (keyof T)[] => {
    return Object.keys(obj) as (keyof T)[];
  };

  getKeyByValue(
    object: Record<string, unknown>,
    value: unknown,
  ): string | undefined {
    return Object.keys(object).find((key) => object[key] === value);
  }

  replaceParamTokens(
    params: (string | number)[],
    tokens: { key: string; value: string }[],
  ): void {
    for (let i = 0; i < params.length; i++) {
      if (typeof params[i] === "string") {
        for (const token of tokens)
          params[i] = (params[i] as string).replace(token.key, token.value);
      }
    }
  }

  replaceResponseTokens(
    responses: Response[],
    tokens: { key: string; value: string }[],
  ): Response[] {
    return responses.map((r) => ({
      ...r,
      actions: this.replaceActionTokens(r.actions, tokens),
    }));
  }

  replaceActionTokens(
    actions: Actions.Action[],
    tokens: { key: string; value: string }[],
  ): Actions.Action[] {
    const results = structuredClone(actions);
    for (const action of results) {
      if ("params" in action) this.replaceParamTokens(action.params, tokens);
    }
    return results;
  }

  replaceTriggerTokens(
    triggers: Triggers.Trigger[],
    tokens: { key: string; value: string }[],
  ): Triggers.Trigger[] {
    const results = structuredClone(triggers);
    for (const trigger of results) {
      if ("triggers" in trigger) {
        trigger.triggers = this.replaceTriggerTokens(trigger.triggers, tokens);
      } else if ("params" in trigger) {
        this.replaceParamTokens(trigger.params, tokens);
      }
    }
    return results;
  }

  resolveStringRef(value: StringReference | undefined): string | undefined {
    if (value === undefined) return;
    else if (typeof value === "string") {
      const ref = translationService.stringRef(value);
      return `RESOLVE_STR_REF(@${ref})`; // create a new string ref from language key
    }
    try {
      translationService.from(value);
      return `RESOLVE_STR_REF(@${value})`; // create a new string ref from generated language
    } catch {
      return `${value}`;
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

  getImmunityFunctionName(immunity: ImmunityConfig | ImmunityName) {
    immunity =
      typeof immunity === "string"
        ? (State.immunities.find((i) => i.name === immunity)!)
        : immunity;
    return `${immunity.name}_${immunity.type}`;
  }

  getSpellFunctionName(spell: Spell) {
    if (typeof spell.name === "number")
      throw new Error("can't handle a number in name!");
    const names = spell.name.split(".");
    let name = names.pop();
    if (name === "name") name = names.pop();
    return `create_spell_${name}`;
  }

  getSpellResourceFunctionName(group: SpellGroupName | SpellGroup) {
    return `get_${typeof group === "string" ? group : group.name}_resources`;
  }

  hasImmunity(
    immunities: (ImmunityName | string)[],
    name: ImmunityName | string,
  ): boolean {
    let found = false;
    for (let i = 0; i < immunities.length && !found; i++) {
      if (immunities[i] === name) found = true;
      else {
        const immunity = State.immunities.find(
          (im) => im.name === immunities[i],
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
      const tr = State.immunities.find((i) => i.name === t)!;
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

  writeFile(file: string, content: string) {
    if (!file.startsWith(State.modFolder)) {
      file = path.join(State.modFolder, file);
    }
    let index = file.lastIndexOf("/");
    if (index === -1) index = file.lastIndexOf("\\");
    const folder = file.substring(0, index);
    fs.mkdirSync(folder, { recursive: true });
    const normalized = content.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n");
    fs.writeFileSync(file, normalized);
  }

  getFamilyFolder(family: MonsterFamilyEnum): string {
    return `lib/pnp-monster/${MonsterFamilyEnum[family].toLowerCase()}`;
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

  getSpellInfos(file: string): { type: MemorizedSpellType; level: number } {
    let result = this.getSpellInfosByFilename(file);
    if (result) return result;
    const spell = State.spells.find((s) => s.file === file);
    if (!spell) return { type: "innate", level: 1 }; // unknown case, returns innate
    if (spell.copyFrom) result = this.getSpellInfosByFilename(spell.copyFrom);
    let type = this.getMemorizedSpellType(spell.type);
    if (!type && spell.options?.spellType)
      type = this.getMemorizedSpellType(spell.options.spellType);
    if (!type && result) {
      // console.log(`getSpellInfos: ${file} => fallback to copyFrom ${JSON.stringify(result)}`);
      return result;
    }
    // console.log(
    //   `getSpellInfos: ${file} => type: ${type}, level: ${spell.spellLevel}`
    // );
    return { type: type ?? "innate", level: spell.level ?? 1 };
  }

  getMemorizedSpellType(spellType?: SpellTypeEnum): MemorizedSpellType | null {
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
    filename: string,
  ): { type: MemorizedSpellType; level: number } | null {
    const name = filename.toUpperCase();
    let result: { type: MemorizedSpellType; level: number } | null = null;
    const spell = this.getExternalSpell(filename);
    if (spell)
      result = {
        type: this.getMemorizedSpellType(spell.type)!,
        level: spell.level,
      };
    else if (name.startsWith("SPWI"))
      result = { type: "wizard", level: +(name.at(4)!) };
    else if (name.startsWith("SPPR"))
      result = { type: "priest", level: +(name.at(4)!) };
    else if (name.startsWith("SPIN") || name.startsWith("SPCL"))
      result = { type: "innate", level: 1 };
    return result;
  }

  getExternalSpell(filename: string) {
    const spells = [...Object.values(FNP_SPELLS)];
    const spell = spells.find((s) => s.file === filename);
    return spell;
  }

  /**
   * Fisher–Yates shuffle
   */
  shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i >= 1; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

const utils = new UtilsService();
export default utils;
