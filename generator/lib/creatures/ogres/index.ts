import { RawCreature } from "../../src/model/raw/creature";
import { OGRE } from "../minotaur";
import { OGRE_BERSERKER } from "./ogre_berserker";
import { OGRE_HALF } from "./ogre_half";
import { OGRE_MAGE } from "./ogre_mage";
import { OGRE_OGRILLON } from "./ogre_ogrillon";
import { OGRE_SHAMAN } from "./ogre_shaman";

export const Ogres: RawCreature[] = [
  OGRE_OGRILLON,
  OGRE_HALF,
  OGRE,
  OGRE_SHAMAN,
  OGRE_BERSERKER,
  OGRE_MAGE,
];
