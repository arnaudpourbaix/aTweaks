import { ANKHEG } from "../../creatures/ankheg/ankheg";
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
  getCreatures(): Creature[] {
    const creatures = [ANKHEG]; //CREATURES
    const families: MonsterFamilyEnum[] = [];
    creatures.forEach((creature) => {
      creatureService.check(creature);
      immunityService.handleImmunities(creature);
      creatureService.checkWeapons(creature);
      descriptionService.generateCreatureItems(creature);
      if (!families.includes(creature.family)) {
        families.push(creature.family);
        weiduCreatureService.createOrUpdateMainFile(creature.family);
      }
      if (creature.isValid()) {
        bafGeneratorService.generate(creature);
        weiduCreatureService.generateWeiduScript(creature);
        documentationService.addCreature(creature);
      }
    });
    documentationService.generate();
    return creatures;
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
