import { ImmunityName } from "../../config/immunity-name";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { Creature } from "../model/final/creature";
import { Effect } from "../model/final/effect";
import { EffectTypeEnum } from "../model/final/effect.type";
import {
  AbilityDamageTypeEnum,
  ItemAbilityTypeEnum,
  SaveTypeEnum,
} from "../model/final/enums";
import { ImmunityConfig } from "../model/final/immunity";
import { Item } from "../model/final/item";
import {
  ArmorClassBonusEffect,
  CastingTimeModifierEffect,
  CurrentHPbonusEffect,
  DamageEffect,
  IdsEffect,
  InvisibilityEffect,
  LevelDrainEffect,
  PoisonEffect,
  RawEffect,
  RegenerationEffect,
  SleepEffect,
  StatisticModifierEffect,
} from "../model/raw/effect";
import { State } from "../state";
import { EffectService } from "./effect.service";

export class DescriptionService {
  static instance = new DescriptionService();

  private effectService = EffectService.instance;

  generateCreatureItems(creature: Creature): void {
    for (const item of creature.items) {
      if (!item.description) this.generateItemDescription(item, creature);
    }
  }

  generateImmunity(immunity: ImmunityConfig): void {
    if (immunity.description.length) return; // don't override
    const results: string[] = [];
    results.push(...this.getImmunitiesDescription(immunity.immunities));
    for (const effect of immunity.effects ?? []) {
      results.push(...this.getEffectDescription(effect));
    }
    immunity.description = results;
  }

  private generateItemDescription(item: Item, creature?: Creature) {
    const desc: string[] = [];
    const type = item.type === ItemAbilityTypeEnum.Melee ? "Melee" : "Ranged";
    if (item.bonusToHit) {
      desc.push(`THAC0: ${this.getSignedNumber(item.bonusToHit)}`);
    }
    const damage = this.getDiceValue({ ...item, value: item.damageBonus });
    if (damage) {
      desc.push(
        `${type} damage: ${damage} (${AbilityDamageTypeEnum[item.damageType!]})`
      );
    }
    const damageEffects = item.effects.filter((e) => e.raw.opcode === "Damage");
    const otherEffects = item.effects.filter((e) => e.raw.opcode !== "Damage");
    desc.push(...this.getItemEffectsDescription(damageEffects, creature));
    if ((damage || damageEffects.length) && item.speed !== undefined) {
      desc.push(`Speed Factor: ${item.speed}`);
    }
    if (item.enchantment && item.enchantment > 0) {
      desc.push(`Enchantment: ${item.enchantment}`);
    }
    if (item.range) {
      desc.push(`Range: ${item.range} feet`);
    }
    desc.push(...this.getImmunitiesDescription(item.immunities));
    desc.push(...this.getItemEffectsDescription(otherEffects, creature));
    if (desc.length && typeof item.stringRef === "string") {
      desc.unshift(item.stringRef, "");
    } else if (desc.length && typeof item.stringRef === "number") {
      desc.unshift(TraStringReferenceEnum[item.stringRef], "");
    }
    item.description = desc;
  }

  private getImmunitiesDescription(immunities: ImmunityName[]): string[] {
    const results: string[] = [];
    for (const name of immunities) {
      const immunity = State.immunities.find((i) => i.name === name);
      if (immunity) {
        if (!immunity.description.length) this.generateImmunity(immunity);
        results.push(...immunity.description);
      }
    }
    return results;
  }

  private getItemEffectsDescription(
    effects: Effect[],
    creature?: Creature
  ): string[] {
    const results: string[] = [];
    for (const effect of effects) {
      if (effect.opcode === EffectTypeEnum.CastSpell) {
        results.push(...this.getItemSpellDescription(effect, creature));
      } else {
        results.push(...this.getEffectDescription(effect));
      }
    }
    return results;
  }

  private getItemSpellDescription(
    effect: Effect,
    creature?: Creature
  ): string[] {
    const spell = (creature?.spells ?? []).find(
      (s) => s.file === effect.resource
    );
    let text = `Cast spell ${spell ? spell.name : effect.resource}`;
    const condition = this.getSaveText(effect) ?? this.getProbability(effect);
    if (condition) text = `${text}${condition}`;
    const results: string[] = ["", text];
    if (spell && Array.isArray(spell.description)) {
      results.push(...spell.description);
    }
    return results;
  }

  private getEffectDescription(effect: Effect): string[] {
    const results: string[] = [];
    if (effect.raw.opcode === "Damage") {
      results.push(...this.getDamage(effect.raw));
    } else if (effect.raw.opcode === "Poison") {
      results.push(...this.getPoison(effect.raw));
    } else if (effect.raw.opcode === "ArmorClassBonus") {
      results.push(...this.getArmorClassBonus(effect.raw));
    } else if (effect.raw.opcode === "Paralyze") {
      results.push(...this.getParalyze(effect.raw));
    } else if (effect.raw.opcode === "InvisibilityDetection") {
      results.push("Can see invisible creatures.");
    } else if (effect.raw.opcode === "Blur") {
      results.push("Blur (visual effect only)");
    } else if (effect.raw.opcode === "Translucency") {
      results.push("Translucent");
    } else if (effect.raw.opcode === "CurrentHPbonus") {
      results.push(...this.getCurrentHPbonus(effect.raw));
    } else if (effect.raw.opcode === "LevelDrain") {
      results.push(...this.getLevelDrain(effect.raw));
    } else if (effect.raw.opcode === "Sleep") {
      results.push(...this.getSleep(effect.raw));
    } else if (effect.raw.opcode === "MirrorImageEffect") {
      results.push(`Mirror image (${effect.raw.amount})`);
    } else if (effect.raw.opcode === "Invisibility") {
      results.push(...this.getInvisibility(effect.raw));
    } else if (effect.raw.opcode === "Regeneration") {
      results.push(...this.getRegeneration(effect.raw));
    } else if (effect.raw.opcode === "CastingTimeModifier") {
      results.push(...this.getCastingTimeModifier(effect.raw));
    } else if (this.getStatisticText(effect.raw)) {
      results.push(
        ...this.getStatisticModifier(effect.raw as StatisticModifierEffect)
      );
    }
    return results;
  }

  getSaveText(effect: Effect | RawEffect): string {
    let save = "";
    const type = effect.saveTypes?.[0];
    if (
      type === "ParalyzePoisonDeath" ||
      type === SaveTypeEnum.ParalyzePoisonDeath
    )
      save = "poison/death";
    else if (type === "Breath" || type === SaveTypeEnum.Breath) save = "breath";
    else if (
      type === "PetrifyPolymorph" ||
      type === SaveTypeEnum.PetrifyPolymorph
    )
      save = "petrify/polymorph";
    else if (type === "RodStaffWand" || type === SaveTypeEnum.RodStaffWand)
      save = "wand";
    else if (type === "Spell" || type === SaveTypeEnum.Spell) save = "spell";
    let bonus = effect.saveBonus
      ? ` at ${this.getSignedNumber(effect.saveBonus)}`
      : "";
    const saveText = save ? ` (saves vs ${save}${bonus})` : "";
    return saveText;
  }

  getProbability(effect: Effect | RawEffect): string {
    //TODO: handle probability2
    return effect.probability1 && effect.probability1 < 100
      ? ` (${effect.probability1}%)`
      : "";
  }

  getDuration(duration?: number): string {
    if (!duration) return "";
    const rounds = Math.round(duration / 6);
    const turns = duration / 60;
    return duration % 60 === 0 ? `${turns} turns` : `${rounds} rounds`;
  }

  private getArmorClassBonus(effect: ArmorClassBonusEffect): string[] {
    if (effect.bonusTo === "SetBaseArmorClassToValue")
      return [`${effect.value} base AC`];
    const results: string[] = [];
    let suffix = "";
    if (effect.bonusTo === "CrushingWeapons") suffix = "crushing";
    else if (effect.bonusTo === "SlashingWeapons") suffix = "slashing";
    else if (effect.bonusTo === "PiercingWeapons") suffix = "piercing";
    else if (effect.bonusTo === "MissileWeapons") suffix = "missile";
    if (suffix) suffix = ` vs. ${suffix} attacks`;
    results.push(`${this.getSignedNumber(effect.value)} AC${suffix}`);
    return results;
  }

  private getInvisibility(effect: InvisibilityEffect): string[] {
    const results: string[] = [];
    if (effect.type === "Improved") results.push("Improved invisibility");
    else results.push(`Invisibility`);
    return results;
  }

  private getRegeneration(effect: RegenerationEffect): string[] {
    if (["AmountHPperSecond", "AmountHPperSecondBis"].includes(effect.type))
      return [`Regeneration: ${effect.amount} hp/second`];
    else if (effect.type === "AmountHPpercentagePerSecond")
      return [`Regeneration: ${effect.amount}% hp/second`];
    else if (effect.amount === 6) return [`Regeneration: 1 hp/round`];
    const rounds = effect.amount / 6;
    if (rounds > 1 && effect.amount % 6 === 0)
      return [`Regeneration: 1 hp/${rounds} rounds`];
    return [`Regeneration: 1 hp/${effect.amount} seconds`];
  }

  private getParalyze(effect: IdsEffect): string[] {
    const results: string[] = [];
    //TODO: handle ids entry/id
    results.push(
      `Paralyze target for ${this.getDuration(
        effect.duration
      )}${this.getSaveText(effect)}.`
    );
    return results;
  }

  private getLevelDrain(effect: LevelDrainEffect): string[] {
    const results: string[] = [];
    results.push(
      `Drain ${effect.amount} level from target${this.getSaveText(effect)}.`
    );
    return results;
  }

  private getCastingTimeModifier(effect: CastingTimeModifierEffect): string[] {
    const results: string[] = [];
    results.push(`Casting time: ${effect.value} (${effect.type})`);
    return results;
  }

  private getStatisticModifier(effect: StatisticModifierEffect): string[] {
    const results: string[] = [];
    results.push(this.getStatisticText(effect) as string);
    return results;
  }

  private getCurrentHPbonus(effect: CurrentHPbonusEffect): string[] {
    const results: string[] = [];
    const heal = this.getDiceValue(effect);
    results.push(`Heal: ${heal}`);
    return results;
  }

  private getSleep(effect: SleepEffect): string[] {
    const results: string[] = [];
    const wake = effect.wakeOnDamage ? " (wake on damage)" : "";
    results.push(
      `Sleep for ${this.getDuration(effect.duration)}${wake}${this.getSaveText(
        effect
      )}`
    );
    return results;
  }

  private getDamage(effect: DamageEffect): string[] {
    const results: string[] = [];
    const amount = effect.amount ? this.getSignedNumber(effect.amount) : "";
    if (effect.diceSize && effect.diceThrown) {
      results.push(
        `${effect.type} damage: ${effect.diceThrown}D${effect.diceSize}${amount}`
      );
    }
    return results;
  }

  private getPoison(effect: PoisonEffect): string[] {
    let text = "one damage per second";
    if (effect.type === "AmountDamagePerSecond")
      text = `${effect.amount} per second`;
    else text = `one damage per ${effect.amount} seconds`;
    const results: string[] = [];
    const level =
      effect.diceSize && effect.diceThrown
        ? `Level ${effect.diceSize}-${effect.diceThrown}: `
        : "";
    results.push(
      `${level}Poison: deals ${text} for ${this.getDuration(
        effect.duration
      )}${this.getSaveText(effect)}.`
    );
    return results;
  }

  private getDiceValue(payload: {
    diceThrown?: number;
    diceSize?: number;
    value?: number;
  }) {
    const dice =
      payload.diceThrown && payload.diceSize
        ? `${payload.diceThrown}D${payload.diceSize}`
        : "";
    const value = payload.value ? `${this.getSignedNumber(payload.value)}` : "";
    return dice ? `${dice}${value}` : `${value.substring(1)}`;
  }

  private getSignedNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return "";
    else if (value <= 0) return `${value}`;
    return `+${value}`;
  }

  getStatisticText(effect: RawEffect) {
    const opcodes = [
      { opcode: "DexterityBonus", label: "Dexterity" },
      { opcode: "IntelligenceBonus", label: "Intelligence" },
      { opcode: "StrengthBonus", label: "Strength" },
      { opcode: "ConstitutionBonus", label: "Constitution" },
      {
        opcode: "SlashingResistanceModifier",
        label: "Slashing Resistance",
      },
      {
        opcode: "CrushingResistanceModifier",
        label: "Crushing Resistance",
      },
      {
        opcode: "PiercingResistanceModifier",
        label: "Piercing Resistance",
      },
      {
        opcode: "MissilesResistanceModifier",
        label: "Missiles Resistance",
      },
      { opcode: "FireResistanceModifier", label: "Fire Resistance" },
      { opcode: "ColdResistanceModifier", label: "Cold Resistance" },
      { opcode: "MagicResistanceModifier", label: "Magic Resistance" },
      {
        opcode: "MagicalColdResistanceModifier",
        label: "Magical Cold Resistance",
      },
      {
        opcode: "MagicalFireResistanceModifier",
        label: "Magical Fire Resistance",
      },
      { opcode: "AcidResistanceModifier", label: "Acid Resistance" },
      {
        opcode: "ElectricityResistanceModifier",
        label: "Electricity Resistance",
      },
      {
        opcode: "MagicDamageResistanceModifier",
        label: "Magic Damage Resistance",
      },
      { opcode: "MaximumHPModifier", label: "Maximum HP" },
      { opcode: "MoraleModifier", label: "Morale" },
      { opcode: "MoraleBreakModifier", label: "Morale Break" },
      { opcode: "FatigueBonus", label: "Fatigue Bonus" },
      { opcode: "AllSavingThrowsBonus", label: "All Saving Throws" },
      { opcode: "SaveVsBreathModifier", label: "Save vs Breath" },
      { opcode: "SaveVsDeathModifier", label: "Save vs Death" },
      {
        opcode: "SaveVsPetrificationModifier",
        label: "Save vs Petrification",
      },
      { opcode: "SaveVsSpellModifier", label: "Save vs Spell" },
      { opcode: "SaveVsWandModifier", label: "Save vs Wand" },
    ];
    const opcode = opcodes.find((o) => o.opcode === effect.opcode);
    if (!opcode) return;
    const eff = effect as StatisticModifierEffect;
    return opcode.opcode.includes("Resistance")
      ? `${opcode.label}: ${eff.value}%`
      : `${opcode.label}: ${this.getSignedNumber(eff.value)}`;
  }
}
