import presetFactory from "../src/factories/preset.factory";
import triggerFactory from "../src/factories/trigger.factory";
import { Durations, ScriptTarget } from "../src/model/constants";
import { AbilityPreset } from "../src/model/misc";
import {
  CHARM_TARGET_LISTS,
  DEFAULT_SPELL_PROBABILITY,
  FEAR_TARGET_LISTS,
  HOLD_TARGET_LISTS,
  PRESET_NAMES,
  SLEEP_TARGET_LISTS,
} from "./common";
import { FNP_SPELLS, SPELLS } from "./spell-names";

export const ABILITY_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.Vocalize.file,
    ability: {
      name: "ability.Vocalize",
      spell: {
        probability: 100,
        selfTarget: true,
      },
      triggers: [
        {
          name: "StateCheck",
          params: [ScriptTarget.myself, "STATE_SILENCED"],
        },
      ],
      requireVocal: false,
    },
  },
  {
    preset: SPELLS.Invisibility.file,
    ability: {
      name: "ability.invisibility",
      spell: {
        excludeStateChecks: ["STATE_INVISIBLE"],
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
      triggers: [{ name: "Detect", params: ["NearestEnemyOf"] }],
    },
  },
  {
    preset: SPELLS.ImprovedInvisibility.file,
    ability: {
      name: "ability.improvedInvisibility",
      spell: {
        excludeStateChecks: ["STATE_IMPROVEDINVISIBILITY"],
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
      triggers: [{ name: "Detect", params: ["NearestEnemyOf"] }],
    },
  },
  {
    preset: SPELLS.Domination.file,
    ability: {
      name: "ability.domination",
      targets: CHARM_TARGET_LISTS,
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.DireCharm.file,
    ability: {
      name: "ability.direCharm",
      targets: CHARM_TARGET_LISTS,
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: triggerFactory.haveSpellRES([SPELLS.Domination.file], true),
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.CharmPerson.file,
    ability: {
      name: "ability.charmPerson",
      targets: CHARM_TARGET_LISTS,
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: triggerFactory.haveSpellRES(
        [SPELLS.Domination.file, SPELLS.DireCharm.file],
        true,
      ),
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.CharmPersonOrAnimal.file,
    ability: {
      name: "ability.charmPersonOrAnimal",
      targets: CHARM_TARGET_LISTS,
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: triggerFactory.haveSpellRES(
        [SPELLS.Domination.file, SPELLS.DireCharm.file],
        true,
      ),
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.PowerWordSleep.file,
    ability: {
      name: "ability.powerWordSleep",
      targets: SLEEP_TARGET_LISTS,
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
      targets: SLEEP_TARGET_LISTS,
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
      targets: SLEEP_TARGET_LISTS,
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
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
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.ConeOfCold.file,
    ability: {
      name: "ability.coneOfCold",
      targets: [{ name: "NearestEnemies", randomOrder: true }],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.MagicMissiles.file,
    ability: {
      name: "ability.magicMissiles",
      targets: [{ name: "PCSpellcasters", randomOrder: true }],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.ChromaticOrb.file,
    ability: {
      name: "ability.ChromaticOrb",
      targets: [{ name: "PCs", randomOrder: true }],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Bless.file,
    ability: {
      name: "ability.bless",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Command.file,
    ability: {
      name: "ability.command",
      targets: SLEEP_TARGET_LISTS,
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Horror.file,
    ability: {
      name: "ability.horror",
      targets: FEAR_TARGET_LISTS,
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
      targets: FEAR_TARGET_LISTS,
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
      targets: FEAR_TARGET_LISTS,
      spell: {
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  ),
  {
    preset: SPELLS.ResistFear.file,
    ability: {
      name: "ability.resistFear",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Chant.file,
    ability: {
      name: "ability.chant",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.HoldPerson.file,
    ability: {
      name: "ability.holdPerson",
      targets: HOLD_TARGET_LISTS,
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.HoldPersonOrAnimal.file,
    ability: {
      name: "ability.HoldPersonOrAnimal",
      targets: HOLD_TARGET_LISTS,
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
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
            {
              name: "Range",
              params: [ScriptTarget.lastSeen, 20],
            },
          ],
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
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
            {
              name: "AreaType",
              params: ["OUTDOOR"],
            },
          ],
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
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
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
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
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.RigidThinking.file,
    ability: {
      name: "ability.rigidThinking",
      targets: [
        {
          name: "NearestEnemies",
          includeStatus: ["Able"],
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  ...presetFactory.create([SPELLS.Chaos.file, FNP_SPELLS.Chaos.file], {
    name: "ability.Chaos",
    targets: [
      {
        name: "NearestEnemies",
        includeStatus: ["Able"],
        randomOrder: true,
      },
    ],
    spell: {
      probability: DEFAULT_SPELL_PROBABILITY,
    },
    requireVocal: true,
  }),
  ...presetFactory.create([SPELLS.Emotion.file, FNP_SPELLS.Emotion.file], {
    name: "ability.Emotion",
    targets: [
      {
        name: "NearestEnemies",
        includeStatus: ["Able"],
        randomOrder: true,
      },
    ],
    spell: {
      probability: DEFAULT_SPELL_PROBABILITY,
    },
    requireVocal: true,
  }),
  {
    preset: SPELLS.SummonInsects.file,
    ability: {
      name: "ability.summonInsects",
      targets: [
        {
          name: "PCSpellcasters",
          includeStatus: ["Able"],
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.DimensionDoor.file,
    ability: {
      name: "ability.dimensionDoor",
      targets: [
        {
          name: "Players",
          randomOrder: true,
        },
      ],
      range: 900,
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
      triggers: [
        {
          name: "StateCheck",
          params: [ScriptTarget.myself, "STATE_BLIND"],
        },
      ],
    },
  },
  {
    preset: PRESET_NAMES.DimensionDoorOffscreen,
    ability: {
      name: "ability.dimensionDoor",
      disableInterrupt: true,
      triggers: [
        {
          name: "Or",
          triggers: [
            { name: "Range", params: ["NearestEnemyOf", 15] },
            { name: "AttackedBy", params: ["ANYONE", "DEFAULT"] },
          ],
        },
      ],
      spell: {
        id: SPELLS.DimensionDoor.id,
        targetName: "RR#TRAT",
      },
      requireVocal: false,
      actionsBefore: [
        {
          name: "CreateCreatureOffscreen", // Create a rat offscreen to teleport to
          params: ["RR#TRAT", 0],
        },
      ],
      actionsAfter: [{ name: "Wait", params: [1] }],
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
          triggers: [triggerFactory.checkStat(0, "ENTANGLE")],
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.CureLightWounds.file,
    ability: {
      name: "ability.cureLightWounds",
      //TODO: target
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
      triggers: [{ name: "HPPercentLT", params: [ScriptTarget.myself, 75] }],
    },
  },
  {
    preset: SPELLS.Barkskin.file,
    ability: {
      name: "ability.barkskin",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.AnimalSummoning4.file,
    ability: {
      name: "ability.animalSummoning4",
      targets: [
        {
          name: "PCsPreferringWeak",
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.CallWoodlandBeeings.file,
    ability: {
      name: "ability.callWoodlandBeeings",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
      triggers: [
        {
          name: "AreaType",
          params: ["OUTDOOR"],
        },
      ],
    },
  },
  {
    preset: SPELLS.Slow.file,
    ability: {
      name: "ability.slow",
      targets: [{ name: "NearestEnemies", limit: 6 }],
      spell: {
        excludeStateChecks: ["STATE_SLOWED"],
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Web.file,
    ability: {
      name: "ability.web",
      targets: HOLD_TARGET_LISTS,
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.DetectInvisibility.file,
    ability: {
      name: "ability.detectInvisibility",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      triggers: [
        { name: "Detect", params: ["PC"] },
        {
          name: "CheckSpellState",
          params: [ScriptTarget.myself, "DETECT_INVISIBILITY"],
        },
      ],
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.WailOfTheBanshee.file,
    ability: {
      name: "ability.wailOfTheBanshee",
      targets: [{ name: "Players" }],
      spell: {
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
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
        },
      ],
      minRange: 20,
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.DispelMagic.file,
    ability: {
      name: "ability.dispelMagic",
      targets: [
        {
          name: "Players",
          randomOrder: true,
          triggers: [
            {
              name: "Allegiance",
              params: [ScriptTarget.lastSeen, "ENEMY"],
            },
            {
              name: "CheckStatGT",
              params: [ScriptTarget.lastSeen, 0, "CLERIC_INSECT_PLAGUE"],
            },
            {
              name: "Or",
              triggers: [
                {
                  name: "StateCheck",
                  params: [ScriptTarget.lastSeen, "STATE_MIRRORIMAGE"],
                },
                {
                  name: "CheckStatGT",
                  params: [ScriptTarget.lastSeen, 0, "STONESKINS"],
                },
                {
                  name: "CheckStatGT",
                  params: [
                    ScriptTarget.lastSeen,
                    0,
                    "WIZARD_PROTECTION_FROM_MAGIC_WEAPONS",
                  ],
                },
                {
                  name: "CheckStatGT",
                  params: [ScriptTarget.lastSeen, 0, "WIZARD_RESIST_FEAR"],
                },
                {
                  name: "CheckStatGT",
                  params: [ScriptTarget.lastSeen, 0, "CLERIC_CHAOTIC_COMMANDS"],
                },
                {
                  name: "CheckStatGT",
                  params: [ScriptTarget.lastSeen, 49, "RESISTFIRE"],
                },
              ],
            },
          ],
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        excludeStateChecks: ["STATE_DISABLED"],
      },
      triggers: [
        {
          name: "Allegiance",
          params: [ScriptTarget.myself, "ENEMY"],
        },
      ],
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
        },
      ],
      spell: {
        excludeStateChecks: ["STATE_BLIND", "STATE_DISABLED"],
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
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
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
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
            {
              name: "HPLT",
              params: [ScriptTarget.lastSeen, 61],
            },
          ],
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
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
            {
              name: "CheckStatGT",
              params: [ScriptTarget.lastSeen, 12, "STRENGTH_MODIFIER"],
            },
          ],
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: FNP_SPELLS.CauseLightWounds.file,
    ability: {
      name: "ability.CauseLightWounds",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
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
    },
  },
  {
    preset: SPELLS.MassCauseLightWounds.file,
    ability: {
      name: "ability.MassCauseLightWounds",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      triggers: [
        ...triggerFactory.hasItem(
          ["LIGHT", "SERIOUS", "CRITICAL", "HARM", "SLAYLIVE"],
          true,
        ),
      ],
      requireVocal: true,
    },
  },
  {
    preset: FNP_SPELLS.CauseSeriousWounds.file,
    ability: {
      name: "ability.CauseSeriousWounds",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
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
    },
  },
  {
    preset: FNP_SPELLS.CauseCriticalWounds.file,
    ability: {
      name: "ability.CauseCriticalWounds",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
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
    },
  },
  {
    preset: SPELLS.Harm.file,
    ability: {
      name: "ability.Harm",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
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
    },
  },
  {
    preset: SPELLS.SlayLiving.file,
    ability: {
      name: "ability.SlayLiving",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      triggers: triggerFactory.hasItem(
        ["LIGHT", "SERIOUS", "CRITICAL", "HARM", "SLAYLIVE"],
        true,
      ),
      requireVocal: true,
    },
  },
  ...presetFactory.create([SPELLS.Doom.file, FNP_SPELLS.Doom.file], {
    name: "ability.Doom",
    targets: [
      {
        name: "Players",
        triggers: [
          {
            name: "CheckSpellState",
            params: [ScriptTarget.lastSeen, "DOOM"],
          },
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
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  ),
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
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: [
        {
          name: "CheckStat",
          params: [ScriptTarget.myself, 5, "SCRIPTINGSTATE4"],
        },
      ],
      range: 10,
      requireVocal: true,
    },
  },
  {
    preset: FNP_SPELLS.Forbiddance.file,
    ability: {
      name: "ability.Forbiddance",
      targets: [
        {
          name: "NearestEnemies",
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      timer: { name: "Forbiddance", value: 2 * Durations.round },
      requireVocal: true,
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
            {
              name: "CheckSpellState",
              params: [ScriptTarget.lastSeen, "MISCAST_MAGIC"],
            },
          ],
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: FNP_SPELLS.RigidThinking.file,
    ability: {
      name: "ability.RigidThinking",
      targets: [
        {
          name: "PCs",
          includeStatus: ["Able"],
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: FNP_SPELLS.Shatter.file,
    ability: {
      name: "ability.Shatter",
      targets: [
        {
          name: "NearestEnemies",
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      timer: { name: "Shatter", value: 4 * Durations.round },
      requireVocal: true,
    },
  },
  ...presetFactory.create([SPELLS.Shield.file, FNP_SPELLS.Shield.file], {
    name: "ability.Shield",
    spell: {
      selfTarget: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
    triggers: [
      {
        name: "CheckStat",
        params: [ScriptTarget.myself, 2, "SCRIPTINGSTATE5"],
      },
    ],
    requireVocal: true,
  }),
  {
    preset: FNP_SPELLS.CircleOfBones.file,
    ability: {
      name: "ability.CircleOfBones",
      spell: {
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: [
        {
          name: "CheckSpellState",
          params: [ScriptTarget.myself, "CIRCLE_OF_BONES"],
        },
      ],
      requireVocal: true,
    },
  },
  {
    preset: FNP_SPELLS.ShadowMonsters.file,
    ability: {
      name: "ability.ShadowMonsters",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      triggers: triggerFactory.haveSpellRES(
        [
          FNP_SPELLS.DemiShadowMonsters.file,
          FNP_SPELLS.AnimateDead.file,
          FNP_SPELLS.SummonShadows.file,
          FNP_SPELLS.Shades.file,
        ],
        true,
      ),
      timer: { name: "Summoning", value: 6 * Durations.round },
      requireVocal: true,
    },
  },
  {
    preset: FNP_SPELLS.DemiShadowMonsters.file,
    ability: {
      name: "ability.DemiShadowMonsters",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      triggers: triggerFactory.haveSpellRES(
        [FNP_SPELLS.SummonShadows.file, FNP_SPELLS.Shades.file],
        true,
      ),
      timer: { name: "Summoning", value: 6 * Durations.round },
      requireVocal: true,
    },
  },
  {
    preset: FNP_SPELLS.AnimateDead.file,
    ability: {
      name: "ability.AnimateDead",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      triggers: triggerFactory.haveSpellRES(
        [FNP_SPELLS.SummonShadows.file, FNP_SPELLS.Shades.file],
        true,
      ),
      timer: { name: "Summoning", value: 6 * Durations.round },
      requireVocal: true,
    },
  },
  {
    preset: FNP_SPELLS.SummonShadows.file,
    ability: {
      name: "ability.SummonShadows",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      triggers: triggerFactory.haveSpellRES([FNP_SPELLS.Shades.file], true),
      timer: { name: "Summoning", value: 6 * Durations.round },
      requireVocal: true,
    },
  },
  {
    preset: FNP_SPELLS.Shades.file,
    ability: {
      name: "ability.Shades",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      timer: { name: "Summoning", value: 6 * Durations.round },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.FingerOfDeath.file,
    ability: {
      name: "ability.FingerOfDeath",
      targets: [
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
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Wither.file,
    ability: {
      name: "ability.Wither",
      targets: [
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
      range: 10,
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.DolorousDecay.file,
    ability: {
      name: "ability.DolorousDecay",
      targets: [
        {
          name: "Players",
          randomOrder: true,
          triggers: [
            {
              name: "StateCheck",
              params: [ScriptTarget.token, "STATE_POISONED"],
            },
          ],
        },
        {
          name: "Players",
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
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
            {
              name: "StateCheck",
              params: [ScriptTarget.token, "STATE_POISONED"],
            },
          ],
        },
        {
          name: "Players",
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.MagicResistance.file,
    ability: {
      name: "ability.MagicResistance",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
    },
  },
  ...presetFactory.create(
    [SPELLS.CloudOfPestilence.file, FNP_SPELLS.CloudOfPestilence.file],
    {
      name: "ability.CloudOfPestilence",
      targets: [
        {
          name: "NearestEnemies",
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
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
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      timer: { name: "WavesOfAgony", value: 3 * Durations.round },
      requireVocal: true,
    },
  },
  {
    preset: FNP_SPELLS.WavesOfFatigue.file,
    ability: {
      name: "ability.WavesOfFatigue",
      targets: [
        {
          name: "Players",
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Glitterdust.file,
    ability: {
      name: "ability.Glitterdust",
      targets: [
        {
          name: "Players",
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.SpellThrust.file,
    ability: {
      name: "ability.SpellThrust",
      targets: [
        {
          name: "PCSpellcasters",
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: [
        {
          name: "CheckSpellState",
          params: [ScriptTarget.lastSeen, "BUFF_PRO_SPELLS"],
        },
      ],
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.MinorSpellDeflection.file,
    ability: {
      name: "ability.MinorSpellDeflection",
      spell: {
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: triggerFactory.seeOneInTargetList("PCSpellcasters"),
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.MirrorImages.file,
    ability: {
      name: "ability.MirrorImages",
      spell: {
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: [
        {
          name: "StateCheck",
          params: [ScriptTarget.myself, "STATE_MIRRORIMAGE"],
          negation: true,
        },
      ],
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Haste.file,
    ability: {
      name: "ability.Haste",
      spell: {
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: [
        {
          name: "StateCheck",
          params: [ScriptTarget.myself, "STATE_HASTED"],
          negation: true,
        },
      ],
      requireVocal: true,
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
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.MelfAcidArrow.file,
    ability: {
      name: "ability.MelfAcidArrow",
      targets: [
        {
          name: "PCSpellcasters",
          randomOrder: true,
        },
        {
          name: "Players",
          randomOrder: true,
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
];
