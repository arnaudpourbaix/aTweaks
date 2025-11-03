import chalk from "chalk";
import deepmerge from "deepmerge";
import figureSet from "figures";
import { MonsterItemIconEnum } from "../../config/item";
import { MonsterEnum, MonsterFamilyEnum } from "../../creatures/monster";
import { TranslationKey } from "../../translations/i18n";
import {
  ADDITIONAL_DATA_DEFAULT,
  ADJUSTMENT_ADDITIONAL_DATA_DEFAULT,
  CreatureAdditionalData,
} from "../model/creature/additional-data";
import {
  CreatureAttackAction,
  PartialCreatureAttack,
} from "../model/creature/attack";
import { PartialCreatureBehavior } from "../model/creature/behavior";
import {
  Creature,
  CreatureAdjustment,
  PartialCreatureAdjustment,
} from "../model/creature/creature";
import { CreatureData } from "../model/creature/data";
import { CreatureGrabConfig } from "../model/creature/grab";
import { ItemSlot, JEWEL_SLOTS } from "../model/creature/item";
import { ImmunityName } from "../model/final/immunity";
import { StringReference } from "../model/final/stringref";
import { BaseEffect, Effect } from "../model/spell-item/effect";
import {
  EffectCastSpellTypeEnum,
  EffectTargetEnum,
  ItemCategoryEnum,
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
import { AtLeast, WithRequired } from "../model/utility-types";
import effectService from "../services/effects/effect.service";
import grabService from "../services/effects/grab.service";
import itemService from "../services/item.service";
import spellService from "../services/spell.service";
import targetService from "../services/target.service";
import translationService from "../services/translation.service";
import { getFilename } from "../services/utils/misc.func";

class CreatureFactory {
  create(p: {
    name: TranslationKey;
    monster: MonsterEnum;
    family: MonsterFamilyEnum;
    files: string[];
    data: Omit<CreatureData, "movement">;
  }): Creature {
    const cre = new Creature();
    cre.name = p.name;
    cre.monster = p.monster;
    cre.family = p.family;
    cre.files = p.files;
    cre.data = p.data;
    cre.additionalData = ADDITIONAL_DATA_DEFAULT;
    console.log(
      chalk.bold(`\nCreating ${translationService.from(cre.name)}...`)
    );
    return cre;
  }

  setAdditionalData(
    cre: Creature,
    additionalData: AtLeast<
      WithRequired<CreatureAdditionalData, "movement">,
      "movement"
    >
  ) {
    cre.additionalData = deepmerge(ADDITIONAL_DATA_DEFAULT, additionalData);
  }

  setAdjustments(cre: Creature, adjustments: PartialCreatureAdjustment[]) {
    for (const adjustment of adjustments) {
      const result: CreatureAdjustment = {
        ...adjustment,
        noWeapon: adjustment.noWeapon ?? false,
        summon: adjustment.summon ?? false,
        data: adjustment.data ?? {},
        additionalData: deepmerge(
          ADJUSTMENT_ADDITIONAL_DATA_DEFAULT,
          adjustment.additionalData ?? {}
        ),
      };
      cre.adjustments.push(result);
    }
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
    if (cre.attack) throw new Error("Add weapons before setting up attack");
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

  isValid(cre: Creature) {
    let valid = true;
    if (!cre.attack) {
      console.log(`${figureSet.warning} No attack defined`);
      valid = false;
    }
    if (!cre.additionalData) {
      console.log(`${figureSet.warning} No additional data defined`);
      valid = false;
    }
    if (!cre.behavior) {
      console.log(`${figureSet.warning} No behavior defined`);
      valid = false;
    }
    return valid;
  }

  createTraitItem(
    cre: Creature,
    {
      stringRef,
      description,
      immunities,
      effects,
    }: {
      stringRef: StringReference;
      description?: StringReference;
      immunities?: ImmunityName[];
      effects?: Effect[];
    }
  ): Item {
    // TODO:
    // const stringRef = `${name} traits`;
    // if (description) {
    //   description.unshift(stringRef, "");
    // }
    return this.addItem(cre, {
      stringRef,
      description,
      effects,
      immunities,
      equippedSlot: JEWEL_SLOTS,
      category: ItemCategoryEnum.Rings,
      icon: MonsterItemIconEnum.Traits,
    });
  }

  setBehavior(cre: Creature, behavior: PartialCreatureBehavior) {
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
      customCode: [],
      additionalCode: [],
      ...behavior,
      abilities: [],
    };
  }

  setAttack(cre: Creature, attack: PartialCreatureAttack) {
    const defaultAction: CreatureAttackAction = {
      disableInterrupt: false,
      responseWeight: 100,
    };
    const actions: CreatureAttackAction[] = (attack.actions ?? []).map((a) => ({
      responseWeight: a.responseWeight ?? defaultAction.responseWeight,
      disableInterrupt: a.disableInterrupt ?? defaultAction.disableInterrupt,
      weaponSlot: a.weaponSlot,
    }));

    cre.attack = {
      actions: actions.length ? actions : [defaultAction],
      melee: attack.melee ?? true,
      ranged: attack.ranged ?? false,
      dualWielding: false,
      targetPriorities: targetService.getTargetPriorities(cre),
      targetStatusWeaponSlot: attack.targetStatusWeaponSlot ?? [],
      selectWeapons: attack.selectWeapons ?? [],
    };
  }
}

const creatureFactory = new CreatureFactory();
export default creatureFactory;
