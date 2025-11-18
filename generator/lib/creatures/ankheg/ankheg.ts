import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import CreatureFactory from "../../src/factories/creature.factory";
import effectFactory from "../../src/factories/effect.factory";
import {
  AbilityDamageTypeEnum,
  EffectDamageTypeEnum,
  EffectFlagsEnum,
  EffectTimingEnum,
  ItemAbilityFlagEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTypeEnum,
  PortraitIconEnum,
  SaveTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import translationService from "../../src/services/translation.service";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

export const createAnkheg = () => {
  const ankheg = CreatureFactory.create({
    monster: MonsterEnum.Ankheg,
    family: MonsterFamilyEnum.Ankheg,
    name: "monster.ankheg.name",
    files: [
      "BDNEO",
      "ANKHEG",
      "ANKHEGF",
      "ANKHEGG",
      "ANKHEGQ",
      "BDANKH01",
      "BDANKHEG",
      "BDANKHSU",
      "BPANKHE1",
      "WIANKHE1",
    ],
    data: {
      level1: 8,
      strength: 17,
      dexterity: 11,
      constitution: 13,
      intelligence: 1,
      wisdom: 13,
      charisma: 6,
      ac: 2,
      apr: 1,
      xpv: 975,
      alignment: "NEUTRAL",
      morale: 9,
      general: "MONSTER",
      race: "ANKHEG",
      class: "ANKHEG",
      gender: "NIETHER",
      size: "Huge",
    },
  });
  ankheg.setAdditionalData({
    movement: { value: 6 },
    immunities: ["magicalBeast"],
    removeScripts: ["ANKHEG"],
    removeItems: ["ANKHEG1", "ANKHEG2"],
    scriptLocation: "Race",
  });
  ankheg.addWeapon({
    weapon: {
      stringRef: "monster.ankheg.weapon",
      equippedSlot: ["WEAPON1"],
      icon: MonsterItemIconEnum.Wolf,
      header: {
        type: ItemAbilityTypeEnum.Melee,
        diceThrown: 3,
        diceSize: 6,
        damageType: AbilityDamageTypeEnum.Crushing,
        speed: 5,
        abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
      },
    },
    grab: { rounds: 3 },
    castSpell: {
      spell: {
        name: "monster.ankheg.digestiveEnzyme.name",
        description: "monster.ankheg.digestiveEnzyme.description",
        doc: false,
        secondaryType: ItemAbilitySecondaryTypeEnum.OffensiveDamage,
        headers: [
          {
            type: ItemAbilityTypeEnum.Melee,
            range: 5,
            effects: [
              {
                opcode: EffectTypeEnum.DisplayPortraitIcon,
                icon: PortraitIconEnum.Acid,
                duration: 24,
              },
              ...effectFactory.damageOverTime(4, {
                opcode: EffectTypeEnum.Damage,
                type: EffectDamageTypeEnum.Acid,
                diceThrown: 1,
                diceSize: 4,
              }),
              {
                opcode: EffectTypeEnum.ProtectionFromSpell,
                duration: 24,
                timing: EffectTimingEnum.InstantLimited,
              },
            ],
          },
        ],
      },
    },
  });
  const stream = ankheg.addSpell({
    memorizedCount: 1,
    name: "monster.ankheg.enzymeStream.name",
    description: "monster.ankheg.enzymeStream.description",
    secondaryType: ItemAbilitySecondaryTypeEnum.OffensiveDamage,
    icon: SPELLS.MelfAcidArrow,
    headers: [
      {
        type: ItemAbilityTypeEnum.Ranged,
        range: 30,
        speed: 3,
        projectile: "acidblob",
        effects: [
          {
            opcode: EffectTypeEnum.Damage,
            type: EffectDamageTypeEnum.Acid,
            diceThrown: 8,
            diceSize: 4,
            saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
            flags: [EffectFlagsEnum.SaveForHalf],
          },
        ],
      },
    ],
    ability: {
      disableInterrupt: true,
      spell: {
        type: "force",
        remove: true,
      },
      targets: [{ name: "PCsPreferringWeak", random: true }],
      triggers: [{ name: "HPPercentLT", params: ["Myself", 50] }],
      range: 30,
    },
  });
  ankheg.setAttack({
    actions: [{ disableInterrupt: true }],
  });
  ankheg.setBehavior({
    abilities: [stream.ability!],
  });
  ankheg.setAdjustments([
    { files: ["BDANKH01"], data: { level1: 10, xpv: 1400 } },
    { files: ["BDANKHSU"], summon: true },
  ]);
  ankheg.validate();
  return [ankheg];
};
