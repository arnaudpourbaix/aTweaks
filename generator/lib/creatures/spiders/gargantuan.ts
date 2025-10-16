import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.GargantuanSpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);

const name = "Gargantuan Spider";
export const SPIDER_GARGANTUAN: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/gargantuan",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  data: {
    level1: 4,
    bonusHp: 4,
    thac0: 15,
    strength: 14,
    dexterity: 16,
    constitution: 12,
    intelligence: 7,
    wisdom: 11,
    charisma: 4,
    movement: 12,
    ac: 4,
    apr: 1,
    xpv: 650,
    alignment: "CHAOTIC_EVIL",
    morale: 13,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_HUGE",
    gender: "MALE",
    size: "Large",
  },
  additionalData: {
    removeItems: ["BDSPIDHU", "SPIDHU1", "ANTIWEB"],
    removeScripts: [
      "DW1MELMO",
      "DW#GPSHM",
      "DW#SPIDS",
      "BPSIGHT",
      "BPASIGHT",
      "DVMELEE",
    ],
    immunities: ["vermin", "spider"],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 8,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "PoisonTypeEffects",
          poisonType: "F",
        },
      ],
    },
  ],
  files: [
    "BDSPIDGA", // Gargantuan Spider
  ],
};
