import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.Ogre;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
const leaderWeapon = file(2, id);
const chiefWeapon = file(3, id);

export const OGRE: RawCreature = {
  name: "Ogre",
  bafFile: `lib/pnp-monster/ogre/${script}`,
  tpaFile: "lib/pnp-monster/ogre/ogre",
  tracking: true,
  combatWalk: true,
  usePotions: true,
  data: {
    level1: 4,
    bonusHp: 1,
    strength: 18,
    dexterity: 8,
    constitution: 16,
    intelligence: 8,
    wisdom: 7,
    charisma: 7,
    movement: 9,
    ac: 5,
    apr: 1,
    xpv: 270,
    alignment: "CHAOTIC_EVIL",
    morale: 12,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "OGRE",
    class: "OGRE",
    size: "Large",
  },
  additionalData: {
    proficiencies: [{ type: "PROFICIENCYTWOHANDEDSWORD", value: 2 }],
    removeItems: ["OGRE1", "B1-2", "B3-12", "B2-16", "BLUN07", "SHLD03"],
    removeScripts: ["BDSUM00", "OGRE"],
  },
  attack: {
    targetPriorities: [
      {
        // The ogres fight more wisely when led by a half-ogre that concentrates assaults on characters it recognizes as spellcasters and teaming up against skilled fighters.
        targets: ["PCSpellcasters", "PCsPreferringStrong"],
      },
    ],
  },
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 10,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
    {
      file: leaderWeapon,
      type: "Melee",
      diceThrown: 2,
      diceSize: 6,
      damageType: "Crushing",
      proficiency: "PROFICIENCYTWOHANDEDSWORD",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
    {
      file: chiefWeapon,
      type: "Melee",
      diceThrown: 2,
      diceSize: 6,
      damageType: "Crushing",
      proficiency: "PROFICIENCYTWOHANDEDSWORD",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: [
    "AC#FP2O1",
    "AC#FP2O2",
    "BDOGRE01",
    "BDOGRE1D",
    "BDOGREF",
    "BDOGREM",
    "BPOGRE01",
    "BSOGRED",
    "OGRE",
    "OGRE02",
    "OGRE03",
    "OGRE04",
    "OGRE05",
    "OGRECO",
    "OGRED",
    "OGRES",
    "OGRESU",
    "OGREUNSH",
    "OGRE_A",
    "OGRE_B",
    "OGRE_C",
    "OGRE_D",
    "OGRE_E",
    "PLYOGRE",
    "WIOGRE01",
    "X3HOGRE",
    "X3HOGRE2",
    "X3HOGRED",
    "BDSOGR1",
    "BDSOGR2",
    "AC#FP2OT", // Thrall
    "AC#FPOG4", // Bagut
    "AC#WRIM1", // Wrimbog
    "ACQ13002", // Ugh
    //"BDCCOGR1", // Ogre Crusader (doesn't seem to be used because no script)
    "GORF", // Gorf
    "HACK", // Hack
    "LARZE", // Larze
    "KROTAN", // Krotan
    "NTKROTAN", // Krotan
    "NTOGREDA", // Daddy
    "NTWELT", // Welt
    "WELT", // Welt
    "OOPAH", // The Amazing Oopah
    "OOPAH2", // The Amazing Oopah
    "SEWERF4", // Ogre Leader
  ],
  adjustments: [
    { files: ["OGRESU"], summon: true },
    { files: ["X3HOGRE", "X3HOGRE2", "X3HOGRED"], noScript: true },
    { files: ["OOPAH", "WELT"], data: { class: "INNOCENT" } },
    { files: ["OOPAH", "OOPAH2"], data: { level1: 5 } },
    {
      // leader is a 7 Hit Dice monster with Armor Class 3, Strenth 18/50, XP 650
      // He inflicts 2d6+3 points of damage per attack.
      files: ["SEWERF4", "BDOGREM", "NTOGREDA"],
      data: {
        level1: 7,
        ac: 3,
        exceptionalStrength: 50,
        xpv: 650,
      },
      additionalData: { itemSlots: [{ file: leaderWeapon, slot: "WEAPON1" }] },
    },
    {
      // chieftain is a 7+4 Hit Dice monster with Armor Class 2, Strenth 18/100, XP 975
      // He inflicts 2d6+6 points of damage per attack.
      files: [
        "AC#WRIM1",
        "AC#FP2O2",
        "BDSOGR1",
        "BDSOGR2",
        "ACQ13002",
        "GORF",
        "HACK",
        "LARZE",
      ],
      data: {
        level1: 7,
        bonusHp: 4,
        ac: 2,
        exceptionalStrength: 100,
        xpv: 975,
      },
      additionalData: { itemSlots: [{ file: chiefWeapon, slot: "WEAPON1" }] },
    },
    {
      files: ["NTOGREDA"],
      data: {
        class: "FIGHTER",
      },
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYTWOHANDEDSWORD", value: 4 }],
      },
    },
    {
      // will have morning star +1
      files: ["AC#FP2OT", "BDSOGR1", "BDSOGR2"],
      noWeapon: true,
      additionalData: {
        itemSlots: [{ file: "BLUN07", slot: "WEAPON1" }],
        proficiencies: [{ type: "PROFICIENCYFLAILMORNINGSTAR", value: 2 }],
      },
    },
    {
      files: ["BDSOGR1", "BDSOGR2"],
      data: { class: "FIGHTER" },
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYFLAILMORNINGSTAR", value: 4 }],
      },
    },
    {
      files: ["GORF", "AC#WRIM1", "HACK", "LARZE", "KROTAN", "NTKROTAN"],
      data: {
        level1: 9,
        strength: 19,
        exceptionalStrength: 0,
        morale: 18,
        class: "FIGHTER",
        xpv: 2000,
      },
      additionalData: {
        proficiencies: [
          { type: "PROFICIENCYTWOHANDEDSWORD", value: 5 },
          { type: "PROFICIENCYLONGSWORD", value: 5 },
        ],
      },
    },
    {
      files: ["AC#WRIM1"],
      data: { level1: 10 },
    },
    {
      files: ["HACK"],
      data: { level1: 11 },
    },
    {
      files: ["LARZE", "KROTAN", "NTKROTAN"],
      data: { level1: 13 },
    },
    {
      files: ["KROTAN", "NTKROTAN"],
      data: { level1: 15, ac: 10 },
      noWeapon: true,
    },
  ],
};
