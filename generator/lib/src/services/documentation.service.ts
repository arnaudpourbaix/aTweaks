import { Creature } from "../model/creature/creature";
import translationService from "./translation.service";

class DocumentationService {
  generate(creature: Creature) {
    console.log(`Generate doc for ${translationService.from(creature.name)}`);
  }
}

const documentationService = new DocumentationService();
export default documentationService;
