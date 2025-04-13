import { StringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster-id";

// Creature Id
const id = MonsterEnum.MountainLion;
// Items
const mainWeapon = file(1, id);
const offhandWeapon = file(2, id);

export const CAT_LION_MOUNTAIN: RawCreature = {
  name: "Mountain Lion",
  tpaFile: "lib/pnp-monster/cat/mountain_lion",
  tracking: true,
  combatWalk: true,
  attack: {
    dualWielding: true,
  },
  data: {
    level1: 3,
    bonusHp: 1,
    strength: 17,
    dexterity: 15,
    constitution: 13,
    intelligence: 4,
    wisdom: 12,
    charisma: 8,
    movement: 12,
    ac: 6,
    apr: 3,
    xpv: 270,
    alignment: "NEUTRAL",
    morale: 9,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "CAT",
    class: "CAT",
    gender: "NIETHER",
    size: "Medium",
  },
  additionalData: {
    removeItems: ["P1-6"],
  },
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 3,
      damageType: "Slashing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "DisplayString",
          stringRef: StringReferenceEnum.RearClawsAttack,
          probability1: 10,
        },
        {
          opcode: "Damage",
          damageMode: "Normal",
          type: "Slashing",
          amount: 0,
          diceThrown: 1,
          diceSize: 4,
          probability1: 10,
        },
        {
          opcode: "Damage",
          damageMode: "Normal",
          type: "Slashing",
          amount: 0,
          diceThrown: 1,
          diceSize: 4,
          probability1: 10,
        },
      ],
    },
    {
      file: offhandWeapon,
      equippedSlot: "SHIELD",
      type: "Melee",
      diceThrown: 1,
      diceSize: 6,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: ["CATLIM01"],
};
