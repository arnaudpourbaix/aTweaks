import presetFactory from "../../src/factories/preset.factory";
import triggerFactory from "../../src/factories/trigger.factory";
import { AbilityPreset } from "../../src/model/misc";
import { DEFAULT_SPELL_PROBABILITY } from "../common";
import { FNP_SPELLS, SPELLS } from "../spell-names";

export const DEBUFF_PRESETS: AbilityPreset[] = [
  ...presetFactory.create([SPELLS.Doom.file, FNP_SPELLS.Doom.file], {
    name: "ability.Doom",
    targets: [
      {
        name: "Players",
        triggers: [
          triggerFactory.checkSpellState("DOOM", true),
          triggerFactory.checkStatGT(0, "MINORGLOBE", true),
          // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
        ],
        randomOrder: true,
      },
    ],
    spell: {
      probability: DEFAULT_SPELL_PROBABILITY,
    },
    requireVocal: true,
  }),
  ...presetFactory.create(
    [SPELLS.GreaterMalison.file, FNP_SPELLS.GreaterMalison.file],
    {
      name: "ability.GreaterMalison",
      targets: [
        {
          name: "Players",
          randomOrder: true,
          triggers: [
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  ),
  {
    preset: FNP_SPELLS.WavesOfFatigue.file,
    ability: {
      name: "ability.WavesOfFatigue",
      targets: [
        {
          name: "Players",
          randomOrder: true,
          triggers: [
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
];
