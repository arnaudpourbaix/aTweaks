import { CR } from "../model/constants";
import { Creature } from "../model/final/creature";
import {
  ItemAbilityLocationEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  SpellTypeEnum,
} from "../model/final/enums";
import { Spell, SpellHeader } from "../model/final/spell";
import { CodeLine } from "../model/misc";
import { GrabConfig } from "../model/raw/grab";
import { AbstractWeiduService } from "./abstract-weidu.service";
import { WeiduEffectService } from "./weidu-effect.service";

export class WeiduSpellService extends AbstractWeiduService {
  static instance = new WeiduSpellService();

  private weiduEffectService = WeiduEffectService.instance;

  createSpells(lines: CodeLine[], spells: Spell[]) {
    for (const spell of spells) {
      this.add(lines, `// ${spell.name}`);
      this.createSpell(lines, spell, 0);
      this.add(lines, "");
    }
  }

  createSpell(lines: CodeLine[], spell: Spell, tab: number) {
    if (spell.copyFrom) {
      this.add(
        lines,
        `COPY_EXISTING ~${spell.copyFrom}.SPL~  ~override/${spell.file}.SPL~`,
        tab
      );
      if (spell.deleteHeaders === true) {
        this.add(
          lines,
          `LPF DELETE_SPELL_HEADER INT_VAR header_type="-1" END`,
          tab + 1
        );
      } else if (Array.isArray(spell.deleteHeaders)) {
        for (const level of spell.deleteHeaders)
          this.add(
            lines,
            `LPF DELETE_SPELL_HEADER STR_VAR min_level = ${level} END`,
            tab + 1
          );
      }
      for (const opcode of spell.deleteOpcodes)
        this.add(
          lines,
          `LPF DELETE_EFFECT INT_VAR match_opcode = ${opcode} END`,
          tab + 1
        );
    } else {
      this.add(lines, `CREATE SPL "${spell.file}"`, tab);
      this.add(lines, `WRITE_LONG 0x64 0x72`, tab + 1);
    }
    this.add(lines, `COPY_EXISTING ~${spell.file}.SPL~  ~override~`, tab);
    this.createSpellCommon(lines, spell, tab + 1);
  }

  private createSpellCommon(lines: CodeLine[], spell: Spell, tab: number) {
    if (spell.stringRef) {
      this.add(
        lines,
        `WRITE_LONG 0x8 ${this.utils.resolveStringRef(spell.stringRef)}`,
        tab
      );
    }
    if (spell.castingSound)
      this.add(lines, `WRITE_ASCII 0x10 ~${spell.castingSound}~ #8`, tab);
    if (spell.flags) {
      const flags = spell.flags.reduce((sum, save) => {
        sum += 2 ** save;
        return sum;
      }, 0);
      this.add(lines, `WRITE_LONG 0x18 ${flags}`, tab);
    }
    if (spell.spellType)
      this.add(lines, `WRITE_SHORT 0x1c ${spell.spellType}`, tab);
    if (spell.exclusionFlags) {
      const flags = spell.exclusionFlags.reduce((sum, save) => {
        sum += 2 ** save;
        return sum;
      }, 0);
      this.add(lines, `WRITE_LONG 0x1e ${flags}`, tab);
    }
    if (spell.castingAnimation)
      this.add(lines, `WRITE_SHORT 0x22 ${spell.castingAnimation}`, tab);
    if (spell.primaryType)
      this.add(lines, `WRITE_BYTE 0x25 ${spell.primaryType}`, tab);
    if (spell.secondaryType)
      this.add(lines, `WRITE_BYTE 0x27 ${spell.secondaryType}`, tab);
    if (spell.spellLevel)
      this.add(lines, `WRITE_LONG 0x34 ${spell.spellLevel}`, tab);
    if (spell.spellbookIcon)
      this.add(lines, `WRITE_ASCII 0x3a ~${spell.spellbookIcon}~ #8`, tab);
    if (spell.description && typeof spell.description === "number")
      this.add(
        lines,
        `WRITE_LONG 0x50 ${this.utils.resolveStringRef(spell.description)}`,
        tab
      );
    else if (spell.description && Array.isArray(spell.description))
      this.add(
        lines,
        `SAY UNIDENTIFIED_DESC ~${spell.description.join(CR)}~`,
        tab
      );
    for (const effect of spell.effects) {
      this.weiduEffectService.addEffect({
        lines,
        tab,
        effect,
        power: spell.spellLevel ?? 0,
        header: 0,
        type: "SPL",
      });
    }
    for (const [index, header] of spell.headers.entries()) {
      this.createSpellHeader(lines, spell, header, index, tab);
    }
  }

  private createSpellHeader(
    lines: CodeLine[],
    spell: Spell,
    header: SpellHeader,
    index: number,
    tab: number
  ) {
    const intVars: string[] = [`type=${header.type}`];
    if (header.location) intVars.push(`location=${header.location}`);
    if (header.target) intVars.push(`target=${header.target}`);
    if (header.range) intVars.push(`range=${header.range}`);
    if (header.minLevel) intVars.push(`required_level=${header.minLevel}`);
    if (header.speed) intVars.push(`speed=${header.speed}`);
    if (header.projectile)
      intVars.push(
        `projectile=(IDS_OF_SYMBOL (~projectl~ ~${header.projectile}~)) + 1`
      );
    const icon = header.memorizedIcon
      ? ` STR_VAR icon="${header.memorizedIcon}"`
      : "";
    this.add(
      lines,
      `LPF ADD_SPELL_HEADER INT_VAR ${intVars.join(" ")}${icon} END`,
      tab
    );
    for (const effect of header.effects) {
      this.weiduEffectService.addEffect({
        lines,
        tab,
        effect,
        power: spell.spellLevel ?? 0,
        header: index + 1,
        type: "SPL",
      });
    }
  }

  createGrabSpell(lines: CodeLine[], creature: Creature, grab: GrabConfig) {
    this.add(lines, `CREATE SPL "${grab.file}"`, 0);
    this.add(lines, `WRITE_SHORT 0x1c ${SpellTypeEnum.Innate}`, 1);
    this.add(lines, `WRITE_LONG 0x34 1`, 1);
    this.add(lines, `WRITE_LONG 0x64 0x72`, 1);
    this.add(lines, `WRITE_SHORT 0x68 1`, 1);
    this.add(lines, `WRITE_LONG 0x6a 0x9a`, 1);
    this.add(lines, `INSERT_BYTES 0x72 0x28`, 1);
    this.add(lines, `WRITE_SHORT 0x72 ${ItemAbilityTypeEnum.Melee}`, 1);
    this.add(lines, `WRITE_SHORT 0x74 ${ItemAbilityLocationEnum.Ability}`, 1);
    this.add(lines, `WRITE_BYTE 0x7e ${ItemAbilityTargetEnum.LivingActor}`, 1);
    this.add(lines, `WRITE_SHORT 0x80 5`, 1);
    this.add(lines, `WRITE_SHORT 0x82 1`, 1);
    this.add(lines, `WRITE_SHORT 0x94 1`, 1);
    this.add(
      lines,
      `SAY NAME1 @${grab.grabStringRef} SAY NAME2 @${grab.grabStringRef}`,
      1
    );
    const effects = this.grabService.getGrabbedEffects(creature, grab);
    for (const effect of effects)
      this.weiduEffectService.addEffect({
        lines,
        tab: 0,
        effect,
        power: 0,
        header: 0,
        type: "SPL",
      });
    this.add(lines, "", 0);
  }
}
