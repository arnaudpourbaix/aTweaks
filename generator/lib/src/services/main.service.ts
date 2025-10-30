import { ANKHEG } from "../../creatures/ankheg/ankheg";
import { Creature } from "../model/creature/creature";
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
    creatures.forEach((creature) => {
      creatureService.checkData({
        creature,
        base: creature,
        isAdjustment: false,
      });
      for (const a of creature.adjustments) {
        creatureService.checkData({
          creature,
          base: a,
          isAdjustment: true,
        });
      }
      immunityService.handleImmunities(creature);
      creatureService.checkWeapons(creature);
      descriptionService.generateCreatureItems(creature);
      if (creature.isValid()) {
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
