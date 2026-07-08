import presetFactory from "../../src/factories/preset.factory";
import triggerFactory from "../../src/factories/trigger.factory";
import { ScriptTarget } from "../../src/model/constants";
import { Durations } from "../../src/model/game-data/durations";
import { AbilityPreset } from "../../src/model/misc";
import { DEFAULT_SPELL_PROBABILITY } from "../common";
import { FNP_SPELLS, SPELLS } from "../spell-names";

export const DAMAGE_AOE_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.ConeOfCold.file,
    ability: {
      name: "ability.coneOfCold",
      targets: [
        {
          name: "NearestEnemies",
          randomOrder: true,
          triggers: [
            //   triggerFactory.checkStatLT(50, "RESISTCOLD"),
            //   triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Fireburst.file,
    ability: {
      name: "ability.Fireburst",
      targets: [
        {
          name: "NearestEnemies",
          randomOrder: true,
          triggers: [
            // triggerFactory.checkStatLT(50, "RESISTFIRE"),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {
        selfTarget: true,
      },
      range: 10,
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.GlyphOfWarding.file,
    ability: {
      name: "ability.glyphOfWarding",
      targets: [
        {
          name: "FarthestEnemies",
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
    preset: SPELLS.BurningHands.file,
    ability: {
      name: "ability.BurningHands",
      targets: [
        {
          name: "NearestEnemies",
          randomOrder: true,
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
            // triggerFactory.checkStatLT(50, "RESISTFIRE"),
          ],
        },
      ],
      spell: {},
      range: 5,
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.IceStorm.file,
    ability: {
      name: "ability.iceStorm",
      targets: [
        {
          name: "FarthestEnemies",
          randomOrder: true,
          triggers: [
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
            // triggerFactory.checkStatLT(50, "RESISTCOLD"),
          ],
        },
      ],
      minRange: 20,
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.MassCauseLightWounds.file,
    ability: {
      name: "ability.MassCauseLightWounds",
      spell: {
        selfTarget: true,
      },
      triggers: [
        ...triggerFactory.hasItem(
          ["LIGHT", "SERIOUS", "CRITICAL", "HARM", "SLAYLIVE"],
          true,
        ),
      ],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    //FIXME: this spell doesn't seem to work at all
    preset: FNP_SPELLS.FrostFingers.file,
    ability: {
      name: "ability.FrostFingers",
      targets: [
        {
          name: "NearestEnemies",
        },
      ],
      spell: {
        selfTarget: true,
      },
      triggers: [
        {
          name: "CheckStat",
          params: [ScriptTarget.myself, 5, "SCRIPTINGSTATE4"],
        },
      ],
      range: 10,
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  ...presetFactory.create(
    [SPELLS.CloudOfPestilence.file, FNP_SPELLS.CloudOfPestilence.file],
    {
      name: "ability.CloudOfPestilence",
      targets: [
        {
          name: "NearestEnemies",
          triggers: [
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
    preset: SPELLS.WavesOfAgony.file,
    ability: {
      name: "ability.WavesOfAgony",
      targets: [
        {
          name: "Players",
          randomOrder: true,
          triggers: [
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          ],
        },
      ],
      spell: {},
      timer: { name: "WavesOfAgony", value: 3 * Durations.round },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.LightningBolt.file,
    ability: {
      name: "ability.LightningBolt",
      targets: [
        {
          name: "Players",
          randomOrder: true,
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
            // triggerFactory.checkStatLT(50, "RESISTELECTRICITY"),
            // triggerFactory.hasBounceEffects(true),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.AgannazarScorcher.file,
    ability: {
      name: "ability.AgannazarScorcher",
      targets: [
        {
          name: "Players",
          randomOrder: true,
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
            // triggerFactory.checkStatLT(50, "RESISTFIRE"),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.VitriolicSphere.file,
    ability: {
      name: "ability.VitriolicSphere",
      targets: [
        {
          name: "FarthestEnemies",
          randomOrder: true,
          triggers: [
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
            // triggerFactory.checkStatLT(50, "RESISTACID"),
          ],
        },
      ],
      minRange: 20,
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Cloudkill.file,
    ability: {
      name: "ability.Cloudkill",
      targets: [
        {
          name: "NearestEnemies",
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
    preset: SPELLS.ChainLightning.file,
    ability: {
      name: "ability.ChainLightning",
      targets: [
        {
          name: "NearestEnemies",
          randomOrder: true,
          triggers: [
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
            // triggerFactory.checkStatLT(50, "RESISTELECTRICITY"),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
];
