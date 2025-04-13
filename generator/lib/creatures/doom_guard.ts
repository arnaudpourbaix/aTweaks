import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster-id";

// Creature Id
const id = MonsterEnum.DoomGuard;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
const armor = file(2, id);
const helmet = file(3, id);

export const DOOM_GUARD: RawCreature = {
  name: "Doom Guard",
  bafFile: `lib/pnp-monster/doom_guard/${script}`,
  tpaFile: "lib/pnp-monster/doom_guard/main",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 5,
    strength: 20,
    dexterity: 10,
    constitution: 9,
    intelligence: 7,
    wisdom: 11,
    charisma: 1,
    movement: 12,
    ac: 2,
    apr: 1,
    xpv: 2000,
    resistFire: 50,
    resistCold: 50,
    alignment: "NEUTRAL",
    morale: 20,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "GOLEM",
    class: "FIGHTER",
    gender: "NIETHER",
    size: "Medium",
  },
  additionalData: {
    immunities: ["construct"],
    proficiencies: [{ type: "PROFICIENCYLONGSWORD", value: 2 }],
    removeScripts: ["dw1melmo"],
    removeItems: ["HELM13", "PLAT07", "SW1H11", "RING95"],
  },
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      enchantment: 1,
      type: "Melee",
      flags: ["Magical"],
      animation: "LongSword",
      category: "LargeSwords",
      proficiency: "PROFICIENCYLONGSWORD",
      animationSwing: { backhand: 50, overhand: 50, thrust: 0 },
      range: 1,
      diceThrown: 1,
      diceSize: 8,
      damageType: "Slashing",
      speed: 5,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          global: true,
          opcode: "SetColor",
          color: "Silver",
          location: "WeaponBlueHeadBladeMinor",
          target: "Self",
          timing: "InstantWhileEquipped",
        },
        {
          global: true,
          opcode: "SetColor",
          color: "Rhubarb",
          location: "WeaponRedGripStaffMinor",
          target: "Self",
          timing: "InstantWhileEquipped",
        },
        {
          global: true,
          opcode: "SetColor",
          color: "DarkSilver",
          location: "WeaponGreyHeadBladeStaffMajor",
          target: "Self",
          timing: "InstantWhileEquipped",
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
  ],
  files: ["DOOMGU", "DOOMDUR"],
  adjustments: [
    {
      files: ["DOOMDUR"],
      data: { level1: 8 },
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYLONGSWORD", value: 2 }],
      },
    },
  ],
};
