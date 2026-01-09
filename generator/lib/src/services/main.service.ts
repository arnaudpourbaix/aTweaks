import figureSet from "figures";
import { familyFactories } from "../../creatures";
import { MonsterFamilyEnum } from "../../creatures/monster";
import { Creature } from "../model/creature/creature";
import bafGeneratorService from "./baf/baf-generator.service";
import descriptionService from "./doc/description.service";
import documentationService from "./doc/documentation.service";
import translationService from "./translation.service";
import weiduCoreService from "./weidu/weidu-core.service";
import weiduCreatureService from "./weidu/weidu-creature.service";
import weiduFamilyService from "./weidu/weidu-family.service";
import weiduFunctionService from "./weidu/weidu-function.service";

class MainService {
  generateCreatures() {
    const families: MonsterFamilyEnum[] = [];
    for (const factory of familyFactories) {
      const family = factory();
      descriptionService.generateCreatureSpells(family.spells);
      descriptionService.generateCreatureItems(family.items);
      if (families.includes(family.id)) {
        throw new Error(
          `Family '${MonsterFamilyEnum[family.id]}' already declared`
        );
      }
      families.push(family.id);
      weiduFamilyService.createOrUpdateMainFile(family.id);
      weiduFamilyService.generateFamilyData(family);
      for (const creature of family.creatures) {
        this.generateCreature(creature, families);
      }
      weiduFamilyService.generateFinalCode(family);
      documentationService.addFamily(family);
    }
    documentationService.generate();
  }

  generateCreature(creature: Creature, families: MonsterFamilyEnum[]) {
    if (!this.isCreatureValid(creature)) return;
    bafGeneratorService.generate(creature);
    weiduCreatureService.generateWeiduScript(creature);
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
    weiduCoreService.generateProjectiles();
    weiduCoreService.generateProtectionSpells();
    weiduFunctionService.generateSpellResources();
    weiduFunctionService.generateSpellFunctions();
    weiduFunctionService.generateImmunities();
    weiduCoreService.writeFile();
  }
}

const mainService = new MainService();
export default mainService;
