import {
  AbilityDamageTypeEnum,
  ItemAbilityLocationEnum,
  ItemAbilityTargetEnum,
} from "../model/spell-item/effect.enums";
import { Item, PartialItem } from "../model/spell-item/spell-item";
import effectService from "./effect.service";
import utils from "./utils.service";

class ItemService {
  getItem(item: PartialItem, file: string): Item {
    const result: Item = {
      file,
      copyFrom: item.copyFrom,
      stringRef: item.stringRef,
      description: item.description,
      immunities: item.immunities ?? [],
      enchantment: item.enchantment,
      animation: item.animation,
      category: item.category,
      proficiency: item.proficiency,
      icon: item.icon,
      flags: item.flags,
      effects: item.effects ?? [],
      equippedSlot: item.equippedSlot ?? [],
    };
    if (item.header) result.header = { effects: [], ...item.header };
    if (result.equippedSlot)
      result.equippedSlot = utils.getItemSlots(result.equippedSlot);
    if (result.header && !result.header.diceSize) result.header.diceSize = 0;
    if (result.header && !result.header.diceThrown)
      result.header.diceThrown = 0;
    if (result.header && !result.header.speed) result.header.speed = 0;
    if (
      result.header &&
      result.header.location === undefined &&
      !result.copyFrom
    )
      result.header.location = ItemAbilityLocationEnum.Weapon;
    if (result.header && result.header.target === undefined && !result.copyFrom)
      result.header.target = ItemAbilityTargetEnum.LivingActor;
    if (
      result.header &&
      result.header.damageType === undefined &&
      !result.copyFrom
    )
      result.header.damageType = AbilityDamageTypeEnum.None;
    result.effects = effectService.getEffects(result.effects, { file });
    if (result.header?.effects)
      result.header.effects = effectService.getEffects(result.header.effects, {
        file,
      });
    return result;
  }
}

const itemService = new ItemService();
export default itemService;
