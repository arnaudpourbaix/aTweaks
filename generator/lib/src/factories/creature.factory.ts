import figureSet from "figures";
import { MonsterEnum, MonsterFamilyEnum } from "../../creatures/monster";
import {
  CreatureAdjustment,
  PartialCreatureAdjustment,
} from "../model/creature/adjustment";
import {
  BEHAVIOR_DEFAULT,
  CreatureBehavior,
  PartialCreatureBehavior,
} from "../model/creature/behavior";
import { BaseCreature, Creature } from "../model/creature/creature";
import {
  CREATURE_DATA_FIELDS,
  CreatureData,
  CreatureDataEffects,
  CreatureDataItems,
  CreatureDataProficiencies,
  CreatureDataScript,
  CreatureDataSpells,
  MainCreatureData,
} from "../model/creature/data";
import { InputCreatureData } from "../model/creature/data-input";
import { ItemSlot } from "../model/creature/item";
import { Item } from "../model/spell-item/spell-item";
import abilityService from "../services/baf/ability.service";
import creatureService from "../services/creature.service";
import descriptionService from "../services/doc/description.service";
import immunityService from "../services/effects/immunity.service";
import translationService from "../services/translation.service";
import { State } from "../state";
import { ImmunityName } from "../model/final/immunity";

class CreatureFactory {
  setData(cre: Creature, data: InputCreatureData) {
    this.checkValidation(cre);
    cre.data = this.getData(cre.data, data, false) as MainCreatureData;
  }

  getData(
    data: CreatureData | undefined,
    input: InputCreatureData,
    isAdjustment: boolean,
  ): CreatureData {
    data ??= this.createEmptyData();
    if (!isAdjustment) {
      data.spells.removeKnown = true;
      data.spells.removeMemorized = true;
      data.effects.remove = true;
    }
    for (const field of CREATURE_DATA_FIELDS) {
      if (field.setter && input[field.key] !== undefined) {
        field.setter(data, input[field.key]);
      }
      if (
        !field.setter &&
        field.key in input &&
        input[field.key] !== undefined
      ) {
        (data as any)[field.key] = input[field.key];
      }
    }
    return data;
  }

  createEmptyData(): CreatureData {
    const data: CreatureData = {
      script: new CreatureDataScript(),
      proficiencies: [] as CreatureDataProficiencies,
      immunities: [] as ImmunityName[],
      items: new CreatureDataItems(),
      spells: new CreatureDataSpells(),
      effects: new CreatureDataEffects(),
    };
    return data;
  }

  setAdjustments(cre: Creature, adjustments: PartialCreatureAdjustment[]) {
    this.checkValidation(cre);
    for (const adjustment of adjustments) {
      const result: CreatureAdjustment = {
        ...adjustment,
        noWeapon: adjustment.noWeapon ?? false,
        summon: adjustment.summon ?? false,
        scriptName: adjustment.scriptName ?? false,
        data: adjustment.data
          ? this.getData(undefined, adjustment.data, true)
          : this.createEmptyData(),
      };
      cre.adjustments.push(result);
    }
  }

  equipItem(cre: Creature, item: Item, slot?: ItemSlot[]): void {
    this.checkValidation(cre);
    slot ??= item.equippedSlot;
    if (!slot) throw new Error(`No slot defined for ${item.stringRef}`);
    const equippedItem = cre.data.items.equipped.find(
      (e) => slot.length === 1 && e.slot[0] === slot[0],
    );
    const duplicate = cre.items.find((i) => i.file === equippedItem?.file);
    if (equippedItem && duplicate) {
      console.log(
        `${figureSet.warning} Slot ${equippedItem.slot} is already attributed to ${duplicate.stringRef}.`,
      );
    }
    cre.data.items.equipped.push({
      file: item.file,
      slot,
    });
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
      ...abilityService.getAbilities(behavior.abilities),
    );
    cre.behavior.customCodes.push(
      ...abilityService.getCustomCodes(behavior.customCodes),
    );
    cre.behavior.additionalCodes.push(...(behavior.additionalCodes ?? []));
    cre.behavior.dialog.push(...(behavior.dialog ?? []));
  }

  checkValidation(creature: Creature) {
    if (creature.valid !== undefined)
      throw new Error(
        `Creature ${translationService.from(
          creature.name,
        )} has already been validated`,
      );
  }

  validate(creature: Creature, family: MonsterFamilyEnum) {
    let valid = true;
    if (State.creatures.some((c) => c.id === creature.id)) {
      throw new Error(`Monster '${MonsterEnum[creature.id]}' already declared`);
    }
    if (creature.family !== family) {
      console.log(
        `${figureSet.warning} Family doesn't match: ${creature.family} <-> ${family}`,
      );
      valid = false;
    }
    if (!creature.files.length) {
      console.log(`${figureSet.warning} No files defined`);
      valid = false;
    }
    const existingFiles = creature.files.filter((f) =>
      State.creatures.some((c) => c.files.includes(f)),
    );
    if (existingFiles.length) {
      console.log(
        `${
          figureSet.warning
        } Those files are already declared in other creatures: ${existingFiles.join(
          ", ",
        )}`,
      );
      valid = false;
    }
    if (!creature.attack) {
      console.log(`${figureSet.warning} No attack defined, using defaults`);
      creature.setAttack({});
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
