import { RawCreature } from "../src/model/raw/creature";
import { ANKHEG } from "./ankheg";
import { BASILISK_GREATER } from "./basilisk_greater";
import { BASILISK_LESSER } from "./basilisk_lesser";
import { BEAR_BLACK } from "./bear_black";
import { BEAR_BROWN } from "./bear_brown";
import { BEAR_CAVE } from "./bear_cave";
import { BEAR_POLAR_KALDRAN } from "./bear_kaldran";
import { BEAR_POLAR } from "./bear_polar";
import { HELLCAT } from "./cat_hell";
import { CAT_JAGUAR } from "./cat_jaguar";
import { CAT_LEOPARD } from "./cat_leopard";
import { CAT_LION } from "./cat_lion";
import { CAT_LION_MOUNTAIN } from "./cat_mountain_lion";
import { CARRION_CRAWLER } from "./crawler_carrion";
import { DISPLACER_BEAST } from "./displacer_beast";
import { DOG_BLINK } from "./dog_blink";
import { SPECTRAL_HOUND } from "./dog_spectral_hound";
import { DOG_WAR } from "./dog_war";
import { DOG_WILD } from "./dog_wild";
import { DOOM_GUARD } from "./doom_guard";
import { FEY_DRYAD } from "./fey_dryad";
import { FEY_HAMADRYAD } from "./fey_hamadryad";
import { FEY_NYMPH } from "./fey_nymph";
import { FEY_SIRINE } from "./fey_sirine";
import { GOLEM_BONE } from "./golem_bone";
import { GOLEM_CLAY } from "./golem_clay";
import { GOLEM_FLESH } from "./golem_flesh";
import { GOLEM_JUGGERNAUT } from "./golem_juggernaut";
import { GOLEM_STONE } from "./golem_stone";
import { HORROR_HELMED } from "./horror_helmed";
import { OGRE } from "./ogre";
import { OGRE_BERSERKER } from "./ogre_berserker";
import { OGRE_HALF } from "./ogre_half";
import { OGRE_MAGE } from "./ogre_mage";
import { OGRE_OGRILLON } from "./ogre_ogrillon";
import { OGRE_SHAMAN } from "./ogre_shaman";
import { PLANT_TREANT } from "./plant_treant";
import { SLIME_BLACK_PUDDING } from "./slime_black_pudding";
import { SLIME_FISSION } from "./slime_fission";
import { SLIME_GRAY_OOZE } from "./slime_gray_ooze";
import { SLIME_GREEN } from "./slime_green";
import { SLIME_MUSTARD_JELLY } from "./slime_mustard_jelly";
import { SLIME_OCHRE_JELLY } from "./slime_ochre_jelly";
import { SLIME_OLIVE_CREATURE } from "./slime_olive_creature";
import { WOLF } from "./wolf";
import { WOLF_DIRE } from "./wolf_dire";
import { WOLF_DREAD } from "./wolf_dread";
import { WOLF_VAMPIRIC } from "./wolf_vampiric";
import { WOLF_WINTER } from "./wolf_winter";
import { WOLF_WORG } from "./wolf_worg";

const Basilisks: RawCreature[] = [BASILISK_GREATER, BASILISK_LESSER];

const Bears: RawCreature[] = [
  BEAR_BLACK,
  BEAR_BROWN,
  BEAR_CAVE,
  BEAR_POLAR,
  BEAR_POLAR_KALDRAN,
];

const Cats: RawCreature[] = [
  CAT_JAGUAR,
  CAT_LEOPARD,
  CAT_LION,
  CAT_LION_MOUNTAIN,
  // CAT_TIGER,
  HELLCAT,
  DISPLACER_BEAST,
];

const Dogs: RawCreature[] = [DOG_BLINK, DOG_WAR, DOG_WILD, SPECTRAL_HOUND];

const Wolves: RawCreature[] = [
  WOLF_DIRE,
  WOLF_DREAD,
  WOLF_VAMPIRIC,
  WOLF_WINTER,
  WOLF_WORG,
  WOLF,
];

const Golems: RawCreature[] = [
  GOLEM_FLESH,
  GOLEM_CLAY,
  GOLEM_STONE,
  // GOLEM_IRON, // None in BG1 (unfinished work)
  GOLEM_BONE,
  GOLEM_JUGGERNAUT,
];

const Ogres: RawCreature[] = [
  OGRE_OGRILLON,
  OGRE_HALF,
  OGRE,
  OGRE_SHAMAN,
  OGRE_BERSERKER,
  OGRE_MAGE,
];

const Feys: RawCreature[] = [FEY_DRYAD, FEY_HAMADRYAD, FEY_NYMPH, FEY_SIRINE];

const Slimes: RawCreature[] = [
  SLIME_MUSTARD_JELLY,
  SLIME_BLACK_PUDDING,
  SLIME_FISSION,
  SLIME_OCHRE_JELLY,
  SLIME_GRAY_OOZE,
  SLIME_GREEN,
  SLIME_OLIVE_CREATURE,
];

const Constructs: RawCreature[] = [HORROR_HELMED, DOOM_GUARD];

export const CREATURES: RawCreature[] = [
  ANKHEG,
  ...Basilisks,
  ...Bears,
  ...Cats,
  ...Dogs,
  ...Wolves,
  ...Golems,
  ...Constructs,
  ...Ogres,
  ...Feys,
  ...Slimes,
  CARRION_CRAWLER,
  PLANT_TREANT,
];

export const CREATURES_TEST: RawCreature[] = [...Ogres, ...Feys, PLANT_TREANT];

/*
"SHOAL", // Shoal the Nereid
"BDNEREID", // Nereid
"BDPWATER", // Nereid

"DEMSUC01", // Succubus
"NTINDFIG", // Succubus
"KIRINH", // Kirinhale

*/
