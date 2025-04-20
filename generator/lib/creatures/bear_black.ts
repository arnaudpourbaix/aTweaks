import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";
// Creature Id
const id = MonsterEnum.BlackBear;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
const offhandWeapon = file(2, id);
export const BEAR_BLACK: RawCreature = {
  name: "Black Bear",
  bafFile: `lib/pnp-monster/bear/${script}`,
  tpaFile: "lib/pnp-monster/bear/black",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 3,
    bonusHp: 3,
    strength: 15,
    dexterity: 10,
    constitution: 15,
    intelligence: 4,
    wisdom: 12,
    charisma: 7,
    movement: 12,
    ac: 7,
    apr: 3,
    xpv: 175,
    alignment: "NEUTRAL",
    morale: 9,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "ANIMAL",
    race: "BEAR",
    class: "BEAR_BLACK",
    gender: "NIETHER",
    size: "Medium",
  },
  additionalData: { removeItems: ["B1-6"], removeScripts: ["CBEAR", "BEAR"] },
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
          stringRef: TraStringReferenceEnum.Hug,
          probability1: 10,
        },
        {
          opcode: "Damage",
          damageMode: "Normal",
          type: "Crushing",
          amount: 0,
          diceThrown: 2,
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
  files: ["BDBEARBL", "BEARBL", "BEARBLSU", "PLYBEAR2", "RSBEARBL", "UBDBEAR"],
  adjustments: [{ files: ["BEARBLSU"], summon: true }],
};
