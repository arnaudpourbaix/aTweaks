import { ObjectIdentifier } from "./ids/object";

export const CR = "\r\n";
export const TAB = "\t";

export const SAVING_THROWS = {
  fighter: [
    {
      levels: [0, 0],
      saveDeath: 16,
      saveWand: 18,
      savePolymorph: 17,
      saveBreath: 20,
      saveSpell: 19,
    },
    {
      levels: [1, 2],
      saveDeath: 14,
      saveWand: 16,
      savePolymorph: 15,
      saveBreath: 17,
      saveSpell: 17,
    },
    {
      levels: [3, 4],
      saveDeath: 13,
      saveWand: 15,
      savePolymorph: 14,
      saveBreath: 16,
      saveSpell: 16,
    },
    {
      levels: [5, 6],
      saveDeath: 11,
      saveWand: 13,
      savePolymorph: 12,
      saveBreath: 13,
      saveSpell: 14,
    },
    {
      levels: [7, 8],
      saveDeath: 10,
      saveWand: 12,
      savePolymorph: 11,
      saveBreath: 12,
      saveSpell: 13,
    },
    {
      levels: [9, 10],
      saveDeath: 8,
      saveWand: 10,
      savePolymorph: 9,
      saveBreath: 9,
      saveSpell: 11,
    },
    {
      levels: [11, 12],
      saveDeath: 7,
      saveWand: 9,
      savePolymorph: 8,
      saveBreath: 8,
      saveSpell: 10,
    },
    {
      levels: [13, 14],
      saveDeath: 5,
      saveWand: 7,
      savePolymorph: 6,
      saveBreath: 5,
      saveSpell: 8,
    },
    {
      levels: [15, 16],
      saveDeath: 4,
      saveWand: 6,
      savePolymorph: 5,
      saveBreath: 4,
      saveSpell: 7,
    },
    {
      levels: [17, 99],
      saveDeath: 3,
      saveWand: 5,
      savePolymorph: 4,
      saveBreath: 4,
      saveSpell: 6,
    },
  ],
  priest: [
    {
      levels: [1, 3],
      saveDeath: 10,
      saveWand: 14,
      savePolymorph: 13,
      saveBreath: 16,
      saveSpell: 15,
    },
    {
      levels: [4, 6],
      saveDeath: 9,
      saveWand: 13,
      savePolymorph: 12,
      saveBreath: 15,
      saveSpell: 14,
    },
    {
      levels: [7, 9],
      saveDeath: 7,
      saveWand: 11,
      savePolymorph: 10,
      saveBreath: 13,
      saveSpell: 12,
    },
    {
      levels: [10, 12],
      saveDeath: 6,
      saveWand: 10,
      savePolymorph: 9,
      saveBreath: 12,
      saveSpell: 11,
    },
    {
      levels: [13, 15],
      saveDeath: 5,
      saveWand: 9,
      savePolymorph: 8,
      saveBreath: 11,
      saveSpell: 10,
    },
    {
      levels: [16, 18],
      saveDeath: 4,
      saveWand: 8,
      savePolymorph: 7,
      saveBreath: 10,
      saveSpell: 9,
    },
    {
      levels: [19, 99],
      saveDeath: 2,
      saveWand: 6,
      savePolymorph: 5,
      saveBreath: 8,
      saveSpell: 7,
    },
  ],
  wizard: [
    {
      levels: [1, 5],
      saveDeath: 14,
      saveWand: 11,
      savePolymorph: 13,
      saveBreath: 15,
      saveSpell: 12,
    },
    {
      levels: [6, 10],
      saveDeath: 13,
      saveWand: 9,
      savePolymorph: 11,
      saveBreath: 13,
      saveSpell: 10,
    },
    {
      levels: [11, 15],
      saveDeath: 11,
      saveWand: 7,
      savePolymorph: 9,
      saveBreath: 11,
      saveSpell: 8,
    },
    {
      levels: [16, 20],
      saveDeath: 10,
      saveWand: 5,
      savePolymorph: 7,
      saveBreath: 9,
      saveSpell: 6,
    },
    {
      levels: [21, 99],
      saveDeath: 8,
      saveWand: 3,
      savePolymorph: 5,
      saveBreath: 7,
      saveSpell: 4,
    },
  ],
};

export const StrengthTable = [
  { str: 17, hit: 1, damage: 1 },
  { str: 18, strEx: [0, 0], hit: 1, damage: 2 },
  { str: 18, strEx: [1, 50], hit: 1, damage: 3 },
  { str: 18, strEx: [51, 75], hit: 2, damage: 3 },
  { str: 18, strEx: [76, 90], hit: 2, damage: 4 },
  { str: 18, strEx: [91, 99], hit: 2, damage: 5 },
  { str: 18, strEx: [100, 100], hit: 3, damage: 6 },
  { str: 19, hit: 3, damage: 7 },
  { str: 20, hit: 3, damage: 8 },
  { str: 21, hit: 4, damage: 9 },
  { str: 22, hit: 4, damage: 10 },
  { str: 23, hit: 5, damage: 11 },
  { str: 24, hit: 6, damage: 12 },
  { str: 25, hit: 7, damage: 14 },
];

export const Durations = {
  // 1 turn	= 10 rounds
  // 1 game hour	= 5 turns
  // 1 game day	= 120 turns
  // note: effects are not entirely applied on their full-time during a rest, it's about 500s of triggers during a rest
  round: 6,
  turn: 60,
  hour: 300,
  minute: 5,
  /**
   * 8 hours, which is equal to a rest
   */
  eightHours: 2400,
  day: 7200,
} as const;

export const ScriptTarget = {
  token: "{Target}",
  myself: "Myself" as ObjectIdentifier,
  lastSeen: "LastSeenBy" as ObjectIdentifier,
};
