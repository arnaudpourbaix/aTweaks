import { ClassIdentifier } from "../src/model/ids/class";
import { RaceIdentifier } from "../src/model/ids/race";
import { RawEffectIDSFile } from "../src/model/raw/enum";

export const EARTH_CREATURES: [
  RawEffectIDSFile,
  ClassIdentifier | RaceIdentifier
][] = [["CLASS", "ELEMENTAL_EARTH"]];

export const AIR_CREATURES: [
  RawEffectIDSFile,
  ClassIdentifier | RaceIdentifier
][] = [
  ["RACE", "WYVERN"],
  ["RACE", "BEHOLDER"],
  ["RACE", "MIST"],
  ["RACE", "MEPHIT"],
  ["RACE", "DRAGON"],
  ["RACE", "SOLAR"],
  ["RACE", "ANTISOLAR"],
  ["RACE", "PLANATAR"],
  ["RACE", "DARKPLANATAR"],
  ["CLASS", "ELEMENTAL_AIR"],
  ["CLASS", "GENIE_DJINNI"],
  ["CLASS", "GENIE_NOBLE_DJINNI"],
];

export const WATER_CREATURES: [
  RawEffectIDSFile,
  ClassIdentifier | RaceIdentifier
][] = [
  ["RACE", "SAHUAGIN"],
  ["RACE", "KUO-TOA"],
  ["CLASS", "ELEMENTAL_WATER"],
  ["CLASS", "FAIRY_NEREID"],
];

export const GRAB_IMMUNE_CREATURES: [
  RawEffectIDSFile,
  ClassIdentifier | RaceIdentifier
][] = [
  ["RACE", "DRAGON"],
  ["RACE", "MIMIC"],
  ["RACE", "MIST"],
  ["RACE", "SHADOW"],
  ["RACE", "SLIME"],
  ["RACE", "SPECTRAL_UNDEAD"],
  ["RACE", "SPECTRE"],
  ["RACE", "WILL-O-WISP"],
  ["RACE", "WRAITH"],
  ["RACE", "WYVERN"],
  ["CLASS", "NEOTHELID"],
  ["CLASS", "SPECTRAL_TROLL"],
  ["CLASS", "SPIDER_WRAITH"],
];

export const HUGE_CREATURES: [
  RawEffectIDSFile,
  ClassIdentifier | RaceIdentifier
][] = [
  ["RACE", "ANKHEG"],
  ["RACE", "ELEMENTAL"],
  ["RACE", "ETTIN"],
  ["RACE", "GIANT"],
  ["RACE", "LIZARDMAN"],
  ["RACE", "TREANT"],
  ["CLASS", "BEAR_CAVE"],
  ["CLASS", "BEAR_POLAR"],
  ["CLASS", "SPIDER_PHASE"],
  ["CLASS", "SPIDER_SWORD"],
];

export const LARGE_CREATURES: [
  RawEffectIDSFile,
  ClassIdentifier | RaceIdentifier
][] = [
  ["RACE", "BUGBEAR"],
  ["RACE", "CARRIONCRAWLER"],
  ["RACE", "CHIMERA"],
  ["RACE", "DARKPLANATAR"],
  ["RACE", "GENIE"],
  ["RACE", "GNOLL"],
  ["RACE", "GOLEM"],
  ["RACE", "HOOK_HORROR"],
  ["RACE", "MINOTAUR"],
  ["RACE", "MYCONID"],
  ["RACE", "OGRE"],
  ["RACE", "OTYUGH"],
  ["RACE", "PLANATAR"],
  ["RACE", "SALAMANDER"],
  ["RACE", "SHAMBLING_MOUND"],
  ["RACE", "SOLAR"],
  ["RACE", "TROLL"],
  ["RACE", "UMBERHULK"],
  ["RACE", "YETI"],
  ["CLASS", "BASILISK_GREATER"],
  ["CLASS", "BEAR_BROWN"],
  ["CLASS", "SPIDER_GIANT"],
  ["CLASS", "WOLF_DIRE"],
  ["CLASS", "WOLF_WINTER"],
];

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
