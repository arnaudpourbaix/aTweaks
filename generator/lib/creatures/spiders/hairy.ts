import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.HairySpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);

const name = "Hairy Spider";
export const SPIDER_HAIRY: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/hairy",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  data: {
    level1: 1,
    bonusHp: 1,
    thac0: 20,
    strength: 2,
    dexterity: 14,
    constitution: 8,
    intelligence: 1,
    wisdom: 10,
    charisma: 2,
    movement: 6, // 6, web 15
    ac: 8,
    apr: 1,
    xpv: 65,
    alignment: "NEUTRAL_EVIL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_HUGE",
    gender: "NIETHER",
    size: "Tiny",
  },
  additionalData: {
    removeItems: ["SPIDHU1", "ANTIWEB"],
    removeScripts: [
      "BDENSHTV",
      "BDNONIN",
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
      damageBonus: 1,
      damageType: "Piercing",
      speed: 2,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        // TODO: If the saving throw fails, the victim's AC and attack rolls are penalized by 1, and Dexterity is penalized by -3 with respect to Dexterity checks.
        // These effects begin one round after the bite and last for 1d4+1 rounds.
        {
          opcode: "PoisonTypeEffects",
          poisonType: "A",
          saveBonus: 2,
        },
      ],
    },
  ],
  files: [
    "BDSPIDER", // Small Spider
    "SPIDSM01", // Small Spider
  ],
  adjustments: [{ files: ["BDSPIDER"], noScript: true }],
};
