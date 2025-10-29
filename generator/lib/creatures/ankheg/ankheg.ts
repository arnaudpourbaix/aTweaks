import { MonsterItemIconEnum } from "../../config/item";
import CreatureFactory from "../../src/factories/creature.factory";
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
import effectService from "../../src/services/effects/effect.service";
import translationService from "../../src/services/translation.service";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

const cre = CreatureFactory.create({
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
    movement: 6,
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
export const ANKHEG = cre;

cre.setAdditionalData({
  removeScripts: ["ANKHEG"],
  removeItems: ["ANKHEG1", "ANKHEG2"],
});

cre.addWeapon({
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
            ...effectService.getDamageOverTime(4, {
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

const stream = cre.addWeapon({
  weapon: {
    stringRef: "monster.ankheg.enzymeStream.name",
    equippedSlot: ["WEAPON2"],
    icon: "SPWI211B",
    header: {
      type: ItemAbilityTypeEnum.Ranged,
      range: 30,
      speed: 3,
      bonusToHit: 20,
      projectile: "acidblob",
    },
  },
  castSpell: {
    remove: true,
    spell: {
      memorizedCount: 1,
      name: "monster.ankheg.enzymeStream.name",
      description: "monster.ankheg.enzymeStream.description",
      secondaryType: ItemAbilitySecondaryTypeEnum.OffensiveDamage,
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
    },
  },
});

cre.setBehavior({
  tracking: true,
  combatWalk: true,
  abilities: [
    {
      name: translationService.t.monster.ankheg.enzymeStream.name,
      disableInterrupt: true,
      target: { name: "PCsPreferringWeak", random: true },
      triggers: [
        { name: "HPPercentLT", params: ["Myself", 50] },
        { name: "HaveSpellRES", params: [stream.file] }, //FIXME: stream is item instead of spell
      ],
      actionsAfter: [
        { name: "SelectWeaponAbility", params: ["SLOT_WEAPON1", 0] },
        { name: "AttackOneRound", params: ["LastSeenBy"] },
      ],
      range: 30,
    },
  ],
});

cre.setAttack({
  // actions: [{ weaponSlot: "SLOT_WEAPON", disableInterrupt: true }],
  // grab: {
  //   file: grab,
  //   weaponFile: mainWeapon,
  //   duration: 18,
  // },
});

//   abilities: [
//     {
//       name: t.monster.ankheg.enzymeStream.name,
//       disableInterrupt: true,
//       target: { name: "PCsPreferringWeak", random: true },
//       triggers: [
//         { name: "HPPercentLT", params: ["Myself", 50] },
//         { name: "HaveSpellRES", params: [acidicEnzyme] },
//       ],
//       actionsAfter: [
//         { name: "SelectWeaponAbility", params: ["SLOT_WEAPON1", 0] },
//         { name: "AttackOneRound", params: ["LastSeenBy"] },
//       ],
//       range: 30,
//     },
//   ],
//   adjustments: [
//     { files: ["BDANKH01"], data: { level1: 10, xpv: 1400 } },
//     { files: ["BDANKHSU"], summon: true },
//   ],
// };
