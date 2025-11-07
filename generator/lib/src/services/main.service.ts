import figureSet from "figures";
import { creatureFactories } from "../../creatures";
import { MonsterFamilyEnum } from "../../creatures/monster";
import { Creature } from "../model/creature/creature";
import bafGeneratorService from "./baf/baf-generator.service";
import creatureService from "./creature.service";
import descriptionService from "./description.service";
import documentationService from "./documentation.service";
import immunityService from "./effects/immunity.service";
import translationService from "./translation.service";
import weiduCoreService from "./weidu/weidu-core.service";
import weiduCreatureService from "./weidu/weidu-creature.service";
import weiduFunctionService from "./weidu/weidu-function.service";

class MainService {
  generateCreatures() {
    const families: MonsterFamilyEnum[] = [];
    for (const factory of creatureFactories) {
      const creatures = factory();
      for (const creature of creatures) {
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
        if (creature.valid) {
          if (!families.includes(creature.family)) {
            families.push(creature.family);
            weiduCreatureService.createOrUpdateMainFile(creature.family);
          }
          bafGeneratorService.generate(creature);
          weiduCreatureService.generateWeiduScript(creature);
          documentationService.addCreature(creature);
        }
      }
    }
    documentationService.generate();
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
