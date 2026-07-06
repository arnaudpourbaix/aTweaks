import triggerFactory from "../../src/factories/trigger.factory";
import { ScriptTarget } from "../../src/model/constants";
import { AbilityPreset } from "../../src/model/misc";
import targetService from "../../src/services/baf/target.service";
import { DEFAULT_SPELL_PROBABILITY } from "../common";
import { SPELLS } from "../spell-names";

export const DEATH_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.WailOfTheBanshee.file,
    ability: {
      name: "ability.wailOfTheBanshee",
      targets: [
        {
          name: "Players",
          triggers: [
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {
        selfTarget: true,
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.PowerWordKill.file,
    ability: {
      name: "ability.powerWordKill",
      targets: [
        {
          name: "Players",
          includeStatus: ["Able"],
          triggers: [
            triggerFactory.hplt(61),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
          randomOrder: true,
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.FingerOfDeath.file,
    ability: {
      name: "ability.FingerOfDeath",
      targets: targetService.combineListWithTriggers(
        [
          {
            name: "Players",
            includeStatus: ["Able"],
            randomOrder: true,
          },
          {
            name: "Players",
            randomOrder: true,
          },
        ],
        [
          // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
        ],
      ),
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
];
