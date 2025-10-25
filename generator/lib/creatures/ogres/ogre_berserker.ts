import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.BerserkerOgre;
// Script
const script = bafFile(id);
// Items
const mainWeapon = getFilename(1, id);

export const OGRE_BERSERKER: RawCreature = {
  name: "Berserker Ogre",
  bafFile: `lib/pnp-monster/ogre/${script}`,
  tpaFile: "lib/pnp-monster/ogre/berserker",
  tracking: true,
  combatWalk: true,
  usePotions: true,
  data: {
    level1: 4,
    bonusHp: 1,
    strength: 18,
    exceptionalStrength: 100,
    dexterity: 8,
    constitution: 17,
    intelligence: 8,
    wisdom: 7,
    charisma: 7,
    movement: 9,
    ac: 3,
    apr: 1,
    xpv: 650,
    alignment: "CHAOTIC_EVIL",
    morale: 12,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "OGRE",
    class: "FIGHTER",
    kit: "BERSERKER",
    size: "Large",
  },
  additionalData: {
    proficiencies: [{ type: "PROFICIENCYFLAILMORNINGSTAR", value: 3 }],
    memorizedSpells: [{ file: SPELLS.BerserkerRage, memorizedCount: 1 }],
    removeItems: [
      "BDOGRE02",
      "BDOGRE06",
      "BLUN06",
      "SW2H01",
      "OGREGRSU",
      "OGRE1",
      "BDSLUG",
    ],
    removeScripts: ["BDSUM00", "BDFIG00", "BDENSHTV"],
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
      stringRef: TraStringReferenceEnum.GiantFlail,
      icon: "IBLUN13",
      equippedSlot: "WEAPON1",
      type: "Melee",
      category: "Flails",
      animation: "Flail",
      diceThrown: 2,
      diceSize: 8,
      damageType: "Crushing",
      speed: 8,
      abilityFlags: ["AddStrengthBonus"],
      proficiency: "PROFICIENCYFLAILMORNINGSTAR",
      animationSwing: { overhand: 50, backhand: 50, thrust: 0 },
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
    "BDARBING", // Arbinge
    "BDBERTOR", // Betror
    "BDCHESKI", // Cheski
    "BDEINER", // Einer
    "BDSLUG", // Slug
    "BDSLUG2", // Slug
    "BDWAVE13", // Ogre Crusader
    "BDYAROK", // Yarok
  ],
  adjustments: [
    { files: ["OGREGRSU"], summon: true },
    {
      // chieftain
      files: [
        "BDOGREDS",
        "X3HOGREC",
        "X3HOGREL",
        "BDOGRE06",
        "BDARBING",
        "BDCHESKI",
        "BDSLUG",
        "BDSLUG2",
        "BDBERTOR",
        "BDEINER",
        "BDWAVE13",
        "BDYAROK",
      ],
      data: {
        level1: 7,
        xpv: 1400,
        strength: 19,
        exceptionalStrength: 0,
      },
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYFLAILMORNINGSTAR", value: 4 }],
        removeMemorizedSpells: true,
        memorizedSpells: [{ file: SPELLS.BerserkerRage, memorizedCount: 2 }],
      },
    },
    {
      files: ["BDSLUG", "BDSLUG2"],
      noScript: true,
      data: {
        level1: 9,
        xpv: 2000,
      },
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYFLAILMORNINGSTAR", value: 5 }],
        removeMemorizedSpells: true,
        memorizedSpells: [{ file: SPELLS.BerserkerRage, memorizedCount: 3 }],
      },
    },
    {
      files: ["BDBERTOR", "BDEINER", "BDYAROK"],
      noScript: true,
      data: {
        level1: 11,
        xpv: 2000,
      },
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYFLAILMORNINGSTAR", value: 5 }],
        removeMemorizedSpells: true,
        memorizedSpells: [{ file: SPELLS.BerserkerRage, memorizedCount: 3 }],
      },
    },
    {
      files: ["BDYAROK"],
      data: {
        ac: 10,
      },
    },
    {
      // barbarian chieftain
      files: ["BDOGRE06", "X3HOGREL"],
      data: {
        kit: "BARBARIAN",
      },
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYFLAILMORNINGSTAR", value: 2 }],
        removeMemorizedSpells: true,
        memorizedSpells: [{ file: SPELLS.BarbarianRage, memorizedCount: 3 }],
      },
    },
    {
      files: ["X3HOGREL"],
      noScript: true,
      data: {
        level1: 8,
      },
    },
  ],
};
