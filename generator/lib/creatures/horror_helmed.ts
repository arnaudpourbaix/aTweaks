import { SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.HelmedHorror;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
const armor = file(2, id);
const helmet = file(3, id);
const amulet = file(4, id);

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
    immunities: ["construct"],
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
      preset: SPELLS.MagicMissiles,
      spell: {
        type: "noDec",
      },
      triggers: [
        { name: "Range", params: ["NearestEnemyOf", 10], negation: true },
      ],
      timer: { name: "MagicMissiles", value: 18 },
    },
  ],
  customCode: [
    {
      location: "trackTargets",
      type: "insertBefore",
      abilities: [
        {
          preset: SPELLS.DimensionDoor,
          range: 180,
        },
      ],
    },
  ],
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.FlamingGreatsword,
      equippedSlot: "WEAPON1",
      enchantment: 1,
      type: "Melee",
      flags: ["TwoHanded", "Magical"],
      animation: "TwoHandedSword",
      category: "Greatswords",
      icon: "IFLAMS01",
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
      stringRef: TraStringReferenceEnum.PlateMail,
      equippedSlot: "ARMOR",
      animation: "PlateMail",
      icon: "IPLAT01",
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
      stringRef: TraStringReferenceEnum.Helmet,
      equippedSlot: "HELMET",
      animation: "HelmetFeatherSideburns",
      category: "Headgear",
      icon: "ihelm10",
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
      file: amulet,
      stringRef: "Helmed Horror traits",
      immunities: [
        "seeInvisible",
        "fireballSpell",
        "lightningBoltSpell",
        "flameArrowSpell",
        "magicMissile",
        "hover",
      ],
      equippedSlot: "AMULET",
      category: "Amulets",
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
          { file: SPELLS.MagicMissiles, memorizedCount: 1 },
          { file: SPELLS.DimensionDoor, memorizedCount: 1 },
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
