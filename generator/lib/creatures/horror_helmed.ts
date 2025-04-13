import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster-id";

// Creature Id
const id = MonsterEnum.HelmedHorror;
// Script
const script = bafFile(id);
// Spells
const magicMissile = "SPWI112";
const teleport = "SPWI402";
// Items
const mainWeapon = file(1, id);
const armor = file(2, id);
const helmet = file(3, id);
const ring = file(3, id);

export const HORROR_HELMED: RawCreature = {
  name: "Helmed Horror",
  bafFile: `lib/pnp-monster/horror/${script}`,
  tpaFile: "lib/pnp-monster/horror/helmed",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 4,
    bonusHp: 10,
    strength: 18,
    dexterity: 13,
    constitution: 9,
    intelligence: 14,
    wisdom: 10,
    charisma: 10,
    movement: 12,
    ac: 2,
    apr: 1,
    xpv: 2000,
    alignment: "NEUTRAL",
    morale: 20,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "GOLEM",
    class: "FIGHTER",
    gender: "NIETHER",
    size: "Medium",
    animation: "FIGHTER_MALE_HUMAN",
    hairColor: 63,
    armorColor: 63,
    skinColor: 63,
    majorColor: 63,
    metalColor: 63,
    minorColor: 63,
    leatherColor: 63,
  },
  additionalData: {
    immunities: ["construct", "hover", "seeInvisible"],
    removeScripts: ["dw1melmo"],
    removeItems: [
      "HELM08",
      "SHLD18",
      "RING95",
      "BLUN08",
      "FBLADE",
      "PLAT07",
      "HELM13",
    ],
    proficiencies: [{ type: "PROFICIENCYTWOHANDEDSWORD", value: 2 }],
  },
  abilities: [
    {
      name: "Magic Missiles",
      target: { name: "PCSpellcasters", includeStatus: ["Able"], random: true },
      triggers: [
        { name: "HaveSpellRES", params: [magicMissile] },
        { name: "Range", params: ["NearestEnemyOf", 10], negation: true },
      ],
      actions: [
        { name: "ForceSpellRES", params: [magicMissile, "LastSeenBy"] },
      ],
      timer: { name: "MagicMissiles", value: 18 },
    },
  ],
  customCode: [
    {
      location: "trackTargets",
      type: "insertBefore",
      statements: [
        {
          comment: "Dimension Door",
          target: {
            name: "Players",
            triggers: [{ name: "Range", params: ["{Target}", 180] }],
          },
          triggers: [
            { name: "HaveSpellRES", params: [teleport] },
            {
              name: "StateCheck",
              params: ["Myself", "STATE_BLIND"],
              negation: true,
            },
          ],
          responses: [
            {
              weight: 100,
              actions: [
                { name: "ForceSpellRES", params: [teleport, "{Target}"] },
                { name: "RemoveSpellRES", params: [teleport] },
              ],
            },
          ],
        },
      ],
    },
  ],
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      enchantment: 1,
      type: "Melee",
      flags: ["TwoHanded", "Magical"],
      animation: "TwoHandedSword",
      category: "Greatswords",
      proficiency: "PROFICIENCYTWOHANDEDSWORD",
      animationSwing: { backhand: 40, overhand: 40, thrust: 20 },
      range: 2,
      diceThrown: 2,
      diceSize: 6,
      damageType: "Slashing",
      speed: 10,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        { opcode: "Damage", diceSize: 6, diceThrown: 1, type: "Fire" },
        {
          global: true,
          opcode: "SetColor",
          color: "ShinyGold",
          location: "WeaponBlueHeadBladeMinor",
          target: "Self",
          timing: "InstantWhileEquipped",
        },
        {
          global: true,
          opcode: "SetColor",
          color: "ShinyGold",
          location: "WeaponRedGripStaffMinor",
          target: "Self",
          timing: "InstantWhileEquipped",
        },
        {
          global: true,
          opcode: "SetColor",
          color: "LightCarnationPink",
          location: "WeaponGreyHeadBladeStaffMajor",
          target: "Self",
          timing: "InstantWhileEquipped",
        },
        {
          global: true,
          opcode: "SetColorGlowSolid",
          color: { red: 64, green: 0, blue: 0 },
          location: "WeaponGreyHeadBladeStaffMajor",
          target: "Self",
          timing: "InstantWhileEquipped",
          duration: 3,
        },
        {
          global: true,
          opcode: "SetColorGlowSolid",
          color: { red: 64, green: 0, blue: 0 },
          location: "WeaponBlueHeadBladeMinor",
          target: "Self",
          timing: "InstantWhileEquipped",
          duration: 3,
        },
        {
          global: true,
          opcode: "SetColorGlowSolid",
          color: { red: 0, green: 0, blue: 0 },
          location: "WeaponRedGripStaffMinor",
          target: "Self",
          timing: "InstantWhileEquipped",
          duration: 3,
        },
      ],
    },
    {
      file: armor,
      equippedSlot: "ARMOR",
      animation: "PlateMail",
      category: "ArmorSlot",
      effects: [
        {
          global: true,
          opcode: "SetColor",
          color: "LeafGreen",
          location: "ArmorBlueArmorTrimming",
          target: "Self",
          timing: "InstantWhileEquipped",
        },
        {
          global: true,
          opcode: "SetColor",
          color: "RedTintedBlack",
          location: "ArmorRedStrapLeather",
          target: "Self",
          timing: "InstantWhileEquipped",
        },
        {
          global: true,
          opcode: "SetColor",
          color: "DarkPoopyBrown",
          location: "ArmorGreyBeltAmulet",
          target: "Self",
          timing: "InstantWhileEquipped",
        },
      ],
    },
    {
      file: helmet,
      copyFrom: "construct",
      equippedSlot: "HELMET",
      animation: "HelmetFeatherSideburns",
      category: "Headgear",
      effects: [
        {
          global: true,
          opcode: "SetColor",
          color: "Silver",
          location: "HelmetBlueExterior",
          target: "Self",
          timing: "InstantWhileEquipped",
        },
        {
          global: true,
          opcode: "SetColor",
          color: "Silver",
          location: "HelmetRedFace",
          target: "Self",
          timing: "InstantWhileEquipped",
        },
        {
          global: true,
          opcode: "SetColor",
          color: "Silver",
          location: "HelmetGreyWings",
          target: "Self",
          timing: "InstantWhileEquipped",
        },
      ],
    },
    {
      file: ring,
      immunities: [
        "fireballSpell",
        "lightningBoltSpell",
        "flameArrowSpell",
        "magicMissile",
      ],
      equippedSlot: "RRING",
      category: "Rings",
      icon: "IRING01",
    },
  ],
  files: ["HELMHO", "GLOWTEST", "BATTHO", "dw#davho", "DOOMSA"],
  adjustments: [
    {
      files: ["BATTHO", "dw#davho", "DOOMSA"],
      data: {
        level1: 8,
        level2: 3,
        bonusHp: 11,
        strength: 20,
        class: "FIGHTER_MAGE",
        alignment: "LAWFUL_EVIL",
        xpv: 4000,
      },
      additionalData: {
        memorizedSpells: [
          { file: magicMissile, memorizedCount: 1 },
          { file: teleport, memorizedCount: 1 },
        ],
      },
    },
    {
      files: ["DOOMSA"],
      additionalData: {
        immunities: ["incorporeal"],
      },
    },
  ],
};
