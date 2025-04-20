import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.Tiger;
// Items
const mainWeapon = file(1, id);
const offhandWeapon = file(2, id);
export const CAT_TIGER: RawCreature = {
  name: "Tiger",
  tpaFile: "lib/pnp-monster/cat/tiger",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 5,
    bonusHp: 2,
    strength: 17,
    dexterity: 15,
    constitution: 14,
    intelligence: 4,
    wisdom: 12,
    charisma: 8,
    movement: 12,
    ac: 5,
    apr: 3,
    xpv: 650,
    alignment: "NEUTRAL",
    morale: 9,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "ANIMAL",
    race: "CAT",
    class: "CAT",
    gender: "NIETHER",
    size: "Medium",
  },
  additionalData: { removeItems: ["CATLIO"] },
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 4,
      damageType: "Slashing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "DisplayString",
          stringRef: TraStringReferenceEnum.RearClawsAttack,
          probability1: 10,
        },
        {
          opcode: "Damage",
          damageMode: "Normal",
          type: "Slashing",
          amount: 1,
          diceThrown: 1,
          diceSize: 6,
          probability1: 10,
        },
        {
          opcode: "Damage",
          damageMode: "Normal",
          type: "Slashing",
          amount: 1,
          diceThrown: 1,
          diceSize: 6,
          probability1: 10,
        },
      ],
    },
    {
      file: offhandWeapon,
      equippedSlot: "SHIELD",
      type: "Melee",
      diceThrown: 1,
      diceSize: 10,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: [],
};
