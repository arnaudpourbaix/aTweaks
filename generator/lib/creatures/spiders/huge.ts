import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.HugeSpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = getFilename(1, id);

const name = "Huge Spider";
export const SPIDER_HUGE: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/huge",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  data: {
    level1: 2,
    bonusHp: 2,
    thac0: 19,
    strength: 14,
    dexterity: 16,
    constitution: 12,
    intelligence: 7,
    wisdom: 11,
    charisma: 4,
    movement: 18,
    ac: 8, // -2 with dex bonus
    apr: 1,
    xpv: 270,
    alignment: "NEUTRAL",
    morale: 8,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_HUGE",
    gender: "NIETHER",
    size: "Medium",
  },
  additionalData: {
    removeItems: ["BDSPIDHU", "SPIDHU1", "ANTIWEB", "D5SMSPID"],
    removeScripts: ["DW1MELMO", "DW#GPSHM", "DW#SPIDS", "BPSIGHT", "BPASIGHT"],
    immunities: ["spider"],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 6,
      damageType: "Piercing",
      speed: 2,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "PoisonTypeEffects",
          poisonType: "A",
          saveBonus: 1,
        },
      ],
    },
  ],
  files: [
    "BDSPIDHU", // Huge Spider
    "SPIDHU", // Huge Spider
    "SPIDLAND", // Huge Spider
  ],
};
