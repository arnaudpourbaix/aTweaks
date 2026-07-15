import presetFactory from "../../src/factories/preset.factory";
import triggerFactory from "../../src/factories/trigger.factory";
import { AbilityPreset } from "../../src/model/misc";
import { DEFAULT_SPELL_PROBABILITY, PRESET_NAMES } from "../common";
import { FNP_SPELLS } from "../spells/fnp-spell-names";
import { SPELLS } from "../spells/spell-names";

export const BUFF_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.Wizard.Vocalize.file,
    ability: {
      name: "ability.Vocalize",
      spell: {
        selfTarget: true,
      },
      requireVocal: false,
      probability: 100,
      triggers: [triggerFactory.stateCheck("STATE_SILENCED")],
    },
  },
  {
    preset: SPELLS.Wizard.Invisibility.file,
    ability: {
      name: "ability.invisibility",
      spell: {
        excludeStateChecks: ["STATE_INVISIBLE"],
        selfTarget: true,
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
      triggers: [triggerFactory.detect("NearestEnemyOf")],
    },
  },
  {
    preset: SPELLS.Wizard.ImprovedInvisibility.file,
    ability: {
      name: "ability.improvedInvisibility",
      spell: {
        excludeStateChecks: ["STATE_IMPROVEDINVISIBILITY"],
        selfTarget: true,
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
      triggers: [triggerFactory.detect("NearestEnemyOf")],
    },
  },
  {
    preset: SPELLS.Wizard.ShadowDoor.file,
    ability: {
      name: "ability.ShadowDoor",
      spell: {
        excludeStateChecks: ["STATE_IMPROVEDINVISIBILITY"],
        selfTarget: true,
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
      triggers: [triggerFactory.detect("NearestEnemyOf"), triggerFactory.hplt(75)],
    },
  },
  {
    preset: SPELLS.Priest.Bless.file,
    ability: {
      name: "ability.bless",
      spell: {
        selfTarget: true,
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Priest.ResistFear.file,
    ability: {
      name: "ability.resistFear",
      spell: {
        selfTarget: true,
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Priest.Chant.file,
    ability: {
      name: "ability.chant",
      spell: {
        selfTarget: true,
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Wizard.DimensionDoor.file,
    ability: {
      name: "ability.dimensionDoor",
      targets: [
        {
          name: "Players",
          randomOrder: true,
        },
      ],
      range: 900,
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
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
        id: SPELLS.Wizard.DimensionDoor.id,
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
    preset: SPELLS.Priest.Barkskin.file,
    ability: {
      name: "ability.barkskin",
      spell: {
        selfTarget: true,
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  ...presetFactory.create([SPELLS.Wizard.Shield.file, FNP_SPELLS.Priest.Shield.file], {
    name: "ability.Shield",
    spell: {
      selfTarget: true,
    },
    triggers: [triggerFactory.checkStat(2, "SCRIPTINGSTATE5")],
    requireVocal: true,
    probability: DEFAULT_SPELL_PROBABILITY,
  }),
  {
    preset: FNP_SPELLS.Priest.CircleOfBones.file,
    ability: {
      name: "ability.CircleOfBones",
      spell: {
        selfTarget: true,
      },
      triggers: [triggerFactory.checkSpellState("CIRCLE_OF_BONES", true)],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Priest.MagicResistance.file,
    ability: {
      name: "ability.MagicResistance",
      spell: {
        selfTarget: true,
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Wizard.MinorSpellDeflection.file,
    ability: {
      name: "ability.MinorSpellDeflection",
      spell: {
        selfTarget: true,
      },
      triggers: triggerFactory.seeOneInTargetList("PCSpellcasters"),
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Wizard.FireShield.file,
    ability: {
      name: "ability.FireShield",
      spell: {
        selfTarget: true,
      },
      triggers: [triggerFactory.checkStatGT(0, "WIZARD_FIRE_SHIELD", true)],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Wizard.MirrorImages.file,
    ability: {
      name: "ability.MirrorImages",
      spell: {
        selfTarget: true,
        excludeStateChecks: ["STATE_MIRRORIMAGE"],
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Wizard.Haste.file,
    ability: {
      name: "ability.Haste",
      spell: {
        selfTarget: true,
        excludeStateChecks: ["STATE_HASTED"],
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Wizard.ProtectionFromMissiles.file,
    ability: {
      name: "ability.ProtectionFromMissiles",
      spell: {
        selfTarget: true,
      },
      triggers: [triggerFactory.checkSpellState("PROTECTION_FROM_NORMAL_MISSILES", true)],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Wizard.MinorGlobeOfInvulnerability.file,
    ability: {
      name: "ability.MinorGlobeOfInvulnerability",
      spell: {
        selfTarget: true,
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  ...presetFactory.create([SPELLS.Wizard.Stoneskin.file, SPELLS.Priest.Ironskin.file], {
    name: "ability.Stoneskin",
    spell: {
      selfTarget: true,
    },
    triggers: [triggerFactory.checkStatLT(2, "STONESKINS")],
    requireVocal: true,
    probability: DEFAULT_SPELL_PROBABILITY,
  }),
  {
    preset: SPELLS.Wizard.ProtectionFromMagicalWeapons.file,
    ability: {
      name: "ability.ProtectionFromMagicalWeapons",
      spell: {
        selfTarget: true,
      },
      triggers: [triggerFactory.checkStatGT(0, "WIZARD_PROTECTION_FROM_MAGIC_WEAPONS", true)],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Wizard.Blur.file,
    ability: {
      name: "ability.Blur",
      spell: {
        selfTarget: true,
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Priest.BladeBarrier.file,
    ability: {
      name: "ability.BladeBarrier",
      spell: {
        selfTarget: true,
      },
      triggers: [triggerFactory.checkStatGT(0, "CLERIC_BLADE_BARRIER", true)],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Priest.RighteousMagic.file,
    ability: {
      name: "ability.RighteousMagic",
      spell: {
        selfTarget: true,
      },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Priest.TrueSeeing.file,
    ability: {
      name: "ability.TrueSeeing",
      spell: {
        selfTarget: true,
      },
      triggers: [triggerFactory.checkStatGT(0, "TRUE_SIGHT", true)],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Priest.HolyPower.file,
    ability: {
      name: "ability.HolyPower",
      spell: {
        selfTarget: true,
      },
      triggers: [triggerFactory.checkStatLT(100, "STR")],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Priest.ProtectionFromLightning.file,
    ability: {
      name: "ability.ProtectionFromLightning",
      spell: {
        selfTarget: true,
      },
      triggers: [triggerFactory.checkStatLT(100, "RESISTELECTRICITY")],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.Priest.DrawUponHolyMight.file,
    ability: {
      name: "ability.DrawUponHolyMight",
      spell: {
        selfTarget: true,
      },
      triggers: [triggerFactory.checkStat(4, "SCRIPTINGSTATE6", true)],
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
];
