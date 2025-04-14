import { StringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.PolarBear;
// Script
const script = bafFile(id);
// Items
export const polarBearMainWeapon = file(1, id);
export const polarBearOffhandWeapon = file(2, id);
export const BEAR_POLAR: RawCreature = {
  name: "Polar Bear",
  bafFile: `lib/pnp-monster/bear/${script}`,
  tpaFile: "lib/pnp-monster/bear/polar",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 8,
    bonusHp: 8,
    specialBonusHp: 12,
    strength: 20,
    dexterity: 10,
    constitution: 16,
    intelligence: 4,
    wisdom: 13,
    charisma: 7,
    movement: 12,
    ac: 6,
    apr: 3,
    xpv: 1400,
    alignment: "NEUTRAL",
    morale: 9,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "BEAR",
    class: "BEAR_POLAR",
    gender: "NIETHER",
    size: "Huge",
  },
  additionalData: {
    removeItems: ["B1-12", "BEARPOSU"],
    removeScripts: ["CBEAR", "BEAR"],
  },
  items: [
    {
      file: polarBearMainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 10,
      damageType: "Slashing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "DisplayString",
          stringRef: StringReferenceEnum.Hug,
          probability1: 10,
        },
        {
          opcode: "Damage",
          damageMode: "Normal",
          type: "Crushing",
          amount: 0,
          diceThrown: 3,
          diceSize: 6,
          probability1: 10,
        },
      ],
    },
    {
      file: polarBearOffhandWeapon,
      equippedSlot: "SHIELD",
      type: "Melee",
      diceThrown: 2,
      diceSize: 6,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: [
    "BEARPO",
    "BEARPO1",
    "BEARPO2",
    "BEARPO3",
    "BEARPOSU",
    "NTBEARPO",
    "BDGHBRSU", // Ghost Polar Bear
    // "SPBEAR1", //TODO: Spirit Bear
    // "SPBEAR2", //TODO: Spirit Bear
    // "SPBEAR3", //TODO: Spirit Bear
    // "SPBEAR4", //TODO: Spirit Bear
    // "SPBEAR5", //TODO: Spirit Bear
    "SPIRBEAR",
  ],
  adjustments: [
    { files: ["BEARPOSU", "BDGHBRSU"], summon: true },
    { files: ["BDGHBRSU"], data: { level1: 9 } },
  ],
};
