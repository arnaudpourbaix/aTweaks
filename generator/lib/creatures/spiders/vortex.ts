import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.VortexSpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = getFilename(1, id);
const traits = getFilename(2, id);

const name = "Vortex Spider";
export const SPIDER_VORTEX: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/vortex",
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
    "SMSPID02", // Vortex Spider
  ],
};
