import triggerFactory from "../../src/factories/trigger.factory";
import { AbilityPreset } from "../../src/model/misc";
import targetService from "../../src/services/baf/target.service";
import { CHARM_TARGET_LISTS, DEFAULT_SPELL_PROBABILITY } from "../common";
import { SPELLS } from "../spell-names";

export const CHARM_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.Domination.file,
    ability: {
      name: "ability.domination",
      targets: targetService.combineListWithTriggers(CHARM_TARGET_LISTS, [
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.DireCharm.file,
    ability: {
      name: "ability.direCharm",
      targets: targetService.combineListWithTriggers(CHARM_TARGET_LISTS, [
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
      ]),
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: [
        ...triggerFactory.haveSpellRES([SPELLS.Domination.file], true),
      ],
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.CharmPerson.file,
    ability: {
      name: "ability.charmPerson",
      targets: targetService.combineListWithTriggers(CHARM_TARGET_LISTS, [
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
      ]),
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: [
        ...triggerFactory.haveSpellRES(
          [SPELLS.Domination.file, SPELLS.DireCharm.file],
          true,
        ),
      ],
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.CharmPersonOrAnimal.file,
    ability: {
      name: "ability.charmPersonOrAnimal",
      targets: targetService.combineListWithTriggers(CHARM_TARGET_LISTS, [
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: [
        ...triggerFactory.haveSpellRES(
          [SPELLS.Domination.file, SPELLS.DireCharm.file],
          true,
        ),
      ],
      requireVocal: true,
    },
  },
];
