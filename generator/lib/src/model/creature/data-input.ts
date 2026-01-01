import { DeepPartialBy, WithRequired } from "../utility-types";
import { CreatureData, Level } from "./data";

export type InputCreatureData = DeepPartialBy<
  Omit<CreatureData, "movement" | "level1" | "level2" | "level3">,
  "proficiencies" | "immunities" | "script" | "items" | "spells" | "effects"
> & {
  movement?: number;
  level1?: Level | number;
  level2?: Level | number;
  level3?: Level | number;
};

export type InputMainCreatureData = WithRequired<
  InputCreatureData,
  "movement" | "level1"
>;
