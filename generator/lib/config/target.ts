import { AllegianceIdentifiers } from "../src/model/ids/allegiance";
import { ObjectIdentifiers } from "../src/model/ids/object";
import { StateIdentifiers } from "../src/model/ids/state";
import { StatsIdentifiers } from "../src/model/ids/stats";
import { TargetPriority, TargetStatusEnum } from "../src/model/raw/target";
import { State } from "../src/state";

export type TargetListName = 'Players'
    | 'NearestEnemies'
    | 'PCsInOrder'
    | 'PCsPreferringStrong'
    | 'PCsPreferringWeak'
    | 'PCSpellcasters'
    | 'FarthestEnemies'
    | 'CloseEnemies';

export const TARGET_LISTS: { name: TargetListName; value: string[] }[] = [
    {
        name: 'NearestEnemies',
        value: [
            ObjectIdentifiers.NearestEnemyOf,
            ObjectIdentifiers.SecondNearestEnemyOf,
            ObjectIdentifiers.ThirdNearestEnemyOf,
            ObjectIdentifiers.FourthNearestEnemyOf,
            ObjectIdentifiers.FifthNearestEnemyOf,
            ObjectIdentifiers.SixthNearestEnemyOf,
            ObjectIdentifiers.SeventhNearestEnemyOf,
            ObjectIdentifiers.EighthNearestEnemyOf,
            ObjectIdentifiers.NinthNearestEnemyOf,
            ObjectIdentifiers.TenthNearestEnemyOf
        ]
    },
    {
        name: 'Players',
        value: [
            ObjectIdentifiers.Player1,
            ObjectIdentifiers.Player2,
            ObjectIdentifiers.Player3,
            ObjectIdentifiers.Player4,
            ObjectIdentifiers.Player5,
            ObjectIdentifiers.Player6,
        ]
    },
    {
        name: 'PCsInOrder',
        value: [
            `Nearest([PC])`,
            `SecondNearest}([PC])`,
            `ThirdNearest}([PC])`,
            `FourthNearest}([PC])`,
            `FifthNearest}([PC])`,
            `SixthNearest}([PC])`,
        ]
    },
    {
        name: 'PCsPreferringStrong',
        value: [
            `[PC.0.0.FIGHTER]`,
            `[PC.0.0.RANGER]`,
            `[PC.0.0.PALADIN]`,
            `[PC.0.0.FIGHTER_THIEF]`,
            `[PC.0.0.BARD]`,
            `[PC.0.0.THIEF]`,
            `[PC]`,
            `SecondNearest([PC])`,
            `ThirdNearest([PC])`
        ]
    },
    {
        name: 'PCsPreferringWeak',
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
            `ThirdNearest([PC])`
        ]
    },
    {
        name: 'PCSpellcasters',
        value: [
            `[PC.0.0.MAGE_ALL]`,
            `[PC.0.0.CLERIC_ALL]`,
            `[PC.0.0.DRUID_ALL]`,
            `[PC.0.0.BARD]`
        ]
    },
    {
        name: 'FarthestEnemies',
        value: [
            'FarthestEnemyOf(Myself)',
            'SecondFarthestEnemyOf(Myself)',
            'ThirdFarthestEnemyOf(Myself)',
        ]
    }
]

export const getTargetPriorityDetails: () => TargetPriority[] = () => [
    {
        status: TargetStatusEnum.Grabbed,
        canOnlyTargetPlayer: false,
        triggers: [],
        targetTriggers: [{ name: "CheckSpellState", params: [State.config.tokens.target, State.config.tokens.grabState] }]
    },
    {
        status: TargetStatusEnum.Slowed,
        canOnlyTargetPlayer: false,
        triggers: [],
        targetTriggers: [{ name: "StateCheck", params: [State.config.tokens.target, StateIdentifiers.STATE_SLOWED] }]
    },
    {
        status: TargetStatusEnum.Able,
        canOnlyTargetPlayer: false,
        triggers: [],
        targetTriggers: [
            { name: "CheckStatGT", params: [State.config.tokens.target, 0, StatsIdentifiers.HELD], negation: true },
            { name: "StateCheck", params: [State.config.tokens.target, StateIdentifiers.STATE_STUNNED], negation: true },
            { name: "StateCheck", params: [State.config.tokens.target, StateIdentifiers.STATE_PANIC], negation: true },
            { name: "StateCheck", params: [State.config.tokens.target, StateIdentifiers.STATE_CONFUSED], negation: true },
            { name: "StateCheck", params: [State.config.tokens.target, StateIdentifiers.STATE_FEEBLEMINDED], negation: true },
            { name: "StateCheck", params: [State.config.tokens.target, StateIdentifiers.STATE_SLEEPING], negation: true },
            { name: "StateCheck", params: [State.config.tokens.target, StateIdentifiers.STATE_HELPLESS], negation: true }
        ]
    },
    {
        status: TargetStatusEnum.Held,
        canOnlyTargetPlayer: false,
        triggers: [],
        targetTriggers: [{ name: "CheckStatGT", params: [State.config.tokens.target, 0, StatsIdentifiers.HELD] }]
    },
    {
        status: TargetStatusEnum.Stunned,
        canOnlyTargetPlayer: false,
        triggers: [],
        targetTriggers: [{ name: "StateCheck", params: [State.config.tokens.target, StateIdentifiers.STATE_STUNNED] }]
    },
    {
        status: TargetStatusEnum.PanicConfused,
        canOnlyTargetPlayer: false,
        triggers: [],
        targetTriggers: [
            {
                triggers: [
                    { name: "StateCheck", params: [State.config.tokens.target, StateIdentifiers.STATE_PANIC] },
                    { name: "StateCheck", params: [State.config.tokens.target, StateIdentifiers.STATE_CONFUSED] },
                    { name: "StateCheck", params: [State.config.tokens.target, StateIdentifiers.STATE_FEEBLEMINDED] },
                ]
            }
        ]
    },
    {
        status: TargetStatusEnum.Sleep,
        canOnlyTargetPlayer: true,
        triggers: [{ name: "Allegiance", params: [ObjectIdentifiers.Myself, AllegianceIdentifiers.ENEMY] }],
        targetTriggers: [
            { name: "StateCheck", params: [State.config.tokens.target, StateIdentifiers.STATE_SLEEPING] }
        ]
    },
    {
        status: TargetStatusEnum.NoCheck,
        canOnlyTargetPlayer: false,
        triggers: [],
        targetTriggers: []
    }
];
