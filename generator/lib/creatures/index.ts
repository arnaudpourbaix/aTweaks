import { CreatureFamily } from "../src/model/creature/family";
import { createAnkhegs } from "./ankheg/ankheg";
import { createBasilisks } from "./basilisks/basilisk";
import { createBears } from "./bears/bear";
import { createCats } from "./cats/cats";
import { createConstructs } from "./constructs/constructs";
import { createCarrionCrawlers } from "./crawler/crawler";
import { createDogs } from "./dogs/dog";
import { createFeys } from "./feys/feys";

export const familyFactories: (() => CreatureFamily)[] = [
  createAnkhegs,
  createBasilisks,
  createBears,
  createCarrionCrawlers,
  createCats,
  createConstructs,
  createDogs,
  createFeys,
  //   // ...Golems,
  //   // ...Ogres,
  //   // ...Plants,
  //   // ...Slimes,
  //   // ...Spiders,
  //   // ...Wolves,
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
