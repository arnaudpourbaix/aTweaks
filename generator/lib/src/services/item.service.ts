import figureSet from "figures";
import {
  AbilityDamageTypeEnum,
  ItemAbilityFlagEnum,
  ItemAbilityLocationEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  ItemAnimationEnum,
  ItemCategoryEnum,
  ItemFlagEnum,
  ProficiencyTypeEnum,
} from "../model/final/enums";
import { Item } from "../model/final/item";
import {
  RawAlterItem,
  RawCreateItem,
  RawItem,
  RawItemSlot,
} from "../model/raw/item";
import { EffectService } from "./effect.service";
import { UtilsService } from "./utils.service";

export class ItemService {
  static instance = new ItemService();

  private utils = UtilsService.instance;
  private effectService = EffectService.instance;

  mapItemSlots(
    itemSlots: RawItemSlot[] | undefined,
    items: RawItem[] | undefined
  ): RawItemSlot[] {
    const results: RawItemSlot[] = itemSlots ?? [];
    if (!items) return results;
    for (const item of items) {
      if (item.equippedSlot) {
        results.push({ file: item.file, slot: item.equippedSlot });
      }
    }
    return results;
  }

  mapItems(items: RawItem[] | undefined): Item[] {
    if (!items) return [];
    const results: Item[] = items.map((i) => {
      const item =
        "copyFrom" in i ? this.mapAlterItem(i) : this.mapCreateItem(i);
      if (!!item.diceSize && !item.speed) {
        item.speed = 3;
        console.log(
          `${figureSet.warning} default speed of ${item.speed} from item ${item.file}.`
        );
      }
      return item;
    });
    return results;
  }

  private mapAlterItem(item: RawAlterItem): Item {
    return {
      ...item,
      equippedSlot: this.utils.getItemSlots(item.equippedSlot),
      immunities: item.immunities ?? [],
      diceSize: item.diceSize ?? 0,
      diceThrown: item.diceThrown ?? 0,
      damageBonus: item.damageBonus,
      bonusToHit: item.bonusToHit,
      speed: item.speed ?? 0,
      type: item.type ? ItemAbilityTypeEnum[item.type] : undefined,
      range: item.range,
      projectile: item.projectile,
      flags: item.flags ? item.flags.map((f) => ItemFlagEnum[f]) : undefined,
      animation: item.animation ? ItemAnimationEnum[item.animation] : undefined,
      category: item.category ? ItemCategoryEnum[item.category] : undefined,
      proficiency: item.proficiency
        ? ProficiencyTypeEnum[item.proficiency]
        : undefined,
      location: item.location
        ? ItemAbilityLocationEnum[item.location]
        : undefined,
      target: item.target ? ItemAbilityTargetEnum[item.target] : undefined,
      damageType: item.damageType
        ? AbilityDamageTypeEnum[item.damageType]
        : undefined,
      abilityflags: item.abilityFlags
        ? item.abilityFlags.map((f) => ItemAbilityFlagEnum[f])
        : undefined,
      effects: item.effects ? this.effectService.getEffects(item.effects) : [],
    };
  }

  private mapCreateItem(item: RawCreateItem): Item {
    const result: Item = {
      file: item.file,
      stringRef: item.stringRef,
      description: item.description,
      equippedSlot: this.utils.getItemSlots(item.equippedSlot),
      icon: item.icon,
      weight: item.weight,
      immunities: item.immunities ?? [],
      flags: item.flags ? item.flags.map((f) => ItemFlagEnum[f]) : undefined,
      animation: item.animation ? ItemAnimationEnum[item.animation] : undefined,
      category: item.category ? ItemCategoryEnum[item.category] : undefined,
      proficiency: item.proficiency
        ? ProficiencyTypeEnum[item.proficiency]
        : undefined,
      abilityflags: item.abilityFlags
        ? item.abilityFlags.map((f) => ItemAbilityFlagEnum[f])
        : undefined,
      effects: item.effects ? this.effectService.getEffects(item.effects) : [],
    };
    if (item.type) {
      result.type = item.type ? ItemAbilityTypeEnum[item.type] : undefined;
      result.range = item.range;
      result.projectile = item.projectile;
      result.diceSize = item.diceSize ?? 0;
      result.diceThrown = item.diceThrown ?? 0;
      result.speed = item.speed ?? 0;
      result.damageBonus = item.damageBonus;
      result.bonusToHit = item.bonusToHit;
      result.animationSwing = item.animationSwing;
      result.enchantment = item.enchantment;
      result.location = item.location
        ? ItemAbilityLocationEnum[item.location]
        : ItemAbilityLocationEnum.Weapon;
      result.target = item.target
        ? ItemAbilityTargetEnum[item.target]
        : ItemAbilityTargetEnum.LivingActor;
      result.damageType = item.damageType
        ? AbilityDamageTypeEnum[item.damageType]
        : AbilityDamageTypeEnum.None;
    }
    return result;
  }
}
