import presetFactory from "../../src/factories/preset.factory";
import triggerFactory from "../../src/factories/trigger.factory";
import { Durations } from "../../src/model/constants";
import { AbilityPreset } from "../../src/model/misc";
import targetService from "../../src/services/baf/target.service";
import { DEFAULT_SPELL_PROBABILITY } from "../common";
import { FNP_SPELLS, SPELLS } from "../spell-names";

export const DISABLING_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.Darkness15Radius.file,
    ability: {
      name: "ability.darkness15Radius",
      targets: [
        {
          name: "NearestEnemies",
          includeStatus: ["Able"],
          limit: 6,
          randomOrder: true,
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.ObscuringMist.file,
    ability: {
      name: "ability.ObscuringMist",
      targets: [
        {
          name: "PCsFighters",
          randomOrder: true,
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Silence.file,
    ability: {
      name: "ability.silence",
      targets: [
        {
          name: "PCSpellcasters",
          includeStatus: ["Able"],
          triggers: [
            triggerFactory.range(20, true),
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
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
    preset: SPELLS.MiscastMagic.file,
    ability: {
      name: "ability.miscastMagic",
      targets: [
        {
          name: "PCSpellcasters",
          includeStatus: ["Able"],
          randomOrder: true,
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  ...presetFactory.create(
    [SPELLS.RigidThinking.file, FNP_SPELLS.RigidThinking.file],
    {
      name: "ability.rigidThinking",
      targets: [
        {
          name: "NearestEnemies",
          includeStatus: ["Able"],
          randomOrder: true,
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  ),
  {
    preset: SPELLS.SummonInsects.file,
    ability: {
      name: "ability.summonInsects",
      targets: [
        {
          name: "PCSpellcasters",
          includeStatus: ["Able"],
          randomOrder: true,
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Entangle.file,
    ability: {
      name: "ability.entangle",
      targets: [
        {
          name: "NearestEnemies",
          includeStatus: ["Able"],
          triggers: [
            triggerFactory.checkStatGT(0, "ENTANGLE", true),
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Slow.file,
    ability: {
      name: "ability.slow",
      targets: targetService.combineListWithTriggers(
        [
          {
            name: "PCsFighters",
            includeStatus: ["Able"],
          },
          {
            name: "NearestEnemies",
            includeStatus: ["Able"],
            limit: 6,
          },
        ],
        [
          triggerFactory.checkStatGT(0, "MINORGLOBE", true),
          // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
        ],
      ),
      spell: {
        excludeStateChecks: ["STATE_SLOWED"],
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.PowerWordBlind.file,
    ability: {
      name: "ability.powerWordBlind",
      targets: [
        {
          name: "Players",
          randomOrder: true,
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {
        excludeStateChecks: ["STATE_BLIND", "STATE_DISABLED"],
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.PowerWordStun.file,
    ability: {
      name: "ability.powerWordStun",
      targets: [
        {
          name: "Players",
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
    },
  },
  {
    preset: FNP_SPELLS.Forbiddance.file,
    ability: {
      name: "ability.Forbiddance",
      targets: [
        {
          name: "NearestEnemies",
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {},
      timer: { name: "Forbiddance", value: 2 * Durations.round },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: FNP_SPELLS.MiscastMagic.file,
    ability: {
      name: "ability.MiscastMagic",
      targets: [
        {
          name: "PCSpellcasters",
          triggers: [
            triggerFactory.checkSpellState("MISCAST_MAGIC", true),
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.StinkingCloud.file,
    ability: {
      name: "ability.StinkingCloud",
      targets: [
        {
          name: "Players",
          randomOrder: true,
          includeStatus: ["Able"],
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  ...presetFactory.create([SPELLS.Emotion.file, FNP_SPELLS.Emotion.file], {
    name: "ability.Emotion",
    targets: [
      {
        name: "NearestEnemies",
        includeStatus: ["Able"],
        randomOrder: true,
      },
    ],
    spell: {},
    requireVocal: true,
    probability: DEFAULT_SPELL_PROBABILITY,
  }),
  {
    preset: SPELLS.TeleportField.file,
    ability: {
      name: "ability.TeleportField",
      targets: [
        {
          name: "Players",
          randomOrder: true,
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
];
