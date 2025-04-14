import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.HalfOgre;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);

export const OGRE_HALF: RawCreature = {
  name: "Half Ogre",
  bafFile: `lib/pnp-monster/ogre/${script}`,
  tpaFile: "lib/pnp-monster/ogre/half",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 2,
    bonusHp: 6,
    strength: 17,
    dexterity: 10,
    constitution: 14,
    intelligence: 9,
    wisdom: 9,
    charisma: 10,
    movement: 12,
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
    proficiencies: [{ type: "PROFICIENCYBASTARDSWORD", value: 2 }],
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
      range: 1,
      diceThrown: 1,
      diceSize: 10,
      damageBonus: 2,
      damageType: "Slashing",
      speed: 7,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: ["", "", "", "", "", "", ""],
};
