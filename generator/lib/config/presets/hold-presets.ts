import presetFactory from "../../src/factories/preset.factory";
import triggerFactory from "../../src/factories/trigger.factory";
import { AbilityPreset } from "../../src/model/misc";
import targetService from "../../src/services/baf/target.service";
import { DEFAULT_SPELL_PROBABILITY, HOLD_TARGET_LISTS } from "../common";
import { SPELLS } from "../spells/spell-names";

export const HOLD_PRESETS: AbilityPreset[] = [
  ...presetFactory.create(
    [SPELLS.Priest.HoldPersonCleric.file, SPELLS.Wizard.HoldPersonWizard.file],
    {
      name: "ability.holdPerson",
      targets: targetService.combineListWithTriggers(HOLD_TARGET_LISTS, [
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  ),
  {
    preset: SPELLS.Priest.HoldPersonOrAnimal.file,
    ability: {
      name: "ability.HoldPersonOrAnimal",
      targets: targetService.combineListWithTriggers(HOLD_TARGET_LISTS, [
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Wizard.Web.file,
    ability: {
      name: "ability.web",
      targets: targetService.combineListWithTriggers(HOLD_TARGET_LISTS, [
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
];
