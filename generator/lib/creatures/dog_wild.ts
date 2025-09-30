import { MonsterItemIconEnum } from "../config/item";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.WildDog;
// Items
const mainWeapon = file(1, id);
export const DOG_WILD: RawCreature = {
  name: "Wild Dog",
  tpaFile: "lib/pnp-monster/dog/wild",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 1,
    bonusHp: 1,
    strength: 12,
    dexterity: 17,
    constitution: 15,
    intelligence: 4,
    wisdom: 13,
    charisma: 11,
    movement: 15,
    ac: 7,
    thac0: 19,
    apr: 1,
    xpv: 35,
    alignment: "NEUTRAL",
    morale: 6,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "DOG",
    class: "DOG_WILD",
    gender: "MALE",
    size: "Small",
  },
  additionalData: { removeItems: ["P1-4"] },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.SPPR416B,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 4,
      damageType: "Piercing",
      speed: 3,
      animationSwing: { overhand: 50, backhand: 50, thrust: 0 },
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: [
    "BDBDOG",
    "BDDEADOG",
    "DOGWI",
    "DOGWISU",
    "BDCRUDOG",
    "BDDOG",
    "DW#RNDWI",
    "BDDOGW01", // Little Wanderer
  ],
  adjustments: [
    { files: ["DOGWISU"], summon: true },
    { files: ["BDDOG"], data: { class: "INNOCENT" } },
  ],
};
