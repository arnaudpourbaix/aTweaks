import presetFactory from "../../src/factories/preset.factory";
import triggerFactory from "../../src/factories/trigger.factory";
import { AbilityPreset } from "../../src/model/misc";
import { DEFAULT_SPELL_PROBABILITY, PRESET_NAMES } from "../common";
import { FNP_SPELLS, SPELLS } from "../spell-names";

export const BUFF_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.Vocalize.file,
    ability: {
      name: "ability.Vocalize",
      spell: {
        probability: 100,
        selfTarget: true,
      },
      triggers: [triggerFactory.stateCheck("STATE_SILENCED")],
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
      triggers: [triggerFactory.detect("NearestEnemyOf")],
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
      triggers: [triggerFactory.detect("NearestEnemyOf")],
    },
  },
  {
    preset: SPELLS.ShadowDoor.file,
    ability: {
      name: "ability.ShadowDoor",
      spell: {
        excludeStateChecks: ["STATE_IMPROVEDINVISIBILITY"],
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
      triggers: [
        triggerFactory.detect("NearestEnemyOf"),
        triggerFactory.hplt(75),
      ],
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
      triggers: [triggerFactory.stateCheck("STATE_BLIND")],
    },
  },
  {
    preset: PRESET_NAMES.DimensionDoorOffscreen,
    ability: {
      name: "ability.dimensionDoor",
      disableInterrupt: true,
      triggers: [
        triggerFactory.or([
          { name: "Range", params: ["NearestEnemyOf", 15] },
          triggerFactory.attackedBy("ANYONE", "DEFAULT"),
        ]),
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
  ...presetFactory.create([SPELLS.Shield.file, FNP_SPELLS.Shield.file], {
    name: "ability.Shield",
    spell: {
      selfTarget: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
    triggers: [triggerFactory.checkStat(2, "SCRIPTINGSTATE5")],
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
      triggers: [triggerFactory.checkSpellState("CIRCLE_OF_BONES", true)],
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
    preset: SPELLS.FireShield.file,
    ability: {
      name: "ability.FireShield",
      spell: {
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: [triggerFactory.checkStatGT(0, "WIZARD_FIRE_SHIELD", true)],
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
        excludeStateChecks: ["STATE_MIRRORIMAGE"],
      },
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
        excludeStateChecks: ["STATE_HASTED"],
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.ProtectionFromMissiles.file,
    ability: {
      name: "ability.ProtectionFromMissiles",
      spell: {
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: [
        triggerFactory.checkSpellState("PROTECTION_FROM_NORMAL_MISSILES", true),
      ],
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.MinorGlobeOfInvulnerability.file,
    ability: {
      name: "ability.MinorGlobeOfInvulnerability",
      spell: {
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  ...presetFactory.create([SPELLS.Stoneskin.file, SPELLS.Ironskin.file], {
    name: "ability.Stoneskin",
    spell: {
      selfTarget: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
    triggers: [triggerFactory.checkStatLT(2, "STONESKINS")],
    requireVocal: true,
  }),
  {
    preset: SPELLS.ProtectionFromMagicalWeapons.file,
    ability: {
      name: "ability.ProtectionFromMagicalWeapons",
      spell: {
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      triggers: [
        triggerFactory.checkStatGT(
          0,
          "WIZARD_PROTECTION_FROM_MAGIC_WEAPONS",
          true,
        ),
      ],
      requireVocal: true,
    },
  },
];
