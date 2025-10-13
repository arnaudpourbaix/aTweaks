import { ImmunityName } from "../../config/immunity-name";
import { MonsterItemIconEnum } from "../../config/item";
import { JEWEL_SLOTS } from "../model/constants";
import { RawEffect } from "../model/raw/effect";
import { RawItem } from "../model/raw/item";

export const createTraitItem = ({
  file,
  name,
  description,
  immunities,
  effects,
}: {
  file: string;
  name: string;
  description?: string[];
  immunities?: ImmunityName[];
  effects?: RawEffect[];
}): RawItem => {
  const stringRef = `${name} traits`;
  if (description) {
    description.unshift(stringRef, "");
  }
  if (effects) {
    for (const effect of effects) {
      effect.global = true;
    }
  }
  const item: RawItem = {
    file,
    stringRef,
    description,
    effects,
    immunities,
    equippedSlot: JEWEL_SLOTS,
    category: "Rings",
    icon: MonsterItemIconEnum.Traits,
  };
  return item;
};
