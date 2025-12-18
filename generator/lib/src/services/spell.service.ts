import { SPELL_GROUPS } from "../../config/spell-group";
import { SpellGroupName } from "../../config/spell-group-name";
import { Effect } from "../model/spell-item/effect";
import {
  EffectIDSFileEnum,
  EffectTimingEnum,
  ItemAbilityLocationEnum,
  ItemAbilityTargetEnum,
  SpellTypeEnum,
} from "../model/spell-item/effect.enums";
import { EffectTypeEnum } from "../model/spell-item/effect.type";
import { PartialProjectile } from "../model/spell-item/projectile";
import {
  PartialSpell,
  PartialSpellHeader,
  Spell,
  SpellHeader,
} from "../model/spell-item/spell-item";
import { State } from "../state";
import effectService from "./effects/effect.service";
import translationService from "./translation.service";

class SpellService {
  getSpell(spell: PartialSpell, file: string): Spell {
    const { headers, effectFiles, ...others } = spell;
    const result: Spell = {
      file,
      doc: spell.doc ?? "both",
      effects: [],
      headers: [],
      effectFiles: [],
      projectiles: [],
      groups: [],
      ...others,
    };
    for (const effectFile of spell.effectFiles ?? []) {
      result.effectFiles.push({
        ...effectService.getEffect(effectFile),
        file: effectFile.file ?? file,
      });
    }
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
    if (result.ability?.spell) {
      result.ability.spell.resource = file;
      result.ability.name ??= spell.name;
    }
    State.spells.push(result);
    return result;
  }

  getGroupRessources(name: SpellGroupName): string[] {
    const group = SPELL_GROUPS.find((g) => g.name === name);
    if (!group) throw new Error(`Group ${name} is not defined !`);
    return group.spells ?? [];
  }

  private addHeader(
    header: PartialSpellHeader,
    spell: Spell,
    file: string
  ): void {
    const result: SpellHeader = { ...header, effects: header.effects ?? [] };
    if (!result.type) throw new Error(`Header type is required!`);
    if (!result.icon && spell.icon && /\d{3}$/.test(spell.icon)) {
      result.icon = `${spell.icon}C`;
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
    if (typeof result.projectile === "object") {
      this.addProjectile(spell, result, result.projectile);
    }
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
      this.addProtectionFromSpellEffect(spell);
    }
  }

  private addProtectionFromSpellEffect(spell: Spell) {
    this.addEffectFile(spell, {
      opcode: EffectTypeEnum.ProtectionFromSpell,
      resource: spell.file,
      timing: EffectTimingEnum.InstantPermanentUntilDeath,
    });
  }

  private addEffectFile(spell: Spell, effect: Effect) {
    if (!spell.effectFiles.some((e) => e.file === spell.file)) {
      console.log(`adding effect file ${spell.file} for spell ${spell.name}`);
      spell.effectFiles.push({
        file: spell.file,
        ...effectService.getEffect(effect),
      });
    }
  }

  private addProjectile(
    spell: Spell,
    header: SpellHeader,
    projectile: PartialProjectile
  ) {
    if (!spell.projectiles.some((p) => p.file === spell.file)) {
      console.log(
        `adding projectile ${
          spell.file
        } for spell ${translationService.fromOptional(spell.name)}`
      );
      spell.projectiles.push({ file: spell.file, ...projectile });
      header.projectile = spell.file;
    }
  }

  private getEffects(effects: Effect[], spell: Spell, file: string): Effect[] {
    const results = effectService.getEffects(effects, { file });
    let needEffectFile = false;
    for (const effect of results) {
      if (
        [
          EffectTypeEnum.ProtectionFromResourceAndMessage,
          EffectTypeEnum.ProtectionFromSpell,
          EffectTypeEnum.UseEFFFile,
        ].includes(effect.opcode) &&
        !effect.resource
      ) {
        needEffectFile =
          needEffectFile || effect.opcode === EffectTypeEnum.UseEFFFile;
        effect.resource = spell.file;
      }
    }
    if (needEffectFile) {
      this.addProtectionFromSpellEffect(spell);
    }
    return results;
  }
}

const spellService = new SpellService();
export default spellService;
