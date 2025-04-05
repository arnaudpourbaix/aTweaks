import { ClassIdentifiers } from "../src/model/ids/class";
import { RaceIdentifiers } from "../src/model/ids/race";
import { RawEffectIDSFile } from "../src/model/raw/enum";

export const EARTH_CREATURES: [RawEffectIDSFile, string][] = [
  ["CLASS", ClassIdentifiers.ELEMENTAL_EARTH],
];

export const AIR_CREATURES: [RawEffectIDSFile, string][] = [
  ["RACE", RaceIdentifiers.WYVERN],
  ["RACE", RaceIdentifiers.BEHOLDER],
  ["RACE", RaceIdentifiers.MIST],
  ["RACE", RaceIdentifiers.MEPHIT],
  ["RACE", RaceIdentifiers.DRAGON],
  ["RACE", RaceIdentifiers.SOLAR],
  ["RACE", RaceIdentifiers.ANTISOLAR],
  ["RACE", RaceIdentifiers.PLANATAR],
  ["RACE", RaceIdentifiers.DARKPLANATAR],
  ["CLASS", ClassIdentifiers.ELEMENTAL_AIR],
  ["CLASS", ClassIdentifiers.GENIE_DJINNI],
  ["CLASS", ClassIdentifiers.GENIE_NOBLE_DJINNI],
];

export const WATER_CREATURES: [RawEffectIDSFile, string][] = [
  ["RACE", RaceIdentifiers.SAHUAGIN],
  ["RACE", RaceIdentifiers.KUO_TOA],
  ["CLASS", ClassIdentifiers.ELEMENTAL_WATER],
  ["CLASS", ClassIdentifiers.FAIRY_NEREID],
];

export const GRAB_IMMUNE_CREATURES = {
  races: [
    RaceIdentifiers.DRAGON,
    RaceIdentifiers.MIMIC,
    RaceIdentifiers.MIST,
    RaceIdentifiers.SHADOW,
    RaceIdentifiers.SLIME,
    RaceIdentifiers.SPECTRAL_UNDEAD,
    RaceIdentifiers.SPECTRE,
    RaceIdentifiers.WILL_O_WISP,
    RaceIdentifiers.WRAITH,
    RaceIdentifiers.WYVERN,
  ],
  classes: [
    ClassIdentifiers.NEOTHELID,
    ClassIdentifiers.SPECTRAL_TROLL,
    ClassIdentifiers.SPIDER_WRAITH,
  ],
};

export const HUGE_CREATURES = {
  races: [
    RaceIdentifiers.ANKHEG,
    RaceIdentifiers.ELEMENTAL,
    RaceIdentifiers.ETTIN,
    RaceIdentifiers.GIANT,
    RaceIdentifiers.LIZARDMAN,
    RaceIdentifiers.TREANT,
  ],
  classes: [
    ClassIdentifiers.BEAR_CAVE,
    ClassIdentifiers.BEAR_POLAR,
    ClassIdentifiers.SPIDER_PHASE,
    ClassIdentifiers.SPIDER_SWORD,
  ],
};

export const LARGE_CREATURES = {
  races: [
    RaceIdentifiers.BUGBEAR,
    RaceIdentifiers.CARRIONCRAWLER,
    RaceIdentifiers.CHIMERA,
    RaceIdentifiers.DARKPLANATAR,
    RaceIdentifiers.GENIE,
    RaceIdentifiers.GNOLL,
    RaceIdentifiers.GOLEM,
    RaceIdentifiers.HOOK_HORROR,
    RaceIdentifiers.MINOTAUR,
    RaceIdentifiers.MYCONID,
    RaceIdentifiers.OGRE,
    RaceIdentifiers.OTYUGH,
    RaceIdentifiers.PLANATAR,
    RaceIdentifiers.SALAMANDER,
    RaceIdentifiers.SHAMBLING_MOUND,
    RaceIdentifiers.SOLAR,
    RaceIdentifiers.TROLL,
    RaceIdentifiers.UMBERHULK,
    RaceIdentifiers.YETI,
  ],
  classes: [
    ClassIdentifiers.BASILISK_GREATER,
    ClassIdentifiers.BEAR_BROWN,
    ClassIdentifiers.SPIDER_GIANT,
    ClassIdentifiers.WOLF_DIRE,
    ClassIdentifiers.WOLF_WINTER,
  ],
};

// Because its body is a mass of unliving matter, a construct is hard to destroy.
// It gains bonus hit points based on size, as shown on the following table.
export const CONSTRUCT_BONUS_HIT_POINT = [
  { size: "Tiny", hp: 0 },
  { size: "Small", hp: 10 },
  { size: "Medium", hp: 20 },
  { size: "Large", hp: 30 },
  { size: "Huge", hp: 40 },
  { size: "Gargantuan", hp: 60 },
  { size: "Colossal", hp: 80 },
];
