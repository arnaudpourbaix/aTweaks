import deepmerge from "deepmerge";
import figureSet from "figures";
import { MonsterEnum, MonsterFamilyEnum } from "../../creatures/monster";
import { TranslationKey } from "../../translations/i18n";
import { CreatureAdditionalData } from "../model/creature/additional-data";
import { CreatureAttack, CreatureAttackAction } from "../model/creature/attack";
import { CreatureBehavior } from "../model/creature/behavior";
import { Creature } from "../model/creature/creature";
import { CreatureData } from "../model/creature/data";
import { BaseEffect } from "../model/spell-item/effect";
import {
  EffectCastSpellTypeEnum,
  EffectTargetEnum,
} from "../model/spell-item/effect.enums";
import { EffectTypeEnum } from "../model/spell-item/effect.type";
import {
  Item,
  PartialItem,
  PartialSpell,
  PartialWeapon,
  Spell,
  Weapon,
  WeaponCastSpell,
} from "../model/spell-item/spell-item";
import { WithRequired } from "../model/utility-types";
import itemService from "../services/item.service";
import { getFilename } from "../services/misc.func";
import spellService from "../services/spell.service";
import { CreatureGrabConfig } from "../model/creature/grab";
import chalk from "chalk";
import translationService from "../services/translation.service";
import { ItemSlot } from "../model/creature/item";
import grabService from "../services/grab.service";
import effectService from "../services/effect.service";

class CreatureFactory {
  create(p: {
    name: TranslationKey;
    monster: MonsterEnum;
    family: MonsterFamilyEnum;
    files: string[];
    data: CreatureData;
  }): Creature {
    const cre = new Creature();
    cre.name = p.name;
    cre.monster = p.monster;
    cre.family = p.family;
    cre.files = p.files;
    cre.data = p.data;
    cre.additionalData = {
      removeScripts: [],
      proficiencies: [],
      removeItems: [],
      equippedItems: [],
      immunities: [],
      removeKnownSpells: true,
      removeMemorizedSpells: true,
      memorizedSpells: [],
      deleteEffectOpcodes: [],
      removeEffects: true,
      effects: [],
    };
    console.log(
      chalk.bold(`\nCreating ${translationService.fromKey(cre.name)}...`)
    );
    return cre;
  }

  setAdditionalData(
    cre: Creature,
    additionalData: Partial<CreatureAdditionalData>
  ) {
    cre.additionalData = deepmerge(cre.additionalData, additionalData);
  }

  setBehavior(cre: Creature, behavior: Partial<CreatureBehavior>) {
    cre.behavior = {
      dialog: [],
      help: true,
      tracking: true,
      walk: false,
      combatWalk: true,
      restHeal: false,
      usePotions: false,
      useKitAbilities: false,
      hideInShadows: false,
      canPolymorph: false,
      abilities: [],
      customCode: [],
      additionalCode: [],
      ...behavior,
    };
  }

  setAttack(cre: Creature, attack: Partial<CreatureAttack>) {
    const defaultAction: CreatureAttackAction = {
      disableInterrupt: false,
      responseWeight: 100,
    };
    const actions: CreatureAttackAction[] = (attack.actions ?? []).map((a) => ({
      responseWeight: a.responseWeight ?? defaultAction.responseWeight,
      disableInterrupt: a.disableInterrupt ?? defaultAction.disableInterrupt,
      weaponSlot: a.weaponSlot,
    }));
    //TODO:
    // const result: CreatureAttack = {
    //   grab: cre.attack.grab
    //     ? { ...GRAB_DEFAULT_CONFIG, ...cre.attack.grab }
    //     : undefined,
    //   targetPriorities: targetService.getTargetPriorities(cre),
    //   targetStatusWeaponSlot: cre.attack.targetStatusWeaponSlot ?? [],
    // };

    cre.attack = {
      actions: actions.length ? actions : [defaultAction],
      dualWielding: attack.dualWielding ?? false,
      melee: attack.melee ?? true,
      ranged: attack.ranged ?? false,
      targetPriorities: [],
      targetStatusWeaponSlot: attack.targetStatusWeaponSlot ?? [],
    };
  }

  addSpell(cre: Creature, spell: PartialSpell): Spell {
    const file = getFilename(cre.spells.length + 1, cre.monster);
    if (spell.memorizedCount) {
      cre.additionalData.memorizedSpells.push({
        file,
        memorizedCount: spell.memorizedCount,
      });
    }
    const result = spellService.getSpell(spell, file);
    cre.spells.push(result);
    return result;
  }

  addItem(cre: Creature, item: PartialItem) {
    const file = getFilename(cre.items.length + 1, cre.monster);
    if (item.equippedSlot) {
      cre.additionalData.equippedItems.push({ file, slot: item.equippedSlot });
    }
    const result = itemService.getItem(item, file);
    cre.items.push(result);
    return result;
  }

  addWeapon({
    cre,
    weapon,
    grab,
    castSpell,
  }: {
    cre: Creature;
    weapon: PartialWeapon;
    grab?: CreatureGrabConfig;
    castSpell?: WeaponCastSpell;
  }) {
    const file = getFilename(cre.items.length + 1, cre.monster);
    if (weapon.equippedSlot)
      this.equipItem(cre, cre.additionalData, file, weapon.equippedSlot);
    if (!weapon.header.speed) {
      weapon.header.speed = 3;
      console.log(
        `${figureSet.warning} default speed of ${weapon.header.speed} from item ${file}.`
      );
    }
    const result = itemService.getItem(weapon, file) as Weapon;
    if (castSpell) this.attachSpellToWeapon(cre, result, castSpell);
    if (grab) grabService.attachGrabToWeapon(cre, result, grab);
    cre.items.push(result);
    return result;
  }

  attachSpellToWeapon(cre: Creature, item: Weapon, cast: WeaponCastSpell) {
    const spell = this.addSpell(cre, cast.spell);
    const baseEffect: WithRequired<Omit<BaseEffect, "opcode">, "resource"> = {
      resource: spell.file,
      probability1: cast.probability1,
      probability2: cast.probability2,
      saveTypes: cast.saveTypes,
      saveBonus: cast.saveBonus,
    };
    item.header.effects.push(
      effectService.getEffect({
        opcode: EffectTypeEnum.CastSpell,
        type: EffectCastSpellTypeEnum.CastInstantlyAtCasterLevel,
        ...baseEffect,
      })
    );
    if (cast.remove) {
      item.header.effects.push(
        effectService.getEffect({
          opcode: EffectTypeEnum.RemoveSpell,
          target: EffectTargetEnum.Self,
          ...baseEffect,
        })
      );
    }
  }

  equipItem(
    cre: Creature,
    data: CreatureAdditionalData,
    file: string,
    slots: ItemSlot[]
  ) {
    const equippedItem = data.equippedItems.find(
      (e) => slots.length === 1 && e.slot[0] === slots[0]
    );
    const item = cre.items.find((i) => i.file === equippedItem?.file);
    if (equippedItem && item) {
      console.log(
        `${figureSet.warning} Slot ${equippedItem.slot} is already attributed to ${item.stringRef}.`
      );
    }
    data.equippedItems.push({
      file,
      slot: slots,
    });
  }
}

const creatureFactory = new CreatureFactory();
export default creatureFactory;
