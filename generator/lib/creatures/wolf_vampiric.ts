import { RawCreature } from "../src/model/raw/creature";

export const WOLF_VAMPIRIC: RawCreature = {
  name: "Vampiric Wolf",
  tpaFile: "lib/pnp-monster/wolf/vampiric",
  bafFile: "lib/pnp-monster/wolf/ja#m21",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 6,
    bonusHp: 4,
    strength: 18,
    dexterity: 13,
    constitution: 9,
    intelligence: 6,
    wisdom: 12,
    charisma: 7,
    movement: 24,
    ac: 2,
    apr: 1,
    xpv: 2000,
    alignment: "NEUTRAL_EVIL",
    morale: 14,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "UNDEAD",
    race: "WOLF",
    class: "WOLF_VAMPIRIC",
    gender: "MALE",
    size: "Small",
  },
  additionalData: {
    removeItems: ["WOLFVA1", "BDWOLFVA"],
    removeScripts: ["DW#GPSHM", "VAMPWOLF"],
  },
  // In game terms, a bite attack will cause a running or standing victim to fall if the victim fails a saving throw vs. paralysis.
  // Once the prey falls, the wolves continue to attack, shifting to the victim's arms so that he can no longer use a weapon.
  // This involves a called-shot attack in which a vampiric wolf has a -4 penalty to hit;
  // success means the wolf has grasped an arm in its mouth, and the victim cannot get free unless he makes a successful Strength check (one attempt per round).
  // Once a grasping bite is made, damage is continually inflicted each round as the wolf gnaws on the limb.
  attack: {
    targetStatusPriorities: ["Grabbed", "Sleep", "NoCheck"],
    defaultWeaponSlot: "SLOT_WEAPON",
    targetStatusWeaponSlot: [
      { status: ["Sleep"], slot: "SLOT_WEAPON1" },
      { status: ["Grabbed"], slot: "SLOT_WEAPON2" },
    ],
    grab: {
      file: "ja#1m21",
      weaponFile: "ja#m21w2",
      onlyGrabProneTarget: true,
      duration: 30,
    },
  },
  items: [
    {
      file: "ja#m21w1",
      type: "Melee",
      equippedSlot: "WEAPON1",
      speed: 1,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "Damage",
          target: "PresetTarget",
          diceThrown: 3,
          diceSize: 4,
          type: "Piercing",
        },
        {
          opcode: "CurrentHPbonus",
          target: "Self",
          timing: "InstantPermanentUntilDeath",
          diceThrown: 3,
          diceSize: 4,
          value: 0,
          type: "Increment",
        },
        {
          opcode: "CharacterColorPulse",
          target: "Self",
          timing: "InstantLimited",
          color: { blue: 191, green: 125, red: 53 },
          location: "ArmorGreyBeltAmulet",
          cycleSpeed: 20,
          duration: 1,
        },
        {
          opcode: "Sleep",
          wakeOnDamage: true,
          timing: "InstantLimited",
          duration: 12,
          saveTypes: ["ParalyzePoisonDeath"],
        },
      ],
    },
    {
      file: "ja#m21w2",
      equippedSlot: "WEAPON2",
      copyFrom: "ja#m21w1",
    },
    {
      file: "ja#m21w3",
      equippedSlot: "WEAPON3",
      copyFrom: "ja#m21w1",
      bonusToHit: 30,
    },
  ],
  files: ["BDWOLFVA", "P#WOLF04", "WOLFVA"],
};
