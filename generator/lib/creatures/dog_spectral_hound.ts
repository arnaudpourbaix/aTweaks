import { RawCreature } from "../src/model/raw/creature";
import { file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.SpectralHound;
// Items
const mainWeapon = file(1, id);
const ring = file(2, id);

export const SPECTRAL_HOUND: RawCreature = {
  name: "Spectral Hound",
  tpaFile: "lib/pnp-monster/dog/spectral_hound",
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
  additionalData: {
    removeItems: [
      "FIGRING3",
      "IPSION",
      "BDSPIRIM",
      // keep their current weapons until a true weapon is done below
      // "DOGWAWP",
      // "BDSHA01C"
    ],
    immunities: ["incorporeal"],
  },
  items: [
    //TODO:
    // {
    //   // roll a saving throw vs. spell. If the saving throw fails, the victim begins to fade, slowly assuming the same translucent appearance as the spectral hound itself.
    //   // The entire process takes 24 hours. After 12 hours, a fading character cannot hear or speak to any unfaded characters from the victim's point of view, it is the rest of the world that is becoming translucent, not himself or herself).
    //   // The character's equipment – weapons, armor, spell components, and the like – is unaffected and drops away.
    //   // Because of their inability to handle objects, faded creatures cannot eat or drink.
    //   // Mental and energy-based attacks work normally when used against a faded character, but the character is immune to physical attacks.
    //   // After 12 more hours, the character fades completely from sight and slips into the Astral Plane.
    //   // Once on the Astral Plane, the victim can handle objects (but isn't likely to find any lying about, waiting to be picked up) and can seek any normal means to exit the plane and return to the Prime Material.
    //   file: mainWeapon,
    //   equippedSlot: "WEAPON1",
    //   type: "Melee",
    //   diceThrown: 2,
    //   diceSize: 6,
    //   damageType: "Piercing",
    //   speed: 3,
    //   abilityFlags: ["AddStrengthBonus"],
    //   effects: [],
    // },
    {
      file: ring,
      immunities: ["extraplanar"],
      effects: [
        {
          opcode: "InvisibilityDetection",
          global: true,
        },
        {
          opcode: "MakeUnselectable",
          disableDialog: true,
          global: true,
        },
      ],
      equippedSlot: "AMULET",
      category: "Amulets",
      icon: "IRING01",
    },
  ],
  files: [
    "BDSHA01C", // Hound Spirit
    "DOGWAWP", // Astral Hound
  ],
  adjustments: [{ files: ["BDSHA01C"], summon: true }],
};
