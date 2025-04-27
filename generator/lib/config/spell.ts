import { RawCreatureAbility } from "../src/model/raw/ability";
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
        probability: 70,
      },
      triggers: [{ name: "Detect", params: ["NearestEnemyOf"] }],
    },
  },
  {
    preset: SPELLS.Domination,
    ability: {
      name: "Domination",
      target: {
        name: "PCsPreferringStrong",
        includeStatus: ["Able"],
        triggers: [
          {
            name: "Race",
            params: [GLOBAL_CONFIG.tokens.target, "ELF"],
            negation: true,
          },
        ],
        random: true,
      },
      spell: {
        id: "WIZARD_DOMINATION",
        probability: 70,
      },
    },
  },
  {
    preset: SPELLS.DireCharm,
    ability: {
      name: "Dire Charm",
      target: {
        name: "PCsPreferringStrong",
        includeStatus: ["Able"],
        triggers: [
          {
            name: "Race",
            params: [GLOBAL_CONFIG.tokens.target, "ELF"],
            negation: true,
          },
        ],
        random: true,
      },
      spell: {
        id: "WIZARD_DIRE_CHARM",
        probability: 70,
      },
    },
  },
  {
    preset: SPELLS.CharmPerson,
    ability: {
      name: "Charm Person",
      target: {
        name: "PCsPreferringStrong",
        includeStatus: ["Able"],
        triggers: [
          {
            name: "Race",
            params: [GLOBAL_CONFIG.tokens.target, "ELF"],
            negation: true,
          },
        ],
        random: true,
      },
      spell: {
        id: "WIZARD_CHARM_PERSON",
        probability: 70,
      },
    },
  },
  {
    preset: SPELLS.PowerWordSleep,
    ability: {
      name: "Power Word Sleep",
      target: {
        name: "PCsPreferringStrong",
        includeStatus: ["Able"],
        triggers: [
          {
            name: "Race",
            params: [GLOBAL_CONFIG.tokens.target, "ELF"],
            negation: true,
          },
        ],
        random: true,
      },
      spell: {
        id: "WIZARD_POWER_WORD_SLEEP",
        probability: 70,
      },
    },
  },
  {
    preset: SPELLS.Sleep,
    ability: {
      name: "Sleep",
      target: {
        name: "PCsPreferringStrong",
        includeStatus: ["Able"],
        triggers: [
          {
            name: "Race",
            params: [GLOBAL_CONFIG.tokens.target, "ELF"],
            negation: true,
          },
        ],
        random: true,
      },
      spell: {
        id: "WIZARD_SLEEP",
        probability: 70,
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
        probability: 70,
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
        probability: 70,
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
        probability: 70,
      },
    },
  },
  {
    preset: SPELLS.Bless,
    ability: {
      name: "Bless",
      spell: {
        id: "CLERIC_BLESS",
        probability: 70,
        selfTarget: true,
      },
    },
  },
  {
    preset: SPELLS.Command,
    ability: {
      name: "Command",
      target: {
        name: "PCsPreferringStrong",
        includeStatus: ["Able"],
        triggers: [
          {
            name: "Race",
            params: [GLOBAL_CONFIG.tokens.target, "ELF"],
            negation: true,
          },
        ],
        random: true,
      },
      spell: {
        id: "CLERIC_COMMAND",
        probability: 70,
      },
    },
  },
  {
    preset: SPELLS.ResistFear,
    ability: {
      name: "Resist fear",
      spell: {
        id: "CLERIC_REMOVE_FEAR",
        probability: 70,
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
        probability: 70,
        selfTarget: true,
      },
    },
  },
  {
    preset: SPELLS.HoldPerson,
    ability: {
      name: "Hold person",
      target: {
        name: "PCsPreferringStrong",
        includeStatus: ["Able"],
        random: true,
      },
      spell: {
        id: "CLERIC_HOLD_PERSON",
        probability: 70,
      },
    },
  },
  {
    preset: SPELLS.HoldPersonOrAnimal,
    ability: {
      name: "Hold person or animal",
      target: {
        name: "PCsPreferringStrong",
        includeStatus: ["Able"],
        random: true,
      },
      spell: {
        id: "CLERIC_HOLD_ANIMAL",
        probability: 70,
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
        probability: 70,
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
            params: [1],
          },
        ],
        random: true,
      },
      spell: {
        id: "CLERIC_CALL_LIGHTNING",
        probability: 70,
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
        probability: 70,
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
        probability: 70,
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
        probability: 70,
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
        probability: 70,
      },
    },
  },
];
