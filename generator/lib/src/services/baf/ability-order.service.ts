import { SPELL_PRIORITY_ORDER } from "../../../config/spell-priority-order";
import { RawCreatureAbility } from "../../model/creature/ability";
import { Creature } from "../../model/creature/creature";
import creatureService from "../creature.service";

class AbilityOrderService {
  resolve(creature: Creature): RawCreatureAbility[] {
    const memorizedFiles = creatureService.memorizedSpellFiles(creature);
    return memorizedFiles
      .map((file) => ({ file, index: SPELL_PRIORITY_ORDER.indexOf(file) }))
      .filter(({ index }) => index !== -1)
      .sort((a, b) => a.index - b.index)
      .map(({ file }): RawCreatureAbility => ({ preset: file }));
  }
}

const abilityOrderService = new AbilityOrderService();
export default abilityOrderService;
