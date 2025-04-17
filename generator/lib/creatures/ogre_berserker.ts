import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.Ogre;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
export const OGRE: RawCreature = {
  name: "Ogre",
  bafFile: `lib/pnp-monster/ogre/${script}`,
  tpaFile: "lib/pnp-monster/ogre/ogre",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 4,
    bonusHp: 1,
    strength: 19,
    dexterity: 8,
    constitution: 16,
    intelligence: 8,
    wisdom: 7,
    charisma: 7,
    movement: 9,
    ac: 5,
    apr: 1,
    xpv: 270,
    alignment: "CHAOTIC_EVIL",
    morale: 12,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "OGRE",
    class: "OGRE",
    gender: "MALE",
    size: "Large",
  },
  additionalData: {
    proficiencies: [{ type: "PROFICIENCYTWOHANDEDSWORD", value: 2 }],
    removeItems: ["OGRE1"],
    removeScripts: ["BDSUM00"],
  },
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 10,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: [
    "BDOGRE02",
    "BDOGREDS",
    "NEOGRE",
    "OGREBERZ",
    "OGREGRSU",
    "X3HOGREC", // Ogre Champion
    "X3HOGREL", // Ogre King
    "BDOGRE06", // Ogre Chieftain
  ],
  adjustments: [{ files: ["OGREGRSU"], summon: true }],
};
