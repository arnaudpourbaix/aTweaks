import triggerFactory from "../src/factories/trigger.factory";
import { RawCreatureAbility } from "../src/model/creature/ability";
import { TargetList } from "../src/model/script/target";
import { GLOBAL_CONFIG } from "./generate";
import { SPELLS } from "./spell-names";

export const SPELL_STATES = {
  flying: "JA_FLYING",
  grabbed: "JA_GRAPPLED",
  grabbing: "JA_GRAPPLING",
  gaseousForm: "JA_GASEOUSFORM",
};

export const DEFAULT_SPELL_PROBABILITY = 70;

const CHARM_TARGET_LISTS: TargetList[] = [
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

const SLEEP_TARGET_LISTS: TargetList[] = [...CHARM_TARGET_LISTS];

const FEAR_TARGET_LISTS: TargetList[] = [
  {
    name: "PCs",
    includeStatus: ["Able"],
    randomOrder: true,
  },
];

const HOLD_TARGET_LISTS: TargetList[] = [
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
      name: "ability.invisibility",
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
      name: "ability.improvedInvisibility",
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
      name: "ability.domination",
      targets: CHARM_TARGET_LISTS,
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
      name: "ability.direCharm",
      targets: CHARM_TARGET_LISTS,
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
      name: "ability.charmPerson",
      targets: CHARM_TARGET_LISTS,
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
      name: "ability.charmPersonOrAnimal",
      targets: CHARM_TARGET_LISTS,
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
      name: "ability.powerWordSleep",
      targets: SLEEP_TARGET_LISTS,
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
      name: "ability.sleep",
      targets: SLEEP_TARGET_LISTS,
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
      name: "ability.darkness15Radius",
      targets: [
        {
          name: "NearestEnemies",
          includeStatus: ["Able"],
          limit: 6,
          randomOrder: true,
        },
      ],
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
      name: "ability.coneOfCold",
      targets: [{ name: "NearestEnemies", randomOrder: true }],
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
      name: "ability.magicMissiles",
      targets: [{ name: "PCSpellcasters", randomOrder: true }],
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
      name: "ability.bless",
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
      name: "ability.command",
      targets: SLEEP_TARGET_LISTS,
      spell: {
        id: "CLERIC_COMMAND",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Horror,
    ability: {
      name: "ability.horror",
      targets: FEAR_TARGET_LISTS,
      spell: {
        id: "WIZARD_HORROR",
        excludeStateChecks: ["STATE_PANIC"],
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.CloakOfFear,
    ability: {
      name: "ability.cloakOfFear",
      targets: FEAR_TARGET_LISTS,
      spell: {
        id: "CLERIC_CLOAK_OF_FEAR",
        excludeStateChecks: ["STATE_PANIC"],
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.ResistFear,
    ability: {
      name: "ability.resistFear",
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
      name: "ability.chant",
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
      name: "ability.holdPerson",
      targets: HOLD_TARGET_LISTS,
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
      name: "ability.HoldPersonOrAnimal",
      targets: HOLD_TARGET_LISTS,
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
      name: "ability.silence",
      targets: [
        {
          name: "PCSpellcasters",
          includeStatus: ["Able"],
          triggers: [
            {
              name: "Range",
              params: [GLOBAL_CONFIG.tokens.target, 20],
              negation: true,
            },
          ],
          randomOrder: true,
        },
      ],
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
      name: "ability.callLightning",
      targets: [
        {
          name: "NearestEnemies",
          triggers: [
            {
              name: "AreaType",
              params: ["OUTDOOR"],
            },
          ],
          randomOrder: true,
        },
      ],
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
      name: "ability.glyphOfWarding",
      targets: [
        {
          name: "FarthestEnemies",
          randomOrder: true,
        },
      ],
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
      name: "ability.miscastMagic",
      targets: [
        {
          name: "PCSpellcasters",
          includeStatus: ["Able"],
          randomOrder: true,
        },
      ],
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
      name: "ability.rigidThinking",
      targets: [
        {
          name: "NearestEnemies",
          includeStatus: ["Able"],
          randomOrder: true,
        },
      ],
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
      name: "ability.summonInsects",
      targets: [
        {
          name: "PCSpellcasters",
          includeStatus: ["Able"],
          randomOrder: true,
        },
      ],
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
      name: "ability.dimensionDoor",
      targets: [
        {
          name: "Players",
          randomOrder: true,
        },
      ],
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
      name: "ability.dimensionDoor",
      disableInterrupt: true,
      triggers: [
        {
          name: "Or",
          triggers: [
            { name: "Range", params: ["NearestEnemyOf", 15] },
            { name: "AttackedBy", params: ["ANYONE", "DEFAULT"] },
          ],
        },
      ],
      spell: {
        id: "WIZARD_DIMENSION_DOOR",
        targetName: "RR#TRAT",
      },
      requireVocal: false,
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
      name: "ability.entangle",
      targets: [
        {
          name: "NearestEnemies",
          includeStatus: ["Able"],
          triggers: [triggerFactory.checkStat(0, "ENTANGLE")],
        },
      ],
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
      name: "ability.cureLightWounds",
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
      name: "ability.barkskin",
      spell: {
        id: "CLERIC_BARKSKIN",
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.AnimalSummoning4,
    ability: {
      name: "ability.animalSummoning4",
      targets: [
        {
          name: "PCsPreferringWeak",
          randomOrder: true,
        },
      ],
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
      name: "ability.callWoodlandBeeings",
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
      name: "ability.slow",
      targets: [{ name: "NearestEnemies", limit: 6 }],
      spell: {
        id: "WIZARD_SLOW",
        excludeStateChecks: ["STATE_SLOWED"],
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.Web,
    ability: {
      name: "ability.web",
      targets: HOLD_TARGET_LISTS,
      spell: {
        id: "WIZARD_WEB",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.DetectInvisibility,
    ability: {
      name: "ability.detectInvisibility",
      spell: {
        id: "WIZARD_DETECT_INVISIBILITY",
        probability: DEFAULT_SPELL_PROBABILITY,
        selfTarget: true,
      },
      triggers: [
        { name: "See", params: ["PC"], negation: true },
        { name: "Detect", params: ["PC"] },
        {
          name: "CheckSpellState",
          params: ["Myself", "DETECT_INVISIBILITY"],
          negation: true,
        },
      ],
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.WailOfTheBanshee,
    ability: {
      name: "ability.wailOfTheBanshee",
      targets: [{ name: "Players" }],
      spell: {
        id: "WIZARD_WAIL_OF_THE_BANSHEE",
        selfTarget: true,
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.IceStorm,
    ability: {
      name: "ability.iceStorm",
      targets: [
        {
          name: "FarthestEnemies",
          randomOrder: true,
        },
      ],
      minRange: 20,
      spell: {
        id: "WIZARD_ICE_STORM",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  //TODO:
  {
    preset: SPELLS.DispelMagic,
    ability: {
      name: "ability.dispelMagic",
      targets: [
        {
          name: "FarthestEnemies",
          randomOrder: true,
        },
      ],
      spell: {
        id: "WIZARD_TRUE_DISPEL_MAGIC",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.PowerWordBlind,
    ability: {
      name: "ability.powerWordBlind",
      targets: SLEEP_TARGET_LISTS,
      spell: {
        id: "WIZARD_POWER_WORD_BLIND",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.PowerWordStun,
    ability: {
      name: "ability.powerWordStun",
      targets: SLEEP_TARGET_LISTS,
      spell: {
        id: "WIZARD_POWER_WORD_STUN",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
  {
    preset: SPELLS.PowerWordKill,
    ability: {
      name: "ability.powerWordKill",
      targets: SLEEP_TARGET_LISTS,
      spell: {
        id: "WIZARD_POWER_WORD_KILL",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
    },
  },
];
