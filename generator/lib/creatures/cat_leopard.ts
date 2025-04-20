import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.Leopard;
// Items
const mainWeapon = file(1, id);
const offhandWeapon = file(2, id);
export const CAT_LEOPARD: RawCreature = {
  name: "Leopard",
  tpaFile: "lib/pnp-monster/cat/leopard",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 3,
    bonusHp: 2,
    strength: 16,
    dexterity: 19,
    constitution: 15,
    intelligence: 4,
    wisdom: 12,
    charisma: 6,
    movement: 15,
    ac: 6,
    apr: 3,
    xpv: 270,
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
  additionalData: { removeItems: ["CATJAGSU"] },
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
          stringRef: TraStringReferenceEnum.RearClawsAttack,
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
      diceSize: 6,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: ["CATJAGSU"],
  adjustments: [{ files: ["CATJAGSU"], summon: true }],
};
