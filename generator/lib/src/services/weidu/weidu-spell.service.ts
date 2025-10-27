import { CR } from "../../model/constants";
import { CodeLine } from "../../model/misc";
import { Spell, SpellHeader } from "../../model/spell-item/spell-item";
import { AbstractWeiduService } from "./abstract-weidu.service";
import weiduEffectService from "./weidu-effect.service";

class WeiduSpellService extends AbstractWeiduService {
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
      this.write(lines, 0x64, 4, "0x72", tab + 1);
    }
    this.add(lines, `COPY_EXISTING ~${spell.file}.SPL~  ~override~`, tab);
    this.createSpellCommon(lines, spell, tab + 1);
    if (spell.options) {
      const type =
        spell.options.spellType !== undefined
          ? `type=${spell.options.spellType}`
          : "";
      const ctime = spell.options.castingTime !== undefined ? "ctime=1" : "";
      const rinvs =
        spell.options.removeInvisbilityOnCast !== undefined ? "rinvs=1" : "";
      const renew = spell.options.renew !== undefined ? "renew=1" : "";
      this.add(
        lines,
        `LPF CHANGE_SPELL INT_VAR ${type} ${ctime} ${rinvs} ${renew} END`,
        tab + 1
      );
    }
  }

  private createSpellCommon(lines: CodeLine[], spell: Spell, tab: number) {
    this.writeStringRef(lines, 0x8, spell.name, tab);
    this.write(lines, 0x10, 8, spell.castingSound, tab);
    this.writeFlag(lines, 0x18, 4, spell.flags, tab);
    this.write(lines, 0x1c, 2, spell.spellType, tab);
    this.writeFlag(lines, 0x1e, 4, spell.exclusionFlags, tab);
    this.write(lines, 0x22, 2, spell.castingAnimation, tab);
    this.write(lines, 0x25, 1, spell.primaryType, tab);
    this.write(lines, 0x27, 1, spell.secondaryType, tab);
    this.write(lines, 0x34, 4, spell.spellLevel, tab);
    this.write(lines, 0x3a, 8, spell.spellbookIcon, tab);
    if (spell.description && typeof spell.description === "number")
      this.writeStringRef(lines, 0x50, spell.description, tab);
    else if (spell.description && Array.isArray(spell.description))
      this.add(
        lines,
        `SAY UNIDENTIFIED_DESC ~${spell.description.join(CR)}~`,
        tab
      );
    for (const effect of spell.effects) {
      weiduEffectService.addEffect({
        lines,
        tab,
        effect,
        power: spell.spellLevel ?? 0,
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
      weiduEffectService.addEffect({
        lines,
        tab,
        effect,
        power: spell.spellLevel ?? 0,
        header: index + 1,
        type: "SPL",
      });
    }
  }
}

const weiduSpellService = new WeiduSpellService();
export default weiduSpellService;
