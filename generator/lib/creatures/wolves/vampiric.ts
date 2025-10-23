import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { RawItem } from "../../src/model/raw/item";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.VampiricWolf;
// Script
const script = bafFile(id);
// Spells
const grab = file(1, id);
// Items
const mainWeapon = file(1, id);
const proneBiteWeapon = file(2, id);
const autoHitWeapon = file(3, id);
const traits = file(4, id);

const baseWeapon: RawItem = {
  file: mainWeapon,
  stringRef: TraStringReferenceEnum.Jaws,
  icon: MonsterItemIconEnum.Jaws,
  type: "Melee",
  equippedSlot: "WEAPON1",
  damageBonus: 8,
  damageType: "Piercing",
  speed: 1,
  abilityFlags: ["AddStrengthBonus"],
  effects: [
    {
      opcode: "CurrentHPbonus",
      target: "Self",
      timing: "InstantPermanentUntilDeath",
      value: 10, // average roll of 8 + 2 strength damage bonus
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
};

const name = "Vampiric Wolf";

export const WOLF_VAMPIRIC: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/wolf/vampiric",
  bafFile: `lib/pnp-monster/wolf/${script}`,
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
    removeItems: ["WOLFVA1", "BDWOLFVA", "IMMUNE1", "RING95"],
    removeScripts: ["DW#GPSHM", "VAMPWOLF"],
  },
  attack: {
    // A bite attack will cause a running or standing victim to fall if the victim fails a saving throw vs. paralysis.
    // Once the prey falls, the wolves continue to attack, shifting to the victim's arms so that he can no longer use a weapon.
    // This involves a called-shot attack in which a vampiric wolf has a -4 penalty to hit;
    // success means the wolf has grasped an arm in its mouth, and the victim cannot get free unless he makes a successful Strength check (one attempt per round).
    // Once a grasping bite is made, damage is continually inflicted each round as the wolf gnaws on the limb.
    targetPriorities: [{ status: ["Grabbed", "Sleep"] }],
    defaultWeaponSlot: "SLOT_WEAPON",
    targetStatusWeaponSlot: [
      { status: ["Sleep"], slot: "SLOT_WEAPON1" },
      { status: ["Grabbed"], slot: "SLOT_WEAPON2" },
    ],
    grab: {
      //TODO:
      file: grab,
      weaponFile: proneBiteWeapon,
      onlyGrabProneTarget: true,
      duration: 30,
    },
  },
  items: [
    baseWeapon,
    {
      ...baseWeapon,
      stringRef: "Jaws-grab sleeping target",
      file: proneBiteWeapon,
      equippedSlot: "WEAPON2",
    },
    {
      ...baseWeapon,
      stringRef: "Jaws-autohit grabbed target",
      file: autoHitWeapon,
      equippedSlot: "WEAPON3",
      bonusToHit: 30,
    },
    createTraitItem({
      file: traits,
      name,
      immunities: ["sleep", "charm", "hold", "normalWeapons"],
    }),
  ],
  files: [
    "BDWOLFVA",
    "P#WOLF04",
    "WOLFVA",
    "DW#ULCWO", // Wolf of Ulcaster
  ],
  notEnforceFiles: ["DW#ULCWO"],
};
