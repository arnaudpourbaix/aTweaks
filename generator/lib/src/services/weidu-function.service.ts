import * as fs from "fs";
import { GLOBAL_CONFIG } from "../../config/generate";
import { CR, TAB } from "../model/constants";
import { Effect } from "../model/final/effect";
import { ImmunityConfig } from "../model/final/immunity";
import { CodeLine } from "../model/misc";
import { State } from "../state";
import { AbstractWeiduService } from "./abstract-weidu.service";
import { EffectService } from "./effect.service";
import { WeiduCoreService } from "./weidu-core.service";
import path from "path";
import { SPELL_GROUPS } from "../../config/spell-group";
import { SpellGroup } from "../model/raw/spell-group";

export class WeiduFunctionService extends AbstractWeiduService {
  static instance = new WeiduFunctionService();

  private effectService = EffectService.instance;
  private weiduCoreService = WeiduCoreService.instance;

  generateSpellResources(): void {
    const lines = this.initLines();
    for (const group of SPELL_GROUPS) {
      this.generateSpellResource(lines, group, 0);
    }
    const content = lines.map((l) => `${TAB.repeat(l.tab)}${l.code}`).join(CR);
    fs.writeFileSync(
      path.join(State.modFolder, GLOBAL_CONFIG.commonSpellResourcesFile),
      content
    );
  }

  generateFunctions(): void {
    const lines = this.initLines();
    for (const immunity of State.immunities) {
      this.generateImmunityFunction(lines, immunity, 0);
    }
    const content = lines.map((l) => `${TAB.repeat(l.tab)}${l.code}`).join(CR);
    fs.writeFileSync(
      path.join(State.modFolder, GLOBAL_CONFIG.commonFunctionsFile),
      content
    );
  }

  private generateSpellResource(
    lines: CodeLine[],
    group: SpellGroup,
    tab: number
  ): void {
    this.add(
      lines,
      `DEFINE_ACTION_FUNCTION ${this.utils.getSpellResourceFunctionName(
        group
      )} RET_ARRAY resources BEGIN`,
      tab
    );
    this.add(lines, `ACTION_DEFINE_ARRAY spells BEGIN`, tab + 1);
    for (const spell of group.spells ?? []) {
      this.add(lines, `"${spell}"`, tab + 2);
    }
    this.add(lines, `END`, tab + 1);
    this.add(
      lines,
      `ACTION_DEFINE_ARRAY ids BEGIN ${(group.idsSpells ?? [])
        .map((i) => i.id)
        .join(" ")} END`,
      tab + 1
    );
    //TODO: handle suffixes
    this.add(
      lines,
      `LAF MERGE_SPELL_ARRAY_WITH_IDS STR_VAR ids spells RET_ARRAY resources=spells END`,
      tab + 1
    );
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
      `DEFINE_PATCH_FUNCTION ${this.utils.getImmunityFunctionName(immunity)}`,
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
    const effects = this.effectService.getEffects(immunity.effects);
    for (const effect of effects) {
      this.generateEffect(lines, effect, tab + 1);
    }
    for (const type of immunity.immunities) {
      this.add(
        lines,
        `LPF ${this.utils.getImmunityFunctionName(type)} END`,
        tab + 1
      );
    }
    this.add(lines, `END`, tab);
    this.add(lines, ``);
    if (immunity.itemSlot)
      this.weiduCoreService.generateItem(immunity.itemSlot, immunity);
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
        `LAF ${this.utils.getSpellResourceFunctionName(
          immunity.spellGroups[0]
        )} RET_ARRAY spells=ressources END`,
        tab + 1
      );
    } else {
      for (const groupName of immunity.spellGroups) {
        const array = `array${++index}`;
        arrays.push(array);
        this.add(
          lines,
          `LAF ${this.utils.getSpellResourceFunctionName(
            groupName
          )} RET_ARRAY ${array}=ressources END`,
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
