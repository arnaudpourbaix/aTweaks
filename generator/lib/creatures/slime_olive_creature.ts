import { MonsterItemIconEnum } from "../config/item";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.OliveSlimeCreature;
// Spells
// Items
const mainWeapon = file(1, id);
// Script
const script = bafFile(id);

export const SLIME_OLIVE_CREATURE: RawCreature = {
  name: "Olive Slime Creature",
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/olive_slime_creature",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  dialog: ["SCHLUM"],
  canPolymorph: true,
  autoGenerate: {
    savingThrows: false,
  },
  data: {
    level1: 8,
    bonusHp: 2,
    thac0: 13,
    strength: 15,
    dexterity: 10,
    constitution: 21,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    movement: 6,
    ac: 9,
    apr: 1,
    resistElectricity: 100,
    xpv: 2500,
    alignment: "NEUTRAL",
    morale: 9,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "OLIVE_SLIME",
    gender: "NIETHER",
    animation: "SLIME_OLIVE",
    size: "Large",
  },
  additionalData: {
    removeItems: ["SCHLUM1", "DW#SCHLU", "RING95", "IMMUNE1"],
    removeScripts: ["DW#GPSHT", "DW1RANMO", "SCHLUM"],
    immunities: ["ooze"],
  },
  items: [
    {
      // Olive slime zombies are harmed by acid, freezing cold, fire and magic missile spells.
      // Spells that affect plants will also affect them, although the effects of entangle are minimal at best.
      // No other attacks, by weapons, lightning, or spells that affect the mind will kill a slime creature.
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Pseudopod,
      icon: MonsterItemIconEnum.Jelly,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceSize: 4,
      diceThrown: 3,
      damageType: "Crushing",
    },
  ],
  files: [
    "SCHLUM", // TODO: Schlumpsha the Sewer King. Note: is an olive slime, was a former mage that appears to have transformed itself into a slime.
  ],
};
