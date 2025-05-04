import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.Treant;
// Script
const script = bafFile(id);
// Items
const mainWeapon8hd = file(1, id);
const mainWeapon10hd = file(2, id);
const mainWeapon12hd = file(3, id);

export const PLANT_TREANT: RawCreature = {
  name: "Treant",
  bafFile: `lib/pnp-monster/plant/${script}`,
  tpaFile: "lib/pnp-monster/plant/treant",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 7,
    strength: 23,
    dexterity: 8,
    constitution: 21,
    intelligence: 12,
    wisdom: 16,
    charisma: 12,
    movement: 12,
    ac: 0,
    apr: 2,
    xpv: 2000,
    alignment: "CHAOTIC_GOOD",
    morale: 16,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "PLANT",
    race: "TREANT",
    class: "NO_CLASS",
    gender: "NIETHER",
    size: "Huge",
    resistFire: -25,
  },
  additionalData: {
    removeItems: ["BDTREANT", "BDPLANT", "IPSION"],
    removeScripts: ["BDENSHTV", "BDFIG00"],
  },
  items: [
    {
      file: mainWeapon8hd,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 2,
      diceSize: 8,
      damageType: "Crushing",
      speed: 8,
      abilityFlags: ["AddStrengthBonus"],
    },
    {
      file: mainWeapon10hd,
      copyFrom: mainWeapon8hd,
      diceThrown: 3,
      diceSize: 6,
    },
    {
      file: mainWeapon12hd,
      copyFrom: mainWeapon10hd,
      diceThrown: 4,
    },
  ],
  files: ["ja#trea1", "ja#trea2", "ja#trea3"],
  adjustments: [
    { files: ["ja#trea1", "ja#trea2", "ja#trea3"], summon: true },
    {
      files: ["ja#trea2"],
      data: {
        level1: 9,
        xpv: 4000,
      },
      additionalData: {
        itemSlots: [{ file: mainWeapon10hd, slot: "WEAPON1" }],
      },
    },
    {
      files: ["ja#trea3"],
      data: {
        level1: 11,
        xpv: 6000,
      },
      additionalData: {
        itemSlots: [{ file: mainWeapon12hd, slot: "WEAPON1" }],
      },
    },
  ],
};
