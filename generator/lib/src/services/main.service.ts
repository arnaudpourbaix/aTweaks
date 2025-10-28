import { ANKHEG } from "../../creatures/ankheg/ankheg";
import { Creature } from "../model/creature/creature";
import creatureService from "./creature.service";
import descriptionService from "./description.service";
import immunityService from "./immunity.service";
import translationService from "./translation.service";
import weiduCoreService from "./weidu/weidu-core.service";
import weiduCreatureService from "./weidu/weidu-creature.service";
import weiduFunctionService from "./weidu/weidu-function.service";

class MainService {
  getCreatures(): Creature[] {
    const creatures = [ANKHEG]; //CREATURES
    creatures.forEach((creature) => {
      immunityService.handleImmunities(creature);
      creatureService.checkWeapons(creature);
      descriptionService.generateCreatureItems(creature);
      if (creature.isValid()) {
        weiduCreatureService.generateWeiduScript(creature);
      }
    });
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
