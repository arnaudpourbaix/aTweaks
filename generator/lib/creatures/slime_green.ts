import { MonsterItemIconEnum } from "../config/item";
import { ATWEAKS_SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.GreenSlime;
// Spells
// Items
const mainWeapon = file(1, id);
// Script
const script = bafFile(id);

export const SLIME_GREEN: RawCreature = {
  name: "Green Slime",
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/green_slime",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  dialog: [],
  canPolymorph: true,
  autoGenerate: {
    savingThrows: false,
  },
  attack: {
    ranged: true,
  },
  data: {
    level1: 2,
    thac0: 19,
    strength: 4,
    dexterity: 12,
    constitution: 8,
    intelligence: 1,
    wisdom: 3,
    charisma: 1,
    movement: 0,
    ac: 9,
    apr: 1,
    xpv: 65,
    alignment: "NEUTRAL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "GREEN_SLIME",
    gender: "NIETHER",
    size: "Small",
  },
  additionalData: {
    removeItems: ["RING95", "JELLGR1", "JELLGRSU"],
    removeScripts: ["BPSIGHT", "BPASIGHT", "DW1MELMO"],
    immunities: ["ooze"],
  },
  items: [
    {
      //
      // This slime cannot attack but is sensitive to vibrations and often drops from the ceiling onto a passing victim.
      // Green slime attaches itself to living flesh and in 1-4 melee rounds turns the creature into green slime (no resurrection possible).
      // Green slime eats through one inch of wood in an hour, but can dissolve metal quickly, going through plate armor in three melee rounds.
      // The horrid growth can be scraped off quickly, cut away, frozen, or burned. A cure disease spell kills green slime, but other attacks, including weapons and spells, have no effect.
      //
      // 5e: Pseudopod. Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) acid damage.
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Pseudopod,
      icon: MonsterItemIconEnum.Jelly,
      equippedSlot: "WEAPON1",
      type: "Melee",
      range: 5,
      diceSize: 4,
      diceThrown: 1,
      damageBonus: 1,
      damageType: "Crushing",
    },
  ],
  files: [
    "JELLGRSU", // Green Slime
    "JELLYGR", // Green Slime
    "JELLYGR2", // Green Slime
    "X#JELLY", // Green Slime
    "X#SLIME", // Green Slime
  ],
  adjustments: [
    { files: ["JELLGRSU"], summon: true, noScript: true },
    { files: ["X#JELLY", "X#SLIME"], noScript: true },
  ],
};
