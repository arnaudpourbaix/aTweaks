import { GLOBAL_CONFIG } from "../../../config/generate";
import { CR, TAB } from "../../model/constants";
import { CreatureAdditionalData } from "../../model/creature/additional-data";
import {
  Creature,
  CreatureAdjustment,
  CreatureAutoGenerate,
} from "../../model/creature/creature";
import { CREATURE_DATA, CreatureData } from "../../model/creature/data";
import { WEAPON_SLOTS } from "../../model/creature/item";
import { ImmunityConfig, ImmunityName } from "../../model/final/immunity";
import { CodeLine } from "../../model/misc";
import { ProficiencyTypeEnum } from "../../model/spell-item/effect.enums";
import { Spell } from "../../model/spell-item/spell-item";
import { State } from "../../state";
import immunityService from "../effects/immunity.service";
import itemService from "../item.service";
import translationService from "../translation.service";
import utils from "../utils/utils.service";
import { AbstractWeiduService } from "./abstract-weidu.service";
import weiduEffectService from "./weidu-effect.service";
import weiduFamilyService from "./weidu-family.service";
import weiduItemService from "./weidu-item.service";
import weiduProjectileService from "./weidu-projectile.service";
import weiduSpellService from "./weidu-spell.service";

class WeiduCreatureService extends AbstractWeiduService {
  generateWeiduScript(creature: Creature): void {
    const lines = this.initLines();
    this.add(lines, `// ${translationService.from(creature.name)}`);
    if (creature.additionalData.scriptLocation !== "None")
      this.compileScripts(lines, creature);
    weiduProjectileService.createProjectiles(lines, creature.projectiles);
    weiduEffectService.createEffectFiles(lines, creature.effectFiles);
    weiduSpellService.createSpells(lines, creature.spells);
    weiduItemService.createItems(lines, creature.items);
    this.createNewFiles(lines, 0, creature);
    this.patchCreatures(lines, 0, creature);
    const content = lines.map((l) => `${TAB.repeat(l.tab)}${l.code}`).join(CR);
    utils.writeFile(
      `${utils.getFamilyFolder(creature.family)}/${creature.monster}.tpa`,
      content
    );
    weiduFamilyService.createOrUpdateMainFile(creature.family, creature);
  }

  private compileScripts(lines: CodeLine[], creature: Creature) {
    this.add(
      lines,
      `COMPILE ~%MOD_FOLDER%/${this.getScriptName(creature, {
        withPath: true,
        ext: true,
      })}~`
    );
    if (creature.adjustments.some((a) => !!a.summon))
      this.add(
        lines,
        `COMPILE ~%MOD_FOLDER%/${this.getScriptName(creature, {
          withPath: true,
          summon: true,
          ext: true,
        })}~`
      );
    this.add(lines, "");
  }

  private createNewFiles(lines: CodeLine[], tab: number, creature: Creature) {
    for (const entry of creature.newFiles) {
      for (const file of entry.files) {
        const copy = entry.copyFromExisting
          ? `COPY_EXISTING ~${entry.copyFromExisting}.cre~`
          : `COPY ~%MOD_FOLDER%/${utils.getFamilyFolder(creature.family)}/${
              entry.copyFrom
            }.cre~`;
        this.add(lines, `${copy} ~override/${file}.cre~`, tab);
        if (entry.stringRef) {
          for (const offset of ["0x8", "0xc"])
            this.add(
              lines,
              `WRITE_LONG ${offset} ${utils.resolveStringRef(entry.stringRef)}`,
              tab + 1
            );
        }
      }
    }
  }

  private patchCreatures(lines: CodeLine[], tab: number, creature: Creature) {
    this.add(lines, "ACTION_FOR_EACH ~file~ IN", tab);
    for (const file of creature.files) this.add(lines, file, tab + 1);
    this.add(lines, "BEGIN", tab);
    this.add(lines, `ACTION_IF FILE_EXISTS_IN_GAME ~%file%.cre~ BEGIN`, ++tab);
    this.add(lines, `COPY_EXISTING ~%file%.cre~ ~override~`, ++tab);
    this.add(lines, `LPF FJ_CRE_VALIDITY END`, ++tab);
    this.removeEffects(lines, tab, creature);
    this.removeKnownSpells(lines, tab, creature);
    this.removeMemorizedSpells(lines, tab, creature);
    this.removeItems(lines, tab, creature.additionalData);
    this.addItemSlots({
      lines,
      tab,
      additionalData: creature.additionalData,
      creature,
    });
    this.addMemorizedSpells(
      lines,
      tab,
      creature.additionalData,
      creature.spells
    );
    this.add(lines, `LPF clear_proficiencies END`, tab);
    for (const opcode of creature.additionalData.deleteEffectOpcodes) {
      this.add(
        lines,
        `LPF DELETE_CRE_EFFECT INT_VAR opcode_to_delete=${opcode} END`,
        tab
      );
    }
    this.addProficiencies(lines, tab, creature.additionalData);
    this.addImmunities(
      lines,
      tab,
      creature.additionalData.immunities,
      creature.adjustments
    );
    for (const effect of creature.additionalData.effects) {
      weiduEffectService.addEffect({
        lines,
        tab,
        effect,
        type: "CRE",
        global: true,
      });
    }
    this.patchCreature({
      lines,
      tab,
      data: creature.data,
      autoGenerate: creature.autoGenerate,
      enforce: true,
      creature,
    });
    if (creature.additionalData.scriptLocation !== "None") {
      this.patchScripts(lines, tab, creature);
    }
    this.handleAdjustments(lines, tab, creature);
    this.add(lines, "BUT_ONLY_IF_IT_CHANGES", --tab);
    this.add(lines, "END ELSE BEGIN", --tab);
    this.add(lines, "PRINT ~====> CRE %file% not found!~", ++tab);
    this.add(lines, "END", --tab);
    this.add(lines, "END", --tab);
  }

  private removeItems(
    lines: CodeLine[],
    tab: number,
    additionalData: CreatureAdditionalData
  ) {
    for (const item of additionalData.removeItems) {
      this.add(lines, `REMOVE_CRE_ITEM ~${item}~`, tab);
    }
  }

  private removeEffects(lines: CodeLine[], tab: number, creature: Creature) {
    const files = creature.files.reduce((acc, file) => {
      const defaultValue = !!creature.additionalData.removeEffects;
      const adj = creature.adjustments.find(
        (a) =>
          a.files.includes(file) &&
          a.additionalData.removeEffects !== undefined &&
          a.additionalData.removeEffects !== defaultValue
      );
      const remove = adj?.additionalData.removeEffects ?? defaultValue;
      if (remove) acc.push(file);
      return acc;
    }, [] as string[]);
    this.executeCodeWithIncludedFiles(
      lines,
      tab,
      `LPF REMOVE_MOST_CRE_EFFECTS END`,
      files
    );
  }

  private removeKnownSpells(
    lines: CodeLine[],
    tab: number,
    creature: Creature
  ) {
    const files = [
      ...creature.adjustments.reduce((acc, adjustement) => {
        if (adjustement.additionalData?.removeKnownSpells === false) {
          for (const f of adjustement.files) acc.add(f);
        }
        return acc;
      }, new Set<string>()),
    ];
    this.executeCodeWithExcludedFiles(lines, tab, `REMOVE_KNOWN_SPELLS`, files);
  }

  private removeMemorizedSpells(
    lines: CodeLine[],
    tab: number,
    creature: Creature
  ) {
    const files = [
      ...creature.adjustments.reduce((acc, adjustement) => {
        if (adjustement.additionalData?.removeMemorizedSpells === false) {
          for (const f of adjustement.files) acc.add(f);
        }
        return acc;
      }, new Set<string>()),
    ];
    this.executeCodeWithExcludedFiles(
      lines,
      tab,
      `REMOVE_MEMORIZED_SPELLS`,
      files
    );
  }

  private addProficiencies(
    lines: CodeLine[],
    tab: number,
    additionalData: CreatureAdditionalData
  ) {
    if (!additionalData.proficiencies.length) return;
    for (const prof of additionalData.proficiencies)
      this.add(
        lines,
        `SET_BG2_PROFICIENCY ~${ProficiencyTypeEnum[prof.type]}~ ${prof.value}`,
        tab
      );
  }

  private addImmunities(
    lines: CodeLine[],
    tab: number,
    immunities: ImmunityName[],
    adjustments: CreatureAdjustment[]
  ) {
    for (const name of immunities) {
      const immunity = State.immunities.find(
        (i) => i.name === name
      ) as ImmunityConfig;
      if (!immunity.itemSlot) {
        const files = immunityService.getOverrides(name, adjustments);
        this.executeCodeWithExcludedFiles(
          lines,
          tab,
          `LPF ${utils.getImmunityFunctionName(name)} END`,
          files
        );
      }
    }
  }

  private addItemSlots(p: {
    lines: CodeLine[];
    tab: number;
    additionalData: CreatureAdditionalData;
    creature?: Creature;
  }) {
    let isEquip = false;
    for (const item of p.additionalData.equippedItems) {
      const noWeaponFiles = (p.creature ? p.creature.adjustments : []).reduce(
        (acc, a) => {
          if (a.noWeapon) acc.push(...a.files);
          return acc;
        },
        [] as string[]
      );
      const slots = itemService.getItemSlots(item.slot);
      const isWeapon = slots.every((slot) =>
        WEAPON_SLOTS.some((s) => s.slot === slot)
      );
      const flagsArray: string[] = [];
      if (item.undroppable === true || item.undroppable === undefined)
        flagsArray.push("UNDROPPABLE");
      if (item.unstealable === true) flagsArray.push("UNSTEALABLE");
      if (!flagsArray.length) flagsArray.push("NONE");
      const flags = `~${flagsArray.join("&")}~`;
      const quantity = `#${item.quantity ?? 0}`;
      const equip = `${isWeapon && !isEquip ? "EQUIP" : ""}`;
      const macro = slots.length > 1 ? "ADD_CRE_ITEM" : "REPLACE_CRE_ITEM";
      const code = `${macro} ~${
        item.file
      }~ ${quantity} #0 #0 ${flags} ~${slots.join(" ")}~ ${equip}`;
      this.addConditionalSourceRes(p.lines, code, p.tab, noWeaponFiles, true);
      if (isWeapon) isEquip = true;
    }
  }

  private addMemorizedSpells(
    lines: CodeLine[],
    tab: number,
    additionalData: CreatureAdditionalData,
    spells: Spell[]
  ) {
    for (const m of additionalData.memorizedSpells) {
      const infos = utils.getSpellInfos(m.file, spells);
      const level = infos.level - 1;
      const spell = State.spells.find((s) => s.file === m.file);
      const comment = spell ? `// ${translationService.from(spell.name)}` : "";
      let code = `ADD_MEMORIZED_SPELL ~${m.file}~ #${level} ~${infos.type}~ (${m.memorizedCount}) ${comment}`;
      if (m.memorizedCount === 0) code = `REMOVE_MEMORIZED_SPELL ~${m.file}~`;
      this.add(lines, code, tab);
    }
  }

  private patchCreature(p: {
    lines: CodeLine[];
    tab: number;
    data: CreatureData;
    autoGenerate: CreatureAutoGenerate;
    enforce: boolean;
    creature: Creature;
  }) {
    if (p.creature.notEnforceFiles.length) {
      this.add(
        p.lines,
        `DEFINE_ARRAY notEnforceFiles BEGIN ${p.creature.notEnforceFiles.join(
          " "
        )} END`,
        p.tab
      );
    }
    this.add(p.lines, `LPF patchCreature`, p.tab);
    this.add(p.lines, `INT_VAR`, p.tab + 1);
    const keys = utils
      .objectKeys(p.creature.data)
      .filter((k) => !["size", "specialBonusHp"].includes(k));
    for (const key of keys) {
      const value = this.extractDataValue(key as keyof CreatureData, p.data);
      const intValue = this.getIntegerValue(value);
      if (intValue !== undefined) {
        this.add(p.lines, `${key}=${intValue}`, p.tab + 2);
        if (key === "gender") {
          this.add(p.lines, `sex=${value}`, p.tab + 2);
        }
      }
    }
    if (p.enforce) this.add(p.lines, `enforce=1`, p.tab + 2);
    if (p.creature.attack?.dualWielding)
      this.add(p.lines, `perfect2weapon=1`, p.tab + 2);
    if (p.creature.notEnforceFiles.length) {
      this.add(p.lines, "STR_VAR", p.tab + 1);
      this.add(p.lines, "notEnforceFiles", p.tab + 2);
    }
    this.add(p.lines, "END", p.tab);
  }

  private patchScripts(lines: CodeLine[], tab: number, creature: Creature) {
    const summonFiles = [
      ...new Set(
        creature.adjustments
          .filter((a) => a.summon)
          .map((a) => a.files)
          .flat()
      ),
    ];
    const locationFiles = [
      ...new Set(
        creature.adjustments
          .filter(
            (a) =>
              !!a.additionalData.scriptLocation &&
              a.additionalData.scriptLocation !== "None"
          )
          .map((a) => a.files)
          .flat()
      ),
    ];
    const noScriptFiles = [
      ...new Set(
        creature.adjustments
          .filter((a) => a.additionalData.scriptLocation === "None")
          .map((a) => a.files)
          .flat()
      ),
    ];
    const scriptName = this.getScriptName(creature, {});
    const summonScriptName = this.getScriptName(creature, { summon: true });
    this.patchScript({
      lines,
      tab,
      script: scriptName,
      slot: creature.additionalData.scriptLocation,
      removeScripts: creature.additionalData.removeScripts,
      files: [],
      skipFiles: [...summonFiles, ...locationFiles, ...noScriptFiles],
    });
    if (summonFiles.length) {
      this.patchScript({
        lines,
        tab,
        script: summonScriptName,
        slot: creature.additionalData.scriptLocation,
        removeScripts: creature.additionalData.removeScripts,
        files: summonFiles,
        skipFiles: [],
      });
    }
    for (const adjustment of creature.adjustments) {
      if (
        adjustment.additionalData.scriptLocation &&
        adjustment.additionalData.scriptLocation !== "None"
      ) {
        this.patchScript({
          lines,
          tab,
          script: scriptName,
          slot: adjustment.additionalData.scriptLocation,
          removeScripts: [
            ...creature.additionalData.removeScripts,
            ...adjustment.additionalData.removeScripts,
          ],
          files: adjustment.files,
          skipFiles: [],
        });
      }
    }
  }

  private patchScript(p: {
    lines: CodeLine[];
    tab: number;
    script: string;
    slot?: string;
    removeScripts: string[];
    files: string[];
    skipFiles: string[];
  }) {
    let removeScripts = "";
    let skipFiles = "";
    let files = "";
    if (
      p.removeScripts.length ||
      GLOBAL_CONFIG.tpaConstants.genericScriptsToRemove
    ) {
      const scripts = [
        ...p.removeScripts,
        ...GLOBAL_CONFIG.tpaConstants.genericScriptsToRemove,
      ];
      this.add(
        p.lines,
        `DEFINE_ARRAY removeScripts BEGIN ${scripts.join(" ")} END`,
        p.tab
      );
      removeScripts = " removeScripts";
    }
    if (p.skipFiles.length && !p.files.length) {
      this.add(
        p.lines,
        `DEFINE_ARRAY skipFiles BEGIN ${p.skipFiles.join(" ")} END`,
        p.tab
      );
      skipFiles = " skipFiles";
    }
    if (p.files.length) {
      this.add(
        p.lines,
        `DEFINE_ARRAY files BEGIN ${p.files.join(" ")} END`,
        p.tab
      );
      files = " files";
    }
    const slot = p.slot ? ` slot=${p.slot}` : "";
    this.add(
      p.lines,
      `LPF patchCreatureScript STR_VAR script=${p.script}${slot}${files}${skipFiles}${removeScripts} END`,
      p.tab
    );
  }

  private handleAdjustments(
    lines: CodeLine[],
    tab: number,
    creature: Creature
  ) {
    for (const adjustment of creature.adjustments) {
      for (const f of adjustment.files)
        if (!creature.files.includes(f))
          throw new Error(`Unknown adjustment file ${f}`);
      if (
        adjustment.data ||
        adjustment.additionalData.equippedItems.length ||
        adjustment.additionalData.memorizedSpells.length ||
        adjustment.additionalData.removeItems.length ||
        adjustment.additionalData.memorizedSpells.length ||
        adjustment.additionalData.proficiencies.length ||
        adjustment.additionalData.effects.length ||
        adjustment.summon
      ) {
        this.handleAdjustment(lines, tab, creature, adjustment);
      }
    }
  }

  private handleAdjustment(
    lines: CodeLine[],
    tab: number,
    creature: Creature,
    adjustment: CreatureAdjustment
  ) {
    this.startConditionalSourceRes(lines, tab++, adjustment.files, false);
    if (adjustment.data?.movement) {
      this.add(
        lines,
        `LPF set_movement_speed INT_VAR value=${adjustment.data.movement} END`,
        tab
      );
    }
    if (adjustment.data)
      this.patchCreatureAdjustement({
        lines,
        tab,
        data: adjustment.data,
        parent: creature.data,
        autoGenerate: creature.autoGenerate,
        summon: !!adjustment.summon,
        creature,
      });
    this.handleAdjustmentAdditionalData(lines, tab, creature, adjustment);
    this.add(lines, "END", --tab);
  }

  private patchCreatureAdjustement(p: {
    lines: CodeLine[];
    tab: number;
    data: Partial<CreatureData>;
    parent?: CreatureData;
    autoGenerate: CreatureAutoGenerate;
    summon: boolean;
    creature: Creature;
  }) {
    if (p.summon) {
      p.data.xpv = 0;
      p.data.gender = "SUMMONED";
    }
    for (const data of CREATURE_DATA) {
      if (p.data[data.key] !== undefined) {
        const value = this.extractDataValue(data.key, p.data);
        const intValue = this.getIntegerValue(value);
        if (intValue !== undefined) {
          for (const field of data.fields) {
            this.add(
              p.lines,
              `${this.getWrite(field.size)} 0x${field.index.toString(
                16
              )} ${intValue} // ${data.key}`,
              p.tab
            );
          }
        }
      }
    }
  }

  private handleAdjustmentAdditionalData(
    lines: CodeLine[],
    tab: number,
    creature: Creature,
    adjustment: CreatureAdjustment
  ) {
    this.removeItems(lines, tab, adjustment.additionalData);
    this.addItemSlots({
      lines,
      tab,
      additionalData: adjustment.additionalData,
    });
    if (adjustment.additionalData.removeMemorizedSpells) {
      this.add(lines, `REMOVE_MEMORIZED_SPELLS`, tab);
    }
    this.addImmunities(lines, tab, adjustment.additionalData.immunities, []);
    this.addMemorizedSpells(
      lines,
      tab,
      adjustment.additionalData,
      creature.spells
    );
    this.addProficiencies(lines, tab, adjustment.additionalData);
    for (const effect of adjustment.additionalData.effects) {
      weiduEffectService.addEffect({
        lines,
        tab,
        effect,
        type: "CRE",
        global: true,
      });
    }
  }

  private extractDataValue(
    key: keyof CreatureData,
    creature: Partial<CreatureData>
  ) {
    if (
      [
        "alignment",
        "animation",
        "modAnimation",
        "general",
        "race",
        "class",
        "kit",
        "gender",
      ].includes(key)
    ) {
      let file = key as string;
      if (key === "alignment") file = "align";
      else if (["modAnimation", "animation"].includes(key)) file = "animate";
      return `IDS_OF_SYMBOL (~${file}~ ~${creature[key]}~)`;
    } else if (typeof creature[key] === "boolean")
      return creature[key] ? "1" : "0";
    return creature[key];
  }

  private getScriptName(
    creature: Creature,
    options: { withPath?: boolean; summon?: boolean; ext?: boolean }
  ) {
    const path = options.withPath
      ? `${utils.getFamilyFolder(creature.family)}/`
      : "";
    const ext = options.ext === true ? ".baf" : "";
    const name = `ja#m${creature.monster}${options.summon ? "su" : ""}${ext}`;
    return `${path}${name}`;
  }
}

const weiduCreatureService = new WeiduCreatureService();
export default weiduCreatureService;
