import triggerFactory from "../../src/factories/trigger.factory";
import { Durations } from "../../src/model/constants";
import { AbilityPreset } from "../../src/model/misc";
import { DEFAULT_SPELL_PROBABILITY } from "../common";
import { FNP_SPELLS, SPELLS } from "../spell-names";

export const SUMMON_PRESETS: AbilityPreset[] = [
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
    },
  },
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
      timer: { name: "Summoning", value: 6 * Durations.round },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
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
      timer: { name: "Summoning", value: 6 * Durations.round },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: FNP_SPELLS.AnimateDead.file,
    ability: {
      name: "ability.AnimateDead",
      spell: {
        selfTarget: true,
      },
      triggers: triggerFactory.haveSpellRES(
        [FNP_SPELLS.SummonShadows.file, FNP_SPELLS.Shades.file],
        true,
      ),
      timer: { name: "Summoning", value: 6 * Durations.round },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
  {
    preset: FNP_SPELLS.SummonShadows.file,
    ability: {
      name: "ability.SummonShadows",
      spell: {
        selfTarget: true,
      },
      triggers: triggerFactory.haveSpellRES([FNP_SPELLS.Shades.file], true),
      timer: { name: "Summoning", value: 6 * Durations.round },
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
      timer: { name: "Summoning", value: 6 * Durations.round },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
    },
  },
];
