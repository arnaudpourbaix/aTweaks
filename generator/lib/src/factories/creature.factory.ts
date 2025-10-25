import deepmerge from "deepmerge";
import figureSet from "figures";
import { MonsterEnum, MonsterFamilyEnum } from "../../creatures/monster";
import { CreatureAdditionalData } from "../model/creature/additional-data";
import { CreatureAttack, CreatureAttackAction } from "../model/creature/attack";
import { CreatureBehavior } from "../model/creature/behavior";
import { Creature } from "../model/creature/creature";
import { CreatureData } from "../model/creature/data";
import { BaseEffect } from "../model/spell-item/effect";
import {
  EffectCastSpellTypeEnum,
  EffectTargetEnum,
  ItemAbilityTypeEnum,
} from "../model/spell-item/effect.enums";
import { EffectTypeEnum } from "../model/spell-item/effect.type";
import {
  Item,
  ItemHeader,
  PartialItem,
  PartialSpell,
  PartialWeapon,
  Spell,
  WeaponCastSpell,
} from "../model/spell-item/spell-item";
import { WithRequired } from "../model/utility-types";
import itemService from "../services/item.service";
import { getFilename } from "../services/misc.func";
import spellService from "../services/spell.service";
import { TranslationKey } from "../translations/i18n";

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

  addWeapon(cre: Creature, weapon: PartialWeapon, castSpell?: WeaponCastSpell) {
    const file = getFilename(cre.items.length + 1, cre.monster);
    if (!weapon.header.speed) {
      weapon.header.speed = 3;
      console.log(
        `${figureSet.warning} default speed of ${weapon.header.speed} from item ${file}.`
      );
    }
    const result = this.addItem(cre, weapon);
    if (castSpell) {
      const spell = this.addSpell(cre, castSpell.spell);
      const baseEffect: WithRequired<Omit<BaseEffect, "opcode">, "resource"> = {
        resource: spell.file,
        probability1: castSpell.probability1,
        probability2: castSpell.probability2,
        saveTypes: castSpell.saveTypes,
        saveBonus: castSpell.saveBonus,
      };
      result.effects.push({
        opcode: EffectTypeEnum.CastSpell,
        type: EffectCastSpellTypeEnum.CastInstantlyAtCasterLevel,
        ...baseEffect,
      });
      if (castSpell.remove) {
        result.effects.push({
          opcode: EffectTypeEnum.RemoveSpell,
          target: EffectTargetEnum.Self,
          ...baseEffect,
        });
      }
    }
    cre.items.push(result);
    return result;
  }
}

const creatureFactory = new CreatureFactory();
export default creatureFactory;
