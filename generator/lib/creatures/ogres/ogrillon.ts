import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.Ogrillon;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);

export const OGRE_OGRILLON: RawCreature = {
  name: "Ogrillon",
  bafFile: `lib/pnp-monster/ogre/${script}`,
  tpaFile: "lib/pnp-monster/ogre/ogrillon",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 2,
    bonusHp: 4,
    strength: 17,
    dexterity: 9,
    constitution: 14,
    intelligence: 6,
    wisdom: 7,
    charisma: 7,
    movement: 12,
    ac: 6,
    apr: 2,
    xpv: 175,
    alignment: "CHAOTIC_EVIL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "OGRE",
    class: "OGRE_OGRILLON",
    size: "Medium",
  },
  additionalData: {
    removeItems: ["B1-8", "SW1H01"],
    removeScripts: ["ORGRILLON", "DW1MELGE", "BDSUM00"],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.LethalFists,
      icon: MonsterItemIconEnum.Fist,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 6,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: [
    "BDKORDEO",
    "GNARL",
    "HAIRTO",
    "OGREGR",
    "OGREGR1",
    "OGREGR2",
    "OGREGR3",
    "OGREGR4",
    "OGREGR_A",
    "OGREGR_B",
    "OGREGR_C",
    "OGREGR_D",
    "OGRELESU",
    "OGREMIRI",
    "SEWERF1",
    "UBSNOGOL",
  ],
  adjustments: [
    { files: ["OGRELESU"], summon: true, data: { level1: 3 } },
    {
      // veteran with 5+3 Hit Dice
      files: ["GNARL", "HAIRTO"],
      data: {
        level1: 5,
        bonusHp: 3,
        strength: 18,
        exceptionalStrength: 95,
        constitution: 15,
        xpv: 420,
      },
    },
  ],
};
