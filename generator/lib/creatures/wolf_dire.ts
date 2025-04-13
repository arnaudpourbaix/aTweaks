import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster-id";

// Creature Id
const id = MonsterEnum.DireWolf;
// Items
const mainWeapon = file(1, id);

export const WOLF_DIRE: RawCreature = {
  name: "Dire Wolf",
  tpaFile: "lib/pnp-monster/wolf/dire",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 4,
    bonusHp: 4,
    strength: 17,
    dexterity: 15,
    constitution: 15,
    intelligence: 4,
    wisdom: 12,
    charisma: 7,
    movement: 18,
    ac: 6,
    apr: 1,
    xpv: 175,
    alignment: "NEUTRAL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "ANIMAL",
    race: "WOLF",
    class: "WOLF_DIRE",
    gender: "MALE",
    size: "Large",
  },
  additionalData: { removeItems: ["P1-8", "P2-8"] },
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 2,
      diceSize: 4,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: ["BDWOLFDI", "P#WOLF02", "WOLFDI", "WOLFDISU", "UBNIMWLF"],
  adjustments: [{ files: ["WOLFDISU"], summon: true }],
};
