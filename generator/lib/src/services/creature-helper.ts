import { ImmunityName } from "../../config/immunity-name";
import { MonsterItemIconEnum } from "../../config/item";
import { JEWEL_SLOTS } from "../model/constants";
import { RawEffect } from "../model/raw/effect";
import { RawItem } from "../model/raw/item";

export const createTraitItem = ({
  file,
  name,
  immunities,
  effects,
}: {
  file: string;
  name: string;
  immunities?: ImmunityName[];
  effects?: RawEffect[];
}): RawItem => {
  const item: RawItem = {
    file,
    stringRef: `${name} traits`,
    effects,
    immunities,
    equippedSlot: JEWEL_SLOTS,
    category: "Rings",
    icon: MonsterItemIconEnum.Traits,
  };
  return item;
};
