import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.OgreShaman;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);

export const OGRE_SHAMAN: RawCreature = {
  // Shaman: a fighter/priest with 5+3 Hit Dice and the spells of a 4th-level priest
  name: "Ogre-Shaman",
  bafFile: `lib/pnp-monster/ogre/${script}`,
  tpaFile: "lib/pnp-monster/ogre/shaman",
  tracking: true,
  combatWalk: true,
  usePotions: true,
  data: {
    level1: 5,
    level2: 5,
    bonusHp: 3,
    strength: 18,
    dexterity: 8,
    constitution: 16,
    intelligence: 12,
    wisdom: 13,
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
    class: "FIGHTER_CLERIC",
    size: "Large",
  },
  additionalData: {
    proficiencies: [{ type: "PROFICIENCYTWOHANDEDSWORD", value: 2 }],
    // effects: [
    //   {
    //     opcode: "AttackDamageBonus",
    //     type: "Increment",
    //     value: 2,
    //     global: true,
    //   },
    // ],
    removeItems: ["BLUN01"],
    removeScripts: ["BDSHM00"],
  },
  attack: {
    targetPriorities: [
      {
        // The ogres fight more wisely when led by a half-ogre that concentrates assaults on characters it recognizes as spellcasters and teaming up against skilled fighters.
        targets: ["PCSpellcasters", "PCsPreferringStrong"],
      },
    ],
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
  files: ["BDOGRE05"],
};
