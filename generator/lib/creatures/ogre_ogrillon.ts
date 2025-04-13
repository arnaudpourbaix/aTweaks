import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster-id";

// Creature Id
const id = MonsterEnum.Ogrillon;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);

export const OGRE_OGRILLON: RawCreature = {
  name: "Ogrillon",
  bafFile: `lib/pnp-monster/ogre/ja#m${id}`,
  tpaFile: "lib/pnp-monster/ogre/ogrillon",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 2,
    bonusHp: 4,
    strength: 18,
    dexterity: 9,
    constitution: 14,
    intelligence: 6,
    wisdom: 7,
    charisma: 7,
    movement: 12,
    ac: 6,
    apr: 2,
    xpv: 175,
    alignment: "CHAOTIC_EVIL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "OGRE",
    class: "OGRE_OGRILLON",
    gender: "MALE",
    size: "Medium",
  },
  additionalData: {
    removeItems: ["P2-8"],
  },
  items: [
    {
      file: `ja#m${id}w1`,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 6,
      damageBonus: 1,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: [
    "BDKORDEO",
    "OGREGR",
    "OGREGR1",
    "OGREGR2",
    "OGREGR3",
    "OGREGR4",
    "OGREGR_A",
    "OGREGR_B",
    "OGREGR_C",
    "OGREGR_D",
    "OGRELESU",
    "OGREMIRI",
  ],
};
