import { MonsterItemIconEnum } from "../../config/item";
import creatureFactory from "../../src/factories/creature.factory";
import {
  AbilityDamageTypeEnum,
  ItemAbilityFlagEnum,
  ItemAbilityTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";
import { petrification2e } from "./petrification";

const cre = creatureFactory.create({
  monster: MonsterEnum.LesserBasilisk,
  family: MonsterFamilyEnum.Basilisk,
  name: "monster.basilisk.lesser",
  files: ["BASILL", "BASILLSU", "BPBASL01"],
  data: {
    level1: 6,
    bonusHp: 1,
    strength: 16,
    dexterity: 8,
    constitution: 15,
    intelligence: 2,
    wisdom: 8,
    charisma: 7,
    ac: 4,
    apr: 1,
    xpv: 1400,
    alignment: "NEUTRAL",
    morale: 12,
    general: "MONSTER",
    race: "BASILISK",
    class: "BASILISK",
    gender: "NIETHER",
    size: "Medium",
  },
});
export const BASILISK_LESSER = cre;

cre.setAdditionalData({
  movement: { value: 6 },
  immunities: ["magicalBeast"],
  removeItems: ["BASILL1", "BASILL2"],
  removeScripts: ["LBASILSK"],
});

cre.addWeapon({
  weapon: {
    stringRef: "monster.basilisk.weapon.jaws",
    equippedSlot: ["WEAPON1"],
    icon: MonsterItemIconEnum.Jaws,
    header: {
      type: ItemAbilityTypeEnum.Melee,
      diceThrown: 1,
      diceSize: 10,
      damageType: AbilityDamageTypeEnum.Piercing,
      speed: 5,
      abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
    },
  },
});

export const petrificationSpell = cre.addSpell(petrification2e);

cre.setBehavior({
  abilities: [petrificationSpell.ability!],
});

cre.setAdjustments([{ files: ["BASILLSU"], summon: true }]);
