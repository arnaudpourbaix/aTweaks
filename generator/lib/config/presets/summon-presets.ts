import presetFactory from "../../src/factories/preset.factory";
import triggerFactory from "../../src/factories/trigger.factory";
import { Durations } from "../../src/model/game-data/durations";
import { AbilityPreset } from "../../src/model/misc";
import { DEFAULT_SPELL_PROBABILITY } from "../common";
import { FNP_SPELLS, SPELLS } from "../spell-names";

const summoningTrigger = (rounds = 2) => ({ name: "Summoning", value: rounds * Durations.round });

export const SUMMON_PRESETS: AbilityPreset[] = [
  {
    preset: FNP_SPELLS.ShadowMonsters.file,
    ability: {
      name: "ability.ShadowMonsters",
      spell: {
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
      timer: summoningTrigger(),
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.CallWoodlandBeeings.file,
    ability: {
      name: "ability.callWoodlandBeeings",
      spell: {},
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
      triggers: [
        {
          name: "AreaType",
          params: ["OUTDOOR"],
        },
      ],
      timer: summoningTrigger(),
    },
  },
  {
    preset: FNP_SPELLS.DemiShadowMonsters.file,
    ability: {
      name: "ability.DemiShadowMonsters",
      spell: {
        selfTarget: true,
      },
      triggers: triggerFactory.haveSpellRES(
        [FNP_SPELLS.SummonShadows.file, FNP_SPELLS.Shades.file],
        true,
      ),
      timer: summoningTrigger(),
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
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
      spell: {},
      timer: summoningTrigger(),
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  ...presetFactory.create([SPELLS.AnimateDead.file, FNP_SPELLS.AnimateDead.file], {
    name: "ability.AnimateDead",
    spell: {
      selfTarget: true,
    },
    triggers: triggerFactory.haveSpellRES(
      [FNP_SPELLS.SummonShadows.file, FNP_SPELLS.Shades.file],
      true,
    ),
    timer: summoningTrigger(),
    requireVocal: true,
    probability: DEFAULT_SPELL_PROBABILITY,
  }),
  {
    preset: FNP_SPELLS.SummonShadows.file,
    ability: {
      name: "ability.SummonShadows",
      spell: {
        selfTarget: true,
      },
      triggers: triggerFactory.haveSpellRES([FNP_SPELLS.Shades.file], true),
      timer: summoningTrigger(),
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: FNP_SPELLS.Shades.file,
    ability: {
      name: "ability.Shades",
      spell: {
        selfTarget: true,
      },
      timer: summoningTrigger(),
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: SPELLS.AerialServant.file,
    ability: {
      name: "ability.AerialServant",
      spell: {
        selfTarget: true,
      },
      timer: summoningTrigger(),
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
];
