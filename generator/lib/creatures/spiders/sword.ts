import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.SwordSpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
const offhandWeapon = file(2, id);

const name = "Sword Spider";
export const SPIDER_SWORD: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/sword",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 5,
    bonusHp: 5,
    thac0: 15,
    strength: 16,
    dexterity: 18,
    constitution: 14,
    intelligence: 9,
    wisdom: 14,
    charisma: 4,
    movement: 8,
    ac: 3,
    apr: 2,
    xpv: 2000,
    alignment: "CHAOTIC_EVIL",
    morale: 13,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_SWORD",
    gender: "NIETHER",
    size: "Huge",
  },
  additionalData: {
    removeItems: ["BDSPIDHU", "SPIDHU1", "ANTIWEB"],
    removeScripts: ["DW1MELMO", "DW#GPSHM", "DW#SPIDS", "BPSIGHT", "BPASIGHT"],
    immunities: ["vermin", "spider"],
  },
  items: [
    // Against formidable prey, a sword spider leaps horizontally as far as 30 feet, and lands legs forward, impaling its prey. Only one attack roll is made for the creature.
    // If the attack is successful, the victim is struck by a number of legs based on its size: size S, three legs; size M, four legs; size L, five legs; size H, six legs; size G, all eight legs.
    // If the spider's leap is greater than 20 feet, each leg receives a +1 bonus to damage.
    // Any upward attack against the leaping spider receives a -4 to the attack roll, due to the impaling blades which protect the spider.
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Legs,
      icon: MonsterItemIconEnum.Wolf,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 12,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
    {
      file: offhandWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "SHIELD",
      type: "Melee",
      diceThrown: 2,
      diceSize: 4,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: [
    "BDHELP03", // Sword Spider
    "BDSPID7L", // Seven-Legged Spider
    "BPSPID03", // Sword Spider
    "PLYSPID", // Sword Spider
    "SPIDSW", // Sword Spider
    "SPIDSW01", // Sword Spider
    "SPIDSWSU", // Sword Spider
    "WISPID03", // Lightning Sword Spider
  ],
};
