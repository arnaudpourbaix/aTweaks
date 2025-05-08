import { SPELLS } from "../config/spell-names";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.HalfOgre;
// Script
const script = bafFile(id);

export const OGRE_HALF: RawCreature = {
  name: "Half Ogre",
  bafFile: `lib/pnp-monster/ogre/${script}`,
  tpaFile: "lib/pnp-monster/ogre/half",
  tracking: true,
  combatWalk: true,
  usePotions: true,
  useKitAbilities: true,
  data: {
    level1: 2,
    bonusHp: 6,
    strength: 17,
    dexterity: 10,
    constitution: 14,
    intelligence: 9,
    wisdom: 9,
    charisma: 10,
    movement: 12,
    ac: 5,
    apr: 1,
    xpv: 175,
    alignment: "CHAOTIC_EVIL",
    morale: 12,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "OGRE",
    class: "OGRE_HALFOGRE",
    size: "Large",
  },
  additionalData: {
    proficiencies: [
      { type: "PROFICIENCYBASTARDSWORD", value: 2 },
      { type: "PROFICIENCYTWOHANDEDSWORD", value: 2 },
    ],
    removeItems: [],
    removeScripts: ["HALFOGRE", "BDFIG00"],
  },
  attack: {
    targetPriorities: [
      {
        // The ogres fight more wisely when led by a half-ogre that concentrates assaults on characters it recognizes as spellcasters and teaming up against skilled fighters.
        targets: ["PCSpellcasters", "PCsPreferringStrong"],
      },
    ],
  },
  files: [
    "OGREBJOR",
    "OGREHA",
    "OGREHA1",
    "OGREHA2",
    "OGREHA3",
    "OGREHA4",
    "OGREHA5",
    "OGREHA_A",
    "OGREHA_B",
    "OGREHA_C",
    "OGREHA_D",
    "OGREHA_E",
    "BDOGRE04", // Half-Ogre Veteran
    "ARGHAI", // Arghain
    "L#CHIEN", // Eglarh
    "TAZOK", // Tazok (bandit camp)
    "TAZOK2", // Tazok (finale fight)
    "X#CHOP", // Chop The Lady Ogre
    "X#CRU11", // Cru The Lady Ogre
  ],
  adjustments: [
    {
      // Veteran with 5+3 Hit Dice.
      files: ["BDOGRE04", "ARGHAI", "X#CHOP", "X#CRU11"],
      data: {
        level1: 5,
        bonusHp: 3,
        strength: 18,
        ac: 3,
        xpv: 520,
      },
    },
    {
      files: ["ARGHAI"],
      data: {
        exceptionalStrength: 100,
      },
    },
    {
      files: ["BDOGRE04"],
      data: {
        exceptionalStrength: 83,
      },
    },
    {
      files: ["X#CHOP", "X#CRU11"],
      data: {
        strength: 19,
      },
    },
    {
      // Boss, level 9 fighter
      files: ["TAZOK", "TAZOK2", "L#CHIEN"],
      data: {
        level1: 9,
        strength: 18,
        ac: 10,
        class: "FIGHTER",
        morale: 20,
        xpv: 4000,
      },
    },
    {
      // Tazok, level 9 berserker
      files: ["TAZOK", "TAZOK2"],
      data: {
        kit: "BERSERKER",
      },
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYTWOHANDEDSWORD", value: 5 }],
        memorizedSpells: [{ file: SPELLS.BerserkerRage, memorizedCount: 1 }],
      },
    },
    {
      // Tazok, level 11 berserker
      files: ["TAZOK2"],
      data: {
        level1: 11,
        resistFire: 70,
      },
    },
    {
      // Eglarh, level 9 fighter
      files: ["L#CHIEN"],
      data: {
        resistFire: 50,
        resistCold: 50,
        resistMissile: 100,
      },
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYLONGSWORD", value: 5 }],
      },
    },
  ],
};
