import { RawCreatureAbility } from "../src/model/raw/ability";
import { RawTargetList } from "../src/model/raw/target";
import { GLOBAL_CONFIG } from "./generate";

export const SPELLS = {
  // Wizard
  CharmPerson: "SPWI104",
  ConeOfCold: "SPWI503",
  Darkness15Radius: "SPWI228",
  DimensionDoor: "SPWI402",
  DireCharm: "SPWI316",
  Domination: "SPWI506",
  Haste: "SPWI305",
  Invisibility: "SPWI206",
  ImprovedInvisibility: "SPWI405",
  MagicMissiles: "SPWI112",
  MinorGlobeOfInvulnerability: "SPWI406",
  PolymorphSelf: "SPWI416",
  PowerWordSleep: "SPWI220",
  Sleep: "SPWI116",
  Slow: "SPWI312",
  Stoneskin: "SPWI408",
  // Priest
  Bless: "SPPR101",
  Command: "SPPR102",
  ResistFear: "SPPR108",
  Chant: "SPPR203",
  HoldPerson: "SPPR208",
  Silence: "SPPR211",
  CallLightning: "SPPR302",
  GlyphOfWarding: "SPPR304",
  HoldPersonOrAnimal: "SPPR305",
  MiscastMagic: "SPPR310",
  RigidThinking: "SPPR311",
  SummonInsects: "SPPR319",
  // Class
  BerserkerRage: "SPCL321",
  BarbarianRage: "SPCL152",
};

export const SPELL_STATES = {
  grabbed: "JA_GRAPPLED",
  grabbing: "JA_GRAPPLING",
  flying: "JA_FLYING",
  gaseousForm: "JA_GASEOUSFORM",
};

const DEFAULT_SPELL_PROBABILITY = 70;

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
      },
      triggers: [{ name: "Detect", params: ["NearestEnemyOf"] }],
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
      triggers: [
        {
          name: "StateCheck",
          params: ["Myself", "STATE_BLIND"],
          negation: true,
        },
      ],
    },
  },
];
