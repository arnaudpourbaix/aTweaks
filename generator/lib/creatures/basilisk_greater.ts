import { GLOBAL_CONFIG } from "../config/generate";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import {
  basiliskGazeProjectile,
  petrification2e,
  petrification5e,
} from "./basilisk_lesser";
import { MonsterEnum } from "./monster.enum";
// Creature Id
const id = MonsterEnum.GreaterBasilisk;
// Script
const script = bafFile(id);
// Spells
const foulBreath = file(1, id);
// Items
const mainWeapon = file(1, id);
const offhandWeapon = file(2, id);
// Projectiles
const breathProjectile = file(1, id);
export const BASILISK_GREATER: RawCreature = {
  name: "Greater Basilisk",
  bafFile: `lib/pnp-monster/basilisk/${script}`,
  tpaFile: "lib/pnp-monster/basilisk/greater",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 10,
    strength: 20,
    dexterity: 8,
    constitution: 19,
    intelligence: 7,
    wisdom: 12,
    charisma: 11,
    movement: 6,
    ac: 2,
    apr: 3,
    xpv: 7000,
    alignment: "NEUTRAL",
    morale: 16,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "BASILISK",
    class: "BASILISK_GREATER",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: {
    removeScripts: ["GBASILSK"],
    removeItems: ["BASILG1", "BASILG2", "BASILG3"],
    memorizedSpells: [
      { file: petrification2e, memorizedCount: 1 },
      { file: petrification5e, memorizedCount: 1 },
    ],
  },
  abilities: [
    {
      name: "Petrification (2e)",
      target: {
        name: "NearestEnemies",
        random: true,
      },
      spell: {
        resource: petrification2e,
        type: "force",
      },
    },
  ],
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 6,
      damageType: "Slashing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "Poison",
          type: "OneDamagePerAmountSecond",
          amount: 6,
          saveTypes: ["ParalyzePoisonDeath"],
          saveBonus: 4,
          duration: 30,
        },
        {
          opcode: "DisplayPortraitIcon",
          icon: "Poisoned",
          saveTypes: ["ParalyzePoisonDeath"],
          saveBonus: 4,
          duration: 30,
        },
      ],
    },
    {
      file: offhandWeapon,
      equippedSlot: "SHIELD",
      type: "Melee",
      diceThrown: 2,
      diceSize: 8,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "CastSpell",
          type: "CastInstantlyAtCasterLevel",
          resource: foulBreath,
        },
      ],
    },
  ],
  projectiles: [
    {
      file: breathProjectile,
      copyFromFile: basiliskGazeProjectile,
      description: "Basilisk foul breath",
      triggerRadius: 85,
      areaOfEffect: 85,
      triggerCount: 0,
      areaProjectileFlags: ["AffectOnlyEnemies"],
    },
  ],
  spells: [
    {
      name: "Foul breath",
      file: foulBreath,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.FoulBreath,
      description: [
        "Its foul breath is also poisonous, and all creatures, coming within 5 feet of its mouth, even if just for a moment, must roll successful saving throws vs. poison (with a +2 bonus) or die (check each round of exposure).",
      ],
      secondaryType: "OffensiveDamage",
      headers: [
        {
          type: "Ranged",
          projectile: breathProjectile,
          range: 5,
          target: "AnyPointWithinRange",
          effects: [
            {
              opcode: "Slay",
              idsFile: "EA",
              idsEntry: "ANYONE",
              timing: "InstantPermanentUntilDeath",
              saveTypes: ["ParalyzePoisonDeath"],
              saveBonus: 2,
            },
            {
              opcode: "PlaySound",
              resource: "EFF_P88",
              timing: "InstantPermanentUntilDeath",
              saveTypes: ["ParalyzePoisonDeath"],
              saveBonus: 2,
            },
            {
              opcode: "PlayVisualEffect",
              playWhere: "OverTargetUnattached",
              resource: "SPFINGER",
              timing: "InstantPermanentUntilDeath",
              saveTypes: ["ParalyzePoisonDeath"],
              saveBonus: 2,
            },
          ],
        },
      ],
    },
  ],
  files: [
    "AC#BASGR",
    "BASILG",
    "BASILGSU",
    "BASILMUT",
    "BASILNAD",
    "BD302BAS",
    "BPBASG01",
  ],
  adjustments: [{ files: ["BASILGSU"], summon: true }],
};
