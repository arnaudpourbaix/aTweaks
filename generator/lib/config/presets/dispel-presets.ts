import presetFactory from "../../src/factories/preset.factory";
import triggerFactory from "../../src/factories/trigger.factory";
import { AbilityPreset } from "../../src/model/misc";
import { DEFAULT_SPELL_PROBABILITY } from "../common";
import { SPELLS } from "../spell-names";

export const DISPEL_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.DetectInvisibility.file,
    ability: {
      name: "ability.detectInvisibility",
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      triggers: [
        triggerFactory.detect("PC"),
        triggerFactory.checkSpellState("DETECT_INVISIBILITY", true),
      ],
      requireVocal: true,
    },
  },
  ...presetFactory.create([SPELLS.DispelMagic.file, SPELLS.RemoveMagic.file], {
    name: "ability.dispelMagic",
    targets: [
      {
        name: "Players",
        randomOrder: true,
        triggers: [
          triggerFactory.stateCheck("STATE_CHARMED", true),
          triggerFactory.checkStatGT(0, "CLERIC_INSECT_PLAGUE", true),
          {
            name: "Or",
            triggers: [
              triggerFactory.checkStatGT(0, "MINORGLOBE"),
              triggerFactory.checkStatGT(0, "STONESKINS"),
              triggerFactory.checkStatGT(0, "WIZARD_RESIST_FEAR"),
              triggerFactory.checkStatGT(0, "CLERIC_CHAOTIC_COMMANDS"),
              triggerFactory.checkStatGT(49, "RESISTFIRE"),
              triggerFactory.checkStatGT(
                0,
                "WIZARD_PROTECTION_FROM_MAGIC_WEAPONS",
              ),
              triggerFactory.stateCheck("STATE_MIRRORIMAGE"),
              triggerFactory.stateCheck("STATE_HASTED"),
              triggerFactory.stateCheck("STATE_DRAWUPONHOLYMIGHT"),
            ],
          },
        ],
      },
    ],
    spell: {
      probability: DEFAULT_SPELL_PROBABILITY,
      excludeStateChecks: ["STATE_DISABLED"],
    },
    requireVocal: true,
  }),
  {
    preset: SPELLS.Breach.file,
    ability: {
      name: "ability.Breach",
      targets: [
        {
          name: "PCSpellcasters",
          randomOrder: true,
          triggers: [
            triggerFactory.or([
              triggerFactory.hasBounceEffects(),
              triggerFactory.hasImmunityEffects(),
            ]),
          ],
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
        excludeStateChecks: ["STATE_DISABLED"],
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
          triggers: [triggerFactory.checkSpellState("BUFF_PRO_SPELLS")],
        },
      ],
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
];
