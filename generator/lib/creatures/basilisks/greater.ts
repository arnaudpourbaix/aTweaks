import { MonsterItemIconEnum } from "../../config/item";
import creatureFactory from "../../src/factories/creature.factory";
import {
  AbilityDamageTypeEnum,
  EffectIDSFileEnum,
  EffectTimingEnum,
  EffectVisualEffectLocationEnum,
  ItemAbilityFlagEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  SaveTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import {
  AreaProjectileEnum,
  ParticleColorEnum,
} from "../../src/model/spell-item/projectile";
import poisonService from "../../src/services/effects/poison.service";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";
import { petrificationAbility, petrificationSpell } from "./lesser";
import { petrification2e } from "./petrification";

const cre = creatureFactory.create({
  monster: MonsterEnum.GreaterBasilisk,
  family: MonsterFamilyEnum.Basilisk,
  name: "monster.basilisk.greater",
  files: [
    "AC#BASGR",
    "BASILG",
    "BASILGSU",
    "BASILMUT",
    "BASILNAD",
    "BD302BAS",
    "BPBASG01",
  ],
  data: {
    level1: 10,
    strength: 20,
    dexterity: 8,
    constitution: 19,
    intelligence: 7,
    wisdom: 12,
    charisma: 11,
    ac: 2,
    apr: 3,
    xpv: 7000,
    alignment: "NEUTRAL",
    morale: 16,
    general: "MONSTER",
    race: "BASILISK",
    class: "BASILISK_GREATER",
    gender: "NIETHER",
    size: "Large",
  },
});
export const BASILISK_GREATER = cre;

cre.setAdditionalData({
  movement: { value: 6 },
  immunities: ["magicalBeast"],
  removeScripts: ["GBASILSK"],
  removeItems: ["BASILG1", "BASILG2", "BASILG3"],
  memorizedSpells: [{ file: petrificationSpell.file, memorizedCount: 1 }],
});

cre.addWeapon({
  weapon: {
    stringRef: "monster.basilisk.weapon.claws",
    equippedSlot: ["WEAPON1"],
    icon: MonsterItemIconEnum.Wolf,
    header: {
      type: ItemAbilityTypeEnum.Melee,
      diceThrown: 1,
      diceSize: 6,
      damageType: AbilityDamageTypeEnum.Slashing,
      speed: 5,
      abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
      effects: poisonService.getEffects({ poisonType: "K", saveBonus: 4 }),
    },
  },
});

cre.addWeapon({
  weapon: {
    stringRef: "monster.basilisk.weapon.jaws",
    equippedSlot: ["SHIELD"],
    icon: MonsterItemIconEnum.Jaws,
    header: {
      type: ItemAbilityTypeEnum.Melee,
      diceThrown: 2,
      diceSize: 8,
      damageType: AbilityDamageTypeEnum.Piercing,
      speed: 5,
      abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
    },
  },
  castSpell: {
    spell: {
      name: "monster.basilisk.foulBreath.name",
      description: "monster.basilisk.foulBreath.description",
      secondaryType: ItemAbilitySecondaryTypeEnum.OffensiveDamage,
      headers: [
        {
          type: ItemAbilityTypeEnum.Ranged,
          projectile: {
            copyFromFile: "dvstink",
            name: "Basilisk foul breath",
            particleColor: ParticleColorEnum.Green,
            areaEffectInfo: {
              areaProjectileFlags: [AreaProjectileEnum.AffectOnlyEnemies],
              explosionDelay: 12,
              triggerCount: 6,
              triggerRadius: 64,
              areaOfEffect: 64,
            },
          },
          range: 5,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          effects: [
            {
              opcode: EffectTypeEnum.Slay,
              idsFile: EffectIDSFileEnum.EA,
              idsEntry: "ANYONE",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
              saveBonus: 2,
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "EFF_P88",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
              saveBonus: 2,
            },
            {
              opcode: EffectTypeEnum.PlayVisualEffect,
              playWhere: EffectVisualEffectLocationEnum.OverTargetUnattached,
              resource: "SPFINGER",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
              saveBonus: 2,
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
  abilities: [petrificationAbility],
});

cre.setAdjustments([{ files: ["BASILGSU"], summon: true }]);
