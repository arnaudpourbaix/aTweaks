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
import { RawEffect } from "../model/raw/effect";
import { RawSpell, RawSpellHeader } from "../model/raw/spell";
import { EffectService } from "./effect.service";

export class SpellService {
  static instance = new SpellService();

  private effectService = EffectService.instance;

  mapSpells(spells: RawSpell[] | undefined): Spell[] {
    if (!spells) return [];
    const results: Spell[] = spells.map((s) => {
      s.effects = s.effects ?? [];
      if (s.infiniteUse) {
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
            timing: "InstantPermanentUntilDeath",
            global: true,
          },
        ];
        s.effects.push(...effects);
      }
      const result = this.mapSpell(s);
      return result;
    });
    return results;
  }

  private mapSpell(spell: RawSpell): Spell {
    const headers: SpellHeader[] = [];
    for (const header of spell.headers ?? []) {
      headers.push(this.mapHeader(header, spell.icon));
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
    };
    if (!spell.copyFrom && spell.spellType === undefined)
      result.spellType = SpellTypeEnum.Innate;
    if (!spell.copyFrom && spell.spellLevel === undefined)
      result.spellLevel = 1;
    return result;
  }

  private mapHeader(header: RawSpellHeader, icon?: string): SpellHeader {
    if (!header.type) throw new Error(`Header type is required!`);
    const result: SpellHeader = {
      type: ItemAbilityTypeEnum[header.type],
      memorizedIcon: icon ? `${icon}B` : undefined,
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
      effects: header.effects
        ? this.effectService.getEffects(header.effects.filter((e) => !e.global))
        : [],
    };
    return result;
  }
}
