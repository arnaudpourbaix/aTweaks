import triggerFactory from "../../src/factories/trigger.factory";
import { AbilityPreset } from "../../src/model/misc";
import targetService from "../../src/services/baf/target.service";
import { DEFAULT_SPELL_PROBABILITY, SLEEP_TARGET_LISTS } from "../common";
import { SPELLS } from "../spell-names";

export const SLEEP_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.PowerWordSleep.file,
    ability: {
      name: "ability.powerWordSleep",
      targets: targetService.combineListWithTriggers(SLEEP_TARGET_LISTS, [
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
        triggerFactory.hplt(20),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Sleep.file,
    ability: {
      name: "ability.sleep",
      targets: targetService.combineListWithTriggers(SLEEP_TARGET_LISTS, [
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.GreaterCommand.file,
    ability: {
      name: "ability.sleep",
      targets: targetService.combineListWithTriggers(SLEEP_TARGET_LISTS, [
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Command.file,
    ability: {
      name: "ability.command",
      targets: targetService.combineListWithTriggers(SLEEP_TARGET_LISTS, [
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
];
