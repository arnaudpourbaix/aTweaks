import { ANKHEG } from "../../creatures/ankheg/ankheg";
import { Creature } from "../model/creature/creature";
import translationService from "./translation.service";
import weiduCoreService from "./weidu/weidu-core.service";
import weiduFunctionService from "./weidu/weidu-function.service";

class MainService {
  getCreatures(): Creature[] {
    const creatures = [ANKHEG]; //CREATURES
    creatures.forEach((creature) => {
      // console.log(creature.behavior);
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
