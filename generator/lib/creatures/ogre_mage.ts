import { SPELL_STATES } from "../config/ability-presets";
import { GLOBAL_CONFIG } from "../config/generate";
import { ITEMS } from "../config/item";
import { SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { StringRefUtils } from "../src/services/string-ref.utils";
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
const gaseousFormWeapon = file(2, id);

export const OGRE_MAGE: RawCreature = {
  name: "Ogre Mage",
  bafFile: `lib/pnp-monster/ogre/${script}`,
  tpaFile: "lib/pnp-monster/ogre/mage",
  tracking: true,
  combatWalk: true,
  usePotions: true,
  data: {
    level1: 5,
    level2: 5,
    bonusHp: 2,
    strength: 18,
    exceptionalStrength: 100,
    dexterity: 10,
    constitution: 17,
    intelligence: 16,
    wisdom: 14,
    charisma: 17,
    // movement: 9, // moved to main weapon because it can polymorph in a slower form
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
    kit: "TRUECLASS",
    gender: "MALE",
    size: "Large",
  },
  additionalData: {
    proficiencies: [{ type: "PROFICIENCYHALBERD", value: 2 }],
    removeItems: [
      "REGHP1",
      "BDOGRE03",
      "HELMNOAN",
      "SW1H43",
      "SW1H01",
      "COMPS01",
      "COMPS02",
      "OGREMASU",
      "BLUN15",
    ],
    removeScripts: [
      "BDOGRE03",
      "BDFIG00",
      "BDFMAG01",
      "BPASIGHT",
      "OGREMASU",
      "DW1MELGE",
      "DW#MG108",
      "DW#MG139",
      "DW#MG56",
    ],
    memorizedSpells: [
      { file: SPELLS.Invisibility, memorizedCount: 1 },
      { file: SPELLS.Darkness15Radius, memorizedCount: 1 },
      { file: SPELLS.CharmPerson, memorizedCount: 1 },
      { file: SPELLS.Sleep, memorizedCount: 1 },
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
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      flags: ["Displayable", "TwoHanded"],
      animation: "LongSword",
      name: "Naganata",
      description: [
        "Similar to the glaive, the naginata is a pole weapon. Naginata were originally used by the samurai class.",
        "",
        "STATISTICS:",
        "Damage: 1D12",
        "Damage type: slashing",
        "Weight: 15",
        "Speed Factor: 8",
        "Proficiency Type: Halberds",
      ],
      category: "Halberds",
      icon: "ISW1H44",
      proficiency: "PROFICIENCYHALBERD",
      weight: 15,
      animationSwing: { backhand: 50, overhand: 50, thrust: 0 },
      range: 2,
      diceThrown: 1,
      diceSize: 12,
      damageType: "Slashing",
      speed: 8,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "MovementRateBonus2",
          type: "Set",
          value: 8, // 9 in PnP
          global: true,
        },
        {
          opcode: "Regeneration",
          type: "OneHPperAmountSeconds",
          amount: 6,
        },
      ],
    },
    {
      file: gaseousFormWeapon,
      name: "Gaseous form",
      description: [
        "Gaseous form is immuned to everything but magical fire, lightning and mind spells.",
      ],
      type: "Melee",
      flags: ["Displayable"],
      immunities: ["poison", "cold", "physical"],
      effects: [
        { opcode: "NoCollisionDetection", passWalls: true, global: true },
        { opcode: "ModifyCollisionBehavior", global: true },
        {
          opcode: "OverrideCreatureData",
          field: "PersonalSpace",
          value: 0,
          global: true,
        },
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
        {
          opcode: "MovementRateBonus2",
          type: "Set",
          value: 3, // 3 in PnP
          global: true,
        },
        {
          opcode: "ModifyAttacksPerRound",
          type: "Final",
          value: 0,
          global: true,
        },
        {
          opcode: "DisableSpellcasting",
          type: "Wizard",
          global: true,
        },
        { opcode: "DisableButton", button: "SpellSelect", global: true },
        {
          opcode: "AnimationChange",
          animationId: "BLOB_MIST_CREATURE",
          animationType: "TemporaryChange",
          global: true,
        },
        {
          opcode: "SetExtendedSpellState",
          state: SPELL_STATES.gaseousForm,
          global: true,
        },
      ],
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
      stringRef: StringRefUtils.getStringId("Cone of Cold"),
      memorizedCount: 1,
      icon: SPELLS.ConeOfCold,
      castingSound: "CAS_M06",
      flags: ["Hostile", "BreakSanctuary"],
      spellType: "Wizard",
      castingAnimation: "Invocation",
      primaryType: "Invoker",
      secondaryType: "OffensiveDamage",
      spellLevel: 5,
      headers: [
        {
          type: "Melee",
          projectile: coneOfCold,
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
      ],
    },
    {
      name: "Fly",
      file: fly,
      stringRef: TraStringReferenceEnum.Fly,
      memorizedCount: 1,
      icon: SPELLS.Haste,
      castingSound: "CAS_M08",
      spellType: "Wizard",
      castingAnimation: "Alteration",
      primaryType: "Transmuter",
      secondaryType: "NonCombat",
      spellLevel: 3,
      headers: [
        {
          type: "Melee",
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
      ],
    },
    {
      name: "Gaseous form",
      file: gaseousForm,
      stringRef: TraStringReferenceEnum.GaseousForm,
      memorizedCount: 1,
      icon: SPELLS.PolymorphSelf,
      castingSound: "CAS_M08",
      spellType: "Wizard",
      castingAnimation: "Alteration",
      primaryType: "Transmuter",
      secondaryType: "NonCombat",
      spellLevel: 4,
      headers: [
        {
          type: "Melee",
          location: "Spell",
          target: "Caster",
          speed: 4,
          effects: [
            {
              opcode: "CreateWeapon",
              amount: 0,
              resource: gaseousFormWeapon,
              timing: "InstantLimited",
              duration: gaseousFormDuration,
            },
            {
              opcode: "PlayVisualEffect",
              target: "Self",
              playWhere: "OverTargetUnattached",
              resource: "SPDISPM3",
              timing: "InstantLimited",
              duration: 3,
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
    },
  ],
  abilities: [
    {
      preset: SPELLS.Invisibility,
      spell: {
        type: "noDec",
      },
      timer: {
        name: "invisible",
        value: 18,
      },
    },
    {
      name: "Fly",
      spell: {
        resource: fly,
        type: "noDec",
        excludeSpellStates: [SPELL_STATES.flying],
        probability: 90,
      },
      triggers: [
        { name: "Detect", params: ["NearestEnemyOf"] },
        { name: "StateCheck", params: ["Myself", "STATE_INVISIBLE"] },
      ],
    },
    {
      preset: SPELLS.Domination,
    },
    {
      preset: SPELLS.DireCharm,
    },
    {
      preset: SPELLS.CharmPerson,
    },
    {
      preset: SPELLS.PowerWordSleep,
    },
    {
      preset: SPELLS.Sleep,
    },
    {
      preset: SPELLS.ConeOfCold,
      spell: {
        id: undefined,
        resource: coneOfCold,
      },
    },
    {
      preset: SPELLS.Darkness15Radius,
      spell: {
        type: "noDec",
      },
      timer: { name: "darkness", value: 60 },
    },
    {
      name: "Gaseous form",
      spell: {
        resource: gaseousForm,
        probability: 80,
      },
      triggers: [
        { name: "Detect", params: ["NearestEnemyOf"] },
        { name: "HaveSpellRES", params: [coneOfCold], negation: true },
        { name: "HaveSpellRES", params: [SPELLS.Sleep], negation: true },
        { name: "HaveSpellRES", params: [SPELLS.CharmPerson], negation: true },
        { name: "HPPercentLT", params: ["Myself", 25] },
      ],
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
    "BDMURS", // Murs
    "BDMURS2", // Murs
    "DROTH", // Droth
    "KAHRK", // Kahrk
    "KROTAN", // Krotan
    "NTKROTAN", // Krotan
    "WIGENTLE", // The Gentleman
    "WIOGMA01", // Yondak Master of Portals
  ],
  adjustments: [
    {
      files: ["OGREMASU"],
      summon: true,
    },
    {
      files: ["BDWAVE16", "WIOGMA01", "WIGENTLE", "DROTH"],
      data: { level1: 7, level2: 7, xpv: 1400, class: "FIGHTER_MAGE" },
      additionalData: {
        scriptLocation: "General",
        proficiencies: [{ type: "PROFICIENCYHALBERD", value: 4 }],
        memorizedSpells: [
          { file: SPELLS.DireCharm, memorizedCount: 1 },
          { file: SPELLS.PowerWordSleep, memorizedCount: 2 },
          { file: SPELLS.CharmPerson, memorizedCount: 1 },
          { file: SPELLS.Sleep, memorizedCount: 1 },
        ],
      },
    },
    {
      files: ["BDMURS", "BDMURS2"],
      data: { level1: 9, level2: 9, xpv: 2000, class: "FIGHTER_MAGE" },
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYHALBERD", value: 5 }],
        memorizedSpells: [
          { file: coneOfCold, memorizedCount: 1 },
          { file: SPELLS.DireCharm, memorizedCount: 2 },
          { file: SPELLS.PowerWordSleep, memorizedCount: 2 },
          { file: SPELLS.CharmPerson, memorizedCount: 2 },
          { file: SPELLS.Sleep, memorizedCount: 2 },
        ],
      },
    },
    {
      files: ["KROTAN", "NTKROTAN", "KAHRK"],
      data: {
        level1: 12,
        level2: 12,
        strength: 19,
        class: "FIGHTER_MAGE",
        xpv: 3500,
      },
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYHALBERD", value: 5 }],
        memorizedSpells: [
          { file: SPELLS.Domination, memorizedCount: 1 },
          { file: coneOfCold, memorizedCount: 2 },
          { file: SPELLS.DireCharm, memorizedCount: 4 },
          { file: SPELLS.PowerWordSleep, memorizedCount: 4 },
          { file: SPELLS.CharmPerson, memorizedCount: 3 },
          { file: SPELLS.Sleep, memorizedCount: 3 },
        ],
      },
    },
    {
      files: ["KAHRK"],
      noWeapon: true,
      additionalData: {
        proficiencies: [{ type: "PROFICIENCYKATANA", value: 5 }],
      },
    },
    {
      files: ["KROTAN", "NTKROTAN"],
      data: { level1: 15, level2: 15, class: "FIGHTER_MAGE", xpv: 4000 },
    },
  ],
};
