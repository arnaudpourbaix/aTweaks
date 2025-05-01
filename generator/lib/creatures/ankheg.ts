import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";
// Creature Id
const id = MonsterEnum.Ankheg;
// Script
const script = bafFile(id);
// Spells
const digestiveEnzyme = file(1, id);
const acidicEnzyme = file(2, id);
const grab = file(3, id);
// Items
const mainWeapon = file(1, id);
const rangedWeapon = file(2, id);
export const ANKHEG: RawCreature = {
  name: "Ankheg",
  bafFile: `lib/pnp-monster/ankheg/${script}`,
  tpaFile: "lib/pnp-monster/ankheg/main",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 8,
    strength: 17,
    dexterity: 11,
    constitution: 13,
    intelligence: 1,
    wisdom: 13,
    charisma: 6,
    movement: 6,
    ac: 2,
    apr: 1,
    xpv: 975,
    alignment: "NEUTRAL",
    morale: 9,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "ANKHEG",
    class: "ANKHEG",
    gender: "NIETHER",
    size: "Huge",
  },
  additionalData: {
    removeScripts: ["ANKHEG"],
    removeItems: ["ANKHEG1", "ANKHEG2"],
  },
  attack: {
    actions: [{ weaponSlot: "SLOT_WEAPON", disableInterrupt: true }],
    grab: {
      file: grab,
      weaponFile: mainWeapon,
      duration: 18,
    },
  },
  abilities: [
    {
      name: "Acidic Enzymes",
      disableInterrupt: true,
      target: { name: "PCsPreferringWeak", random: true },
      triggers: [
        { name: "HPPercentLT", params: ["Myself", 50] },
        { name: "HaveSpellRES", params: [acidicEnzyme] },
      ],
      actionsAfter: [
        { name: "SelectWeaponAbility", params: ["SLOT_WEAPON1", 0] },
        { name: "AttackOneRound", params: ["LastSeenBy"] },
      ],
      range: 30,
    },
  ],
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 3,
      diceSize: 6,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "CastSpell",
          resource: digestiveEnzyme,
          type: "CastInstantlyAtCasterLevel",
        },
      ],
    },
    {
      file: rangedWeapon,
      equippedSlot: "WEAPON2",
      type: "Ranged",
      range: 30,
      speed: 3,
      bonusToHit: 20,
      projectile: "acidblob",
      effects: [
        {
          opcode: "CastSpell",
          type: "CastInstantlyAtCasterLevel",
          resource: acidicEnzyme,
        },
        { opcode: "RemoveSpell", target: "Self", resource: acidicEnzyme },
      ],
    },
  ],
  spells: [
    {
      name: "Acidic digestive enzymes",
      file: digestiveEnzyme,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.AcidicDigestiveEnzymes,
      description: [
        "The ankheg can secret acidic digestive enzymes to cause an additional 1d4 points of damage per round until the victim is dissolved (truncated to 4 rounds).",
      ],
      secondaryType: "OffensiveDamage",
      type: "Melee",
      range: 5,
      effects: [
        { opcode: "DisplayPortraitIcon", icon: "Acid", duration: 24 },
        { opcode: "Damage", type: "Acid", diceThrown: 1, diceSize: 4 },
        {
          opcode: "Damage",
          timing: "DelayPermanent",
          duration: 6,
          type: "Acid",
          diceThrown: 1,
          diceSize: 4,
        },
        {
          opcode: "Damage",
          timing: "DelayPermanent",
          duration: 12,
          type: "Acid",
          diceThrown: 1,
          diceSize: 4,
        },
        {
          opcode: "Damage",
          timing: "DelayPermanent",
          duration: 18,
          type: "Acid",
          diceThrown: 1,
          diceSize: 4,
        },
        {
          opcode: "ProtectionFromSpell",
          resource: digestiveEnzyme,
          duration: 24,
          timing: "InstantLimited",
        },
      ],
    },
    {
      name: "Stream of acidic enzymes",
      file: acidicEnzyme,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.StreamOfAcidicEnzymes,
      description: [
        "The ankheg can squirt a stream of acidic enzymes once every six hours to a distance of 30 feet.",
        "A victim struck by the stream of acidic enzymes suffers 8d4 points of damage (half damage if the victim rolls a successful saving throw vs. poison).",
        "It uses this attack technique only when desperate.",
      ],
      secondaryType: "OffensiveDamage",
      type: "Ranged",
      range: 30,
      speed: 3,
      projectile: "acidblob",
      effects: [
        {
          opcode: "Damage",
          type: "Acid",
          diceThrown: 8,
          diceSize: 4,
          saveTypes: ["ParalyzePoisonDeath"],
          flags: ["SaveForHalf"],
        },
      ],
    },
  ],
  files: [
    "BDNEO",
    "ANKHEG",
    "ANKHEGF",
    "ANKHEGG",
    "ANKHEGQ",
    "BDANKH01",
    "BDANKHEG",
    "BDANKHSU",
    "BPANKHE1",
    "WIANKHE1",
  ],
  adjustments: [
    { files: ["BDANKH01"], data: { level1: 10, xpv: 1400 } },
    { files: ["BDANKHSU"], summon: true },
  ],
};
