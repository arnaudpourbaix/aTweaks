import { RawCreatureAbility } from "../src/model/raw/ability";
import { RawTargetList } from "../src/model/raw/target";
import { FactoryService } from "../src/services/factory.service";
import { GLOBAL_CONFIG } from "./generate";
import { SPELLS } from "./spell-names";

const factory = FactoryService.instance;

export const SPELL_STATES = {
  grabbed: "JA_GRAPPLED",
  grabbing: "JA_GRAPPLING",
  flying: "JA_FLYING",
  gaseousForm: "JA_GASEOUSFORM",
};

export const DEFAULT_SPELL_PROBABILITY = 70;

const CHARM_TARGET_LISTS: RawTargetList[] = [
  {
    name: "PCsFighters",
    randomOrder: true,
    includeStatus: ["Able"],
    triggers: [
      {
        name: "Race",
        params: [GLOBAL_CONFIG.tokens.target, "ELF"],
        negation: true,
      },
      {
        name: "Race",
        params: [GLOBAL_CONFIG.tokens.target, "HALF_ELF"],
        negation: true,
      },
    ],
  },
  {
    name: "PCs",
    includeStatus: ["Able"],
    randomOrder: true,
    triggers: [
      {
        name: "Race",
        params: [GLOBAL_CONFIG.tokens.target, "ELF"],
        negation: true,
      },
      {
        name: "Race",
        params: [GLOBAL_CONFIG.tokens.target, "HALF_ELF"],
        negation: true,
      },
    ],
  },
  {
    name: "PCsFighters",
    randomOrder: true,
    includeStatus: ["Able"],
    triggers: [
      {
        name: "Race",
        params: [GLOBAL_CONFIG.tokens.target, "ELF"],
        negation: true,
      },
    ],
  },
  {
    name: "PCs",
    includeStatus: ["Able"],
    randomOrder: true,
  },
];

export const PRESET_NAMES = {
  DimensionDoorOffscreen: "DimensionDoorOffscreen",
};

const SLEEP_TARGET_LISTS: RawTargetList[] = [...CHARM_TARGET_LISTS];

const HOLD_TARGET_LISTS: RawTargetList[] = [
  {
    name: "PCs",
    includeStatus: ["Able"],
    randomOrder: true,
  },
];

export const ABILITY_PRESETS: {
  preset: string;
  ability: RawCreatureAbility;
}[] = [
  {
    preset: SPELLS.Invisibility,
    ability: {
      name: "Invisibility",
      spell: {
        id: "WIZARD_INVISIBILITY",
        excludeStateChecks: ["STATE_INVISIBLE"],
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
      triggers: [{ name: "Detect", params: ["NearestEnemyOf"] }],
    },
  },
  {
    preset: SPELLS.ImprovedInvisibility,
    ability: {
      name: "Improved Invisibility",
      spell: {
        id: "WIZARD_IMPROVED_INVISIBILITY",
        excludeStateChecks: ["STATE_IMPROVEDINVISIBILITY"],
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Domination,
    ability: {
      name: "Domination",
      target: CHARM_TARGET_LISTS,
      spell: {
        id: "WIZARD_DOMINATION",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.DireCharm,
    ability: {
      name: "Dire Charm",
      target: CHARM_TARGET_LISTS,
      spell: {
        id: "WIZARD_DIRE_CHARM",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.CharmPerson,
    ability: {
      name: "Charm Person",
      target: CHARM_TARGET_LISTS,
      spell: {
        id: "WIZARD_CHARM_PERSON",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.CharmPersonOrAnimal,
    ability: {
      name: "Charm Person or Animal",
      target: CHARM_TARGET_LISTS,
      spell: {
        id: "CLERIC_CHARM_PERSON",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.PowerWordSleep,
    ability: {
      name: "Power Word Sleep",
      target: SLEEP_TARGET_LISTS,
      spell: {
        id: "WIZARD_POWER_WORD_SLEEP",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Sleep,
    ability: {
      name: "Sleep",
      target: SLEEP_TARGET_LISTS,
      spell: {
        id: "WIZARD_SLEEP",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Darkness15Radius,
    ability: {
      name: "Darkness 15' Radius",
      target: {
        name: "NearestEnemies",
        includeStatus: ["Able"],
        limit: 6,
        random: true,
      },
      spell: {
        id: "WIZARD_DARKNESS_15_FOOT",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.ConeOfCold,
    ability: {
      name: "Cone of Cold",
      target: { name: "NearestEnemies", random: true },
      spell: {
        id: "WIZARD_CONE_OF_COLD",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.MagicMissiles,
    ability: {
      name: "Magic Missiles",
      target: { name: "PCSpellcasters", random: true },
      spell: {
        id: "WIZARD_MAGIC_MISSILE",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Bless,
    ability: {
      name: "Bless",
      spell: {
        id: "CLERIC_BLESS",
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Command,
    ability: {
      name: "Command",
      target: SLEEP_TARGET_LISTS,
      spell: {
        id: "CLERIC_COMMAND",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.ResistFear,
    ability: {
      name: "Resist fear",
      spell: {
        id: "CLERIC_REMOVE_FEAR",
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Chant,
    ability: {
      name: "Chant",
      spell: {
        id: "CLERIC_CHANT",
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.HoldPerson,
    ability: {
      name: "Hold person",
      target: HOLD_TARGET_LISTS,
      spell: {
        id: "CLERIC_HOLD_PERSON",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.HoldPersonOrAnimal,
    ability: {
      name: "Hold person or animal",
      target: HOLD_TARGET_LISTS,
      spell: {
        id: "CLERIC_HOLD_ANIMAL",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Silence,
    ability: {
      name: "Silence",
      target: {
        name: "PCSpellcasters",
        includeStatus: ["Able"],
        triggers: [
          {
            name: "Range",
            params: [GLOBAL_CONFIG.tokens.target, 20],
            negation: true,
          },
        ],
        random: true,
      },
      spell: {
        id: "CLERIC_SILENCE_15_FOOT",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.CallLightning,
    ability: {
      name: "Call lightning",
      target: {
        name: "NearestEnemies",
        triggers: [
          {
            name: "AreaType",
            params: ["OUTDOOR"],
          },
        ],
        random: true,
      },
      spell: {
        id: "CLERIC_CALL_LIGHTNING",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.GlyphOfWarding,
    ability: {
      name: "Glyph of warding",
      target: {
        name: "FarthestEnemies",
        random: true,
      },
      spell: {
        id: "CLERIC_GLYPH_OF_WARDING",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.MiscastMagic,
    ability: {
      name: "Miscast magic",
      target: {
        name: "PCSpellcasters",
        includeStatus: ["Able"],
        random: true,
      },
      spell: {
        id: "CLERIC_MISCAST_MAGIC",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.RigidThinking,
    ability: {
      name: "Rigid thinking",
      target: {
        name: "NearestEnemies",
        includeStatus: ["Able"],
        random: true,
      },
      spell: {
        id: "CLERIC_RIGID_THINKING",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.SummonInsects,
    ability: {
      name: "Summon insects",
      target: {
        name: "PCSpellcasters",
        includeStatus: ["Able"],
        random: true,
      },
      spell: {
        id: "CLERIC_SUMMON_INSECTS",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.DimensionDoor,
    ability: {
      name: "Dimension Door",
      target: {
        name: "Players",
        random: true,
      },
      range: 900,
      spell: {
        id: "WIZARD_DIMENSION_DOOR",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
      triggers: [
        {
          name: "StateCheck",
          params: ["Myself", "STATE_BLIND"],
          negation: true,
        },
      ],
    },
  },
  {
    preset: PRESET_NAMES.DimensionDoorOffscreen,
    ability: {
      name: "Dimension Door",
      disableInterrupt: true,
      triggers: [
        {
          name: "Or",
          triggers: [
            { name: "Range", params: ["NearestEnemyOf", 10] },
            { name: "AttackedBy", params: ["ANYONE", "DEFAULT"] },
          ],
        },
      ],
      spell: {
        id: "WIZARD_DIMENSION_DOOR",
        targetName: "RR#TRAT",
      },
      requireVocal: true,
      actionsBefore: [
        {
          name: "CreateCreatureOffscreen", // Create a rat offscreen to teleport to
          params: ["RR#TRAT", 0],
        },
      ],
      actionsAfter: [{ name: "Wait", params: [1] }],
    },
  },
  {
    preset: SPELLS.Entangle,
    ability: {
      name: "Entangle",
      target: {
        name: "NearestEnemies",
        includeStatus: ["Able"],
        triggers: [factory.checkStat(0, "ENTANGLE")],
      },
      spell: {
        id: "CLERIC_ENTANGLE",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.CureLightWounds,
    ability: {
      name: "Cure Light Wounds",
      //TODO: target
      spell: {
        id: "CLERIC_CURE_LIGHT_WOUNDS",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
      triggers: [{ name: "HPPercentLT", params: ["Myself", 75] }],
    },
  },
  {
    preset: SPELLS.Barkskin,
    ability: {
      name: "Barkskin",
      spell: {
        id: "CLERIC_BARKSKIN",
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.SummonInsects,
    ability: {
      name: "Summon Insects",
      target: {
        name: "PCSpellcasters",
        includeStatus: ["Able"],
        randomOrder: true,
      },
      spell: {
        id: "CLERIC_SUMMON_INSECTS",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.AnimalSummoning4,
    ability: {
      name: "Summon Insects",
      target: {
        name: "PCsPreferringWeak",
        randomOrder: true,
      },
      spell: {
        //id: "CLERIC_ANIMAL_SUMMONING_4", // id depends on installed mods (can be 1 or 4)
        resource: "SPPR402",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.CallWoodlandBeeings,
    ability: {
      name: "Call Woodland Beeings",
      spell: {
        id: "CLERIC_CALL_WOODLAND_BEINGS",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
      triggers: [
        {
          name: "AreaType",
          params: ["OUTDOOR"],
        },
      ],
    },
  },
  {
    preset: SPELLS.Slow,
    ability: {
      name: "Slow",
      target: { name: "NearestEnemies", limit: 6 },
      spell: {
        id: "WIZARD_SLOW",
        excludeStateChecks: ["STATE_SLOWED"],
      },
    },
  },
];
