import { RawCreature } from "../src/model/raw/creature";
import { file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.SpectralHound;
// Items
const mainWeapon = file(1, id);
const ring = file(2, id);

export const SPECTRAL_HOUND: RawCreature = {
  name: "spectral hound",
  tpaFile: "lib/pnp-monster/dog/hound",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 5,
    bonusHp: 0,
    strength: 17,
    dexterity: 15,
    constitution: 14,
    intelligence: 4,
    wisdom: 14,
    charisma: 12,
    movement: 15,
    ac: -2,
    apr: 1,
    xpv: 975,
    alignment: "CHAOTIC_EVIL",
    morale: 19,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "DOG",
    class: "DOG_WAR",
    gender: "MALE",
    size: "Medium",
  },
  additionalData: { removeItems: ["FIGRING3", "IPSION"] },
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 2,
      diceSize: 6,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
    {
      file: ring,
      immunities: ["extraplanar", "incorporeal"],
      effects: [
        {
          opcode: "InvisibilityDetection",
          global: true,
        },
        // {
        //   opcode: "Translucency",
        //   amount: 45,
        //   type: "DrawInstantly",
        //   global: true,
        // },
        // {
        //   opcode: "Blur",
        //   global: true,
        // },
        // {
        //   opcode: "SetColorGlowSolid",
        //   color: { red: 40, green: 195, blue: 162 },
        //   location: "ArmorGreenHair",
        //   global: true,
        // },
        // {
        //   opcode: "SetColorGlowPulse",
        //   color: { red: 0, green: 136, blue: 0 },
        //   location: "ArmorBlueArmorTrimming",
        //   cycleSpeed: 80,
        //   global: true,
        // },
      ],
      equippedSlot: "RRING",
      category: "Rings",
      icon: "IRING01",
    },
  ],
  files: [
    "BDSHA01C", // Hound Spirit
    "DOGWAWP", // Astral Hound
  ],
  adjustments: [{ files: ["BDSHA01C"], summon: true }],
};
