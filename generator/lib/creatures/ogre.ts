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
  data: {
    level1: 4,
    bonusHp: 1,
    strength: 19,
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
    gender: "MALE",
    size: "Large",
  },
  additionalData: {
    proficiencies: [{ type: "PROFICIENCYTWOHANDEDSWORD", value: 2 }],
    effects: [
      {
        opcode: "AttackDamageBonus",
        type: "Increment",
        value: 2,
        global: true,
      },
    ],
    removeItems: ["OGRE1", "B1-2", "B2-16"],
    removeScripts: ["BDSUM00", "OGRE"],
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
      damageBonus: 3,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
    {
      file: chiefWeapon,
      type: "Melee",
      diceThrown: 2,
      diceSize: 6,
      damageBonus: 6,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: [
    "AC#FP2O1",
    "AC#FP2O2",
    "AC#FP2OT", // Thrall
    "AC#FPOG4", // Bagut
    "AC#WRIM1", // Wrimbog
    "ACQ13002", // Ugh
    "BDARBING", // Arbinge
    "BDBERTOR", // Betror
    "BDCCOGR1", // Ogre Crusader
    "BDCHESKI", // Cheski
    "BDEINER", // Einer
    "BDOGRE01",
    "BDOGRE1D",
    "BDOGREF",
    "BDOGREM", // Ogre Leader
    "BDSLUG", // Slug
    "BDSLUG2", // Slug
    "BDSOGR1", //TODO:
    "BDSOGR2", //TODO:
    "BDWAVE13", // Ogre Crusader
    "BDYAROK", // Yarok
    "BPOGRE01",
    "BSOGRED",
    "GORF", // Gorf
    "HACK", // Hack
    "KROTAN", // Krotan
    "L#MCMIN", // Minotaur
    "LARZE", // Larze
    "NTKROTAN", // Krotan
    "NTOGREDA", // Daddy
    "NTWELT", // Welt
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
    "OOPAH", // The Amazing Oopah
    "OOPAH2", // The Amazing Oopah
    "PLYOGRE",
    "SEWERF4", // Ogre Leader
    "WELT", // Welt
    "WIOGRE01",
    "X3HOGRE",
    "X3HOGRE2",
    "X3HOGRED",
  ],
  // leader is a 7 Hit Dice monster with Armor Class 3. XP 650
  // He inflicts 2d6+3 points of damage per attack.
  //
  // chieftain is a 7+4 Hit Dice monster with Armor Class 2. XP 975
  // He inflicts 2d6+6 points of damage per attack.
  adjustments: [
    { files: ["X3HOGRE2"], noScript: true },
    { files: ["OOPAH", "WELT"], data: { class: "INNOCENT" } },
    { files: ["OOPAH", "OOPAH2"], data: { level1: 5 } },
    {
      files: ["SEWERF4", "BDOGREM"],
      data: { level1: 7, ac: 3, xpv: 650 },
      additionalData: { itemSlots: [{ file: leaderWeapon, slot: "WEAPON1" }] },
    },
    { files: ["AC#FP2OT"], noWeapon: true },
  ],
};
