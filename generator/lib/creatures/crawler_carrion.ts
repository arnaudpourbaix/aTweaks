import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.CarrionCrawler;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);

export const CARRION_CRAWLER: RawCreature = {
  name: "Carrion Crawler",
  bafFile: `lib/pnp-monster/carrion/${script}`,
  tpaFile: "lib/pnp-monster/carrion/carrion_crawler",
  tracking: true,
  combatWalk: true,
  attack: { targetStatusPriorities: ["Able", "Held", "NoCheck", "Sleep"] },
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 2,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "Paralyze",
          idsFile: "EA",
          idsEntry: "ANYONE",
          timing: "InstantLimited",
          duration: 42,
          saveTypes: ["ParalyzePoisonDeath"],
        },
        {
          opcode: "DisplayPortraitIcon",
          icon: "Held",
          timing: "InstantLimited",
          duration: 42,
          saveTypes: ["ParalyzePoisonDeath"],
        },
        {
          opcode: "PlaySound",
          timing: "InstantPermanentUntilDeath",
          resource: "EFF_P11",
          saveTypes: ["ParalyzePoisonDeath"],
        },
        {
          opcode: "PlaySound",
          timing: "DelayPermanent",
          resource: "EFF_E05",
          duration: 42,
          saveTypes: ["ParalyzePoisonDeath"],
        },
        {
          opcode: "CharacterColorPulse",
          timing: "InstantPermanentUntilDeath",
          color: { blue: 0, green: 57, red: 87 },
          location: "ArmorGreyBeltAmulet",
          cycleSpeed: 25,
          saveTypes: ["ParalyzePoisonDeath"],
        },
        {
          opcode: "LightingEffects",
          timing: "InstantPermanentUntilDeath",
          lightingTarget: "SpellTarget",
          effect: "NecromancyEarth",
          saveTypes: ["ParalyzePoisonDeath"],
        },
      ],
    },
  ],
  data: {
    level1: 3,
    bonusHp: 1,
    strength: 14,
    dexterity: 13,
    constitution: 16,
    intelligence: 1,
    wisdom: 12,
    charisma: 5,
    movement: 12,
    ac: 3,
    apr: 8,
    alignment: "NEUTRAL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "CARRIONCRAWLER",
    class: "CARRIONCRAWLER",
    gender: "NIETHER",
    size: "Large",
    xpv: 420,
  },
  additionalData: { removeItems: ["CARRIO1"], removeScripts: ["ccrawler"] },
  files: [
    "BDCCRAW1",
    "BPCRCW01",
    "CARRIO",
    "CRYPTCRA",
    "BDCRAWMU",
    "BDMCARRI",
    "CARRIOSU",
  ],
  adjustments: [
    { files: ["BDCCRAW1"], noScript: true },
    { files: ["CARRIOSU"], summon: true },
    { files: ["CRYPTCRA"], data: { level1: 6, thac0: 9, xpv: 650 } },
  ],
};
