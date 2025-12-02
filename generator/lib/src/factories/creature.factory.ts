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
import {
  BEHAVIOR_DEFAULT,
  CreatureBehavior,
  PartialCreatureBehavior,
} from "../model/creature/behavior";
import {
  Creature,
  CreatureAdjustment,
  CreatureAutoGenerate,
  CreatureNewFile,
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
  EffectTimingEnum,
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
import abilityService from "../services/baf/ability.service";
import creatureService from "../services/creature.service";
import descriptionService from "../services/description.service";
import effectService from "../services/effects/effect.service";
import grabService from "../services/effects/grab.service";
import immunityService from "../services/effects/immunity.service";
import itemService from "../services/item.service";
import spellService from "../services/spell.service";
import targetService from "../services/target.service";
import translationService from "../services/translation.service";
import { getFilename } from "../services/utils/misc.func";
import { State } from "../state";

class CreatureFactory {
  create(p: {
    name: TranslationKey;
    monster: MonsterEnum;
    family: MonsterFamilyEnum;
    id?: number;
    files: string[];
    newFiles?: CreatureNewFile[];
    data: Omit<CreatureData, "movement">;
    autoGenerate?: CreatureAutoGenerate;
  }): Creature {
    console.log(chalk.bold(`\nCreating ${translationService.from(p.name)}...`));
    const cre = new Creature();
    cre.name = p.name;
    cre.monster = p.monster;
    cre.family = p.family;
    cre.id = p.id;
    cre.files = p.files;
    cre.newFiles = p.newFiles ?? [];
    cre.data = p.data;
    cre.additionalData = structuredClone(ADDITIONAL_DATA_DEFAULT);
    if (p.autoGenerate) {
      cre.autoGenerate = { ...cre.autoGenerate, ...p.autoGenerate };
      console.log("autogenerate", cre.autoGenerate);
    }
    return cre;
  }

  createFrom(p: {
    name: TranslationKey;
    from: Creature;
    monster: MonsterEnum;
    id?: number;
    files: string[];
  }): Creature {
    const cre = structuredClone(p.from);
    Object.setPrototypeOf(cre, p.from);
    cre.monster = p.monster;
    cre.name = p.name;
    cre.id = p.id;
    cre.files = p.files;
    cre.newFiles = [];
    cre.items = [];
    cre.spells = [];
    cre.effectFiles = [];
    cre.projectiles = [];
    cre.valid = undefined;
    console.log(
      chalk.bold(
        `\nCreating ${translationService.from(
          cre.name
        )} from ${translationService.from(p.from.name)}...`
      )
    );
    return cre;
  }

  setData(cre: Creature, data: Partial<CreatureData>) {
    this.checkValidation(cre);
    cre.data = deepmerge(cre.data, data);
    if (!data.level1) return;
    if (data.thac0 === undefined) cre.data.thac0 = undefined;
    if (data.hp === undefined) cre.data.hp = undefined;
    if (data.saveBreath === undefined) cre.data.saveBreath = undefined;
    if (data.saveDeath === undefined) cre.data.saveDeath = undefined;
    if (data.savePolymorph === undefined) cre.data.savePolymorph = undefined;
    if (data.saveSpell === undefined) cre.data.saveSpell = undefined;
    if (data.saveWand === undefined) cre.data.saveWand = undefined;
  }

  setAdditionalData(
    cre: Creature,
    additionalData: AtLeast<
      WithRequired<CreatureAdditionalData, "movement">,
      "movement"
    >
  ) {
    this.checkValidation(cre);
    const current: CreatureAdditionalData = deepmerge(
      ADDITIONAL_DATA_DEFAULT,
      cre.additionalData
    );
    cre.additionalData = deepmerge(current, additionalData);
  }

  setAdjustments(cre: Creature, adjustments: PartialCreatureAdjustment[]) {
    this.checkValidation(cre);
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

  addSpell(cre: Creature, spell: PartialSpell, file?: string): Spell {
    this.checkValidation(cre);
    file ??= getFilename(cre.spells.length + 1, cre.monster);
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

  addItem(cre: Creature, item: PartialItem): Item {
    this.checkValidation(cre);
    const file = getFilename(cre.items.length + 1, cre.monster);
    if (item.equippedSlot) {
      cre.additionalData.equippedItems.push({ file, slot: item.equippedSlot });
    }
    const result = itemService.getItem(item, file);
    cre.items.push(result);
    return result;
  }

  addExistingItem(cre: Creature, item: Item): void {
    this.checkValidation(cre);
    if (!item.equippedSlot)
      throw new Error(`No slot defined for ${item.stringRef}`);
    cre.additionalData.equippedItems.push({
      file: item.file,
      slot: item.equippedSlot,
    });
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
    this.checkValidation(cre);
    if (cre.attack) throw new Error("Add weapons before setting up attack");
    const file = getFilename(cre.items.length + 1, cre.monster);
    if (weapon.equippedSlot)
      this.equipItem(cre, cre.additionalData, file, weapon.equippedSlot);
    const result = itemService.getItem(weapon, file) as Weapon;
    if (castSpell) this.attachSpellToWeapon(cre, result, castSpell);
    if (grab) grabService.attachGrabToWeapon(cre, result, grab);
    cre.items.push(result);
    return result;
  }

  attachSpellToWeapon(cre: Creature, item: Weapon, cast: WeaponCastSpell) {
    this.checkValidation(cre);
    const spell = this.addSpell(cre, cast.spell);
    spell.doc = false;
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
    this.checkValidation(cre);
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

  addTrait(
    cre: Creature,
    {
      description,
      immunities,
      effects,
    }: {
      description?: StringReference;
      immunities?: ImmunityName[];
      effects?: Effect[];
    }
  ): Item {
    this.checkValidation(cre);
    const stringRef = translationService.addCustomTranslation([
      `${translationService.from(cre.name)} ${translationService.from(
        "common.creatureTraits"
      )}`,
    ]);
    const item = this.addItem(cre, {
      stringRef,
      description,
      effects: (effects ?? []).map(
        (e) =>
          ({
            ...e,
            timing: EffectTimingEnum.InstantWhileEquipped,
            target: EffectTargetEnum.Self,
          } as Effect)
      ),
      immunities,
      equippedSlot: JEWEL_SLOTS,
      category: ItemCategoryEnum.Rings,
      icon: MonsterItemIconEnum.Traits,
    });
    item.trait = true;
    return item;
  }

  setBehavior(cre: Creature, behavior: PartialCreatureBehavior) {
    this.checkValidation(cre);
    const current: CreatureBehavior =
      cre.behavior ?? structuredClone(BEHAVIOR_DEFAULT);
    const { abilities, customCodes, additionalCodes, dialog, ...others } =
      behavior;
    cre.behavior = {
      ...current,
      ...others,
    };
    cre.behavior.abilities.push(
      ...abilityService.getAbilities(behavior.abilities)
    );
    cre.behavior.customCodes.push(
      ...abilityService.getCustomCodes(behavior.customCodes)
    );
    cre.behavior.additionalCodes.push(...(behavior.additionalCodes ?? []));
    cre.behavior.dialog.push(...(behavior.dialog ?? []));
  }

  setAttack(cre: Creature, attack: PartialCreatureAttack) {
    this.checkValidation(cre);
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
      targetPriorities: targetService.getTargetPriorities(cre, attack),
      targetStatusWeaponSlot: attack.targetStatusWeaponSlot ?? [],
      selectWeapons: attack.selectWeapons ?? [],
    };
  }

  checkValidation(creature: Creature) {
    if (creature.valid !== undefined)
      throw new Error(
        `Creature ${translationService.from(
          creature.name
        )} has already been validated`
      );
  }

  validate(creature: Creature, family: MonsterFamilyEnum) {
    let valid = true;
    if (State.creatures.some((c) => c.monster === creature.monster)) {
      throw new Error(
        `Monster '${MonsterEnum[creature.monster]}' already declared`
      );
    }
    if (creature.family !== family) {
      console.log(
        `${figureSet.warning} Family doesn't match: ${creature.family} <-> ${family}`
      );
      valid = false;
    }
    if (!creature.files.length) {
      console.log(`${figureSet.warning} No files defined`);
      valid = false;
    }
    const existingFiles = creature.files.filter((f) =>
      State.creatures.some((c) => c.files.includes(f))
    );
    if (existingFiles.length) {
      console.log(
        `${
          figureSet.warning
        } Those files are already declared in other creatures: ${existingFiles.join(
          ", "
        )}`
      );
      valid = false;
    }
    if (!creature.additionalData) {
      console.log(`${figureSet.warning} No additional data defined`);
      valid = false;
    }
    if (!creature.attack) {
      console.log(`${figureSet.warning} No attack defined, using defaults`);
      this.setAttack(creature, {});
    }
    if (!creature.behavior) {
      console.log(`${figureSet.warning} No behavior defined, using defaults`);
      this.setBehavior(creature, {});
    }
    creature.valid = valid;
    if (valid) State.creatures.push(creature);
    creatureService.check(creature);
    immunityService.handleImmunities(creature);
    creatureService.checkWeapons(creature);
    descriptionService.generateCreatureSpells(creature.spells);
    descriptionService.generateCreatureItems(creature.items);
  }
}

const creatureFactory = new CreatureFactory();
export default creatureFactory;
