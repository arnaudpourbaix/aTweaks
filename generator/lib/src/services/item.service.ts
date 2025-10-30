import { EquippedItem, ItemSlot, WEAPON_SLOTS } from "../model/creature/item";
import {
  AbilityDamageTypeEnum,
  ItemAbilityLocationEnum,
  ItemAbilityTargetEnum,
} from "../model/spell-item/effect.enums";
import { Item, PartialItem } from "../model/spell-item/spell-item";
import effectService from "./effects/effect.service";

class ItemService {
  getItem(item: PartialItem, file: string): Item {
    const result: Item = {
      file,
      doc: item.doc ?? true,
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
      result.equippedSlot = this.getItemSlots(result.equippedSlot);
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

  getItemSlots(slot: ItemSlot | ItemSlot[] | undefined): ItemSlot[] {
    const results: ItemSlot[] = Array.isArray(slot) ? slot : [];
    if (typeof slot === "string") results.push(slot);
    return results;
  }

  isSlotIncluded(
    itemSlots: EquippedItem[],
    includedSlot: ItemSlot | ItemSlot[]
  ): boolean {
    if (Array.isArray(includedSlot)) return false;
    const list = itemSlots.map((i) => this.getItemSlots(i.slot)).flat(1);
    return list.includes(includedSlot);
  }

  isEquippedWeapon(item: EquippedItem): boolean {
    if (Array.isArray(item.slot) && item.slot.length !== 1) return false;
    const slot = Array.isArray(item.slot) ? item.slot[0] : item.slot;
    return WEAPON_SLOTS.map((s) => s.slot).includes(slot);
  }
}

const itemService = new ItemService();
export default itemService;
