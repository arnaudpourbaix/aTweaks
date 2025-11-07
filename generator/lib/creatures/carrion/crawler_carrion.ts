import { MonsterItemIconEnum } from "../../config/item";
import creatureFactory from "../../src/factories/creature.factory";
import effectFactory from "../../src/factories/effect.factory";
import {
  AbilityDamageTypeEnum,
  ItemAbilityFlagEnum,
  ItemAbilityTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

export const createCarrionCrawler = () => {
  const carrionCrawler = creatureFactory.create({
    monster: MonsterEnum.CarrionCrawler,
    family: MonsterFamilyEnum.Carrion,
    name: "monster.carrionCrawler.name",
    files: [
      "BDCCRAW1",
      "BPCRCW01",
      "CARRIO",
      "CRYPTCRA",
      "BDCRAWMU",
      "BDMCARRI",
      "CARRIOSU",
    ],
    data: {
      level1: 3,
      bonusHp: 1,
      strength: 14,
      dexterity: 13,
      constitution: 16,
      intelligence: 1,
      wisdom: 12,
      charisma: 5,
      ac: 3,
      apr: 8,
      alignment: "NEUTRAL",
      morale: 10,
      general: "MONSTER",
      race: "CARRIONCRAWLER",
      class: "CARRIONCRAWLER",
      gender: "NIETHER",
      size: "Large",
      xpv: 420,
    },
  });
  carrionCrawler.setAdditionalData({
    movement: { value: 12 },
    removeItems: ["CARRIO1"],
    removeScripts: ["ccrawler"],
  });
  carrionCrawler.addWeapon({
    weapon: {
      stringRef: "monster.carrionCrawler.weapon",
      icon: MonsterItemIconEnum.Jelly,
      equippedSlot: ["WEAPON1"],
      header: {
        type: ItemAbilityTypeEnum.Melee,
        diceThrown: 1,
        diceSize: 2,
        damageType: AbilityDamageTypeEnum.Piercing,
        speed: 3,
        abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
        effects: effectFactory.paralyze({ duration: 42 }),
      },
    },
  });
  carrionCrawler.setAttack({
    targetPriorities: [{ status: ["Able"] }],
  });
  carrionCrawler.setAdjustments([
    { files: ["BDCCRAW1"], additionalData: { scriptLocation: "None" } },
    { files: ["CARRIOSU"], summon: true },
    { files: ["CRYPTCRA"], data: { level1: 6, thac0: 9, xpv: 650 } },
  ]);
  carrionCrawler.validate();
  return [carrionCrawler];
};
