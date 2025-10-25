import { ATWEAKS_CREATURES } from "../../config/creatures";
import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.Treant;
// Script
const script = bafFile(id);
// Items
const mainWeapon7hd = getFilename(1, id);
const mainWeapon9hd = getFilename(2, id);
const mainWeapon11hd = getFilename(3, id);

export const PLANT_TREANT: RawCreature = {
  name: "Treant",
  bafFile: `lib/pnp-monster/plant/${script}`,
  tpaFile: "lib/pnp-monster/plant/treant",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 11,
    strength: 23,
    dexterity: 8,
    constitution: 21,
    intelligence: 12,
    wisdom: 16,
    charisma: 12,
    movement: 12,
    ac: 0,
    apr: 2,
    xpv: 6000,
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
    immunities: ["plant"],
  },
  items: [
    {
      file: mainWeapon7hd,
      stringRef: TraStringReferenceEnum.LethalFists,
      icon: MonsterItemIconEnum.EarthElemental,
      type: "Melee",
      range: 5,
      diceThrown: 2,
      diceSize: 8,
      damageType: "Crushing",
      speed: 8,
      abilityFlags: ["AddStrengthBonus"],
    },
    {
      file: mainWeapon9hd,
      copyFrom: mainWeapon7hd,
      diceThrown: 3,
      diceSize: 6,
    },
    {
      file: mainWeapon11hd,
      equippedSlot: "WEAPON1",
      copyFrom: mainWeapon9hd,
      diceThrown: 4,
    },
  ],
  files: [
    ATWEAKS_CREATURES.Treant5hd,
    ATWEAKS_CREATURES.Treant7hd,
    ATWEAKS_CREATURES.Treant9hd,
    ATWEAKS_CREATURES.Treant11hd,
  ],
  adjustments: [
    {
      files: [
        ATWEAKS_CREATURES.Treant5hd,
        ATWEAKS_CREATURES.Treant7hd,
        ATWEAKS_CREATURES.Treant9hd,
        ATWEAKS_CREATURES.Treant11hd,
      ],
      summon: true,
    },
    {
      files: [ATWEAKS_CREATURES.Treant5hd],
      data: {
        level1: 5,
        strength: 19,
        constitution: 19,
        xpv: 1400,
      },
      additionalData: {
        itemSlots: [{ file: mainWeapon7hd, slot: "WEAPON1" }],
      },
    },
    {
      files: [ATWEAKS_CREATURES.Treant7hd],
      data: {
        level1: 7,
        strength: 20,
        constitution: 20,
        xpv: 2000,
      },
      additionalData: {
        itemSlots: [{ file: mainWeapon7hd, slot: "WEAPON1" }],
      },
    },
    {
      files: [ATWEAKS_CREATURES.Treant9hd],
      data: {
        level1: 9,
        strength: 21,
        constitution: 20,
        xpv: 4000,
      },
      additionalData: {
        itemSlots: [{ file: mainWeapon9hd, slot: "WEAPON1" }],
      },
    },
  ],
};
