import {
  poisonImmediateDeathDuration,
  PoisonModel,
  POISONS,
} from "../../../config/poison";
import { Effect } from "../../model/spell-item/effect";
import {
  EffectTimingEnum,
  PnPPoisonType,
  PoisonTypeEnum,
  PortraitIconEnum,
  SaveTypeEnum,
} from "../../model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../model/spell-item/effect.type";

class PoisonService {
  getEffects(payload: {
    poisonType: PnPPoisonType;
    saveBonus?: number;
  }): Effect[] {
    const poison = POISONS.find(
      (p) => p.type === payload.poisonType
    ) as PoisonModel;
    const effects: Effect[] = [];
    if (poison.saveDamage) {
      effects.push(this.getSaveEffect(poison));
    }
    if (poison.duration === poisonImmediateDeathDuration)
      effects.push(...this.getImmediateDeathEffects(poison, payload.saveBonus));
    else effects.push(...this.getTimeEffects(poison, payload.saveBonus));
    return effects;
  }

  getSaveEffect(poison: PoisonModel): Effect {
    return {
      opcode: EffectTypeEnum.Poison,
      icon: PortraitIconEnum.Poisoned,
      ...this.getEffect({
        label: "save",
        damage: poison.saveDamage,
        duration: poison.duration,
      }),
      timing: EffectTimingEnum.InstantLimited,
    };
  }

  getImmediateDeathEffects(poison: PoisonModel, saveBonus?: number): Effect[] {
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
        5 * Math.min(level.max, 9) -
        poison.saveDamage;
      return {
        opcode: EffectTypeEnum.Poison,
        icon: PortraitIconEnum.Poisoned,
        ...this.getEffect({
          label: "death",
          damage: maxHP,
          duration: poisonImmediateDeathDuration,
        }),
        diceSize: level.min,
        diceThrown: level.max,
        timing: EffectTimingEnum.InstantLimited,
        saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
        saveBonus,
      };
    });
  }

  getTimeEffects(poison: PoisonModel, saveBonus?: number): Effect[] {
    return [
      {
        opcode: EffectTypeEnum.Poison,
        icon: PortraitIconEnum.Poisoned,
        ...this.getEffect({
          label: "normal",
          damage: poison.damage - poison.saveDamage,
          duration: poison.duration,
        }),
        timing: EffectTimingEnum.InstantLimited,
        saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
        saveBonus,
      },
    ];
  }

  getEffect({
    label,
    damage,
    duration,
  }: {
    label: string;
    damage: number;
    duration: number;
  }): {
    type: PoisonTypeEnum;
    amount: number;
    duration: number;
  } {
    if (damage > duration)
      return this.getAmountDamagePerSecondEffect({ label, damage, duration });
    else
      return this.getOneDamagePerAmountSecondEffect({
        label,
        damage,
        duration,
      });
  }

  getOneDamagePerAmountSecondEffect({
    label,
    damage,
    duration,
  }: {
    label: string;
    damage: number;
    duration: number;
  }): {
    type: PoisonTypeEnum;
    amount: number;
    duration: number;
  } {
    const type = PoisonTypeEnum.OneDamagePerAmountSecond;
    const amount = Math.floor(duration / damage);
    let newDuration = duration;
    while (damage > newDuration / amount) newDuration++;
    const total = newDuration / amount;
    // console.log(
    //   `poison (1dmg/x seconds) (${label}) => ${damage}/${duration} ==> ${type}: ${amount}/${newDuration} (total=${total}, diff duration=${
    //     newDuration - duration
    //   })`
    // );
    return { type, amount, duration: newDuration };
  }

  getAmountDamagePerSecondEffect({
    label,
    damage,
    duration,
  }: {
    label: string;
    damage: number;
    duration: number;
  }): {
    type: PoisonTypeEnum;
    amount: number;
    duration: number;
  } {
    const type = PoisonTypeEnum.AmountDamagePerSecond;
    const amount = Math.floor(damage / duration);
    let newDuration = duration;
    while (damage > amount * newDuration) newDuration++;
    const total = amount * newDuration;
    // console.log(
    //   `poison (x dmg per second) (${label}) => ${damage}/${duration} ==> ${type}: ${amount}/${newDuration} (total=${total}, diff duration=${
    //     newDuration - duration
    //   })`
    // );
    return {
      type,
      amount,
      duration: newDuration,
    };
  }
}

const poisonService = new PoisonService();
export default poisonService;
