import { Effect } from "../model/spell-item/effect";
import {
  EffectIDSFileEnum,
  EffectTimingEnum,
  ItemAbilityLocationEnum,
  ItemAbilityTargetEnum,
  SpellTypeEnum,
} from "../model/spell-item/effect.enums";
import { EffectTypeEnum } from "../model/spell-item/effect.type";
import {
  PartialSpell,
  PartialSpellHeader,
  Spell,
  SpellHeader,
} from "../model/spell-item/spell-item";
import effectService from "./effect.service";

class SpellService {
  getSpell(spell: PartialSpell, file: string): Spell {
    const { headers, ...others } = spell;
    const result: Spell = {
      file,
      effects: [],
      headers: [],
      effectFiles: [],
      ...others,
    };
    for (const header of spell.headers ?? []) {
      this.addHeader(header, result, file);
    }
    if (result.icon && /\d{3}$/.test(result.icon)) {
      result.icon = `${result.icon}C`;
    }
    if (result.spellType === undefined && !result.copyFrom)
      result.spellType = SpellTypeEnum.Innate;
    if (result.deleteHeaders === undefined) result.deleteHeaders = false;
    if (result.spellLevel === undefined && !result.copyFrom)
      result.spellLevel = 1;
    result.effects = this.getEffects(result.effects, result, file);
    return result;
  }

  private addHeader(
    header: PartialSpellHeader,
    spell: Spell,
    file: string
  ): void {
    const result: SpellHeader = { ...header, effects: header.effects ?? [] };
    if (!result.type) throw new Error(`Header type is required!`);
    if (!result.icon && spell.icon && /\d{3}$/.test(spell.icon)) {
      header.icon = `${spell.icon}B`;
    }
    if (result.range === undefined) result.range = 0;
    if (result.speed === undefined) result.speed = 0;
    if (result.minLevel === undefined) result.minLevel = 0;
    if (result.location === undefined)
      result.location = ItemAbilityLocationEnum.Ability;
    if (result.target === undefined)
      result.target = ItemAbilityTargetEnum.LivingActor;
    if (spell.options?.addRacialResistances !== false)
      this.addRacialResistances(result, spell);
    result.effects = this.getEffects(result.effects, spell, file);
    spell.headers.push(result);
  }

  private addRacialResistances(header: SpellHeader, spell: Spell): void {
    if (
      header.effects.some((e) =>
        [
          EffectTypeEnum.CharmCreature,
          EffectTypeEnum.Sleep,
          EffectTypeEnum.Sleep20HP,
        ].includes(e.opcode)
      )
    ) {
      const racials = [
        ["ELF", 90],
        ["HALF_ELF", 30],
      ] as const;
      for (const [idsEntry, probability1] of racials) {
        header.effects.unshift({
          opcode: EffectTypeEnum.UseEFFFile,
          idsFile: EffectIDSFileEnum.RACE,
          idsEntry,
          probability1,
          timing: EffectTimingEnum.InstantLimited,
          duration: 1,
          resource: spell.file,
        });
      }
      this.addEffectFiles(spell, {
        opcode: EffectTypeEnum.ProtectionFromSpell,
        resource: spell.file,
        timing: EffectTimingEnum.InstantPermanentUntilDeath,
      });
    }
  }

  private addEffectFiles(spell: Spell, effect: Effect) {
    if (!spell.effectFiles.some((e) => e.file === spell.file)) {
      spell.effectFiles.push({
        file: spell.file,
        ...effect,
      });
    }
  }

  private getEffects(effects: Effect[], spell: Spell, file: string): Effect[] {
    const results = effectService.getEffects(effects, { file });
    for (const effect of results) {
      if (
        effect.opcode === EffectTypeEnum.ProtectionFromSpell &&
        !effect.resource
      ) {
        effect.resource = spell.file;
      }
    }
    return results;
  }
}

const spellService = new SpellService();
export default spellService;
