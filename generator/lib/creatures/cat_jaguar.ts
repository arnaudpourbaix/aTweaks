import { StringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.Jaguar;
// Items
const mainWeapon = file(1, id);
const offhandWeapon = file(2, id);
export const CAT_JAGUAR: RawCreature = {
  name: "Jaguar",
  tpaFile: "lib/pnp-monster/cat/jaguar",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 4,
    bonusHp: 1,
    strength: 14,
    dexterity: 15,
    constitution: 10,
    intelligence: 4,
    wisdom: 14,
    charisma: 7,
    movement: 15,
    ac: 6,
    apr: 3,
    xpv: 420,
    alignment: "NEUTRAL",
    morale: 9,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "CAT",
    class: "CAT",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: { removeItems: ["CATJAG"] },
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
          amount: 1,
          diceThrown: 1,
          diceSize: 4,
          probability1: 10,
        },
        {
          opcode: "Damage",
          damageMode: "Normal",
          type: "Slashing",
          amount: 1,
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
      diceSize: 8,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: [
    "BDHELP04",
    // "BDSHA06B", //TODO: Panther Spirit
    "CATJAG01",
  ],
  adjustments: [{ files: ["BDHELP04"], summon: true }],
};
