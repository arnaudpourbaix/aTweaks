import { JEWEL_SLOTS } from "../src/model/constants";
import { EffectTypeEnum } from "../src/model/final/effect.type";
import { PortraitIconEnum } from "../src/model/final/enums";
import { MISSILE_WEAPONS } from "../src/model/ids/projectile";
import { RawEffect } from "../src/model/raw/effect";
import { RawImmunityConfig } from "../src/model/raw/immunity";
import { StringRefUtils } from "../src/services/string-ref.utils";
import { AIR_CREATURES, WATER_CREATURES } from "./creatures";
import { ITEMS } from "./item";

export const IMMUNITIES: RawImmunityConfig[] = [
  {
    name: "poison",
    type: "immunity",
    description: ["Poison immunity"],
    preventEffects: [EffectTypeEnum.Poison],
    preventIcons: [PortraitIconEnum.Poisoned],
    displayIcons: [PortraitIconEnum.ProtectionFromPoison],
    strings: StringRefUtils.getStringIds("poison"),
    effects: [
      {
        opcode: "PoisonResistanceModifier",
        value: 100,
      },
      {
        opcode: "SetExtendedSpellState",
        state: "ITEM_POISON",
      },
    ],
    spellGroups: ["poison"],
  },
  {
    name: "disease",
    type: "immunity",
    description: ["Disease immunity"],
    preventEffects: [EffectTypeEnum.Disease],
    preventIcons: [PortraitIconEnum.Diseased],
    strings: StringRefUtils.getStringIds("disease"),
    spellGroups: ["disease"],
  },
  {
    name: "bleeding",
    type: "immunity",
    description: ["Bleeding immunity"],
    preventIcons: [PortraitIconEnum.Bleeding],
    strings: StringRefUtils.getStringIds("bleed"),
    spellGroups: ["bleeding"],
  },
  {
    name: "abilityDrain",
    type: "immunity",
    description: ["Ability drain immunity"],
    preventEffects: [
      EffectTypeEnum.IntelligenceBonus,
      EffectTypeEnum.DexterityBonus,
      EffectTypeEnum.StrengthBonus,
      EffectTypeEnum.ConstitutionBonus,
    ],
    strings: StringRefUtils.getStringIds("rigidThinking"),
  },
  {
    name: "hold",
    type: "immunity",
    description: ["Hold immunity"],
    preventEffects: [EffectTypeEnum.Paralyze, EffectTypeEnum.Hold],
    preventIcons: [PortraitIconEnum.Held],
    spellGroups: ["hold"],
    strings: StringRefUtils.getStringIds("held"),
    animations: ["SPFLAYER", "SPMINDAT"],
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "HOLD_IMMUNITY",
      },
    ],
  },
  {
    name: "stun",
    type: "immunity",
    description: ["Stun immunity"],
    preventEffects: [EffectTypeEnum.Stun, EffectTypeEnum.Stun90HP],
    preventIcons: [PortraitIconEnum.Stun],
    strings: StringRefUtils.getStringIds("stun"),
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "STUN_IMMUNITY",
      },
    ],
  },
  {
    name: "energyDrain",
    type: "immunity",
    description: ["Energy drain immunity"],
    preventEffects: [EffectTypeEnum.LevelDrain],
    strings: StringRefUtils.getStringIds("levelDrain"),
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "ITEM_LEVELDRAIN",
      },
    ],
  },
  {
    name: "sleep",
    type: "immunity",
    description: ["Sleep immunity"],
    preventEffects: [EffectTypeEnum.Sleep, EffectTypeEnum.Sleep20HP],
    preventIcons: [PortraitIconEnum.Sleep, PortraitIconEnum.Unconscious],
    strings: StringRefUtils.getStringIds("sleep"),
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "SLEEP_IMMUNITY",
      },
    ],
  },
  {
    name: "charm",
    type: "immunity",
    description: ["Charm immunity"],
    preventEffects: [
      EffectTypeEnum.CharmCreature,
      EffectTypeEnum.CharmControlCreature,
    ],
    preventIcons: [
      PortraitIconEnum.Charm,
      PortraitIconEnum.DireCharm,
      PortraitIconEnum.Domination,
    ],
    strings: StringRefUtils.getStringIds("charm"),
    animations: ["SPNWCHRM"],
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "CHARM_IMMUNITY",
      },
    ],
  },
  {
    name: "fear",
    type: "immunity",
    description: ["Fear immunity"],
    preventEffects: [
      EffectTypeEnum.Panic,
      EffectTypeEnum.MoraleModifier,
      EffectTypeEnum.MoraleBreakModifier,
    ],
    preventIcons: [PortraitIconEnum.Panic],
    strings: StringRefUtils.getStringIds("panic"),
    animations: ["CDHORROR"],
    spellGroups: ["fear"],
    displaySpellIneffective: true,
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "RESIST_FEAR",
      },
      {
        opcode: "SetExtendedSpellState",
        state: "PANIC_IMMUNITY",
      },
    ],
  },
  {
    name: "fatigue",
    type: "immunity",
    description: ["Fatigue immunity"],
    preventEffects: [EffectTypeEnum.FatigueBonus],
    preventIcons: [],
    strings: [],
    spellGroups: ["fatigue"],
    displaySpellIneffective: true,
  },
  {
    name: "confusion",
    type: "immunity",
    description: ["Confusion immunity"],
    preventEffects: [EffectTypeEnum.Confusion],
    preventIcons: [PortraitIconEnum.Confused],
    strings: StringRefUtils.getStringIds(["rigidThinking", "confusion"]),
    animations: ["SPCONFUS"],
    spellGroups: ["confusion"],
    displaySpellIneffective: true,
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "CONFUSION_IMMUNITY",
      },
    ],
  },
  {
    name: "magicMissile",
    type: "immunity",
    description: ["Magic missiles immunity"],
    spellGroups: ["magicMissile"],
    displaySpellIneffective: true,
  },
  {
    name: "blindness",
    type: "immunity",
    description: ["Blindness immunity"],
    preventEffects: [EffectTypeEnum.Blindness],
    preventIcons: [PortraitIconEnum.Blind],
    spellGroups: ["blindness"],
  },
  {
    name: "fireSpells",
    type: "immunity",
    description: ["Fire spells immunity"],
    spellGroups: ["fire"],
  },
  {
    name: "fire",
    type: "immunity",
    description: ["Fire and magical fire immunity"],
    effects: [
      {
        opcode: "FireResistanceModifier",
        value: 100,
        type: "Set",
        global: true,
      },
      {
        opcode: "MagicalFireResistanceModifier",
        value: 100,
        type: "Set",
      },
    ],
  },
  {
    name: "coldSpells",
    type: "immunity",
    description: ["Cold spells immunity"],
    spellGroups: ["cold"],
  },
  {
    name: "cold",
    type: "immunity",
    description: ["Cold and magical cold immunity"],
    effects: [
      {
        opcode: "ColdResistanceModifier",
        value: 100,
        type: "Set",
      },
      {
        opcode: "MagicalColdResistanceModifier",
        value: 100,
        type: "Set",
      },
    ],
  },
  {
    name: "electricalSpells",
    type: "immunity",
    description: ["Electrical spells immunity"],
    spellGroups: ["electrical"],
  },
  {
    name: "electricity",
    type: "immunity",
    description: ["Electricity immunity"],
    effects: [
      {
        opcode: "ElectricityResistanceModifier",
        value: 100,
        type: "Set",
      },
    ],
  },
  {
    name: "magic",
    type: "immunity",
    description: ["Magic immunity"],
    effects: [
      {
        opcode: "MagicResistanceModifier",
        value: 100,
        type: "Set",
      },
    ],
  },
  {
    name: "magicDamage",
    type: "immunity",
    description: ["Magic damage immunity"],
    effects: [
      {
        opcode: "MagicDamageResistanceModifier",
        value: 100,
        type: "Set",
      },
    ],
  },
  {
    name: "acid",
    type: "immunity",
    description: ["Acid immunity"],
    effects: [
      {
        opcode: "AcidResistanceModifier",
        value: 100,
        type: "Set",
        global: true,
      },
    ],
  },
  {
    name: "acidSpells",
    type: "immunity",
    description: ["Acid spells immunity"],
    spellGroups: ["acidSpells"],
  },
  {
    name: "cureSpells",
    type: "immunity",
    description: ["Cure spells immunity"],
    spellGroups: ["cure"],
    displaySpellIneffective: true,
  },
  {
    name: "cloudSpells",
    type: "immunity",
    itemSlot: { file: ITEMS.CloudSpells, slot: JEWEL_SLOTS },
    description: ["Cloud spells immunity"],
    spellGroups: ["cloud"],
    displaySpellIneffective: true,
  },
  {
    name: "web",
    type: "immunity",
    description: ["Web immunity"],
    preventEffects: [EffectTypeEnum.Web],
    preventIcons: [PortraitIconEnum.Webbed],
    spellGroups: ["web"],
    displaySpellIneffective: true,
  },
  {
    name: "entangle",
    type: "immunity",
    description: ["Entangle immunity"],
    preventEffects: [EffectTypeEnum.EntangleOverlay],
    preventIcons: [PortraitIconEnum.Entangled],
    spellGroups: ["entangle"],
    displaySpellIneffective: true,
    itemSlot: { file: ITEMS.EntangleImmunity, slot: JEWEL_SLOTS },
  },
  {
    name: "insectSpells",
    type: "immunity",
    description: ["Insect spells immunity"],
    spellGroups: ["insect"],
    //TODO: why: LPF ADD_IMMUNITY_CRE_ITM_SPL STR_VAR spells duration=120 resist_dispel=3 power=3 displaySpellIneffective=1 END
    displaySpellIneffective: true,
  },
  {
    name: "petrification",
    type: "immunity",
    description: ["Petrification immunity"],
    preventEffects: [EffectTypeEnum.Petrification],
    strings: StringRefUtils.getStringIds("petrified"),
    spellGroups: ["petrification"],
    displaySpellIneffective: true,
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "PETRIFY_IMMUNITY",
      },
    ],
  },
  {
    name: "missileWeapons",
    type: "immunity",
    description: ["Missile weapons immunity"],
    effects: MISSILE_WEAPONS.map((w) => ({
      opcode: "ProtectionFromProjectile",
      projectile: w,
    })),
  },
  {
    name: "polymorph",
    type: "immunity",
    description: ["Polymorph immunity"],
    //preventEffects: [EffectTypeEnum.PolymorphIntoSpecific], // not used anymore
    preventIcons: [PortraitIconEnum.Polymorphed],
    strings: StringRefUtils.getStringIds("polymorph"),
    spellGroups: ["polymorph"],
    displaySpellIneffective: true,
  },
  {
    name: "vorpal",
    type: "immunity",
    description: ["Vorpal immunity"],
    preventEffects: [EffectTypeEnum.KillTarget, EffectTypeEnum.Slay],
    strings: StringRefUtils.getStringIds("death"),
  },
  {
    name: "earthquake",
    type: "immunity",
    description: ["Earthquake spells immunity"],
    spellGroups: ["earthquake"],
    displaySpellIneffective: true,
  },
  {
    name: "physicalDamage",
    type: "immunity",
    description: ["Physical damage immunity"],
    immunities: [
      "slashingDamage",
      "crushingDamage",
      "piercingDamage",
      "missileDamage",
    ],
  },
  {
    name: "slashingDamage",
    type: "immunity",
    description: ["Slashing damage immunity"],
    effects: [
      {
        opcode: "SlashingResistanceModifier",
        value: 100,
        type: "Set",
      },
    ],
  },
  {
    name: "crushingDamage",
    type: "immunity",
    description: ["Crushing damage immunity"],
    effects: [
      {
        opcode: "CrushingResistanceModifier",
        value: 100,
        type: "Set",
      },
    ],
  },
  {
    name: "piercingDamage",
    type: "immunity",
    description: ["Piercing damage immunity"],
    effects: [
      {
        opcode: "PiercingResistanceModifier",
        value: 100,
        type: "Set",
      },
    ],
  },
  {
    name: "missileDamage",
    type: "immunity",
    description: ["Missile damage immunity"],
    effects: [
      {
        opcode: "MissilesResistanceModifier",
        value: 100,
        type: "Set",
      },
    ],
  },
  {
    name: "unturnable",
    type: "immunity",
    description: ["Turn undead immunity"],
    effects: [{ opcode: "ImmunityToTurnUndead" }],
  },
  {
    name: "illusion",
    type: "immunity",
    description: ["Illusion spells immunity"],
    spellGroups: ["illusion"],
    displaySpellIneffective: true,
  },
  {
    name: "necromancyEffects",
    type: "immunity",
    description: ["Necromancy effects immunity"],
    immunities: ["cureSpells"],
    spellGroups: ["necromancyEffects"],
    displaySpellIneffective: true,
  },
  {
    name: "deathEffects",
    type: "immunity",
    description: ["Death effects immunity"],
    preventEffects: [
      EffectTypeEnum.DeathKill60HP,
      EffectTypeEnum.KillTarget,
      EffectTypeEnum.Slay,
    ],
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "DEATH_IMMUNITY",
      },
    ],
  },
  {
    name: "deathSpell",
    type: "immunity",
    description: ["Death spell immunity"],
    spellGroups: ["death"],
    displaySpellIneffective: true,
  },
  {
    name: "mindSpells",
    type: "immunity",
    description: [
      "Immunity to mind-affecting spells and abilities (charms, compulsions, phantasms, patterns, and morale effects)",
    ],
    preventEffects: [EffectTypeEnum.Berserk],
    immunities: ["charm", "fear", "confusion", "illusion", "hold", "stun"],
  },
  {
    name: "hover",
    type: "trait",
    itemSlot: { file: ITEMS.Hover, slot: "BOOTS" },
    description: [
      "Hover (flight)",
      "This effectively prevents ground-based spells such as Earthquake, Entangle, Grease and Web from affecting the creature.",
      "Furthermore, creatures with this ability can cross lava and acid pools without taking damage by hovering above them.",
    ],
    immunities: ["entangle", "web"],
    spellGroups: ["ground"],
    displaySpellIneffective: true,
  },
  {
    name: "normalWeapons",
    type: "immunity",
    description: ["Immunity to normal weapons"],
    effects: [
      { opcode: "ProtectionFromWeapons", type: "NonMagical", enchantment: 0 },
    ],
  },
  {
    name: "backstab",
    type: "immunity",
    description: ["Immunity to backstab"],
    effects: [{ opcode: "ProtectionFromBackstab" }],
  },
  {
    name: "criticalHit",
    type: "immunity",
    itemSlot: { file: ITEMS.CriticalHitImmunity, slot: "HELMET" },
    description: ["Immunity to critical hits"],
  },
  {
    name: "devourBrain",
    type: "immunity",
    description: ["Immunity to Devour Brain ability (Mind Flayer)"],
    preventEffects: [EffectTypeEnum.IntelligenceBonus],
  },
  {
    name: "construct",
    type: "trait",
    itemSlot: { file: ITEMS.Construct, slot: JEWEL_SLOTS },
    description: [
      "Construct trait",
      "",
      "Immunity to poison, sleep effects, paralysis, stunning, disease, death effects, necromancy effects, mind-affecting spells and abilities (charms, compulsions, phantasms, patterns, and morale effects).",
      "Not subject to critical hits, backstab, nonlethal damage, ability damage, ability drain, fatigue, exhaustion, energy drain, flesh to Stone, insect Plague and similar spells.",
      "Darkvision out to 60 feet.",
    ],
    immunities: [
      "poison",
      "sleep",
      "hold",
      "bleeding",
      "stun",
      "disease",
      "deathEffects",
      "necromancyEffects",
      "mindSpells",
      "backstab",
      "criticalHit",
      "abilityDrain",
      "energyDrain",
      "fatigue",
      "petrification",
      "insectSpells",
      "infravision",
    ],
  },
  {
    name: "fey",
    type: "trait",
    itemSlot: { file: ITEMS.Fey, slot: JEWEL_SLOTS },
    description: [
      "Fey trait",
      "",
      "Fey creatures cannot be interrupted while using their spell-like abilities, all of which have a casting time of 1.",
      "In all other aspects, spell-like abilities function exactly like the spells which they mimic.",
    ],
    effects: [
      {
        opcode: "CastingTimeModifier",
        value: 1,
        type: "Set",
      },
    ],
  },
  {
    name: "elemental",
    type: "trait",
    description: [
      "Immunity to poison, sleep effects, paralysis, bleeding, and stunning.",
      "Not subject to critical hits or backstab. Due to their unique physiology, elementals are not subject to the Mind Flayers' Devour Brain attack.",
      "They are also unaffected by Flesh to Stone, Insect Plague and similar spells. Darkvision out to 60 feet.",
    ],
    immunities: [
      "poison",
      "sleep",
      "hold",
      "bleeding",
      "stun",
      "criticalHit",
      "backstab",
      "devourBrain",
      "petrification",
      "insectSpells",
      "infravision",
    ],
  },
  {
    name: "airAffinity",
    type: "trait",
    description: [
      "Creatures with this trait receive a +1 bonus to hit and a +4 bonus to damage when fighting airborne opponents.",
    ],
    effects: AIR_CREATURES.map(([f, e]): RawEffect[] => [
      {
        opcode: "DamageVsCreatureTypeModifier",
        idsFile: f,
        idsEntry: e,
        special: 4,
      },
      {
        opcode: "Thac0VsCreatureTypeModifier",
        idsFile: f,
        idsEntry: e,
        special: 1,
      },
    ]).flat(),
  },
  {
    name: "earthAffinity",
    type: "trait",
    description: [
      "Creatures with this trait receive a -2 penalty to hit and damage when fighting airborne and waterborne opponents. They are also unaffected by the Earthquake spell.",
    ],
    immunities: ["earthquake"],
    effects: [...AIR_CREATURES, ...WATER_CREATURES]
      .map(([f, e]): RawEffect[] => [
        {
          opcode: "DamageVsCreatureTypeModifier",
          idsFile: f,
          idsEntry: e,
          special: -2,
        },
        {
          opcode: "Thac0VsCreatureTypeModifier",
          idsFile: f,
          idsEntry: e,
          special: -2,
        },
      ])
      .flat(),
  },
  {
    name: "skeletal",
    type: "trait",
    itemSlot: { file: ITEMS.Sketetal, slot: JEWEL_SLOTS },
    description: [
      "Skeletal undead suffer no damage from cold-based attacks. Due to their bony frames, edged and piercing weapons inflict only half damage.",
    ],
    immunities: ["cold", "coldSpells"],
    effects: [
      {
        opcode: "SlashingResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "MissilesResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "PiercingResistanceModifier",
        value: 50,
        type: "Set",
      },
    ],
  },
  {
    name: "extraplanar",
    type: "trait",
    description: [
      "Extraplanar creatures are immune to Death Spell and are unaffected by all Cure and Cause Wound spells including Heal and Harm.",
    ],
    immunities: ["cureSpells", "deathSpell"],
  },
  {
    name: "plant",
    type: "trait",
    description: [
      "Plants' traits",
      "",
      "Infravision.",
      "Immunity to all mind-affecting effects (charms, compulsions, phantasms, patterns, and morale effects).",
      "Immunity to poison, sleep effects, paralysis, polymorph, and stunning.",
      "Not subject to critical hits and backstab.",
    ],
    itemSlot: { file: ITEMS.Plant, slot: JEWEL_SLOTS },
    immunities: [
      "mindSpells",
      "poison",
      "sleep",
      "hold",
      "polymorph",
      "stun",
      "criticalHit",
      "backstab",
      "disease",
      "bleeding",
      "petrification",
      "insectSpells",
      "entangle",
      "infravision",
    ],
  },
  {
    name: "infravision",
    type: "trait",
    description: ["Infravision"],
    effects: [{ opcode: "Infravision" }],
  },
  {
    name: "seeInvisible",
    type: "trait",
    description: ["See invisible creatures"],
    effects: [{ opcode: "InvisibilityDetection" }],
  },
  {
    name: "fireballSpell",
    type: "immunity",
    description: ["Fireball spell immunity"],
    spellGroups: ["fireball"],
    displaySpellIneffective: true,
  },
  {
    name: "lightningBoltSpell",
    type: "immunity",
    description: ["Lightning Bolt spell immunity"],
    spellGroups: ["lightningBolt"],
    displaySpellIneffective: true,
  },
  {
    name: "flameArrowSpell",
    type: "immunity",
    description: ["Flame Arrow spell immunity"],
    spellGroups: ["flameArrow"],
    displaySpellIneffective: true,
  },
  {
    name: "incorporeal",
    itemSlot: { file: ITEMS.Incorporeal, slot: JEWEL_SLOTS },
    type: "trait",
    description: [
      "An incorporeal creature has no physical body.",
      "Immune to backstab and critical hits",
      "Immune to all nonmagical attacks.",
      "Has a 50% resistance to every damages.",
      "Deflection bonus (+3 AC).",
      "Attacks pass through armor (+4 THAC0).",
      // "Do not set off traps that are triggered by weight. (not implemented)",
    ],
    immunities: ["backstab", "criticalHit"],
    effects: [
      {
        opcode: "Translucency",
        amount: 99,
        type: "DrawInstantly",
      },
      {
        opcode: "SetColorGlowPulse",
        color: { red: 125, green: 125, blue: 125 },
        location: "CharacterColor",
        cycleSpeed: 30,
      },
      {
        opcode: "CreatureRGBColorFade",
        color: { red: 90, green: 30, blue: 90 },
        fadeSpeed: 25,
      },
      { opcode: "NoCollisionDetection", passWalls: true },
      { opcode: "ModifyCollisionBehavior" },
      // { opcode: "OverrideCreatureData", field: "PersonalSpace", value: 0 }, // Create 2 issues: creature can attack from range and can't move at all
      // { opcode: "MakeUnselectable", disableDialog: false },
      // { opcode: "SelectionCircleRemoval" },
      {
        opcode: "ProtectionFromWeapons",
        enchantment: 0,
        type: "NonMagical",
      },
      {
        opcode: "DisplayPortraitIcon",
        icon: "Invulnerable",
      },
      {
        opcode: "ArmorClassBonus",
        value: 3,
        bonusTo: "AllWeapons",
      },
      {
        opcode: "Thac0Bonus",
        value: 4,
        type: "Increment",
      },
      {
        opcode: "FireResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "MagicalFireResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "ColdResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "MagicalColdResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "ElectricityResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "AcidResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "MagicDamageResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "SlashingResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "CrushingResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "PiercingResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "MissilesResistanceModifier",
        value: 50,
        type: "Set",
      },
      { opcode: "PoisonResistanceModifier", value: 50 },
    ],
  },
  {
    name: "gazeAttacks",
    type: "immunity",
    description: ["Gaze attacks immunity."],
    immunities: ["petrification"], //TODO:
  },
  {
    name: "blindsight",
    type: "trait",
    description: [
      "Blindsight trait.",
      "Invisibility, darkness, and most kinds of concealment are irrelevant.",
      "Blindsight does not subject a creature to gaze attacks.",
    ],
    immunities: ["gazeAttacks", "seeInvisible"],
  },
  {
    name: "ooze",
    type: "trait",
    itemSlot: { file: ITEMS.Ooze, slot: JEWEL_SLOTS },
    description: [
      "Ooze trait.",
      "Blindsight (can see invisible, not subject to gaze attacks).",
      "Immunity to poison, sleep effects, paralysis, stunning, polymorph, blindness, mind-affecting spells and abilities (charms, compulsions, phantasms, patterns, and morale effects).",
      "Not subject to critical hits, backstab.",
      "Darkvision out to 60 feet.",
      "Translucent",
      "10-sided Hit Dice",
    ],
    immunities: [
      "mindSpells",
      "backstab",
      "poison",
      "sleep",
      "hold",
      "stun",
      "bleeding",
      "criticalHit",
      "backstab",
      "infravision",
      "polymorph",
      "blindsight",
      "blindness",
    ],
    effects: [
      {
        opcode: "Translucency",
        amount: 100,
        type: "DrawInstantly",
      },
      { opcode: "NoCollisionDetection", passWalls: true },
      { opcode: "ModifyCollisionBehavior" },
    ],
  },
];
