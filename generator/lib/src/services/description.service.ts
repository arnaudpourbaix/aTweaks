import { IMMUNITIES } from "../../config/immunity-config";
import { Creature } from "../model/final/creature";
import { Effect } from "../model/final/effect";
import { EffectTypeEnum } from "../model/final/effect.type";
import {
  AbilityDamageTypeEnum,
  ItemAbilityTypeEnum,
  SaveTypeEnum,
} from "../model/final/enums";
import { Item } from "../model/final/item";
import {
  ArmorClassBonusEffect,
  DamageEffect,
  IdsEffect,
  PoisonEffect,
  RawEffect,
} from "../model/raw/effect";

export class DescriptionService {
  static instance = new DescriptionService();

  generate(creature: Creature): void {
    for (const item of creature.items) {
      if (!item.description) this.getItemDescription(creature, item);
    }
  }

  private getItemDescription(creature: Creature, item: Item) {
    const desc: string[] = [];
    const type = item.type === ItemAbilityTypeEnum.Melee ? "Melee" : "Ranged";
    if (item.bonusToHit) {
      desc.push(`THAC0: ${this.getSignedNumber(item.bonusToHit)}`);
    }
    const damage =
      item.diceThrown && item.diceSize
        ? `${item.diceThrown}D${item.diceSize}`
        : "";
    const damageBonus = item.damageBonus
      ? `${this.getSignedNumber(item.damageBonus)}`
      : "";
    if (damage || damageBonus) {
      desc.push(
        `${type} damage: ${damage}${damageBonus} (${
          AbilityDamageTypeEnum[item.damageType!]
        })`
      );
      if (item.speed !== undefined) {
        desc.push(`Speed Factor: ${item.speed}`);
      }
    }
    if (item.enchantment && item.enchantment > 0) {
      desc.push(`Enchantment: ${item.enchantment}`);
    }
    if (item.range) {
      desc.push(`Range: ${item.range} feet`);
    }
    desc.push(...this.getItemEffectsDescription(creature, item.effects));
    desc.push(...this.getImmunitiesDescription(creature, item));
    if (desc.length) desc.unshift("STATISTICS:", "");
    item.description = desc;
  }

  private getImmunitiesDescription(creature: Creature, item: Item): string[] {
    const results: string[] = [];
    for (const name of item.immunities) {
      const immunity = IMMUNITIES.find((i) => i.name === name);
      if (immunity) results.push(...immunity.description);
    }
    return results;
  }

  private getItemEffectsDescription(
    creature: Creature,
    effects: Effect[]
  ): string[] {
    const results: string[] = [];
    for (const effect of effects) {
      if (effect.opcode === EffectTypeEnum.CastSpell) {
        results.push(...this.getItemSpellDescription(creature, effect));
      } else {
        results.push(...this.getSpellEffectDescription(effect));
      }
    }
    return results;
  }

  private getItemSpellDescription(
    creature: Creature,
    effect: Effect
  ): string[] {
    const spell = creature.spells.find((s) => s.file === effect.resource);
    let text = `Cast spell ${spell ? spell.name : effect.resource}`;
    const condition = this.getSaveText(effect) ?? this.getProbability(effect);
    if (condition) text = `${text}${condition}`;
    const results: string[] = ["", text];
    if (spell && Array.isArray(spell.description)) {
      results.push(...spell.description);
    }
    return results;
  }

  private getSpellEffectDescription(effect: Effect): string[] {
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
    return `${rounds} rounds`;
  }

  private getArmorClassBonus(effect: ArmorClassBonusEffect): string[] {
    const results: string[] = [];
    results.push(
      `${this.getSignedNumber(effect.value)} AC (${effect.bonusTo})`
    );
    return results;
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

  private getDamage(effect: DamageEffect): string[] {
    const results: string[] = [];
    if (effect.diceSize && effect.diceThrown) {
      results.push(
        `${effect.type} damage: ${effect.diceThrown}D${effect.diceSize}`
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
    results.push(
      `Poison: deals ${text} for ${this.getDuration(
        effect.duration
      )}${this.getSaveText(effect)}.`
    );
    return results;
  }

  private getSignedNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return "";
    else if (value <= 0) return `${value}`;
    return `+${value}`;
  }
}
