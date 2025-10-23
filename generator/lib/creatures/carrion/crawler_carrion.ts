import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

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
  attack: {
    //TODO:
    targetPriorities: [
      {
        status: ["Able"],
      },
    ],
  },
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
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Tentacles,
      icon: MonsterItemIconEnum.Jelly,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 2,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "ParalyzeEffects",
          lightningEffect: "NecromancyEarth",
          // CharacterColorPulse: blue: 0, green: 57, red: 87
          saveTypes: ["ParalyzePoisonDeath"],
          duration: 42,
        },
      ],
    },
  ],
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
