import {
  poisonImmediateDeathDuration,
  PoisonModel,
  POISONS,
} from "../../config/poison";
import {
  RawBaseEffect,
  RawEffect,
  RawPoisonTypeEffectGroup,
} from "../model/raw/effect";
import { RawPoisonType } from "../model/raw/enum";

export class PoisonService {
  static instance = new PoisonService();

  getEffects(effect: RawPoisonTypeEffectGroup): RawEffect[] {
    const poison = POISONS.find(
      (p) => p.type === effect.poisonType
    ) as PoisonModel;
    const effects: RawEffect[] = [];
    if (poison.saveDamage) {
      effects.push(this.getSaveEffect(poison));
    }
    if (poison.duration === poisonImmediateDeathDuration)
      effects.push(...this.getImmediateDeathEffects(effect));
    else effects.push(...this.getTimeEffects(poison, effect));
    return effects;
  }

  getSaveEffect(poison: PoisonModel): RawEffect {
    return {
      opcode: "Poison",
      icon: "Poisoned",
      ...this.getEffect({
        damage: poison.saveDamage,
        duration: poison.duration,
      }),
      timing: "InstantLimited",
    };
  }

  getImmediateDeathEffects(effect: RawPoisonTypeEffectGroup): RawEffect[] {
    const levels = [
      { min: 1, max: 2 },
      { min: 3, max: 4 },
      { min: 5, max: 6 },
      { min: 7, max: 8 },
      { min: 9, max: 10 },
      { min: 11, max: 15 },
      { min: 16, max: 40 },
    ];
    return levels.map((level) => {
      const maxHP =
        12 * Math.min(level.max, 9) +
        3 * Math.max(level.max - 9, 0) +
        5 * Math.min(level.max, 9);
      return {
        opcode: "Poison",
        icon: "Poisoned",
        ...this.getEffect({
          damage: maxHP,
          duration: poisonImmediateDeathDuration,
        }),
        diceSize: level.min,
        diceThrown: level.max,
        timing: "InstantLimited",
        saveTypes: ["ParalyzePoisonDeath"],
        saveBonus: effect.saveBonus,
      };
    });
  }

  getTimeEffects(
    poison: PoisonModel,
    effect: RawPoisonTypeEffectGroup
  ): RawEffect[] {
    return [
      {
        opcode: "Poison",
        icon: "Poisoned",
        ...this.getEffect({
          damage: poison.damage - poison.saveDamage,
          duration: poison.duration,
        }),
        timing: "InstantLimited",
        saveTypes: ["ParalyzePoisonDeath"],
        saveBonus: effect.saveBonus,
      },
    ];
  }

  getEffect({ damage, duration }: { damage: number; duration: number }): {
    type: RawPoisonType;
    amount: number;
    duration: number;
  } {
    const type: RawPoisonType =
      damage > duration ? "AmountDamagePerSecond" : "OneDamagePerAmountSecond";
    const amount =
      type === "OneDamagePerAmountSecond"
        ? Math.ceil(duration / damage)
        : Math.ceil(damage / duration);
    console.log(`poison => ${damage}/${duration} ==> ${type}: ${amount}`);
    return { type, amount, duration };
  }
}
