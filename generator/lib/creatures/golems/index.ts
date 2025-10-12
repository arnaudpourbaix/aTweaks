import { RawCreature } from "../../src/model/raw/creature";
import { GOLEM_BONE } from "./bone";
import { GOLEM_CLAY } from "./clay";
import { GOLEM_FLESH } from "./flesh";
import { GOLEM_JUGGERNAUT } from "./juggernaut";
import { GOLEM_STONE } from "./stone";

export const Golems: RawCreature[] = [
  GOLEM_FLESH,
  GOLEM_CLAY,
  GOLEM_STONE,
  // GOLEM_IRON, // None in BG1 (unfinished work)
  GOLEM_BONE,
  GOLEM_JUGGERNAUT,
];
