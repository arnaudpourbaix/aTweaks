import { PRESET_NAMES } from "../../config/ability-presets";
import { ATWEAKS_CREATURES } from "../../config/creatures";
import { ITEMS } from "../../config/item";
import { ATWEAKS_SPELLS, SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { createDimensionDoor } from "../../spells/dimension_door";
import { ConditionalStatement } from "../../src/model/final/script";
import { RawCreatureAbility } from "../../src/model/raw/ability";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { EffectService } from "../../src/services/effect.service";
import { FactoryService } from "../../src/services/factory.service";
import { bafFile, file } from "../../src/services/misc.func";
import { StringRefUtils } from "../../src/services/string-ref.utils";
import { MonsterEnum } from "../monster.enum";

const factory = FactoryService.instance;
const effects = EffectService.instance;

// Creature Id
const id = MonsterEnum.Dryad;
// Items
const traits = file(1, id);
// Script
const script = bafFile(id);

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
          {
            name: "HaveSpellRES",
            params: [ATWEAKS_SPELLS.DimensionDoorInfinite],
          },
          {
            name: "HaveSpellRES",
            params: [ATWEAKS_SPELLS.DetectSnaresAndPits],
          },
        ],
      },
    ],
    responses: factory.response([
      {
        name: "RemoveSpellRES",
        params: [ATWEAKS_SPELLS.DimensionDoorInfinite],
      },
      { name: "RemoveSpellRES", params: [ATWEAKS_SPELLS.DetectSnaresAndPits] },
      factory.setGlobal(globals.Wilderness, 2),
    ]),
  },
];

const name = "Dryad";

export const FEY_DRYAD: RawCreature = {
  name,
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
    immunities: ["fey"],
    proficiencies: [{ type: "PROFICIENCYDAGGER", value: 2 }],
    removeItems: [],
    removeScripts: ["DRYAD", "DW1MELGE", "INITDLG", "WTRUNSGT"],
  },
  spells: [
    createDimensionDoor({
      file: ATWEAKS_SPELLS.DimensionDoorInfinite,
      memorizedCount: 1,
      spellLevel: 1,
      spellType: "Innate",
      infiniteUse: 1,
    }),
    {
      name: "Dire Charm",
      file: ATWEAKS_SPELLS.DryadCharmPerson,
      stringRef: StringRefUtils.getStringId("Dire Charm"),
      description: [
        "Dryads have the ability to throw a powerful charm person spell.",
        "This spell is so powerful that targets of the spell suffer a -3 penalty to their saving throws.",
      ],
      memorizedCount: 3,
      icon: SPELLS.DireCharm,
      castingSound: "CAS_M05",
      flags: ["BreakSanctuary"],
      spellType: "Innate",
      castingAnimation: "Enchantment",
      primaryType: "Enchanter",
      secondaryType: "Disabling",
      spellLevel: 1,
      headers: [
        {
          type: "Melee",
          projectile: "SPARKLGO",
          location: "Ability",
          target: "LivingActor",
          range: 30,
          speed: 1,
          racialSleepCharmResistance: true,
          effects: effects.getCharmEffects({
            charmType: "NeutralDireCharm",
            duration: 180,
            dispelResistance: "DispelNotBypassResistance",
            saveType: "Spell",
            saveBonus: -3,
          }),
        },
      ],
    },
    {
      name: "Speak With Plants",
      file: ATWEAKS_SPELLS.SpeakWithPlants,
      stringRef: TraStringReferenceEnum.SpeakWithPlants,
      description: [
        "Speak with plants",
        "The caster can question plants as to whether or not creatures have passed through them, cause thickets to part to enable easy passage, require vines to entangle pursuers, and command similar services.",
        "Immunity to entangle spell for 10 rounds.",
      ],
      memorizedCount: 1,
      icon: "RR#FSPKP",
      castingSound: "CAS_P02",
      spellType: "Innate",
      castingAnimation: "Alteration",
      primaryType: "Transmuter",
      secondaryType: "NonCombat",
      spellLevel: 1,
      infiniteUse: 1,
      headers: [
        {
          type: "Melee",
          location: "Ability",
          target: "Caster",
          range: 30,
          speed: 1,
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
    },
  ],
  items: [
    createTraitItem({
      file: traits,
      name,
      immunities: ["magicResistance"],
    }),
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
      disableInterrupt: true,
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
