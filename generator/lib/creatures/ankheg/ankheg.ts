import { MonsterItemIconEnum } from "../../config/item";
import CreatureFactory from "../../src/factories/cre.factory";
import {
  AbilityDamageTypeEnum,
  EffectCastSpellTypeEnum,
  EffectDamageTypeEnum,
  EffectFlagsEnum,
  EffectTargetEnum,
  EffectTimingEnum,
  ItemAbilityFlagEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTypeEnum,
  PortraitIconEnum,
  SaveTypeEnum,
} from "../../src/model/final/effect.enums";
import { EffectTypeEnum } from "../../src/model/final/effect.type";
import { bafFile, file } from "../../src/services/misc.func";
import { t } from "../../src/translations/i18n";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

// Creature Id
// const id = MonsterEnum.Ankheg;
// // Script
// const script = bafFile(id);
// // Spells
// const digestiveEnzyme = file(1, id);
// const acidicEnzyme = file(2, id);
// const grab = file(3, id);
// // Items
// const mainWeapon = file(1, id);
// const rangedWeapon = file(2, id);

const cre = CreatureFactory.create({
  monster: MonsterEnum.Ankheg,
  family: MonsterFamilyEnum.Ankheg,
  name: "monster.ankheg.weapon",
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
  additionalData: {
    removeScripts: ["ANKHEG"],
    removeItems: ["ANKHEG1", "ANKHEG2"],
  },
  behavior: {
    tracking: true,
    combatWalk: true,
    abilities: [
      {
        name: t.monster.ankheg.enzymeStream.name,
        disableInterrupt: true,
        target: { name: "PCsPreferringWeak", random: true },
        triggers: [
          { name: "HPPercentLT", params: ["Myself", 50] },
          { name: "HaveSpellRES", params: [acidicEnzyme] },
        ],
        actionsAfter: [
          { name: "SelectWeaponAbility", params: ["SLOT_WEAPON1", 0] },
          { name: "AttackOneRound", params: ["LastSeenBy"] },
        ],
        range: 30,
      },
    ],
  },
});

CreatureFactory.setAttack(cre, {
  actions: [{ weaponSlot: "SLOT_WEAPON", disableInterrupt: true }],
  grab: {
    file: grab,
    weaponFile: mainWeapon,
    duration: 18,
  },
});

const enzyme = CreatureFactory.addSpell(cre, {
  stringRef: "monster.ankheg.digestiveEnzyme.name",
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
        {
          opcode: EffectTypeEnum.Damage,
          type: EffectDamageTypeEnum.Acid,
          diceThrown: 1,
          diceSize: 4,
        },
        {
          opcode: EffectTypeEnum.Damage,
          timing: EffectTimingEnum.DelayPermanent,
          duration: 6,
          type: EffectDamageTypeEnum.Acid,
          diceThrown: 1,
          diceSize: 4,
        },
        {
          opcode: EffectTypeEnum.Damage,
          timing: EffectTimingEnum.DelayPermanent,
          duration: 12,
          type: EffectDamageTypeEnum.Acid,
          diceThrown: 1,
          diceSize: 4,
        },
        {
          opcode: EffectTypeEnum.Damage,
          timing: EffectTimingEnum.DelayPermanent,
          duration: 18,
          type: EffectDamageTypeEnum.Acid,
          diceThrown: 1,
          diceSize: 4,
        },
        {
          opcode: EffectTypeEnum.ProtectionFromSpell,
          resource: digestiveEnzyme,
          duration: 24,
          timing: EffectTimingEnum.InstantLimited,
        },
      ],
    },
  ],
});
CreatureFactory.addWeapon(cre, {
  stringRef: "monster.ankheg.weapon",
  equippedSlot: ["WEAPON1"],
  icon: MonsterItemIconEnum.Wolf,
  header: {
    type: ItemAbilityTypeEnum.Melee,
    diceThrown: 3,
    diceSize: 6,
    damageType: AbilityDamageTypeEnum.Crushing,
    speed: 3,
    abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
    effects: [
      {
        opcode: EffectTypeEnum.CastSpell,
        type: EffectCastSpellTypeEnum.CastInstantlyAtCasterLevel,
        resource: enzyme.file,
      },
    ],
  },
});

const stream = CreatureFactory.addSpell(cre, {
  memorizedCount: 1,
  stringRef: "monster.ankheg.enzymeStream.name",
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
});
CreatureFactory.addWeapon(cre, {
  stringRef: "monster.ankheg.enzymeStream.name",
  equippedSlot: ["WEAPON2"],
  icon: "SPWI211B",
  header: {
    type: ItemAbilityTypeEnum.Ranged,
    range: 30,
    speed: 3,
    bonusToHit: 20,
    projectile: "acidblob",
    effects: [
      {
        opcode: EffectTypeEnum.CastSpell,
        type: EffectCastSpellTypeEnum.CastInstantlyAtCasterLevel,
        resource: stream.file,
      },
      {
        opcode: EffectTypeEnum.RemoveSpell,
        target: EffectTargetEnum.Self,
        resource: stream.file,
      },
    ],
  },
});

// export const ANKHEG: RawCreature = {
//   name: "monster.ankheg.name",
//   bafFile: `lib/pnp-monster/ankheg/${script}`,
//   tpaFile: "lib/pnp-monster/ankheg/main",
//   tracking: true,
//   combatWalk: true,
//   data: {
//     level1: 8,
//     strength: 17,
//     dexterity: 11,
//     constitution: 13,
//     intelligence: 1,
//     wisdom: 13,
//     charisma: 6,
//     movement: 6,
//     ac: 2,
//     apr: 1,
//     xpv: 975,
//     alignment: "NEUTRAL",
//     morale: 9,
//     moraleBreak: 4,
//     moraleRecovery: 15,
//     general: "MONSTER",
//     race: "ANKHEG",
//     class: "ANKHEG",
//     gender: "NIETHER",
//     size: "Huge",
//   },
//   additionalData: {
//     removeScripts: ["ANKHEG"],
//     removeItems: ["ANKHEG1", "ANKHEG2"],
//   },
//   attack: {
//     actions: [{ weaponSlot: "SLOT_WEAPON", disableInterrupt: true }],
//     grab: {
//       file: grab,
//       weaponFile: mainWeapon,
//       duration: 18,
//     },
//   },
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
//   items: [
//     {
//       file: mainWeapon,
//       stringRef: "monster.ankheg.weapon",
//       equippedSlot: "WEAPON1",
//       type: "Melee",
//       icon: MonsterItemIconEnum.Wolf,
//       diceThrown: 3,
//       diceSize: 6,
//       damageType: "Crushing",
//       speed: 3,
//       abilityFlags: ["AddStrengthBonus"],
//       effects: [
//         {
//           opcode: "CastSpell",
//           resource: digestiveEnzyme,
//           type: "CastInstantlyAtCasterLevel",
//         },
//       ],
//     },
//     {
//       file: rangedWeapon,
//       stringRef: "monster.ankheg.enzymeStream.name",
//       equippedSlot: "WEAPON2",
//       type: "Ranged",
//       icon: "SPWI211B",
//       range: 30,
//       speed: 3,
//       bonusToHit: 20,
//       projectile: "acidblob",
//       effects: [
//         {
//           opcode: "CastSpell",
//           type: "CastInstantlyAtCasterLevel",
//           resource: acidicEnzyme,
//         },
//         { opcode: "RemoveSpell", target: "Self", resource: acidicEnzyme },
//       ],
//     },
//   ],
//   spells: [
//     {
//       file: digestiveEnzyme,
//       stringRef: "monster.ankheg.digestiveEnzyme.name",
//       description: "monster.ankheg.digestiveEnzyme.description",
//       secondaryType: "OffensiveDamage",
//       headers: [
//         {
//           type: "Melee",
//           range: 5,
//           effects: [
//             { opcode: "DisplayPortraitIcon", icon: "Acid", duration: 24 },
//             { opcode: "Damage", type: "Acid", diceThrown: 1, diceSize: 4 },
//             {
//               opcode: "Damage",
//               timing: "DelayPermanent",
//               duration: 6,
//               type: "Acid",
//               diceThrown: 1,
//               diceSize: 4,
//             },
//             {
//               opcode: "Damage",
//               timing: "DelayPermanent",
//               duration: 12,
//               type: "Acid",
//               diceThrown: 1,
//               diceSize: 4,
//             },
//             {
//               opcode: "Damage",
//               timing: "DelayPermanent",
//               duration: 18,
//               type: "Acid",
//               diceThrown: 1,
//               diceSize: 4,
//             },
//             {
//               opcode: "ProtectionFromSpell",
//               resource: digestiveEnzyme,
//               duration: 24,
//               timing: "InstantLimited",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       file: acidicEnzyme,
//       memorizedCount: 1,
//       stringRef: "monster.ankheg.enzymeStream.name",
//       description: "monster.ankheg.enzymeStream.description",
//       secondaryType: "OffensiveDamage",
//       headers: [
//         {
//           type: "Ranged",
//           range: 30,
//           speed: 3,
//           projectile: "acidblob",
//           effects: [
//             {
//               opcode: "Damage",
//               type: "Acid",
//               diceThrown: 8,
//               diceSize: 4,
//               saveTypes: ["ParalyzePoisonDeath"],
//               flags: ["SaveForHalf"],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   files: [
//     "BDNEO",
//     "ANKHEG",
//     "ANKHEGF",
//     "ANKHEGG",
//     "ANKHEGQ",
//     "BDANKH01",
//     "BDANKHEG",
//     "BDANKHSU",
//     "BPANKHE1",
//     "WIANKHE1",
//   ],
//   adjustments: [
//     { files: ["BDANKH01"], data: { level1: 10, xpv: 1400 } },
//     { files: ["BDANKHSU"], summon: true },
//   ],
// };
