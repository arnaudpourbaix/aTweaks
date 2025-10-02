import { MonsterItemIconEnum } from "../config/item";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.WinterWolf;
// Script
const script = bafFile(id);
// Spells
const streamOfFrost = file(1, id);
// Projectile
const streamOfFrostProjectile = file(1, id);
// Items
const mainWeapon = file(1, id);
export const WOLF_WINTER: RawCreature = {
  name: "Winter Wolf",
  tpaFile: "lib/pnp-monster/wolf/winter",
  bafFile: `lib/pnp-monster/wolf/${script}`,
  tracking: true,
  combatWalk: true,
  data: {
    level1: 6,
    bonusHp: 0,
    strength: 18,
    dexterity: 13,
    constitution: 14,
    intelligence: 9,
    wisdom: 12,
    charisma: 8,
    movement: 18,
    ac: 5,
    apr: 1,
    xpv: 975,
    alignment: "NEUTRAL_EVIL",
    morale: 13,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "ANIMAL",
    race: "WOLF",
    class: "WOLF_WINTER",
    gender: "MALE",
    size: "Large",
    resistCold: 100,
    resistFire: -10,
  },
  additionalData: {
    removeItems: ["WOLFWI1", "WOLFWI2"],
    removeScripts: ["WNTRWOLF", "BDSUM00"],
  },
  projectiles: [
    {
      file: streamOfFrostProjectile,
      copyFromFile: "CONECOLD",
      description: "Stream of frost",
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
      name: "Stream of frost",
      target: {
        name: "NearestEnemies",
        limit: 3,
      },
      spell: {
        resource: streamOfFrost,
        type: "force",
        probability: 20,
        selfTarget: true,
      },
      range: 10,
      timer: { name: "StreamOfFrost", value: 60 },
    },
  ],
  spells: [
    {
      name: "Stream of frost",
      file: streamOfFrost,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.StreamOfFrost,
      description: [
        "Unleash a stream of frost, causing 6d4 points of damage to everything within 10 feet. A save vs. breath weapon is allowed for half damage.",
      ],
      secondaryType: "OffensiveDamage",
      headers: [
        {
          type: "Ranged",
          target: "AnyPointWithinRange",
          projectile: streamOfFrostProjectile,
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
          ],
        },
      ],
    },
  ],
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 2,
      diceSize: 4,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: [
    "P#WOLF01",
    "WOLFWI",
    "WOLFWISU",
    "WOLFWWSU",
    "L#WOLST", // Pregnant Wolf
    // "SPIRWOLF", //TODO: Spirit Wolf
    // "SPWOLF1", //TODO: Spirit Wolf
    // "SPWOLF2", //TODO: Spirit Wolf
    // "SPWOLF3", //TODO: Spirit Wolf
    // "SPWOLF4", //TODO: Spirit Wolf
    // "SPWOLF5", //TODO: Spirit Wolf
  ],
};
