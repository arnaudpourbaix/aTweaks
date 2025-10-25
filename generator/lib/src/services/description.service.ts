import { ImmunityName } from "../../config/immunity-name";
import { TraStringReferenceEnum } from "../../config/stringRef";
import {
  ArmorClassBonusEffect,
  CastingTimeModifierEffect,
  CurrentHPbonusEffect,
  DamageEffect,
  Effect,
  IdsEffect,
  InvisibilityEffect,
  LevelDrainEffect,
  PoisonEffect,
  RegenerationEffect,
  SleepEffect,
  StatisticModifierEffect,
} from "../model/spell-item/effect";
import {
  AbilityDamageTypeEnum,
  EffectBonusToEnum,
  InvisibilityTypeEnum,
  ItemAbilityTypeEnum,
  PoisonTypeEnum,
  RegenerationTypeEnum,
  SaveTypeEnum,
} from "../model/spell-item/effect.enums";
import { EffectTypeEnum } from "../model/spell-item/effect.type";
import { ImmunityConfig } from "../model/final/immunity";
import { Item } from "../model/spell-item/spell-item";
import { State } from "../state";
import { Creature } from "../model/creature/creature";

class DescriptionService {
  generateCreatureItems(creature: Creature): void {
    for (const item of creature.items) {
      if (!item.description) this.generateWeaponDescription(item, creature);
    }
  }

  generateImmunity(immunity: ImmunityConfig): void {
    if (immunity.description) return; // don't override
    const results: string[] = [];
    results.push(...this.getImmunitiesDescription(immunity.immunities));
    for (const effect of immunity.effects ?? []) {
      results.push(...this.getEffectDescription(effect));
    }
    // immunity.description = results; //FIXME:
  }

  private generateWeaponDescription(item: Item, creature?: Creature) {
    const desc: string[] = [];
    if (!item.header) throw new Error(`not a weapon: ${item.file}`);
    const type =
      item.header.type === ItemAbilityTypeEnum.Melee ? "Melee" : "Ranged";
    if (item.header.bonusToHit) {
      desc.push(`THAC0: ${this.getSignedNumber(item.header.bonusToHit)}`);
    }
    const damage = this.getDiceValue({
      ...item,
      value: item.header.damageBonus,
    });
    if (damage) {
      desc.push(
        `${type} damage: ${damage} (${
          AbilityDamageTypeEnum[item.header.damageType!]
        })`
      );
    }
    const damageEffects = item.effects.filter(
      (e) => e.opcode === EffectTypeEnum.Damage
    );
    const otherEffects = item.effects.filter(
      (e) => e.opcode !== EffectTypeEnum.Damage
    );
    desc.push(...this.getItemEffectsDescription(damageEffects, creature));
    if ((damage || damageEffects.length) && item.header.speed !== undefined) {
      desc.push(`Speed Factor: ${item.header.speed}`);
    }
    if (item.enchantment && item.enchantment > 0) {
      desc.push(`Enchantment: ${item.enchantment}`);
    }
    if (item.header.range) {
      desc.push(`Range: ${item.header.range} feet`);
    }
    desc.push(...this.getImmunitiesDescription(item.immunities));
    desc.push(...this.getItemEffectsDescription(otherEffects, creature));
    if (desc.length && typeof item.stringRef === "string") {
      desc.unshift(item.stringRef, "");
    } else if (desc.length && typeof item.stringRef === "number") {
      desc.unshift(TraStringReferenceEnum[item.stringRef], "");
    }
    // item.description = desc; //TODO:
  }

  private getImmunitiesDescription(immunities: ImmunityName[]): string[] {
    const results: string[] = [];
    for (const name of immunities) {
      const immunity = State.immunities.find((i) => i.name === name);
      if (immunity) {
        if (!immunity.description) this.generateImmunity(immunity);
        // results.push(immunity.description); //TODO:
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
    if (effect.opcode === EffectTypeEnum.Damage) {
      results.push(...this.getDamage(effect));
    } else if (effect.opcode === EffectTypeEnum.Poison) {
      results.push(...this.getPoison(effect));
    } else if (effect.opcode === EffectTypeEnum.ArmorClassBonus) {
      results.push(...this.getArmorClassBonus(effect));
    } else if (effect.opcode === EffectTypeEnum.Paralyze) {
      results.push(...this.getParalyze(effect));
    } else if (effect.opcode === EffectTypeEnum.InvisibilityDetection) {
      results.push("Can see invisible creatures.");
    } else if (effect.opcode === EffectTypeEnum.Blur) {
      results.push("Blur (visual effect only)");
    } else if (effect.opcode === EffectTypeEnum.Translucency) {
      results.push("Translucent");
    } else if (effect.opcode === EffectTypeEnum.CurrentHPbonus) {
      results.push(...this.getCurrentHPbonus(effect));
    } else if (effect.opcode === EffectTypeEnum.LevelDrain) {
      results.push(...this.getLevelDrain(effect));
    } else if (effect.opcode === EffectTypeEnum.Sleep) {
      results.push(...this.getSleep(effect));
    } else if (effect.opcode === EffectTypeEnum.MirrorImageEffect) {
      results.push(`Mirror image (${effect.amount})`);
    } else if (effect.opcode === EffectTypeEnum.Invisibility) {
      results.push(...this.getInvisibility(effect));
    } else if (effect.opcode === EffectTypeEnum.Regeneration) {
      results.push(...this.getRegeneration(effect));
    } else if (effect.opcode === EffectTypeEnum.CastingTimeModifier) {
      results.push(...this.getCastingTimeModifier(effect));
    } else if (this.getStatisticText(effect)) {
      results.push(
        ...this.getStatisticModifier(effect as StatisticModifierEffect)
      );
    }
    return results;
  }

  getSaveText(effect: Effect): string {
    let save = "";
    const type = effect.saveTypes?.[0];
    if (type === SaveTypeEnum.ParalyzePoisonDeath) save = "poison/death";
    else if (type === SaveTypeEnum.Breath) save = "breath";
    else if (type === SaveTypeEnum.PetrifyPolymorph) save = "petrify/polymorph";
    else if (type === SaveTypeEnum.RodStaffWand) save = "wand";
    else if (type === SaveTypeEnum.Spell) save = "spell";
    let bonus = effect.saveBonus
      ? ` at ${this.getSignedNumber(effect.saveBonus)}`
      : "";
    const saveText = save ? ` (saves vs ${save}${bonus})` : "";
    return saveText;
  }

  getProbability(effect: Effect): string {
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
    if (effect.bonusTo === EffectBonusToEnum.SetBaseArmorClassToValue)
      return [`${effect.value} base AC`];
    const results: string[] = [];
    let suffix = "";
    if (effect.bonusTo === EffectBonusToEnum.CrushingWeapons)
      suffix = "crushing";
    else if (effect.bonusTo === EffectBonusToEnum.SlashingWeapons)
      suffix = "slashing";
    else if (effect.bonusTo === EffectBonusToEnum.PiercingWeapons)
      suffix = "piercing";
    else if (effect.bonusTo === EffectBonusToEnum.MissileWeapons)
      suffix = "missile";
    if (suffix) suffix = ` vs. ${suffix} attacks`;
    results.push(`${this.getSignedNumber(effect.value)} AC${suffix}`);
    return results;
  }

  private getInvisibility(effect: InvisibilityEffect): string[] {
    const results: string[] = [];
    if (effect.type === InvisibilityTypeEnum.Improved)
      results.push("Improved invisibility");
    else results.push(`Invisibility`);
    return results;
  }

  private getRegeneration(effect: RegenerationEffect): string[] {
    if (
      [
        RegenerationTypeEnum.AmountHPperSecond,
        RegenerationTypeEnum.AmountHPperSecondBis,
      ].includes(effect.type)
    )
      return [`Regeneration: ${effect.amount} hp/second`];
    else if (effect.type === RegenerationTypeEnum.AmountHPpercentagePerSecond)
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
    if (effect.type === PoisonTypeEnum.AmountDamagePerSecond)
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

  getStatisticText(effect: Effect) {
    const opcodes = [
      { opcode: EffectTypeEnum.DexterityBonus, label: "Dexterity" },
      { opcode: EffectTypeEnum.IntelligenceBonus, label: "Intelligence" },
      { opcode: EffectTypeEnum.StrengthBonus, label: "Strength" },
      { opcode: EffectTypeEnum.ConstitutionBonus, label: "Constitution" },
      {
        opcode: EffectTypeEnum.SlashingResistanceModifier,
        label: "Slashing Resistance",
      },
      {
        opcode: EffectTypeEnum.CrushingResistanceModifier,
        label: "Crushing Resistance",
      },
      {
        opcode: EffectTypeEnum.PiercingResistanceModifier,
        label: "Piercing Resistance",
      },
      {
        opcode: EffectTypeEnum.MissilesResistanceModifier,
        label: "Missiles Resistance",
      },
      {
        opcode: EffectTypeEnum.FireResistanceModifier,
        label: "Fire Resistance",
      },
      {
        opcode: EffectTypeEnum.ColdResistanceModifier,
        label: "Cold Resistance",
      },
      {
        opcode: EffectTypeEnum.MagicResistanceModifier,
        label: "Magic Resistance",
      },
      {
        opcode: EffectTypeEnum.MagicalColdResistanceModifier,
        label: "Magical Cold Resistance",
      },
      {
        opcode: EffectTypeEnum.MagicalFireResistanceModifier,
        label: "Magical Fire Resistance",
      },
      {
        opcode: EffectTypeEnum.AcidResistanceModifier,
        label: "Acid Resistance",
      },
      {
        opcode: EffectTypeEnum.ElectricityResistanceModifier,
        label: "Electricity Resistance",
      },
      {
        opcode: EffectTypeEnum.MagicDamageResistanceModifier,
        label: "Magic Damage Resistance",
      },
      { opcode: EffectTypeEnum.MaximumHPModifier, label: "Maximum HP" },
      { opcode: EffectTypeEnum.MoraleModifier, label: "Morale" },
      { opcode: EffectTypeEnum.MoraleBreakModifier, label: "Morale Break" },
      { opcode: EffectTypeEnum.FatigueBonus, label: "Fatigue Bonus" },
      {
        opcode: EffectTypeEnum.AllSavingThrowsBonus,
        label: "All Saving Throws",
      },
      { opcode: EffectTypeEnum.SaveVsBreathModifier, label: "Save vs Breath" },
      { opcode: EffectTypeEnum.SaveVsDeathModifier, label: "Save vs Death" },
      {
        opcode: EffectTypeEnum.SaveVsPetrificationModifier,
        label: "Save vs Petrification",
      },
      { opcode: EffectTypeEnum.SaveVsSpellModifier, label: "Save vs Spell" },
      { opcode: EffectTypeEnum.SaveVsWandModifier, label: "Save vs Wand" },
    ];
    const opcode = opcodes.find((o) => o.opcode === effect.opcode);
    if (!opcode) return;
    const eff = effect as StatisticModifierEffect;
    return EffectTypeEnum[opcode.opcode].includes("Resistance")
      ? `${opcode.label}: ${eff.value}%`
      : `${opcode.label}: ${this.getSignedNumber(eff.value)}`;
  }
}

const descriptionService = new DescriptionService();
export default descriptionService;
