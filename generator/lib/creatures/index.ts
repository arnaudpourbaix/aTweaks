import { Creature } from "../src/model/creature/creature";
import { createAnkheg } from "./ankheg/ankheg";
import { createBasilisks } from "./basilisks/basilisk";
import { createBears } from "./bears/bear";
import { createCarrionCrawler } from "./carrion/crawler_carrion";

export const creatureFactories: (() => Creature[])[] = [
  createAnkheg,
  createBasilisks,
  createBears,
  createCarrionCrawler,
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
