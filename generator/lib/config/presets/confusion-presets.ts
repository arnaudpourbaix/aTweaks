import presetFactory from "../../src/factories/preset.factory";
import { AbilityPreset } from "../../src/model/misc";
import { DEFAULT_SPELL_PROBABILITY } from "../common";
import { FNP_SPELLS, SPELLS } from "../spell-names";

export const CONFUSION_PRESETS: AbilityPreset[] = [
  ...presetFactory.create([SPELLS.Confusion.file], {
    name: "ability.Confusion",
    targets: [
      {
        name: "NearestEnemies",
        includeStatus: ["Able"],
        randomOrder: true,
        triggers: [
          // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
        ],
      },
    ],
    spell: {},
    requireVocal: true,
    probability: DEFAULT_SPELL_PROBABILITY,
  }),
  ...presetFactory.create([SPELLS.Chaos.file, FNP_SPELLS.Chaos.file], {
    name: "ability.Chaos",
    targets: [
      {
        name: "NearestEnemies",
        includeStatus: ["Able"],
        randomOrder: true,
        triggers: [
          // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
        ],
      },
    ],
    spell: {},
    requireVocal: true,
    probability: DEFAULT_SPELL_PROBABILITY,
  }),
];
