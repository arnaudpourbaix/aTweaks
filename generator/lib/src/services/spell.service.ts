import { Effect, EffectFile } from "../model/spell-item/effect";
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
  Spell,
  SpellHeader,
} from "../model/spell-item/spell-item";
import effectService from "./effect.service";

class SpellService {
  getSpell(spell: PartialSpell, file: string): Spell {
    const result: Spell = {
      file,
      effects: [],
      headers: [],
      effectFiles: [],
      ...spell,
    };
    for (const header of result.headers ?? []) {
      this.checkHeader(header, result);
    }
    if (result.icon && /\d{3}$/.test(result.icon)) {
      result.icon = `${result.icon}C`;
    }
    if (result.spellType === undefined && !result.copyFrom)
      result.spellType = SpellTypeEnum.Innate;
    if (result.deleteHeaders === undefined) result.deleteHeaders = false;
    if (result.spellLevel === undefined && !result.copyFrom)
      result.spellLevel = 1;
    result.effects = this.getEffects(result.effects, result);
    return result;
  }

  private checkHeader(header: SpellHeader, spell: Spell): void {
    if (!header.type) throw new Error(`Header type is required!`);
    if (!header.icon && spell.icon && /\d{3}$/.test(spell.icon)) {
      header.icon = `${spell.icon}B`;
    }
    if (header.range === undefined) header.range = 0;
    if (header.speed === undefined) header.speed = 0;
    if (header.minLevel === undefined) header.minLevel = 0;
    if (header.location === undefined)
      header.location = ItemAbilityLocationEnum.Ability;
    if (header.target === undefined)
      header.target = ItemAbilityTargetEnum.LivingActor;
    header.effects = header.effects ?? [];
    this.addRacialResistances(header, spell);
    header.effects = this.getEffects(header.effects ?? [], spell);
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
      spell.effectFiles.push({
        file: spell.file,
        opcode: EffectTypeEnum.ProtectionFromSpell,
        resource: spell.file,
        timing: EffectTimingEnum.InstantPermanentUntilDeath,
      });
    }
  }

  private getEffects(effects: Effect[], spell: Spell): Effect[] {
    const results = effectService.getEffects(effects);
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
