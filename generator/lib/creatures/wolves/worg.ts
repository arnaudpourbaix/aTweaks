import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.Worg;
// Items
const mainWeapon = file(1, id);
export const WOLF_WORG: RawCreature = {
  name: "Worg",
  tpaFile: "lib/pnp-monster/wolf/worg",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 3,
    bonusHp: 3,
    strength: 16,
    dexterity: 13,
    constitution: 13,
    intelligence: 7,
    wisdom: 11,
    charisma: 8,
    movement: 18,
    ac: 6,
    apr: 1,
    xpv: 120,
    alignment: "NEUTRAL_EVIL",
    morale: 11,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "ANIMAL",
    race: "WOLF",
    class: "WOLF_WORG",
    gender: "MALE",
    size: "Medium",
  },
  additionalData: { removeItems: ["P1-6"] },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 2,
      diceSize: 4,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: ["WOLFCH", "BDWORG", "WORG", "WORGAR", "WORGSU"],
  adjustments: [{ files: ["WORGSU"], summon: true }],
};
