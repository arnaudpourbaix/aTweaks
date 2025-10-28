import { ImmunityName } from "../../config/immunity-config";
import { MonsterItemIconEnum } from "../../config/item";
import { JEWEL_SLOTS } from "../model/creature/item";
import { Effect } from "../model/spell-item/effect";
import { Item } from "../model/spell-item/spell-item";

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
  effects?: Effect[];
}): Item => {
  const stringRef = `${name} traits`;
  if (description) {
    description.unshift(stringRef, "");
  }
  if (effects) {
    for (const effect of effects) {
      effect.global = true;
    }
  }
  const item: Item = {
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
