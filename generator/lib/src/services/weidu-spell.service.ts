import { CR } from "../model/constants";
import { Creature } from "../model/final/creature";
import {
  ItemAbilityLocationEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  SpellTypeEnum,
} from "../model/final/enums";
import { Spell } from "../model/final/spell";
import { CodeLine } from "../model/misc";
import { GrabConfig } from "../model/raw/grab";
import { AbstractWeiduService } from "./abstract-weidu.service";
import { WeiduEffectService } from "./weidu-effect.service";

export class WeiduSpellService extends AbstractWeiduService {
  static instance = new WeiduSpellService();

  private weiduEffectService = WeiduEffectService.instance;

  createSpells(lines: CodeLine[], creature: Creature) {
    for (const spell of creature.spells) {
      if (spell.copyFrom) {
        this.createSpellFrom(lines, creature, spell);
      } else {
        this.createSpell(lines, creature, spell);
      }
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
      this.weiduEffectService.addEffect(lines, 1, effect, 0, "SPL");
    this.add(lines, "", 0);
  }

  private createSpell(lines: CodeLine[], creature: Creature, spell: Spell) {
    this.add(lines, `// ${spell.name}`, 1);
    this.add(lines, `CREATE SPL "${spell.file}"`, 0);
    this.add(lines, `WRITE_LONG 0x64 0x72`, 1);
    this.createSpellCommon(lines, creature, spell);
  }

  private createSpellFrom(lines: CodeLine[], creature: Creature, spell: Spell) {
    this.add(
      lines,
      `COPY_EXISTING ~${spell.copyFrom}.SPL~  ~override/${spell.file}.SPL~`,
      0
    );
    for (const level of spell.deleteHeaders)
      this.add(
        lines,
        `LPF DELETE_SPELL_HEADER STR_VAR min_level = ${level} END`,
        1
      );
    for (const opcode of spell.removeOpcodes)
      this.add(
        lines,
        `LPF DELETE_EFFECT INT_VAR match_opcode = ${opcode} END`,
        1
      );
    this.createSpellCommon(lines, creature, spell);
  }

  private createSpellCommon(
    lines: CodeLine[],
    creature: Creature,
    spell: Spell
  ) {
    if (spell.type) {
      this.add(lines, `INSERT_BYTES 0x72 0x28`, 1);
      this.add(lines, `WRITE_SHORT 0x68 1`, 1);
      this.add(lines, `WRITE_LONG 0x6a 0x9a`, 1);
      this.add(lines, `WRITE_SHORT 0x72 ${spell.type}`, 1);
      this.add(lines, `WRITE_SHORT 0x82 1`, 1);
    }
    if (spell.flags) {
      const flags = spell.flags.reduce((sum, save) => {
        sum += 2 ** save;
        return sum;
      }, 0);
      this.add(lines, `WRITE_LONG 0x18 ${flags}`, 1);
    }
    if (spell.spellbookIcon) {
      this.add(lines, `WRITE_ASCII 0x3a ~${spell.spellbookIcon}~ #8`, 1);
    }
    if (spell.memorizedIcon) {
      this.add(lines, `WRITE_ASCII 0x76 ~${spell.memorizedIcon}~ #8`, 1);
    }
    if (spell.castingAnimation)
      this.add(lines, `WRITE_SHORT 0x22 ${spell.castingAnimation}`, 1);
    if (spell.spellType)
      this.add(lines, `WRITE_SHORT 0x1c ${spell.spellType}`, 1);
    if (spell.primaryType)
      this.add(lines, `WRITE_BYTE 0x25 ${spell.primaryType}`, 1);
    if (spell.secondaryType)
      this.add(lines, `WRITE_BYTE 0x27 ${spell.secondaryType}`, 1);
    if (spell.spellLevel)
      this.add(lines, `WRITE_LONG 0x34 ${spell.spellLevel}`, 1);
    if (spell.castingSound)
      this.add(lines, `WRITE_ASCII 0x10 ~${spell.castingSound}~ #8`, 1);
    if (spell.location)
      this.add(lines, `WRITE_SHORT 0x74 ${spell.location}`, 1);
    if (spell.target) this.add(lines, `WRITE_BYTE 0x7e ${spell.target}`, 1);
    if (spell.range) this.add(lines, `WRITE_SHORT 0x80 ${spell.range}`, 1);
    if (spell.speed) this.add(lines, `WRITE_SHORT 0x84 ${spell.speed}`, 1);
    if (spell.stringRef) {
      this.add(
        lines,
        `WRITE_LONG 0x8 ${this.utils.resolveStringRef(spell.stringRef)}`,
        1
      );
    }
    if (spell.description && typeof spell.description === "number")
      this.add(
        lines,
        `WRITE_LONG 0x50 ${this.utils.resolveStringRef(spell.description)}`,
        1
      );
    else if (spell.description && Array.isArray(spell.description))
      this.add(
        lines,
        `SAY UNIDENTIFIED_DESC ~${spell.description.join(CR)}~`,
        1
      );
    if (spell.projectile)
      this.add(
        lines,
        `WRITE_SHORT 0x98 (IDS_OF_SYMBOL (~projectl~ ~${spell.projectile}~)) + 1`,
        1
      );
    for (const effect of spell.effects) {
      this.weiduEffectService.addEffect(
        lines,
        1,
        effect,
        spell.spellLevel ?? 0,
        "SPL"
      );
    }
    this.add(lines, "", 0);
  }
}
