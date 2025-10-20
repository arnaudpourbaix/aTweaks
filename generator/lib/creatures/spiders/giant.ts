import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.GiantSpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);

const name = "Giant Spider";
export const SPIDER_GIANT: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/giant",
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
    movement: 3, // 3, Web 12
    ac: 6, // -2 with dex bonus
    apr: 1,
    xpv: 650,
    alignment: "CHAOTIC_EVIL",
    morale: 13,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_GIANT",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: {
    removeItems: ["BDSPIDGI", "SPIDG1", "ANTIWEB", "PLYSPID"],
    removeScripts: [
      "DW1MELMO",
      "DW#GPSHM",
      "DW#SPIDG",
      "BPSIGHT",
      "BPASIGHT",
      "DVMELEE",
      "BDSUM00",
      "SPIDFGSU",
    ],
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
      diceSize: 8,
      damageType: "Piercing",
      speed: 2,
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
    "BDHELP01", // Giant Spider
    "BDSPIDGI", // Giant Spider
    "BDWISTAK", // Wistak
    "BPSPID02", // Giant Spider
    "PLYSPID2", // Giant Spider
    "RSSPIDGI", // Giant Spider
    "SPIDGI", // Giant Spider
    "SPIDGISU", // Giant Spider
    "SPIDFGSU", // Kitthix
  ],
  adjustments: [
    { files: ["SPIDGISU", "BDHELP01", "SPIDFGSU"], summon: true },
    { files: ["PLYSPID2"], noScript: true },
  ],
};
