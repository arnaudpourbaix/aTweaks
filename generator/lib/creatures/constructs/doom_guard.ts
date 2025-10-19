import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.DoomGuard;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
const traits = file(2, id);
const armor = file(3, id);
const helmet = file(4, id);

const name = "Doom Guard";

export const DOOM_GUARD: RawCreature = {
  name,
  bafFile: `lib/pnp-monster/construct/${script}`,
  tpaFile: "lib/pnp-monster/construct/doom_guard",
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
      stringRef: TraStringReferenceEnum.LongSword,
      equippedSlot: "WEAPON1",
      enchantment: 1,
      type: "Melee",
      flags: ["Magical"],
      animation: "LongSword",
      icon: "ISW1H04",
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
    createTraitItem({
      file: traits,
      name,
      immunities: ["mindSpells", "fireResistance", "coldResistance"],
    }),
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
      icon: "ihelm10",
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
