import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.WarDog;
// Items
const mainWeapon = file(1, id);
export const DOG_WAR: RawCreature = {
  name: "War Dog",
  tpaFile: "lib/pnp-monster/dog/war",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 2,
    bonusHp: 2,
    strength: 12,
    dexterity: 17,
    constitution: 15,
    intelligence: 4,
    wisdom: 13,
    charisma: 11,
    movement: 12,
    ac: 9, // -3 with dex bonus
    apr: 1,
    xpv: 65,
    alignment: "NEUTRAL",
    morale: 9,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "DOG",
    class: "DOG_WAR",
    gender: "MALE",
    size: "Medium",
  },
  additionalData: { removeItems: ["P2-8"] },
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
  files: [
    "BDPRISD1",
    "BDPRISD2",
    "DOGWA",
    "DOGWASU",
    "DW#RNDWA",
    "UBNIMDOG",
    "NTPOOCH", // Pooch
  ],
  adjustments: [{ files: ["DOGWASU"], summon: true }],
};
