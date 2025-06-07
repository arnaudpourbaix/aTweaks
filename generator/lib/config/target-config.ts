import { TargetStatus } from "../src/model/raw/target";
import { GLOBAL_CONFIG } from "./generate";
import { GRAB_DEFAULT_CONFIG } from "./grab";
import { TargetListName, TargetStatusName } from "./target-name";

export const TARGET_LISTS: { name: TargetListName; value: string[] }[] = [
  {
    name: "NearestEnemies",
    value: [
      "NearestEnemyOf",
      "SecondNearestEnemyOf",
      "ThirdNearestEnemyOf",
      "FourthNearestEnemyOf",
      "FifthNearestEnemyOf",
      "SixthNearestEnemyOf",
      "SeventhNearestEnemyOf",
      "EighthNearestEnemyOf",
      "NinthNearestEnemyOf",
      "TenthNearestEnemyOf",
    ],
  },
  {
    name: "NearestAllies",
    value: [
      "NearestAllyOf",
      "SecondNearestAllyOf",
      "ThirdNearestAllyOf",
      "FourthNearestAllyOf",
      "FifthNearestAllyOf",
      "SixthNearestAllyOf",
    ],
  },
  {
    name: "Players",
    value: ["Player1", "Player2", "Player3", "Player4", "Player5", "Player6"],
  },
  {
    name: "PCs",
    value: [
      `[PC]`,
      `SecondNearest([PC])`,
      `ThirdNearest([PC])`,
      `FourthNearest([PC])`,
      `FifthNearest([PC])`,
      `SixthNearest([PC])`,
    ],
  },
  {
    name: "PCsFighters",
    value: [
      `[PC.0.0.FIGHTER_ALL]`,
      `SecondNearest([PC.0.0.FIGHTER_ALL])`,
      `ThirdNearest([PC.0.0.FIGHTER_ALL])`,
      `[PC.0.0.RANGER_ALL]`,
      `SecondNearest([PC.0.0.RANGER_ALL])`,
      `ThirdNearest([PC.0.0.RANGER_ALL])`,
      `[PC.0.0.PALADIN_ALL]`,
      `SecondNearest([PC.0.0.PALADIN_ALL])`,
      `ThirdNearest([PC.0.0.PALADIN_ALL])`,
    ],
  },
  {
    name: "PCsPreferringStrong",
    value: [
      `[PC.0.0.FIGHTER]`,
      `[PC.0.0.RANGER]`,
      `[PC.0.0.PALADIN]`,
      `[PC.0.0.FIGHTER_THIEF]`,
      `[PC.0.0.BARD]`,
      `[PC.0.0.THIEF]`,
      `[PC]`,
      `SecondNearest([PC])`,
      `ThirdNearest([PC])`,
    ],
  },
  {
    name: "PCsPreferringWeak",
    value: [
      `[PC.0.0.MAGE]`,
      `[PC.0.0.MAGE_THIEF]`,
      `[PC.0.0.MAGE_ALL]`,
      `[PC.0.0.THIEF]`,
      `[PC.0.0.BARD]`,
      `[PC.0.0.THIEF_ALL]`,
      `[PC.0.0.CLERIC]`,
      `[PC]`,
      `SecondNearest([PC])`,
      `ThirdNearest([PC])`,
    ],
  },
  {
    name: "PCSpellcasters",
    value: [
      `[PC.0.0.MAGE_ALL]`,
      `[PC.0.0.CLERIC_ALL]`,
      `[PC.0.0.DRUID_ALL]`,
      `[PC.0.0.BARD]`,
    ],
  },
  {
    name: "FarthestEnemies",
    value: [
      "FarthestEnemyOf(Myself)",
      "SecondFarthestEnemyOf(Myself)",
      "ThirdFarthestEnemyOf(Myself)",
    ],
  },
  {
    name: "Animals",
    value: [
      `NearestEnemyOfType([0.ANIMAL])`,
      `SecondNearestEnemyOfType([0.ANIMAL])`,
      `ThirdNearestEnemyOfType([0.ANIMAL])`,
      `[NEUTRAL.ANIMAL]`,
      `SecondNearest([NEUTRAL.ANIMAL])`,
      `ThirdNearest([NEUTRAL.ANIMAL])`,
    ],
  },
];

export const DEFAULT_STATUS_ORDER: TargetStatusName[] = [
  "Grabbed",
  "Slowed",
  "Able",
  "Held",
  "Stunned",
  "NoCheck",
  "Sleep",
];

export const TARGET_STATUS: TargetStatus[] = [
  {
    status: "Grabbed",
    canOnlyTargetPlayer: false,
    requireIntelligence: false,
    triggers: [],
    targetTriggers: [
      {
        name: "CheckSpellState",
        params: [GLOBAL_CONFIG.tokens.target, GRAB_DEFAULT_CONFIG.grabbedState],
      },
    ],
  },
  {
    status: "Slowed",
    canOnlyTargetPlayer: false,
    requireIntelligence: true,
    triggers: [],
    targetTriggers: [
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_SLOWED"],
      },
      {
        name: "CheckStatGT",
        params: [GLOBAL_CONFIG.tokens.target, 0, "HELD"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_STUNNED"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_PANIC"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_CONFUSED"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_FEEBLEMINDED"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_SLEEPING"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_HELPLESS"],
        negation: true,
      },
    ],
  },
  {
    status: "Able",
    canOnlyTargetPlayer: false,
    requireIntelligence: true,
    triggers: [],
    targetTriggers: [
      {
        name: "CheckStatGT",
        params: [GLOBAL_CONFIG.tokens.target, 0, "HELD"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_STUNNED"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_PANIC"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_CONFUSED"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_FEEBLEMINDED"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_SLEEPING"],
        negation: true,
      },
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_HELPLESS"],
        negation: true,
      },
    ],
  },
  {
    status: "Held",
    canOnlyTargetPlayer: false,
    requireIntelligence: true,
    triggers: [],
    targetTriggers: [
      {
        name: "CheckStatGT",
        params: [GLOBAL_CONFIG.tokens.target, 0, "HELD"],
      },
    ],
  },
  {
    status: "Stunned",
    canOnlyTargetPlayer: false,
    requireIntelligence: true,
    triggers: [],
    targetTriggers: [
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_STUNNED"],
      },
    ],
  },
  {
    status: "PanicConfused",
    canOnlyTargetPlayer: false,
    requireIntelligence: true,
    triggers: [],
    targetTriggers: [
      {
        name: "Or",
        triggers: [
          {
            name: "StateCheck",
            params: [GLOBAL_CONFIG.tokens.target, "STATE_PANIC"],
          },
          {
            name: "StateCheck",
            params: [GLOBAL_CONFIG.tokens.target, "STATE_CONFUSED"],
          },
          {
            name: "StateCheck",
            params: [GLOBAL_CONFIG.tokens.target, "STATE_FEEBLEMINDED"],
          },
        ],
      },
    ],
  },
  {
    status: "Sleep",
    canOnlyTargetPlayer: true,
    requireIntelligence: false,
    triggers: [
      {
        name: "Allegiance",
        params: ["Myself", "ENEMY"],
      },
    ],
    targetTriggers: [
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_SLEEPING"],
      },
    ],
  },
  {
    status: "NoCheck",
    canOnlyTargetPlayer: false,
    requireIntelligence: false,
    triggers: [],
    targetTriggers: [],
  },
];
