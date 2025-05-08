import { ATWEAKS_CREATURES } from "../config/creatures";
import { ITEMS } from "../config/item";
import { PRESET_NAMES } from "../config/ability-presets";
import { ATWEAKS_SPELLS, SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { ConditionalStatement } from "../src/model/final/script";
import { RawCreatureAbility } from "../src/model/raw/ability";
import { RawCreature } from "../src/model/raw/creature";
import { FactoryService } from "../src/services/factory.service";
import { bafFile } from "../src/services/misc.func";
import { StringRefUtils } from "../src/services/string-ref.utils";
import { MonsterEnum } from "./monster.enum";

const factory = FactoryService.instance;

// Creature Id
const id = MonsterEnum.Dryad;
// Script
const script = bafFile(id);

const charmDuration = 180;
const speakWithPlantsDuration = 60;

export const abilitySpeakWithPlants: RawCreatureAbility = {
  name: "Speak with plants",
  spell: {
    resource: ATWEAKS_SPELLS.SpeakWithPlants,
    type: "force",
  },
  disableInterrupt: true,
  triggers: [{ name: "CheckStatGT", params: ["Myself", 0, "ENTANGLE"] }],
  timer: { name: "speakWithPlants", value: 60 },
};
export const abilityDryadDireCharm: RawCreatureAbility = {
  preset: SPELLS.DireCharm,
  spell: {
    resource: ATWEAKS_SPELLS.DryadCharmPerson,
    id: undefined,
    type: "force",
    remove: true,
  },
  disableInterrupt: true,
};

const globals = {
  Wilderness: "ja#wilderness",
  MinscCharmed: "MinscCharmed",
  HelpDryads: "HelpDryads",
};

export const dryadWildernessAbilities: ConditionalStatement[] = [
  {
    comment: "Can use dimension door and detect traps",
    triggers: [
      factory.global(globals.Wilderness, 0),
      { name: "AreaType", params: ["OUTDOOR"] },
      { name: "AreaType", params: ["CITY"], negation: true },
      { name: "AreaType", params: ["DUNGEON"], negation: true },
    ],
    responses: factory.response([factory.setGlobal(globals.Wilderness, 1)]),
  },
  {
    triggers: [
      factory.global(globals.Wilderness, 0),
      {
        name: "Or",
        triggers: [
          { name: "HaveSpellRES", params: [ATWEAKS_SPELLS.DimensionDoor] },
          {
            name: "HaveSpellRES",
            params: [ATWEAKS_SPELLS.DetectSnaresAndPits],
          },
        ],
      },
    ],
    responses: factory.response([
      { name: "RemoveSpellRES", params: [ATWEAKS_SPELLS.DimensionDoor] },
      { name: "RemoveSpellRES", params: [ATWEAKS_SPELLS.DetectSnaresAndPits] },
      factory.setGlobal(globals.Wilderness, 2),
    ]),
  },
];

export const FEY_DRYAD: RawCreature = {
  name: "Dryad",
  bafFile: `lib/pnp-monster/fey/${script}`,
  tpaFile: "lib/pnp-monster/fey/dryad",
  tracking: true,
  combatWalk: true,
  dialog: ["CDryad", "Ulene", "L#APEST"],
  attack: {
    melee: false,
    ranged: false,
  },
  data: {
    level1: 2,
    strength: 10,
    dexterity: 12,
    constitution: 11,
    intelligence: 14,
    wisdom: 15,
    charisma: 18,
    movement: 12,
    ac: 9,
    apr: 1,
    resistMagic: 50,
    xpv: 975,
    alignment: "NEUTRAL",
    morale: 12,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "HUMANOID",
    race: "FAIRY",
    class: "FAIRY_DRYAD",
    gender: "FEMALE",
    size: "Medium",
  },
  additionalData: {
    proficiencies: [{ type: "PROFICIENCYDAGGER", value: 2 }],
    removeItems: [],
    removeScripts: ["DRYAD", "DW1MELGE", "INITDLG", "WTRUNSGT"],
  },
  effectFiles: [
    {
      file: ATWEAKS_SPELLS.DryadCharmPerson,
      opcode: "ProtectionFromSpell",
      resource: ATWEAKS_SPELLS.DryadCharmPerson,
      timing: "InstantPermanentUntilDeath",
    },
  ],
  spells: [
    {
      name: "Dimension Door",
      file: ATWEAKS_SPELLS.DimensionDoor,
      copyFrom: SPELLS.DimensionDoor,
      memorizedCount: 1,
      spellType: "Innate",
      spellLevel: 1,
      location: "Ability",
      speed: 1,
      infiniteUse: true,
    },
    {
      name: "Dire Charm",
      file: ATWEAKS_SPELLS.DryadCharmPerson,
      stringRef: `${StringRefUtils.getStringId("Dire Charm")}`,
      memorizedCount: 3,
      type: "Melee",
      projectile: "SPARKLGO",
      icon: SPELLS.DireCharm,
      castingSound: "CAS_M05",
      flags: ["BreakSanctuary"],
      spellType: "Innate",
      castingAnimation: "Enchantment",
      primaryType: "Enchanter",
      secondaryType: "Disabling",
      spellLevel: 1,
      location: "Ability",
      target: "LivingActor",
      range: 30,
      speed: 1,
      effects: [
        {
          opcode: "UseEFFFile",
          idsFile: "RACE",
          idsEntry: "ELF",
          probability1: 90,
          timing: "InstantLimited",
          duration: 1,
          resource: ATWEAKS_SPELLS.DryadCharmPerson,
        },
        {
          opcode: "UseEFFFile",
          idsFile: "RACE",
          idsEntry: "HALF_ELF",
          probability1: 30,
          timing: "InstantLimited",
          duration: 1,
          resource: ATWEAKS_SPELLS.DryadCharmPerson,
        },
        {
          opcode: "CharmCreature",
          generalType: "HUMANOID",
          charmType: "NeutralDireCharm",
          timing: "InstantLimited",
          duration: charmDuration,
          dispelResistance: "DispelNotBypassResistance",
          saveTypes: ["Spell"],
          saveBonus: -3,
        },
        {
          opcode: "DisplayString",
          stringRef: `${StringRefUtils.getStringId("Dire charmed")}`,
          timing: "InstantPermanentUntilDeath",
          dispelResistance: "DispelNotBypassResistance",
          saveTypes: ["Spell"],
          saveBonus: -3,
        },
        {
          opcode: "CharacterColorPulse",
          color: { red: 255, green: 144, blue: 147 },
          location: "ArmorGreyBeltAmulet",
          cycleSpeed: 30,
          timing: "InstantLimited",
          duration: 1,
          dispelResistance: "DispelNotBypassResistance",
          saveTypes: ["Spell"],
          saveBonus: -3,
        },
        {
          opcode: "PlayVisualEffect",
          playWhere: "OverTargetAttached",
          resource: "SPNWCHRM",
          timing: "InstantLimited",
          duration: 3,
          dispelResistance: "DispelNotBypassResistance",
          saveTypes: ["Spell"],
          saveBonus: -3,
        },
        {
          opcode: "PlaySound",
          resource: "EFF_E07",
          timing: "DelayLimited",
          duration: charmDuration,
          dispelResistance: "DispelNotBypassResistance",
          saveTypes: ["Spell"],
          saveBonus: -3,
        },
      ],
    },
    {
      name: "Speak With Plants",
      file: ATWEAKS_SPELLS.SpeakWithPlants,
      stringRef: TraStringReferenceEnum.SpeakWithPlants,
      memorizedCount: 1,
      type: "Melee",
      // projectile: "SPARGRPA",
      icon: "RR#FSPKP",
      castingSound: "CAS_P02",
      spellType: "Innate",
      castingAnimation: "Alteration",
      primaryType: "Transmuter",
      secondaryType: "NonCombat",
      spellLevel: 1,
      location: "Ability",
      target: "Caster",
      range: 30,
      speed: 1,
      infiniteUse: true,
      effects: [
        {
          opcode: "CreateItemInSlot",
          slot: "SLOT_AMULET",
          resource: ITEMS.EntangleImmunity,
          timing: "InstantLimited",
          duration: speakWithPlantsDuration,
          dispelResistance: "DispelBypassResistance",
        },
        {
          opcode: "CharacterColorPulse",
          color: { red: 72, green: 243, blue: 102 },
          location: "ArmorGreyBeltAmulet",
          cycleSpeed: 30,
          timing: "InstantLimited",
          duration: 1,
          dispelResistance: "DispelBypassResistance",
        },
        {
          opcode: "PlayVisualEffect",
          playWhere: "OverTargetAttached",
          resource: "SPRMCURS",
          timing: "InstantLimited",
          duration: 2,
          dispelResistance: "DispelBypassResistance",
        },
      ],
    },
  ],
  additionalCode: [
    {
      location: "trackTargets",
      triggers: [
        { name: "HaveSpellRES", params: [ATWEAKS_SPELLS.DryadCharmPerson] },
      ],
    },
  ],
  customCode: [
    {
      location: "init",
      type: "insertBefore",
      statements: [
        ...dryadWildernessAbilities,
        {
          comment: "Irenicus' Dungeon specific code",
          triggers: [
            {
              name: "Name",
              params: ["Ulene", "Myself"],
            },
            {
              name: "AreaCheck",
              params: ["AR0602"], // Irenicus' Dungeon, first level
            },
            factory.global(globals.MinscCharmed, 1, "AR0602"),
            factory.global(globals.HelpDryads, 0, "GLOBAL"),
            { name: "See", params: ["Minsc"], negation: true },
            { name: "Range", params: ["Minsc", 4], negation: true },
          ],
          responses: factory.response([
            {
              name: "ActionOverride",
              params: ["Minsc", "JumpToPoint([4069.1222])"],
            },
          ]),
        },
        {
          triggers: [
            {
              name: "Name",
              params: ["Ulene", "Myself"],
            },
            {
              name: "AreaCheck",
              params: ["AR0602"], // Irenicus' Dungeon, first level
            },
            factory.global(globals.MinscCharmed, 1, "AR0602"),
            factory.global(globals.HelpDryads, 0, "GLOBAL"),
            { name: "See", params: ["Minsc"] },
            { name: "Range", params: ["Minsc", 4], negation: true },
          ],
          responses: factory.response([
            {
              name: "ActionOverride",
              params: ["Minsc", `MoveToObject("Ulene")`],
            },
          ]),
        },
      ],
    },
  ],
  abilities: [
    {
      preset: PRESET_NAMES.DimensionDoorOffscreen,
      spell: {
        type: "force",
      },
    },
    abilitySpeakWithPlants,
    abilityDryadDireCharm,
  ],
  files: [
    "DRYAD", // Dryad of the Cloudpeaks
    ATWEAKS_CREATURES.DryadSummon,
    "DRY01", // Dryad (unused?)
    "DRYAD01", // Dryad (unused?)
    "DRYAD02", // Dryad (unused?)
    "DRYAD03", // Dryad (unused?)
    "IDRYAD01", // Ulene (one of Irenicus captive Dryads)
    "IDRYAD02", // Cania (one of Irenicus captive Dryads)
    "IDRYAD03", // Elyme (one of Irenicus captive Dryads)
    "dr01mod", // Dryad (PofQuestPack)
    "drmod", // Dryad (PofQuestPack)
    "RE_DRYAD", // Dryad (PofQuestPack)
    "H_KATREC", // Katreda
    "L#APEST", // Y'Uula
    "NTARCHAN", // Archandra
    "NTASSAIA", // Assaia
    "NTESSILA", // Essila
    "NTLUCRET", // Lucretia
    "NTMILEA", // Milea
    "NTPAULIA", // Paulia
    "NTTAMAEL", // Tamael
  ],
  adjustments: [
    {
      files: [ATWEAKS_CREATURES.DryadSummon],
      summon: true,
    },
    {
      files: ["DRYAD", "L#APEST"],
      data: { class: "INNOCENT" },
    },
  ],
};
