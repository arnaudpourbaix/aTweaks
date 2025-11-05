import { Creature } from "../src/model/creature/creature";
import { ANKHEG } from "./ankheg/ankheg";
import { Basilisks } from "./basilisks";
import { CARRION_CRAWLER } from "./carrion/crawler_carrion";

export const CREATURES: Creature[] = [
  ANKHEG,
  ...Basilisks,
  // ...Bears,
  CARRION_CRAWLER,
  // ...Cats,
  // ...Constructs,
  // ...Dogs,
  // ...Feys,
  // ...Golems,
  // ...Ogres,
  // ...Plants,
  // ...Slimes,
  // ...Spiders,
  // ...Wolves,
];

/*
"SHOAL", // Shoal the Nereid
"BDNEREID", // Nereid
"BDPWATER", // Nereid

"DEMSUC01", // Succubus
"NTINDFIG", // Succubus
"KIRINH", // Kirinhale

"AC#FPOX1", // Obliviax https://adnd2e.fandom.com/wiki/Obliviax

*/
