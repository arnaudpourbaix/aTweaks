class PoisonService {
  getEffects(effect: PoisonTypeEffectGroup): Effect[] {
    const poison = POISONS.find(
      (p) => p.type === effect.poisonType
    ) as PoisonModel;
    const effects: Effect[] = [];
    if (poison.saveDamage) {
      effects.push(this.getSaveEffect(poison));
    }
    if (poison.duration === poisonImmediateDeathDuration)
      effects.push(...this.getImmediateDeathEffects(effect, poison));
    else effects.push(...this.getTimeEffects(poison, effect));
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

  getImmediateDeathEffects(
    effect: RawPoisonTypeEffectGroup,
    poison: PoisonModel
  ): Effect[] {
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
        opcode: "Poison",
        icon: "Poisoned",
        ...this.getEffect({
          label: "death",
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
  ): Effect[] {
    return [
      {
        opcode: "Poison",
        icon: "Poisoned",
        ...this.getEffect({
          label: "normal",
          damage: poison.damage - poison.saveDamage,
          duration: poison.duration,
        }),
        timing: "InstantLimited",
        saveTypes: ["ParalyzePoisonDeath"],
        saveBonus: effect.saveBonus,
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
    type: RawPoisonType;
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
    type: RawPoisonType;
    amount: number;
    duration: number;
  } {
    const type: RawPoisonType = "OneDamagePerAmountSecond";
    const amount = Math.floor(duration / damage);
    let newDuration = duration;
    while (damage > newDuration / amount) newDuration++;
    const total = newDuration / amount;
    console.log(
      `poison (${label}) => ${damage}/${duration} ==> ${type}: ${amount}/${newDuration} (total=${total}, diff duration=${
        newDuration - duration
      })`
    );
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
    type: RawPoisonType;
    amount: number;
    duration: number;
  } {
    const type: RawPoisonType = "AmountDamagePerSecond";
    const amount = Math.floor(damage / duration);
    let newDuration = duration;
    while (damage > amount * newDuration) newDuration++;
    const total = amount * newDuration;
    console.log(
      `poison (${label}) => ${damage}/${duration} ==> ${type}: ${amount}/${newDuration} (total=${total}, diff duration=${
        newDuration - duration
      })`
    );
    return {
      type,
      amount,
      duration: newDuration,
    };
  }
}

const poisonService = new PoisonService();
export default poisonService;
