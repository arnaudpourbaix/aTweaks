import deepmerge from "deepmerge";
import figureSet from "figures";
import { MonsterItemIconEnum } from "../../config/item";
import { MonsterEnum, MonsterFamilyEnum } from "../../creatures/monster";
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
  PartialCreatureAdjustment,
} from "../model/creature/creature";
import { CreatureData } from "../model/creature/data";
import { ItemSlot, JEWEL_SLOTS } from "../model/creature/item";
import { ImmunityName } from "../model/final/immunity";
import { StringReference } from "../model/final/stringref";
import { Effect } from "../model/spell-item/effect";
import {
  EffectTargetEnum,
  EffectTimingEnum,
  ItemCategoryEnum,
} from "../model/spell-item/effect.enums";
import { Item } from "../model/spell-item/spell-item";
import { AtLeast, WithRequired } from "../model/utility-types";
import abilityService from "../services/baf/ability.service";
import targetService from "../services/baf/target.service";
import creatureService from "../services/creature.service";
import descriptionService from "../services/doc/description.service";
import immunityService from "../services/effects/immunity.service";
import translationService from "../services/translation.service";
import { State } from "../state";

class CreatureFactory {
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

  equipItem(cre: Creature, item: Item, slot?: ItemSlot[]): void {
    this.checkValidation(cre);
    slot ??= item.equippedSlot;
    if (!slot) throw new Error(`No slot defined for ${item.stringRef}`);
    const equippedItem = cre.additionalData.equippedItems.find(
      (e) => slot.length === 1 && e.slot[0] === slot[0]
    );
    const duplicate = cre.items.find((i) => i.file === equippedItem?.file);
    if (equippedItem && duplicate) {
      console.log(
        `${figureSet.warning} Slot ${equippedItem.slot} is already attributed to ${duplicate.stringRef}.`
      );
    }
    cre.additionalData.equippedItems.push({
      file: item.file,
      slot,
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
    const item = cre.addItem({
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
    if (State.creatures.some((c) => c.id === creature.id)) {
      throw new Error(`Monster '${MonsterEnum[creature.id]}' already declared`);
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
    if (valid) State.creatures.push(creature);
    creatureService.check(creature);
    immunityService.handleImmunities(creature);
    creatureService.checkWeapons(creature);
    descriptionService.generateCreatureSpells(creature.spells);
    descriptionService.generateCreatureItems(creature.items);
    creature.valid = valid;
  }
}

const creatureFactory = new CreatureFactory();
export default creatureFactory;
