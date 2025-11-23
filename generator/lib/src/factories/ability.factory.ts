import { DEFAULT_SPELL_PROBABILITY } from "../../config/ability-presets";
import { RawCreatureAbility } from "../model/creature/ability";
import { Triggers } from "../model/script/triggers";

class AbilityFactory {
  polymorphSelf(payload: {
    triggers: Triggers.Trigger[];
  }): RawCreatureAbility[] {
    const results: RawCreatureAbility[] = [];
    results.push({
      name: "ability.polymorphSelf",
      spell: {
        id: "WIZARD_POLYMORPH_SELF",
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      triggers: payload.triggers,
      requireVocal: true,
    });
    // TODO: cover all these creatures
    // Set intelligent form depending on situation
    // Fast form to run away or track players
    // Strong melee form in melee
    // Strong range in ranged
    const resources = [
      "SPWI495", // Spider
      "SPWI496", // Mustard Jelly
      "DW-PSOM", // Ogre Mage
      "SPWI493", // Flind
      "DW-PSHG", // Hill Giant Barbarian
      "DW-PSHH", // Hell Hound
      "SPWI494", // Ogre
      "SPWI497", // Brown Bear
      "SPWI490", // Natural Form
    ];
    const max = 1000;
    for (const [index, resource] of resources.entries()) {
      const ability: RawCreatureAbility = {
        name: "ability.polymorphSelf",
        spell: {
          resource,
          selfTarget: true,
        },
        noRoundTimer: true,
        canUseWhenPolymorphed: true,
        triggers: [],
        timer: {
          name: "polymorph",
          value: 12,
        },
      };
      if (index < resources.length - 1) {
        ability.triggers!.push({
          name: "RandomNumLT",
          params: [max, Math.round(max / (resources.length - index))],
        });
      }
      results.push(ability);
    }
    return results;
  }
}

const abilityFactory = new AbilityFactory();
export default abilityFactory;
