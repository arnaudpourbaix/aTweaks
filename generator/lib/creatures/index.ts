import { RawCreature } from "../src/model/raw/creature";
import { ANKHEG } from "./ankheg";
import { Basilisks } from "./basilisks";
import { Bears } from "./bears";
import { Cats } from "./cats";
import { Constructs } from "./constructs";
import { CARRION_CRAWLER } from "./crawler_carrion";
import { Dogs } from "./dogs";
import { Feys } from "./feys";
import { Golems } from "./golems";
import { Ogres } from "./ogres";
import { Plants } from "./plants";
import { Slimes } from "./slimes";
import { Wolves } from "./wolves";

export const CREATURES: RawCreature[] = [
  ANKHEG,
  ...Basilisks,
  ...Bears,
  CARRION_CRAWLER,
  ...Cats,
  ...Dogs,
  ...Wolves,
  ...Golems,
  ...Constructs,
  ...Ogres,
  ...Feys,
  ...Slimes,
  ...Plants,
];

export const CREATURES_TEST: RawCreature[] = [...Plants, ...Feys, ...Slimes];

/*
"SHOAL", // Shoal the Nereid
"BDNEREID", // Nereid
"BDPWATER", // Nereid

"DEMSUC01", // Succubus
"NTINDFIG", // Succubus
"KIRINH", // Kirinhale

"AC#FPOX1", // Obliviax https://adnd2e.fandom.com/wiki/Obliviax

*/
