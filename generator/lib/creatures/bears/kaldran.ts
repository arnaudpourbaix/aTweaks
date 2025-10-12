import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { RawSaveType } from "../../src/model/raw/enum";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";
import { polarBearMainWeapon, polarBearOffhandWeapon } from "./polar";

// Creature Id
const id = MonsterEnum.PolarBearKaldran;
// Script
const script = bafFile(id);
// Spells
const improvedStreamOfFrost = file(1, id);
// Projectile
const improvedStreamOfFrostProjectile = file(1, id);

const paralyzeSave: { saveTypes: RawSaveType[]; saveBonus: number } = {
  saveTypes: ["ParalyzePoisonDeath"],
  saveBonus: -2,
};

export const BEAR_POLAR_KALDRAN: RawCreature = {
  name: "Polar Bear Kaldran",
  bafFile: `lib/pnp-monster/bear/${script}`,
  tpaFile: "lib/pnp-monster/bear/kaldran",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 12,
    bonusHp: 8,
    specialBonusHp: 12,
    strength: 20,
    dexterity: 10,
    constitution: 16,
    intelligence: 10,
    wisdom: 13,
    charisma: 7,
    movement: 12,
    ac: 6,
    apr: 3,
    resistCold: 100,
    alignment: "NEUTRAL",
    morale: 15,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "ANIMAL",
    race: "BEAR",
    class: "BEAR_POLAR",
    gender: "NIETHER",
    size: "Huge",
  },
  additionalData: {
    removeItems: ["KALDW1", "B1-12"],
    removeScripts: ["kaldran", "dw1ranmo"],
    itemSlots: [
      { file: polarBearMainWeapon, slot: "WEAPON1" },
      { file: polarBearOffhandWeapon, slot: "SHIELD" },
    ],
  },
  customCode: [
    {
      location: "init",
      type: "insertAfter",
      statements: [
        {
          triggers: [
            { name: "Global", params: ["Kaldran", "GLOBAL", 0] },
            { name: "See", params: ["NearestEnemyOf"] },
            { name: "See", params: ["PC"] },
          ],
          responses: [
            {
              weight: 100,
              actions: [
                { name: "SetGlobal", params: ["Kaldran", "GLOBAL", 1] },
              ],
            },
          ],
        },
      ],
    },
  ],
  projectiles: [
    {
      file: improvedStreamOfFrostProjectile,
      copyFromFile: "CONECOLD",
      description: "Improved stream of frost",
      areaEffectInfo: {
        areaProjectileFlags: ["AffectOnlyEnemies", "UseSecondaryProjectile"],
        triggerRadius: 180,
        areaOfEffect: 180,
        coneWidth: 0,
      },
    },
  ],
  abilities: [
    {
      name: "Improved stream of frost",
      target: {
        name: "NearestEnemies",
        limit: 3,
      },
      spell: {
        resource: improvedStreamOfFrost,
        type: "force",
        probability: 20,
        selfTarget: true,
      },
      range: 10,
      timer: { name: "StreamOfFrost", value: 18 },
    },
  ],
  spells: [
    {
      name: "Improved stream of frost",
      file: improvedStreamOfFrost,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.ImprovedStreamOfFrost,
      icon: SPELLS.Fireburst,
      description: [
        "Unleash a stream of frost, causing 6d4 points of damage to everything within 10 feet. A save vs. breath weapon is allowed for half damage. Affected creatures are also paralyzed for one turn (saves vs paralyze at -2)",
      ],
      secondaryType: "OffensiveDamage",
      headers: [
        {
          type: "Ranged",
          target: "AnyPointWithinRange",
          projectile: improvedStreamOfFrost,
          range: 10,
          effects: [
            {
              opcode: "Damage",
              timing: "InstantPermanentUntilDeath",
              amount: 0,
              damageMode: "Normal",
              type: "Cold",
              diceThrown: 6,
              diceSize: 4,
              saveTypes: ["Breath"],
              flags: ["SaveForHalf"],
            },
            {
              opcode: "CharacterColorPulse",
              timing: "InstantPermanentUntilDeath",
              color: { blue: 255, green: 213, red: 123 },
              location: "ArmorGreyBeltAmulet",
              cycleSpeed: 20,
            },
            {
              opcode: "Paralyze",
              timing: "InstantLimited",
              idsFile: "EA",
              idsEntry: "ANYONE",
              duration: 60,
              ...paralyzeSave,
            },
            {
              opcode: "DisplayPortraitIcon",
              timing: "InstantLimited",
              icon: "Held",
              duration: 60,
              ...paralyzeSave,
            },
            {
              opcode: "PlaySound",
              timing: "InstantPermanentUntilDeath",
              resource: "MISC_04A",
              ...paralyzeSave,
            },
            {
              opcode: "PlaySound",
              timing: "DelayPermanent",
              resource: "EFF_E03",
              duration: 60,
              ...paralyzeSave,
            },
          ],
        },
      ],
    },
  ],
  files: ["KALDRAN"],
};
