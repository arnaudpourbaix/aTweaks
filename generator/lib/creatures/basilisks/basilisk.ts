import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import creatureFactory from "../../src/factories/creature.factory";
import effectFactory from "../../src/factories/effect.factory";
import { CreatureFamily } from "../../src/model/creature/family";
import {
  AbilityDamageTypeEnum,
  EffectCastSpellTypeEnum,
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
  ProjectileAnimationEnum,
  ProjectileExplosionEffectEnum,
  ProjectileTypeEnum,
} from "../../src/model/spell-item/projectile";
import poisonService from "../../src/services/effects/poison.service";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

enum Ids {
  Projectile,
  Petrification,
}

class BasiliskFamily extends CreatureFamily {
  constructor() {
    super(MonsterFamilyEnum.Basilisk);
    this.createPetrificationProjectile();
    this.createPetrification2e();
    this.addCreature(this.lesser());
    this.addCreature(this.greater());
  }

  /**
   * Lesser Basilisk
   */
  private lesser() {
    const lesser = creatureFactory.create({
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
    lesser.setAdditionalData({
      movement: { value: 6 },
      immunities: ["magicalBeast"],
      removeItems: ["BASILL1", "BASILL2"],
      memorizedSpells: [
        { file: this.spell(Ids.Petrification).file, memorizedCount: 1 },
      ],
      removeScripts: ["LBASILSK"],
      scriptLocation: "Race",
    });
    lesser.addWeapon({
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
    lesser.setBehavior({
      abilities: [this.ability(Ids.Petrification)],
    });
    lesser.setAdjustments([{ files: ["BASILLSU"], summon: true }]);
    return lesser;
  }

  /**
   * Greater Basilisk
   */
  private greater() {
    const greater = creatureFactory.create({
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
    greater.setAdditionalData({
      movement: { value: 6 },
      immunities: ["magicalBeast"],
      removeScripts: ["GBASILSK"],
      removeItems: ["BASILG1", "BASILG2", "BASILG3"],
      memorizedSpells: [
        { file: this.spell(Ids.Petrification).file, memorizedCount: 1 },
      ],
      scriptLocation: "Race",
    });
    greater.addWeapon({
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
    greater.addWeapon({
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
                  playWhere:
                    EffectVisualEffectLocationEnum.OverTargetUnattached,
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
    greater.setBehavior({
      abilities: [this.ability(Ids.Petrification)],
    });
    greater.setAdjustments([{ files: ["BASILGSU"], summon: true }]);
    return greater;
  }

  private createPetrificationProjectile() {
    return this.addProjectile({
      copyFromFile: "gaze",
      name: "Basilisk petrifying gaze",
      id: Ids.Projectile,
      type: ProjectileTypeEnum.AreaOfEffect,
      areaEffectInfo: {
        areaProjectileFlags: [
          AreaProjectileEnum.AffectOnlyEnemies,
          AreaProjectileEnum.Coneshaped,
        ],
        triggerRadius: 255,
        areaOfEffect: 255,
        coneWidth: 60,
        fragmentAnimation: ProjectileAnimationEnum.NULL_ANIMATION,
        explosionEffect: ProjectileExplosionEffectEnum.NONE,
      },
    });
  }

  /**
   * Petrification (2e)
   */
  private createPetrification2e() {
    const petrificationSave: { saveTypes: SaveTypeEnum[]; saveBonus: number } =
      {
        saveTypes: [SaveTypeEnum.PetrifyPolymorph],
        saveBonus: -4,
      };
    return this.addSpell({
      name: "monster.basilisk.petrifyingGaze.name",
      description: "monster.basilisk.petrifyingGaze.description",
      id: Ids.Petrification,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      options: {
        renew: 1,
      },
      icon: SPELLS.FleshToStone,
      headers: [
        {
          type: ItemAbilityTypeEnum.Ranged,
          projectile: this.projectile(Ids.Projectile).file,
          range: 30,
          effects: [
            {
              opcode: EffectTypeEnum.Petrification,
              ...petrificationSave,
            },
            {
              opcode: EffectTypeEnum.DisplayString,
              stringRef: "monster.basilisk.petrifyingGaze.petrified",
              ...petrificationSave,
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "MISC_06B",
              ...petrificationSave,
            },
            {
              opcode: EffectTypeEnum.PlayVisualEffect,
              playWhere: EffectVisualEffectLocationEnum.OverTargetUnattached,
              resource: "SPFLESHS.VVC",
              ...petrificationSave,
            },
            {
              opcode: EffectTypeEnum.CreatureRGBColorFade,
              color: { blue: 120, red: 120, green: 120 },
              fadeSpeed: 25,
              ...petrificationSave,
            },
          ],
        },
      ],
      ability: {
        targets: [
          {
            name: "NearestEnemies",
            randomOrder: true,
          },
        ],
        spell: {
          type: "force",
        },
      },
    });
  }

  /**
   * Petrification (5e)
   */
  private createPetrification5e() {
    const petrificationSave: { saveTypes: SaveTypeEnum[]; saveBonus: number } =
      {
        saveTypes: [SaveTypeEnum.PetrifyPolymorph],
        saveBonus: -4,
      };
    const technical = this.addSpell({
      name: "monster.basilisk.petrifyingGaze.name",
      description: "monster.basilisk.petrifyingGaze.description5e",
      doc: false,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      icon: SPELLS.FleshToStone,
      headers: [
        {
          type: ItemAbilityTypeEnum.Ranged,
          projectile: this.projectile(Ids.Projectile).file,
          range: 30,
          effects: [
            {
              opcode: EffectTypeEnum.Petrification,
              timing: EffectTimingEnum.InstantPermanent,
              ...petrificationSave,
            },
            {
              opcode: EffectTypeEnum.DisplayString,
              stringRef: "monster.basilisk.petrifyingGaze.petrified",
              timing: EffectTimingEnum.InstantPermanent,
              ...petrificationSave,
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "MISC_06B",
              timing: EffectTimingEnum.InstantPermanent,
              ...petrificationSave,
            },
            {
              opcode: EffectTypeEnum.PlayVisualEffect,
              playWhere: EffectVisualEffectLocationEnum.OverTargetUnattached,
              resource: "SPFLESHS.VVC",
              timing: EffectTimingEnum.InstantPermanent,
              ...petrificationSave,
            },
            {
              opcode: EffectTypeEnum.CreatureRGBColorFade,
              color: { blue: 120, red: 120, green: 120 },
              fadeSpeed: 25,
              timing: EffectTimingEnum.InstantPermanent,
              ...petrificationSave,
            },
          ],
        },
      ],
    });
    return this.addSpell({
      name: "monster.basilisk.petrifyingGaze.name",
      description: "monster.basilisk.petrifyingGaze.description5e",
      id: Ids.Petrification,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      options: {
        renew: 1,
      },
      icon: SPELLS.FleshToStone,
      headers: [
        {
          type: ItemAbilityTypeEnum.Ranged,
          projectile: this.projectile(Ids.Projectile).file,
          range: 30,
          effects: [
            {
              opcode: EffectTypeEnum.DisplayString,
              stringRef: "monster.basilisk.petrifyingGaze.turningToStone",
              ...petrificationSave,
            },
            ...effectFactory.restrained({ duration: 12, ...petrificationSave }),
            {
              opcode: EffectTypeEnum.CastSpell,
              timing: EffectTimingEnum.DelayLimited,
              duration: 12,
              type: EffectCastSpellTypeEnum.CastInstantlyAtCasterLevel,
              resource: technical.file,
              ...petrificationSave,
            },
            {
              opcode: EffectTypeEnum.ProtectionFromSpell,
              timing: EffectTimingEnum.DelayLimited,
              duration: 12,
              ...petrificationSave,
            },
          ],
        },
      ],
      ability: {
        targets: [
          {
            name: "NearestEnemies",
            randomOrder: true,
          },
        ],
        spell: {
          excludeStateChecks: ["STATE_SLOWED"],
          excludeStatsChecks: ["HELD"],
          type: "force",
        },
      },
    });
  }
}

export const createBasilisks = () => new BasiliskFamily();
