import { TargetStatus } from "../src/model/raw/target";
import { GLOBAL_CONFIG } from "./generate";
import { TargetListName } from "./target-name";

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
    name: "Players",
    value: ["Player1", "Player2", "Player3", "Player4", "Player5", "Player6"],
  },
  {
    name: "PCsInOrder",
    value: [
      `Nearest([PC])`,
      `SecondNearest}([PC])`,
      `ThirdNearest}([PC])`,
      `FourthNearest}([PC])`,
      `FifthNearest}([PC])`,
      `SixthNearest}([PC])`,
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
];

export const TARGET_STATUS: TargetStatus[] = [
  {
    status: "Grabbed",
    canOnlyTargetPlayer: false,
    triggers: [],
    targetTriggers: [
      {
        name: "CheckSpellState",
        params: [GLOBAL_CONFIG.tokens.target, GLOBAL_CONFIG.tokens.grabState],
      },
    ],
  },
  {
    status: "Slowed",
    canOnlyTargetPlayer: false,
    triggers: [],
    targetTriggers: [
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_SLOWED"],
      },
    ],
  },
  {
    status: "Able",
    canOnlyTargetPlayer: false,
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
    triggers: [],
    targetTriggers: [],
  },
];
