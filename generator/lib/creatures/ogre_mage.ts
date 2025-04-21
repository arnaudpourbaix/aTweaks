import { GLOBAL_CONFIG } from "../config/generate";
import { GRAB_DEFAULT_CONFIG } from "../config/grab";
import { ITEMS } from "../config/item";
import { SPELL_STATES, SPELLS } from "../config/spell";
import {
  StringReferenceEnum,
  TraStringReferenceEnum,
} from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.OgreMage;
// Script
const script = bafFile(id);
// Spells
const coneOfCold = file(1, id);
const fly = file(2, id);
const gaseousForm = file(3, id);

const flyDuration = 72;
const gaseousFormDuration = 12;

// Items
const mainWeapon = file(1, id);
const gaseousFormImmunities = file(2, id);

export const OGRE_MAGE: RawCreature = {
  name: "Ogre Mage",
  bafFile: `lib/pnp-monster/ogre/${script}`,
  tpaFile: "lib/pnp-monster/ogre/mage",
  tracking: true,
  combatWalk: true,
  usePotions: true,
  data: {
    level1: 5,
    bonusHp: 2,
    strength: 18,
    exceptionalStrength: 100,
    dexterity: 10,
    constitution: 17,
    intelligence: 16,
    wisdom: 14,
    charisma: 17,
    movement: 9,
    ac: 4,
    apr: 1,
    xpv: 650,
    alignment: "LAWFUL_EVIL",
    morale: 14,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "OGRE",
    class: "OGRE_MAGE",
    gender: "MALE",
    size: "Large",
  },
  additionalData: {
    proficiencies: [{ type: "PROFICIENCYKATANA", value: 2 }],
    removeItems: ["REGHP1", "BDOGRE03"],
    memorizedSpells: [
      { file: SPELLS.Invisibility, memorizedCount: 1 },
      { file: SPELLS.Darkness15Radius, memorizedCount: 1 },
      { file: SPELLS.CharmPerson, memorizedCount: 1 },
      { file: SPELLS.Sleep, memorizedCount: 1 },
    ],
    effects: [
      {
        opcode: "Regeneration",
        type: "OneHPperAmountSeconds",
        amount: 6,
      },
    ],
  },
  attack: {
    targetPriorities: [
      {
        // The ogres fight more wisely when led by a half-ogre that concentrates assaults on characters it recognizes as spellcasters and teaming up against skilled fighters.
        targets: ["PCSpellcasters", "PCsPreferringStrong"],
      },
    ],
  },
  items: [
    {
      // Naganata, 1d12 slashing, range 2
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      flags: ["Displayable"],
      animation: "LongSword",
      category: "Halberds",
      icon: "ISW1H44",
      proficiency: "PROFICIENCYKATANA",
      animationSwing: { backhand: 50, overhand: 50, thrust: 0 },
      range: 2,
      diceThrown: 1,
      diceSize: 12,
      damageType: "Slashing",
      speed: 5,
      abilityFlags: ["AddStrengthBonus"],
    },
    {
      file: gaseousFormImmunities,
      name: "Gaseous form immunities",
      description: [
        "Gaseous form to everything but magical fire, lightning and mind spells.",
      ],
      immunities: ["poison", "cold", "physical"],
      effects: [
        {
          opcode: "FireResistanceModifier",
          value: 100,
          type: "Set",
          global: true,
        },
        {
          opcode: "AcidResistanceModifier",
          value: 100,
          type: "Set",
          global: true,
        },
        {
          opcode: "MagicDamageResistanceModifier",
          value: 100,
          type: "Set",
          global: true,
        },
      ],
      category: "Rings",
      icon: "IRING01",
    },
  ],
  projectiles: [
    {
      file: coneOfCold,
      copyFromFile: "CONECOLD",
      description: "Ogre-Mage Cone of Cold",
      areaOfEffect: 620,
      triggerRadius: 620,
      areaProjectileFlags: ["Coneshaped"], // "AffectOnlyEnemies" to prevent them for killing their allies
    },
  ],
  spells: [
    {
      name: "Cone of Cold",
      file: coneOfCold,
      stringRef: StringReferenceEnum.ConeOfCold,
      memorizedCount: 1,
      type: "Melee",
      projectile: coneOfCold,
      icon: "SPWI503",
      castingSound: "CAS_M06",
      flags: ["Hostile", "BreakSanctuary"],
      spellType: "Wizard",
      castingAnimation: "Invocation",
      primaryType: "Invoker",
      secondaryType: "OffensiveDamage",
      spellLevel: 5,
      location: "Spell",
      target: "LivingActor",
      range: 10,
      speed: 1,
      effects: [
        {
          opcode: "Damage",
          type: "Cold",
          amount: 0,
          diceSize: 8,
          diceThrown: 8,
          saveTypes: ["Spell", "BypassMirrorImage"],
          saveBonus: -4,
          flags: ["SaveForHalf"],
        },
        {
          opcode: "PauseTarget",
          duration: 1,
        },
      ],
    },
    {
      name: "Fly",
      file: fly,
      stringRef: TraStringReferenceEnum.Fly,
      type: "Melee",
      memorizedCount: 1,
      icon: "SPWI305",
      castingSound: "CAS_M08",
      spellType: "Wizard",
      castingAnimation: "Alteration",
      primaryType: "Transmuter",
      secondaryType: "NonCombat",
      spellLevel: 3,
      location: "Spell",
      target: "Caster",
      speed: 3,
      effects: [
        {
          opcode: "MovementRateBonus2",
          type: "Set",
          value: 13, // 15 in PnP
          timing: "InstantLimited",
          duration: flyDuration,
        },
        {
          opcode: "CreateItemInSlot",
          slot: "SLOT_BOOTS",
          resource: ITEMS.Hover,
          timing: "InstantLimited",
          duration: flyDuration,
        },
        {
          opcode: "SetExtendedSpellState",
          state: SPELL_STATES.flying,
          timing: "InstantLimited",
          duration: flyDuration,
        },
        {
          opcode: "DisplayPortraitIcon",
          icon: "Haste",
          timing: "InstantLimited",
          duration: flyDuration,
        },
        {
          opcode: "PlaySound",
          resource: "EFF_M28",
        },
        {
          opcode: "PlaySound",
          resource: "EFF_M29",
          timing: "DelayPermanent",
          duration: flyDuration,
        },
      ],
    },
    {
      name: "Gaseous form",
      file: gaseousForm,
      stringRef: TraStringReferenceEnum.GaseousForm,
      type: "Melee",
      memorizedCount: 1,
      icon: "SPWI416",
      castingSound: "CAS_M08",
      spellType: "Wizard",
      castingAnimation: "Alteration",
      primaryType: "Transmuter",
      secondaryType: "NonCombat",
      spellLevel: 4,
      location: "Spell",
      target: "Caster",
      speed: 4,
      effects: [
        {
          opcode: "MovementRateBonus2",
          type: "Set",
          value: 3, // 3 in PnP
          timing: "InstantLimited",
          duration: gaseousFormDuration,
        },
        {
          opcode: "PolymorphIntoSpecific",
          type: "AppearanceOnly",
          resource: "GASFORM4",
          timing: "InstantLimited",
          duration: gaseousFormDuration,
        },
        {
          opcode: "CreateItemInSlot",
          slot: "SLOT_AMULET",
          resource: gaseousFormImmunities,
          timing: "InstantLimited",
          duration: gaseousFormDuration,
        },
        {
          opcode: "SetExtendedSpellState",
          state: SPELL_STATES.gaseousForm,
          timing: "InstantLimited",
          duration: gaseousFormDuration,
        },
        {
          opcode: "PlayVisualEffect",
          target: "Self",
          playWhere: "OverTargetUnattached",
          resource: "SPDISPM3",
          timing: "InstantLimited",
          duration: gaseousFormDuration,
        },
        {
          opcode: "PlaySound",
          resource: "MSTCHNG",
        },
        {
          opcode: "PlayVisualEffect",
          target: "Self",
          playWhere: "OverTargetUnattached",
          resource: "SPDISPM3",
          timing: "DelayPermanent",
          duration: gaseousFormDuration,
        },
        {
          opcode: "PlaySound",
          resource: "MSTCHNG",
          timing: "DelayPermanent",
          duration: gaseousFormDuration,
        },
        {
          opcode: "PlaySound",
          resource: "MSTCHNG",
          timing: "DelayPermanent",
          duration: gaseousFormDuration,
        },
      ],
    },
  ],
  abilities: [
    // {
    //   name: "Invisibility",
    //   timer: {
    //     name: "invisible",
    //     value: 18,
    //   },
    //   triggers: [
    //     { name: "HaveSpellRES", params: [SPELLS.Invisibility] },
    //     { name: "Detect", params: ["NearestEnemyOf"] },
    //     {
    //       name: "RandomNumGT",
    //       params: [869, 100],
    //     },
    //     {
    //       name: "StateCheck",
    //       params: ["Myself", "STATE_INVISIBLE"],
    //       negation: true,
    //     },
    //   ],
    //   actions: [
    //     { name: "SpellNoDecRES", params: [SPELLS.Invisibility, "Myself"] },
    //   ],
    // },
    // {
    //   name: "Fly",
    //   triggers: [
    //     { name: "HaveSpellRES", params: [fly] },
    //     { name: "Detect", params: ["NearestEnemyOf"] },
    //     {
    //       name: "CheckSpellState",
    //       params: ["Myself", SPELL_STATES.flying],
    //       negation: true,
    //     },
    //   ],
    //   actions: [{ name: "SpellNoDecRES", params: [fly, "Myself"] }],
    // },
    // {
    //   name: "Charm Person",
    //   target: {
    //     name: "PCsPreferringStrong",
    //     random: true,
    //   },
    //   isTargetSpell: true,
    //   triggers: [
    //     { name: "HaveSpellRES", params: [SPELLS.CharmPerson] },
    //     {
    //       name: "RandomNumGT",
    //       params: [870, 100],
    //     },
    //   ],
    //   actions: [
    //     { name: "SpellRES", params: [SPELLS.CharmPerson, "LastSeenBy"] },
    //   ],
    // },
    // {
    //   name: "Sleep",
    //   target: {
    //     name: "PCsPreferringStrong",
    //     random: true,
    //   },
    //   isTargetSpell: true,
    //   triggers: [
    //     { name: "HaveSpellRES", params: [SPELLS.Sleep] },
    //     {
    //       name: "RandomNumGT",
    //       params: [871, 100],
    //     },
    //   ],
    //   actions: [{ name: "SpellRES", params: [SPELLS.Sleep, "LastSeenBy"] }],
    // },
    // {
    //   name: "Cone of Cold",
    //   target: { name: "NearestEnemies", random: true },
    //   isTargetSpell: true,
    //   triggers: [
    //     { name: "HaveSpellRES", params: [coneOfCold] },
    //     {
    //       name: "RandomNumGT",
    //       params: [872, 100],
    //     },
    //   ],
    //   actions: [{ name: "SpellRES", params: [coneOfCold, "LastSeenBy"] }],
    // },
    // {
    //   name: "Darkness 15' Radius",
    //   timer: { name: "darkness", value: 60 },
    //   target: {
    //     name: "NearestEnemies",
    //     random: true,
    //     limit: 6,
    //   },
    //   isTargetSpell: true,
    //   triggers: [
    //     { name: "HaveSpellRES", params: [SPELLS.Darkness15Radius] },
    //     {
    //       name: "RandomNumGT",
    //       params: [873, 100],
    //     },
    //   ],
    //   actions: [
    //     { name: "SpellNoDecRES", params: [SPELLS.Darkness15Radius, "Myself"] },
    //   ],
    // },
    {
      name: "Gaseous form",
      triggers: [
        { name: "HaveSpellRES", params: [gaseousForm] },
        { name: "Detect", params: ["NearestEnemyOf"] },
      ],
      actions: [{ name: "SpellRES", params: [gaseousForm, "Myself"] }],
    },
  ],
  files: [
    "BDOGRE03",
    "BDWAVE16",
    "BPOGMA01",
    "OGREMA",
    "OGREMA02",
    "OGREMA03",
    "OGREMASU",
    "OGREMA_A",
    "OGREMA_B",
    "OGREMA_C",
    "OGREMA_D",
    "OGREMBA",
    "OGRMBA",
    "UBOGMA01",
    "UBOGMA02",
    "NTFOREOG",
    "BDOGRE05", // Ogre Shaman
    "BDMURS", // Murs
    "BDMURS2", // Murs
    "DROTH", // Droth
    "DWSST2", //
    "KAHRK", // Kahrk
    "KROTAN", // Krotan
    "NTKROTAN", // Krotan
    "WIGENTLE", // The Gentleman
    "WIOGMA01", // Yondak Master of Portals
  ],
};
