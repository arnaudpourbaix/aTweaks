import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
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
    effects: [
      {
        opcode: "AttackDamageBonus",
        type: "Increment",
        value: 2,
        global: true,
      },
    ],
    removeItems: [],
    removeScripts: ["HALFOGRE", "BDFIG00"],
  },
  attack: {
    targetPriorities: [
      {
        // The ogres fight more wisely when led by a half-ogre that concentrates assaults on characters it recognizes as spellcasters,
        // and teaming up against skilled fighters.
        targets: ["PCSpellcasters", "PCsPreferringStrong"],
      },
    ],
    //
    // use potions!
    // use kit abilities
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
    "TAZOK", // Tazok
    "TAZOK2", // Tazok
    "X#CHOP", // Chop The Lady Ogre
    "X#CRU11", // Cru The Lady Ogre
  ],
  // notEnforceFiles: ["L#CHIEN"],
  adjustments: [
    {
      // Veteran with 5+3 Hit Dice.
      files: ["BDOGRE04"],
      data: {
        level1: 5,
        bonusHp: 3,
        strength: 18,
        exceptionalStrength: 100,
        xpv: 420,
      },
    },
    // Kader with 6 Hit Dice.
    {
      // Boss, level 9 fighter
      files: ["L#CHIEN"],
      data: {
        level1: 9,
        strength: 18,
        exceptionalStrength: 100,
        class: "FIGHTER",
        resistFire: 50,
        resistCold: 50,
        resistMissile: 100,
        xpv: 4000,
      },
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYLONGSWORD", value: 4 }],
      },
    },
    // Shaman, a fighter/priest with 5+3 Hit Dice and the spells of a 4th-level priest
    // Acolyte shamans, with 4+6 Hit Dice and the spells of a 2nd-level priest.
  ],
};
