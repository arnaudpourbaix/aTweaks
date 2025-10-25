import { RawCreature } from "../src/model/raw/creature";
import { bafFile, getFilename } from "../src/services/misc.func";
import { MonsterEnum } from "./monster";

// Creature Id
const id = MonsterEnum.Ogre; //TODO:
// Script
const script = bafFile(id);
// Items
const mainWeapon = getFilename(1, id);
const leaderWeapon = getFilename(2, id);
const chiefWeapon = getFilename(3, id);

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
    removeItems: ["OGRE1", "B1-2", "B3-12", "B2-16"],
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
    "L#MCMIN", // Minotaur
  ],
};
