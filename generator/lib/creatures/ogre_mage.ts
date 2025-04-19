import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.OgreMage;
// Script
const script = bafFile(id);
// Spells
const digestiveEnzyme = file(1, id);
const acidicEnzyme = file(2, id);
// Items
const mainWeapon = file(1, id);
export const OGRE_MAGE: RawCreature = {
  name: "Ogre Mage",
  bafFile: `lib/pnp-monster/ogre/${script}`,
  tpaFile: "lib/pnp-monster/ogre/mage",
  tracking: true,
  combatWalk: true,
  usePotions: true,
  data: {
    level1: 5,
    bonusHp: 2,
    strength: 17,
    dexterity: 10,
    constitution: 14,
    intelligence: 16,
    wisdom: 9,
    charisma: 10,
    movement: 9,
    ac: 4,
    apr: 1,
    xpv: 650,
    alignment: "LAWFUL_EVIL",
    morale: 14,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "OGRE",
    class: "OGRE_MAGE",
    gender: "MALE",
    size: "Large",
  },
  additionalData: {
    proficiencies: [{ type: "PROFICIENCYTWOHANDEDSWORD", value: 2 }],
    removeItems: ["P2-8"],
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
  files: [
    "BDMURS", // Murs
    "BDMURS2", // Murs
    "BDOGRE03", // Ogre Mage
    "BDOGRE05", // Ogre Shaman
    "BDWAVE16", // Ogre Mage
    "BPOGMA01", // Ogre Mage
    "DROTH", // Droth
    "DWSST2", // <Invalid Strref -1>
    "KAHRK", // Kahrk
    "KROTAN", // Krotan
    "NTFOREOG", // Ogre Mage
    "NTKROTAN", // Krotan
    "OGREMA", // Ogre Mage
    "OGREMA02", // Ogre Mage
    "OGREMA03", // Ogre Mage
    "OGREMASU", // Ogre Mage
    "OGREMA_A", // Ogre Mage
    "OGREMA_B", // Ogre Mage
    "OGREMA_C", // Ogre Mage
    "OGREMA_D", // Ogre Mage
    "OGREMBA", // Ogre Mage
    "OGRMBA", // Ogre Mage
    "UBOGMA01", // Ogre Mage
    "UBOGMA02", // Ogre Mage
    "WIGENTLE", // The Gentleman
    "WIOGMA01", // Yondak Master of Portals
  ],
};
