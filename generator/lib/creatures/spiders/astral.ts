import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.AstralPhaseSpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
const traits = file(2, id);

const name = "Astral Phase Spider";
export const SPIDER_ASTRAL_PHASE: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/astral",
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
    ac: 6,
    apr: 1,
    xpv: 270,
    alignment: "NEUTRAL",
    morale: 8,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_HUGE",
    gender: "MALE",
    size: "Medium",
  },
  additionalData: {
    removeItems: ["BDSPIDHU", "SPIDHU1", "ANTIWEB"],
    removeScripts: ["DW1MELMO", "DW#GPSHM", "DW#SPIDS", "BPSIGHT", "BPASIGHT"],
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
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "Poison",
          type: "OneDamagePerAmountSecond",
          amount: 40,
          saveTypes: ["ParalyzePoisonDeath"],
          saveBonus: 1,
          duration: 600,
        },
        {
          opcode: "DisplayPortraitIcon",
          icon: "Poisoned",
          saveTypes: ["ParalyzePoisonDeath"],
          saveBonus: 1,
          duration: 600,
        },
      ],
    },
    createTraitItem({
      file: traits,
      name,
      description: [],
    }),
  ],
  files: [],
};
