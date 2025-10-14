import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.GrayOoze;
// Items
const mainWeapon = file(1, id);
const traits = file(2, id);
// Script
const script = bafFile(id);

const name = "Gray Ooze";

export const SLIME_GRAY_OOZE: RawCreature = {
  name,
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/gray_ooze",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 3,
    bonusHp: 3,
    thac0: 17,
    strength: 12,
    dexterity: 6,
    constitution: 16,
    intelligence: 1,
    wisdom: 6,
    charisma: 2,
    movement: 1,
    ac: 8,
    apr: 1,
    xpv: 270,
    alignment: "NEUTRAL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "GREY_OOZE",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: {
    removeItems: ["RING95", "OOZEGR1", "DW#OOZEG"],
    removeScripts: ["BPSIGHT", "BPASIGHT", "DW1RANMO"],
    immunities: ["ooze"],
  },
  items: [
    {
      // The gray ooze strikes like a snake, and can corrode metal at an alarming rate (chain mail in one round, plate mail in two, and magical armor in one round per each plus to Armor Class).
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Pseudopod,
      icon: MonsterItemIconEnum.Jelly,
      equippedSlot: "WEAPON1",
      type: "Melee",
      effects: [
        {
          opcode: "Damage",
          type: "Acid",
          diceSize: 8,
          diceThrown: 2,
        },
      ],
      // 5e:
      // Acid (Ex): A gray ooze secretes a digestive acid that quickly dissolves organic material and metal, but not stone. Any melee hit or constrict attack deals acid damage. Armor or clothing dissolves and becomes useless immediately unless it succeeds on a DC 16 Reflex save. A metal or wooden weapon that strikes a gray ooze also dissolves immediately unless it succeeds on a DC 16 Reflex save. The save DCs are Constitution-based.
      // The ooze’s acidic touch deals 16 points of damage per round to wooden or metal objects, but the ooze must remain in contact with the object for 1 full round to deal this damage.
      // Constrict (Ex): A gray ooze deals automatic slam and acid damage with a successful grapple check. The opponent’s clothing and armor take a –4 penalty on Reflex saves against the acid.
      // Improved Grab (Ex): To use this ability, a gray ooze must hit with its slam attack. It can then attempt to start a grapple as a free action without provoking an attack of opportunity. If it wins the grapple check, it establishes a hold and can constrict.
    },
    createTraitItem({
      file: traits,
      name,
      // Spells have no effect on this monster, nor do fire- or cold-based attacks. Lightning and blows from weapons cause full damage.
      // Note that weapons striking a gray ooze may corrode and break.
      immunities: ["magic", "fire", "cold"],
    }),
  ],
  files: [
    "BPJLGR01", // Gray Ooze
    "JELLGR", // Gray Ooze
  ],
};
