import { EffectTypeEnum } from "../model/final/effect.type";
import {
  ItemAbilityCastingAnimationEnum,
  ItemAbilityLocationEnum,
  ItemAbilityPrimaryTypeEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  SpellExclusionFlagEnum,
  SpellFlagEnum,
  SpellTypeEnum,
} from "../model/final/enums";
import { Spell, SpellHeader } from "../model/final/spell";
import { RawEffect, RawEffectFile } from "../model/raw/effect";
import {
  RawMemorizedSpell,
  RawSpell,
  RawSpellHeader,
} from "../model/raw/spell";
import { EffectService } from "./effect.service";

export class SpellService {
  static instance = new SpellService();

  private effectService = EffectService.instance;

  mapMemorizedSpells(
    memorizedSpells: RawMemorizedSpell[] | undefined,
    spells: RawSpell[] | undefined
  ): RawMemorizedSpell[] {
    const results: RawMemorizedSpell[] = memorizedSpells ?? [];
    if (!spells) return results;
    for (const spell of spells) {
      if (spell.memorizedCount) {
        results.push({
          file: spell.file,
          memorizedCount: spell.memorizedCount,
        });
      }
    }
    return results;
  }

  mapSpells(
    spells: RawSpell[] | undefined,
    effectFiles: RawEffectFile[]
  ): Spell[] {
    if (!spells) return [];
    const results: Spell[] = [];
    for (const s of spells) {
      s.effects = s.effects ?? [];
      if (s.infiniteUse !== undefined) {
        const effects: RawEffect[] = [
          {
            opcode: "RemoveSpell",
            resource: s.file,
            target: "Self",
            timing: "InstantPermanentUntilDeath",
            global: true,
          },
          {
            opcode: "GiveAbility",
            resource: s.file,
            target: "Self",
            timing: "DelayPermanent",
            duration: s.infiniteUse * 6,
            global: true,
          },
        ];
        s.effects.push(...effects);
      }
      const result = this.mapSpell(s, effectFiles);
      if (results.some((r) => r.file === result.file))
        throw new Error(`Duplicate spell file detected: ${result.file}`);
      results.push(result);
    }
    return results;
  }

  mapSpell(spell: RawSpell, effectFiles: RawEffectFile[]): Spell {
    const headers: SpellHeader[] = [];
    for (const header of spell.headers ?? []) {
      headers.push(this.mapHeader(header, spell, effectFiles));
    }
    const result: Spell = {
      file: spell.file,
      copyFrom: spell.copyFrom,
      name: spell.name,
      stringRef: spell.stringRef,
      description: spell.description,
      spellbookIcon: spell.icon ? `${spell.icon}C` : undefined,
      castingSound: spell.castingSound,
      spellType: spell.spellType
        ? SpellTypeEnum[spell.spellType]
        : spell.copyFrom
        ? undefined
        : SpellTypeEnum.Innate,
      spellLevel: spell.spellLevel,
      primaryType: spell.primaryType
        ? ItemAbilityPrimaryTypeEnum[spell.primaryType]
        : undefined,
      secondaryType: spell.secondaryType
        ? ItemAbilitySecondaryTypeEnum[spell.secondaryType]
        : undefined,
      castingAnimation: spell.castingAnimation
        ? ItemAbilityCastingAnimationEnum[spell.castingAnimation]
        : undefined,
      flags: spell.flags ? spell.flags.map((f) => SpellFlagEnum[f]) : undefined,
      exclusionFlags: spell.exclusionFlags
        ? spell.exclusionFlags.map((f) => SpellExclusionFlagEnum[f])
        : undefined,
      effects: spell.effects
        ? this.effectService.getEffects(spell.effects)
        : [],
      headers,
      deleteOpcodes: (spell.deleteOpcodes ?? []).map((o) => EffectTypeEnum[o]),
      deleteHeaders: spell.deleteHeaders ?? false,
      changes: spell.changes
        ? {
            ...spell.changes,
            spellType: spell.changes?.spellType
              ? SpellTypeEnum[spell.changes.spellType]
              : undefined,
          }
        : undefined,
    };
    if (!spell.copyFrom && spell.spellType === undefined)
      result.spellType = SpellTypeEnum.Innate;
    if (!spell.copyFrom && spell.spellLevel === undefined)
      result.spellLevel = 1;
    return result;
  }

  private mapHeader(
    header: RawSpellHeader,
    spell: RawSpell,
    effectFiles: RawEffectFile[]
  ): SpellHeader {
    if (!header.type) throw new Error(`Header type is required!`);
    const effects = [...(header.effects ?? [])].filter((e) => !e.global);
    if (header.racialSleepCharmResistance) {
      effects.unshift({
        opcode: "UseEFFFile",
        idsFile: "RACE",
        idsEntry: "ELF",
        probability1: 90,
        timing: "InstantLimited",
        duration: 1,
        resource: spell.file,
      });
      effects.unshift({
        opcode: "UseEFFFile",
        idsFile: "RACE",
        idsEntry: "HALF_ELF",
        probability1: 30,
        timing: "InstantLimited",
        duration: 1,
        resource: spell.file,
      });
      effectFiles.push({
        file: spell.file,
        opcode: "ProtectionFromSpell",
        resource: spell.file,
        timing: "InstantPermanentUntilDeath",
      });
    }
    const result: SpellHeader = {
      type: ItemAbilityTypeEnum[header.type],
      memorizedIcon: spell.icon ? `${spell.icon}B` : undefined,
      range: header.range ?? 0,
      speed: header.speed ?? 0,
      minLevel: header.minLevel ?? 0,
      location: header.location
        ? ItemAbilityLocationEnum[header.location]
        : ItemAbilityLocationEnum.Ability,
      target: header.target
        ? ItemAbilityTargetEnum[header.target]
        : ItemAbilityTargetEnum.LivingActor,
      projectile: header.projectile,
      effects: this.effectService.getEffects(effects),
    };
    return result;
  }
}
