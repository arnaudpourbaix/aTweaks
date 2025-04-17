import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.HalfOgre;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);

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
    xpv: 270,
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
  // items: [
  //   {
  //     file: mainWeapon,
  //     equippedSlot: "WEAPON1",
  //     type: "Melee",
  //     flags: ["TwoHanded"],
  //     animation: "BastardSword",
  //     category: "BastardSwords",
  //     proficiency: "PROFICIENCYBASTARDSWORD",
  //     animationSwing: { backhand: 40, overhand: 40, thrust: 20 },
  //     range: 2,
  //     diceThrown: 1,
  //     diceSize: 10,
  //     damageBonus: 2,
  //     damageType: "Slashing",
  //     speed: 7,
  //     abilityFlags: ["AddStrengthBonus"],
  //   },
  // ],
  attack: {
    // The ogres fight more wisely when led by a half-ogre that concentrates assaults on characters it recognizes as spellcasters,
    // and teaming up against skilled fighters.
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
  notEnforceFiles: ["L#CHIEN"],
  adjustments: [
    {
      files: ["BDOGRE04"],
      data: {
        level1: 5,
        bonusHp: 3,
        xpv: 520,
        strength: 18,
        exceptionalStrength: 100,
      },
    },
    {
      files: ["L#CHIEN"],
      data: { level1: 8 },
    },
  ],
};
