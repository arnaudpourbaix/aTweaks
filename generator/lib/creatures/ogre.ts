import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster-id";

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
    strength: 17,
    dexterity: 10,
    constitution: 14,
    intelligence: 8,
    wisdom: 9,
    charisma: 10,
    movement: 9,
    ac: 5,
    apr: 1,
    xpv: 270,
    alignment: "CHAOTIC_EVIL",
    morale: 12,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "OGRE",
    class: "OGRE_HALFOGRE",
    gender: "MALE",
    size: "Large",
  },
  additionalData: {
    proficiencies: [{ type: "PROFICIENCYTWOHANDEDSWORD", value: 2 }],
    removeItems: ["P2-8"],
  },
  items: [
    {
      file: "ja#m29w1",
      equippedSlot: "WEAPON1",
      type: "Melee",
      flags: ["TwoHanded"],
      animation: "BastardSword",
      category: "BastardSwords",
      proficiency: "PROFICIENCYBASTARDSWORD",
      animationSwing: { backhand: 40, overhand: 40, thrust: 20 },
      range: 2,
      diceThrown: 2,
      diceSize: 6,
      damageType: "Slashing",
      speed: 10,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: ["", "", "", "", "", "", ""],
};
