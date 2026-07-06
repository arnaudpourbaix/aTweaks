import triggerFactory from "../../src/factories/trigger.factory";
import { Durations, ScriptTarget } from "../../src/model/constants";
import { AbilityPreset } from "../../src/model/misc";
import targetService from "../../src/services/baf/target.service";
import { DEFAULT_SPELL_PROBABILITY } from "../common";
import { FNP_SPELLS, SPELLS } from "../spell-names";

export const DAMAGE_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.MagicMissiles.file,
    ability: {
      name: "ability.magicMissiles",
      targets: targetService.combineListWithTriggers(
        [
          {
            name: "PCSpellcasters",
            randomOrder: true,
            triggers: [triggerFactory.stateCheck("STATE_MIRRORIMAGE")],
          },
          {
            name: "PCSpellcasters",
            randomOrder: true,
          },
          {
            name: "Players",
            randomOrder: true,
          },
        ],
        [
          triggerFactory.checkStatGT(0, "MINORGLOBE", true),
          triggerFactory.checkStat(2, "SCRIPTINGSTATE5", false), // Shield
          // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          // triggerFactory.hasBounceEffects(true),
        ],
      ),
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.MordenkainenForceMissiles.file,
    ability: {
      name: "ability.MordenkainenForceMissiles",
      targets: targetService.combineListWithTriggers(
        [
          {
            name: "PCSpellcasters",
            randomOrder: true,
            triggers: [triggerFactory.stateCheck("STATE_MIRRORIMAGE")],
          },
          {
            name: "PCSpellcasters",
            randomOrder: true,
          },
          {
            name: "Players",
            randomOrder: true,
          },
        ],
        [
          triggerFactory.checkStat(2, "SCRIPTINGSTATE5", false), // Shield
          // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          // triggerFactory.hasBounceEffects(true),
        ],
      ),
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.ChromaticOrb.file,
    ability: {
      name: "ability.ChromaticOrb",
      targets: [
        {
          name: "PCs",
          randomOrder: true,
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
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
    preset: SPELLS.CallLightning.file,
    ability: {
      name: "ability.callLightning",
      targets: [
        {
          name: "NearestEnemies",
          triggers: [
            triggerFactory.areaType("OUTDOOR"),
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
            // triggerFactory.checkStatLT(50, "RESISTELECTRICITY"),
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
    preset: FNP_SPELLS.CauseDisease.file,
    ability: {
      name: "ability.CauseDisease",
      targets: [
        {
          name: "PCsFighters",
          triggers: [
            triggerFactory.checkStatGT(12, "STRENGTH_MODIFIER"),
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
    preset: FNP_SPELLS.CauseLightWounds.file,
    ability: {
      name: "ability.CauseLightWounds",
      spell: {
        selfTarget: true,
      },
      triggers: [
        ...triggerFactory.hasItem(
          ["LIGHT", "SERIOUS", "CRITICAL", "HARM", "SLAYLIVE"],
          true,
        ),
        ...triggerFactory.haveSpellRES(
          [
            FNP_SPELLS.CauseSeriousWounds.file,
            FNP_SPELLS.CauseCriticalWounds.file,
            FNP_SPELLS.Harm.file,
            SPELLS.SlayLiving.file,
          ],
          true,
        ),
      ],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: FNP_SPELLS.CauseSeriousWounds.file,
    ability: {
      name: "ability.CauseSeriousWounds",
      spell: {
        selfTarget: true,
      },
      triggers: [
        ...triggerFactory.hasItem(
          ["LIGHT", "SERIOUS", "CRITICAL", "HARM", "SLAYLIVE"],
          true,
        ),
        ...triggerFactory.haveSpellRES(
          [
            FNP_SPELLS.CauseCriticalWounds.file,
            FNP_SPELLS.Harm.file,
            SPELLS.SlayLiving.file,
          ],
          true,
        ),
      ],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: FNP_SPELLS.CauseCriticalWounds.file,
    ability: {
      name: "ability.CauseCriticalWounds",
      spell: {
        selfTarget: true,
      },
      triggers: [
        ...triggerFactory.hasItem(
          ["LIGHT", "SERIOUS", "CRITICAL", "HARM", "SLAYLIVE"],
          true,
        ),
        ...triggerFactory.haveSpellRES(
          [FNP_SPELLS.Harm.file, SPELLS.SlayLiving.file],
          true,
        ),
      ],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Harm.file,
    ability: {
      name: "ability.Harm",
      spell: {
        selfTarget: true,
      },
      triggers: [
        ...triggerFactory.hasItem(
          ["LIGHT", "SERIOUS", "CRITICAL", "HARM", "SLAYLIVE"],
          true,
        ),
        ...triggerFactory.haveSpellRES([SPELLS.SlayLiving.file], true),
      ],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.SlayLiving.file,
    ability: {
      name: "ability.SlayLiving",
      spell: {
        selfTarget: true,
      },
      triggers: triggerFactory.hasItem(
        ["LIGHT", "SERIOUS", "CRITICAL", "HARM", "SLAYLIVE"],
        true,
      ),
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: FNP_SPELLS.Shatter.file,
    ability: {
      name: "ability.Shatter",
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
      timer: { name: "Shatter", value: 4 * Durations.round },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Wither.file,
    ability: {
      name: "ability.Wither",
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
          // triggerFactory.checkStatLT(50, "RESISTMAGIC")
        ],
      ),
      range: 10,
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.DolorousDecay.file,
    ability: {
      name: "ability.DolorousDecay",
      targets: targetService.combineListWithTriggers(
        [
          {
            name: "Players",
            randomOrder: true,
            triggers: [triggerFactory.stateCheck("STATE_POISONED", true)],
          },
          {
            name: "Players",
            randomOrder: true,
          },
        ],
        [
          // triggerFactory.checkStatLT(50, "RESISTMAGIC")
        ],
      ),
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Poison.file,
    ability: {
      name: "ability.Poison",
      targets: [
        {
          name: "Players",
          randomOrder: true,
          triggers: [
            triggerFactory.stateCheck("STATE_POISONED", true),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
            // triggerFactory.checkStatLT(50, "RESISTPOISON"),
          ],
        },
      ],
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.MelfAcidArrow.file,
    ability: {
      name: "ability.MelfAcidArrow",
      targets: targetService.combineListWithTriggers(
        [
          {
            name: "PCSpellcasters",
            randomOrder: true,
          },
          {
            name: "Players",
            randomOrder: true,
          },
        ],
        [
          triggerFactory.checkStatGT(0, "MINORGLOBE", true),
          triggerFactory.checkSpellState(
            "PROTECTION_FROM_NORMAL_MISSILES",
            true,
          ),
          // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
          // triggerFactory.checkStatLT(50, "RESISTACID"),
        ],
      ),
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.FlameArrow.file,
    ability: {
      name: "ability.FlameArrow",
      targets: [
        {
          name: "Players",
          randomOrder: true,
          triggers: [
            triggerFactory.checkStatGT(0, "MINORGLOBE", true),
            triggerFactory.checkSpellState(
              "PROTECTION_FROM_NORMAL_MISSILES",
              true,
            ),
            // triggerFactory.checkStatLT(50, "RESISTMAGIC"),
            // triggerFactory.checkStatLT(50, "RESISTFIRE"),
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
    preset: SPELLS.Combust.file,
    ability: {
      name: "ability.Combust",
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
];
