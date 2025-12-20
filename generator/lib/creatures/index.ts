import { Family } from "../src/model/creature/family";
import { createAnkhegs } from "./ankhegs";
import { createBasilisks } from "./basilisks";
import { createBears } from "./bears";
import { createCats } from "./cats";
import { createConstructs } from "./constructs";
import { createCarrionCrawlers } from "./crawlers";
import { createDogs } from "./dogs";
import { createEttercaps } from "./ettercaps";
import { createFeys } from "./feys";
import { createGolems } from "./golems";
import { createMinotaurs } from "./minotaurs";
import { createOgres } from "./ogres";
import { createPlants } from "./plants";
import { createSlimes } from "./slimes";
import { createSpiders } from "./spiders";
import { createWolves } from "./wolves";

export const familyFactories: (() => Family)[] = [
  createAnkhegs,
  createBasilisks,
  createBears,
  createCarrionCrawlers,
  createCats,
  createConstructs,
  createDogs,
  createEttercaps,
  createFeys,
  createGolems,
  createMinotaurs,
  createOgres,
  createPlants,
  createSlimes,
  createSpiders,
  createWolves,
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

// Hunter class:
// "BDBEETBH", // Boring Beetle
// "BDBEETBM", // Bombardier Beetle
// "BDBEETBR", // Boring Beetle
// "BDBEETFM", // Fire Beetle
// "BDBEETMH", // Bombardier Beetle
// "BDBEETRH", // Rhinoceros Beetle
// "BDGRIZHU", // Grizzly Bear
// "BDHOOKHR", // Hook Horror
// "BDSNAKEH", // Snake
// "BDWOLF02", // Wolf
// "CATJAG01", // Panther
// "CATLIM01", // Mountain Lion
// "H_SNAKEC", // Snake
// "L#BUGBU", // Beetle

// Food class:
// "ACQ13003", // Rabbit
// "ACVIRGI", //
// "BATSU", // Bat
// "BDBCHICK", // Chicken
// "BDBOAR01", // White Boar
// "BDBOAR02", // Wild Boar
// "BDBOAR03", // Old Boar
// "BDCHICBR", // Brown Rooster
// "BDCHICKW", // Chicken
// "BDCHICWI", // White Rooster
// "BDCHUNKS", // Rat
// "BDFRAT", // Rat
// "BDRAT", // Rat
// "BDRAT2", // Rat
// "BDRATDIE", // Rat
// "BDRATNC", // Rat
// "BDSHRIEK", // Shrieker
// "BSRABBIT", // Rabbit
// "BSTQ010", // Betsy the Rat
// "CHICKDEF", // Rabid Chicken
// "CHICKE", // Chicken
// "CHICKER", // Rabid Chicken
// "COW", // Cow
// "COWH", // Cow
// "D5_RABB", // Rabbit
// "GRHOG01", // Groundhog
// "L#FAIRAT", // Dire Rat
// "MOOSE01", // Moose
// "NECHICK1", // Chicken
// "NEDEER1", // Deer
// "PHEAS01", // Pheasant
// "RABBIT", // Rabbit
// "RABBITSU", // Rabbit
// "RAT", // Rat
// "RAT2", // Rat
// "SQUIRR", // Squirrel
// "X#WDOE", // White Doe
