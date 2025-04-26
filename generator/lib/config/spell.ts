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
        probability: 80,
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
        excludeStateChecks: ["STATE_HELPLESS"],
        probability: 80,
      },
    },
  },
  {
    preset: SPELLS.DireCharm,
    ability: {
      name: "Dire Charm",
      target: {
        name: "PCsPreferringStrong",
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
        excludeStateChecks: ["STATE_HELPLESS"],
        probability: 80,
      },
    },
  },
  {
    preset: SPELLS.CharmPerson,
    ability: {
      name: "Charm Person",
      target: {
        name: "PCsPreferringStrong",
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
        excludeStateChecks: ["STATE_HELPLESS"],
        probability: 80,
      },
    },
  },
  {
    preset: SPELLS.PowerWordSleep,
    ability: {
      name: "Power Word Sleep",
      target: {
        name: "PCsPreferringStrong",
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
        excludeStateChecks: ["STATE_HELPLESS"],
        probability: 80,
      },
    },
  },
  {
    preset: SPELLS.Sleep,
    ability: {
      name: "Sleep",
      target: {
        name: "PCsPreferringStrong",
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
        excludeStateChecks: ["STATE_HELPLESS"],
        probability: 80,
      },
    },
  },
  {
    preset: SPELLS.Darkness15Radius,
    ability: {
      name: "Darkness 15' Radius",
      target: {
        name: "NearestEnemies",
        random: true,
        limit: 6,
      },
      spell: {
        id: "WIZARD_DARKNESS_15_FOOT",
        excludeStateChecks: ["STATE_HELPLESS"],
        probability: 80,
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
        excludeStateChecks: ["STATE_HELPLESS"],
        probability: 80,
      },
    },
  },
  {
    preset: SPELLS.MagicMissiles,
    ability: {
      name: "Magic Missiles",
      target: { name: "PCSpellcasters", includeStatus: ["Able"], random: true },
      spell: {
        id: "WIZARD_MAGIC_MISSILE",
        probability: 80,
      },
    },
  },
];
