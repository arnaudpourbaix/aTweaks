import * as fs from "fs";
import path from "path";
import { GLOBAL_CONFIG } from "../../../config/generate";
import { SPELL_GROUPS } from "../../../config/spell-group";
import { SPELL_FUNCTIONS } from "../../../spells";
import { CR, TAB } from "../../model/constants";
import { ImmunityConfig } from "../../model/final/immunity";
import { CodeLine } from "../../model/misc";
import { SpellGroup } from "../../model/raw/spell-group";
import { Effect } from "../../model/spell-item/effect";
import { Spell } from "../../model/spell-item/spell-item";
import { State } from "../../state";
import utils from "../utils.service";
import { AbstractWeiduService } from "./abstract-weidu.service";
import { WeiduCoreService } from "./weidu-core.service";
import weiduSpellService from "./weidu-spell.service";
import spellService from "../spell.service";

class WeiduFunctionService extends AbstractWeiduService {
  generateSpellResources(): void {
    const lines = this.initLines();
    for (const group of SPELL_GROUPS) {
      this.generateSpellResource(lines, group, 0);
    }
    const content = lines.map((l) => `${TAB.repeat(l.tab)}${l.code}`).join(CR);
    fs.writeFileSync(
      path.join(State.modFolder, GLOBAL_CONFIG.files.spellResources),
      content
    );
  }

  generateSpellFunctions(): void {
    const lines = this.initLines();
    const spells = spellService.mapSpells(SPELL_FUNCTIONS, []); //FIXME: can't handle effect file creation
    for (const spell of spells) {
      this.generateSpellFunction(lines, spell, 0);
    }
    const content = lines.map((l) => `${TAB.repeat(l.tab)}${l.code}`).join(CR);
    fs.writeFileSync(
      path.join(State.modFolder, GLOBAL_CONFIG.files.spellFunctions),
      content
    );
  }

  generateImmunities(): void {
    const lines = this.initLines();
    for (const immunity of State.immunities) {
      this.generateImmunityFunction(lines, immunity, 0);
    }
    const content = lines.map((l) => `${TAB.repeat(l.tab)}${l.code}`).join(CR);
    fs.writeFileSync(
      path.join(State.modFolder, GLOBAL_CONFIG.files.immunities),
      content
    );
  }

  private generateSpellFunction(
    lines: CodeLine[],
    spell: Spell,
    tab: number
  ): void {
    this.add(
      lines,
      `DEFINE_ACTION_FUNCTION ${utils.getSpellFunctionName(spell)} BEGIN`,
      tab
    );
    weiduSpellService.createSpell(lines, spell, 1);
    this.add(lines, `END`, tab);
    this.add(lines, ``, tab);
  }

  private generateSpellResource(
    lines: CodeLine[],
    group: SpellGroup,
    tab: number
  ): void {
    const spells = group.spells ?? [];
    const idsSpells = group.idsSpells ?? [];
    this.add(
      lines,
      `DEFINE_ACTION_FUNCTION ${utils.getSpellResourceFunctionName(
        group
      )} RET_ARRAY resources BEGIN`,
      tab
    );
    this.add(lines, `ACTION_DEFINE_ARRAY spells BEGIN`, tab + 1);
    for (const spell of spells) {
      this.add(lines, `"${spell}"`, tab + 2);
    }
    this.add(lines, `END`, tab + 1);
    this.add(
      lines,
      `ACTION_DEFINE_ARRAY ids BEGIN ${idsSpells
        .map((i) => i.id)
        .join(" ")} END`,
      tab + 1
    );
    this.add(
      lines,
      `LAF MERGE_SPELL_ARRAY_WITH_IDS STR_VAR ids spells RET_ARRAY resources=spells END`,
      tab + 1
    );
    let index = spells.length + idsSpells.length;
    for (const [i, spell] of idsSpells.entries()) {
      if (!!spell.suffixes) {
        this.add(
          lines,
          `OUTER_SPRINT res $resources(${spells.length + i})`,
          tab + 1
        );
        for (const suffix of spell.suffixes) {
          this.add(
            lines,
            `OUTER_SPRINT $resources(${index++}) ~%res%${suffix}~`,
            tab + 1
          );
        }
      }
    }
    this.add(lines, `END`, tab);
    this.add(lines, ``);
  }

  generateImmunityFunction(
    lines: CodeLine[],
    immunity: ImmunityConfig,
    tab: number
  ): void {
    this.add(
      lines,
      `DEFINE_PATCH_FUNCTION ${utils.getImmunityFunctionName(immunity)}`,
      tab
    );
    this.add(lines, `BEGIN`, tab);
    if (
      immunity.preventEffects.length ||
      immunity.preventIcons.length ||
      immunity.strings.length ||
      immunity.spellGroups.length ||
      immunity.animations.length
    )
      this.callImmunityFunction(lines, immunity, tab + 1);
    for (const effect of immunity.effects) {
      this.generateEffect(lines, effect, tab + 1);
    }
    for (const type of immunity.immunities) {
      this.add(
        lines,
        `LPF ${utils.getImmunityFunctionName(type)} END`,
        tab + 1
      );
    }
    this.add(lines, `END`, tab);
    this.add(lines, ``);
    if (immunity.itemSlot)
      WeiduCoreService.generateItem(immunity.itemSlot, immunity);
  }

  callImmunityFunction(
    lines: CodeLine[],
    immunity: ImmunityConfig,
    tab: number
  ): void {
    const spells = this.generateSpells(lines, immunity, tab);
    const effects = immunity.preventEffects.length
      ? ` effects="${immunity.preventEffects.join(" ")}"`
      : "";
    const icons = immunity.preventIcons.length
      ? ` prevent_icons="${immunity.preventIcons.join(" ")}"`
      : "";
    const strings = immunity.strings.length
      ? ` strings="${immunity.strings.join(" ")}"`
      : "";
    const animations = immunity.animations.length
      ? ` animations="${immunity.animations.join(" ")}"`
      : "";
    const display = immunity.displaySpellIneffective
      ? " INT_VAR displaySpellIneffective=1"
      : "";
    this.add(
      lines,
      `LPF ADD_IMMUNITY_CRE_ITM_SPL${display} STR_VAR${effects}${icons}${strings}${animations}${spells} END`,
      tab
    );
  }

  generateEffect(lines: CodeLine[], effect: Effect, tab: number): void {
    const parameter1 =
      effect.parameter1 !== "0"
        ? ` parameter1=${this.getIntegerValue(effect.parameter1)}`
        : "";
    const parameter2 =
      effect.parameter2 !== "0"
        ? ` parameter2=${this.getIntegerValue(effect.parameter2)}`
        : "";
    const special = !!effect.special
      ? ` special=${this.getIntegerValue(effect.special)}`
      : "";
    const resource = !!effect.resource
      ? ` STR_VAR resource="${effect.resource}"`
      : "";
    const line = `LPF ADD_EFFECT_CRE_ITM_SPL INT_VAR opcode=${effect.opcode}${parameter1}${parameter2}${special}${resource} END`;
    this.add(lines, line, tab);
  }

  generateSpells(
    lines: CodeLine[],
    immunity: ImmunityConfig,
    tab: number
  ): string {
    if (!immunity.spellGroups.length) return "";
    this.add(lines, `INNER_ACTION BEGIN`, tab);
    let index = 0;
    let arrays: string[] = [];
    if (immunity.spellGroups.length === 1) {
      this.add(
        lines,
        `LAF ${utils.getSpellResourceFunctionName(
          immunity.spellGroups[0]
        )} RET_ARRAY spells=resources END`,
        tab + 1
      );
    } else {
      for (const groupName of immunity.spellGroups) {
        const array = `array${++index}`;
        arrays.push(array);
        this.add(
          lines,
          `LAF ${utils.getSpellResourceFunctionName(
            groupName
          )} RET_ARRAY ${array}=resources END`,
          tab + 1
        );
      }
      this.add(
        lines,
        `LAF MERGE_ARRAYS STR_VAR ${arrays.join(
          " "
        )} RET_ARRAY spells=array END`,
        tab + 1
      );
    }
    this.add(lines, `END`, tab);
    return " spells";
  }
}

const weiduFunctionService = new WeiduFunctionService();
export default weiduFunctionService;
