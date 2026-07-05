import presetFactory from "../../src/factories/preset.factory";
import triggerFactory from "../../src/factories/trigger.factory";
import { AbilityPreset } from "../../src/model/misc";
import targetService from "../../src/services/baf/target.service";
import { DEFAULT_SPELL_PROBABILITY, FEAR_TARGET_LISTS } from "../common";
import { FNP_SPELLS, SPELLS } from "../spell-names";

export const FEAR_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.Horror.file,
    ability: {
      name: "ability.horror",
      targets: targetService.combineListWithTriggers(FEAR_TARGET_LISTS, [
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
        // triggerFactory.checkStatGT(0, "WIZARD_RESIST_FEAR", true),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Spook.file,
    ability: {
      name: "ability.spook",
      targets: targetService.combineListWithTriggers(FEAR_TARGET_LISTS, [
        triggerFactory.checkStatGT(0, "MINORGLOBE", true),
        // triggerFactory.checkStatGT(0, "WIZARD_RESIST_FEAR", true),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  ...presetFactory.create(
    [SPELLS.CloakOfFear.file, FNP_SPELLS.CloakOfFear.file],
    {
      name: "ability.cloakOfFear",
      targets: targetService.combineListWithTriggers(FEAR_TARGET_LISTS, [
        // triggerFactory.checkStatGT(0, "WIZARD_RESIST_FEAR", true),
        // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
      ]),
      spell: {
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  ),
];
