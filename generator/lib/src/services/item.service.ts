import { Creature } from "../model/creature/creature";
import {
  EquippedItem,
  ItemSlot,
  WEAPON_SLOTS,
  WeaponSlot,
} from "../model/creature/item";
import {
  AbilityDamageTypeEnum,
  EffectTargetEnum,
  EffectTimingEnum,
  ItemAbilityLocationEnum,
  ItemAbilityTargetEnum,
} from "../model/spell-item/effect.enums";
import { PartialProjectile } from "../model/spell-item/projectile";
import {
  Item,
  ItemHeader,
  PartialItem,
  PartialItemHeader,
} from "../model/spell-item/spell-item";
import { State } from "../state";
import effectService from "./effects/effect.service";

class ItemService {
  getItem(item: PartialItem, file: string): Item {
    const result: Item = {
      file,
      id: item.id,
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
      projectiles: [],
      trait: false,
    };
    if (result.equippedSlot) {
      result.equippedSlot = this.getItemSlots(result.equippedSlot);
    }
    result.effects = effectService.getEffects(result.effects, {
      file,
      base: {
        target: EffectTargetEnum.Self,
        timing: EffectTimingEnum.InstantWhileEquipped,
      },
    });
    if (item.header) this.setHeader(result, item.header, file);
    State.items.push(result);
    return result;
  }

  setHeader(result: Item, header: PartialItemHeader, file: string): Item {
    result.header = { effects: [], ...header };
    if (!result.header.diceSize) result.header.diceSize = 0;
    if (!result.header.diceThrown) result.header.diceThrown = 0;
    if (!result.header.speed) result.header.speed = 0;
    if (result.header.location === undefined && !result.copyFrom)
      result.header.location = ItemAbilityLocationEnum.Weapon;
    if (result.header.target === undefined && !result.copyFrom)
      result.header.target = ItemAbilityTargetEnum.LivingActor;
    if (result.header.damageType === undefined && !result.copyFrom)
      result.header.damageType = AbilityDamageTypeEnum.None;
    result.effects = effectService.getEffects(result.effects, { file });
    if (result.header.effects)
      result.header.effects = effectService.getEffects(result.header.effects, {
        file,
      });
    if (typeof header.projectile === "object") {
      this.addProjectile(result, result.header, header.projectile);
    }
    return result;
  }

  private addProjectile(
    item: Item,
    header: ItemHeader,
    projectile: PartialProjectile
  ) {
    if (!item.projectiles.some((p) => p.file === item.file)) {
      console.log(`adding projectile ${item.file} for item ${item.stringRef}`);
      item.projectiles.push({ file: item.file, ...projectile });
      header.projectile = item.file;
    }
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
    //TODO handle case where you have an array of WEAPON slots
    if (
      Array.isArray(item.slot) &&
      !item.slot.every((s) => WEAPON_SLOTS.map((w) => w.slot).includes(s)) &&
      item.slot.length !== 1
    )
      return false;
    const slot = Array.isArray(item.slot) ? item.slot[0] : item.slot;
    return WEAPON_SLOTS.map((s) => s.slot).includes(slot);
  }
}

const itemService = new ItemService();
export default itemService;
