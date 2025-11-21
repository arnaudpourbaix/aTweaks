import figureSet from "figures";
import { familyFactories } from "../../creatures";
import { MonsterFamilyEnum } from "../../creatures/monster";
import { Creature } from "../model/creature/creature";
import bafGeneratorService from "./baf/baf-generator.service";
import documentationService from "./documentation.service";
import translationService from "./translation.service";
import weiduCoreService from "./weidu/weidu-core.service";
import weiduCreatureService from "./weidu/weidu-creature.service";
import weiduFunctionService from "./weidu/weidu-function.service";
import weiduFamilyService from "./weidu/weidu-family.service";
import { State } from "../state";
import descriptionService from "./description.service";

class MainService {
  generateCreatures() {
    const families: MonsterFamilyEnum[] = [];
    for (const factory of familyFactories) {
      const family = factory();
      State.spells.push(...family.spells);
      State.items.push(...family.items);
      descriptionService.generateCreatureSpells(family.spells);
      descriptionService.generateCreatureItems(family.items);
      if (families.includes(family.name)) {
        throw new Error(
          `Family '${MonsterFamilyEnum[family.name]}' already declared`
        );
      }
      families.push(family.name);
      weiduFamilyService.createOrUpdateMainFile(family.name);
      weiduFamilyService.generateFamilyData(family);
      for (const creature of family.creatures) {
        this.generateCreature(creature, families);
      }
    }
    documentationService.generate();
  }

  generateCreature(creature: Creature, families: MonsterFamilyEnum[]) {
    if (!this.isCreatureValid(creature)) return;
    bafGeneratorService.generate(creature);
    weiduCreatureService.generateWeiduScript(creature);
    State.spells.push(...creature.spells);
    State.items.push(...creature.items);
    documentationService.addCreature(creature);
  }

  isCreatureValid(creature: Creature) {
    if (creature.valid === undefined) {
      console.log(
        `${figureSet.warning} ${translationService.from(
          creature.name
        )} has not been validated, you must call validate`
      );
    } else if (creature.valid === false) {
      console.log(
        `${figureSet.warning} ${translationService.from(
          creature.name
        )} is not valid, please fix it !`
      );
    }
    return !!creature.valid;
  }

  generateTranslations() {
    translationService.generateWeiduFiles();
  }

  generateCommonCode() {
    weiduCoreService.generateSpellStates();
    weiduCoreService.generateProtectionSpells();
    weiduFunctionService.generateSpellResources();
    weiduFunctionService.generateSpellFunctions();
    weiduFunctionService.generateImmunities();
    weiduCoreService.writeFile();
  }
}

const mainService = new MainService();
export default mainService;
