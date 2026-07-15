import triggerFactory from "../../src/factories/trigger.factory";
import { AbilityPreset } from "../../src/model/misc";
import targetService from "../../src/services/baf/target.service";
import { DEFAULT_SPELL_PROBABILITY, SLEEP_TARGET_LISTS } from "../common";
import { SPELLS } from "../spells/spell-names";

export const SLEEP_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.Wizard.PowerWordSleep.file,
    ability: {
      name: "ability.powerWordSleep",
      targets: targetService.combineListWithTriggers(SLEEP_TARGET_LISTS, [
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
        triggerFactory.hplt(20),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Wizard.Sleep.file,
    ability: {
      name: "ability.sleep",
      targets: targetService.combineListWithTriggers(SLEEP_TARGET_LISTS, [
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Priest.GreaterCommand.file,
    ability: {
      name: "ability.GreaterCommand",
      targets: targetService.combineListWithTriggers(SLEEP_TARGET_LISTS, [
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Priest.Command.file,
    ability: {
      name: "ability.command",
      targets: targetService.combineListWithTriggers(SLEEP_TARGET_LISTS, [
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
];
