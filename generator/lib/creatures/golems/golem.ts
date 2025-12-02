import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import creatureFactory from "../../src/factories/creature.factory";
import effectFactory from "../../src/factories/effect.factory";
import { Creature } from "../../src/model/creature/creature";
import { CreatureFamily } from "../../src/model/creature/family";
import {
  AbilityDamageTypeEnum,
  EffectDamageTypeEnum,
  EffectFlagsEnum,
  EffectHasteTypeEnum,
  EffectIDSFileEnum,
  EffectStatisticModifierEnum,
  EffectTimingEnum,
  ItemAbilityFlagEnum,
  ItemAbilityLocationEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  LightingEffectEnum,
  LightingEffectTargetEnum,
  PortraitIconEnum,
  SaveTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import {
  AreaProjectileEnum,
  ParticleColorEnum,
} from "../../src/model/spell-item/projectile";
import { WeaponCastSpell } from "../../src/model/spell-item/spell-item";
import {
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../../src/model/spell-item/spell-protection";
import { StringRefUtils } from "../../src/services/utils/string-ref.utils";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

enum Ids {
  Charge,
  CloudOfPoisonousGas,
  Haste,
  HideousLaugh,
}

export class GolemFamily extends CreatureFamily {
  constructor() {
    super(MonsterFamilyEnum.Golem);
    this.createCharge();
    this.createHaste();
    this.createHideousLaugh();
    this.createCloudOfPoisonousGas();
    this.addCreature(this.flesh());
    this.addCreature(this.clay());
    this.addCreature(this.stone());
    this.addCreature(this.iron());
    this.addCreature(this.bone());
    this.addCreature(this.juggernaut());
  }

  /**
   * Flesh Golem
   */
  private flesh() {
    const flesh = creatureFactory.create({
      monster: MonsterEnum.FleshGolem,
      family: MonsterFamilyEnum.Golem,
      name: "monster.golem.name.flesh",
      files: ["BPGOFL01", "FGOLEM", "GOLEMF", "GOLEMF2", "TOMEGOL1"],
      data: {
        level1: 9,
        bonusHp: 0,
        strength: 19,
        dexterity: 9,
        constitution: 18,
        intelligence: 3,
        wisdom: 10,
        charisma: 5,
        ac: 9,
        apr: 2,
        xpv: 2000,
        alignment: "NEUTRAL",
        morale: 20,
        general: "GIANTHUMANOID",
        race: "GOLEM",
        class: "GOLEM_FLESH",
        gender: "NIETHER",
        size: "Large",
        modAnimation: "A7!GOLEM_FLESH_PST",
      },
    });
    flesh.setAdditionalData({
      movement: { value: 8 },
      immunities: ["construct"],
      removeItems: ["GOLFLE"],
    });
    flesh.addTrait({
      immunities: ["magic", "fire", "cold"],
      effects: [
        {
          opcode: EffectTypeEnum.ElectricityResistanceModifier,
          value: 125,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    this.createFists(flesh, 2, 8, AbilityDamageTypeEnum.Crushing);
    flesh.setBehavior({
      restHeal: true,
    });
    return flesh;
  }

  /**
   * Clay Golem
   */
  private clay() {
    const clay = creatureFactory.create({
      monster: MonsterEnum.ClayGolem,
      family: MonsterFamilyEnum.Golem,
      name: "monster.golem.name.clay",
      files: ["AC#FPCLG", "AC#FPCLY", "BPCLAY", "TOMEGOL2", "WICLAYGO"],
      data: {
        level1: 11,
        bonusHp: 0,
        strength: 20,
        dexterity: 9,
        constitution: 18,
        intelligence: 3,
        wisdom: 8,
        charisma: 1,
        ac: 7,
        apr: 1,
        xpv: 5000,
        alignment: "NEUTRAL",
        morale: 20,
        general: "GIANTHUMANOID",
        race: "GOLEM",
        class: "GOLEM_CLAY",
        gender: "NIETHER",
        size: "Large",
      },
    });
    clay.setAdditionalData({
      movement: { value: 7 },
      immunities: ["construct"],
      removeScripts: ["GOLCLY01", "BPFHT"],
      removeItems: ["GOLCLA", "RING95"],
      memorizedSpells: [
        {
          file: this.spell(Ids.Haste).file,
          memorizedCount: 1,
        },
      ],
    });
    clay.addTrait({
      immunities: [
        "magic",
        "normalWeapons",
        "slashingDamage",
        "piercingDamage",
        "missileDamage",
      ],
    });
    this.createFists(clay, 3, 10, AbilityDamageTypeEnum.Crushing);
    clay.setBehavior({
      restHeal: true,
      abilities: [this.ability(Ids.Haste)],
    });
    return clay;
  }

  /**
   * Stone Golem
   */
  private stone() {
    const stone = creatureFactory.create({
      monster: MonsterEnum.StoneGolem,
      family: MonsterFamilyEnum.Golem,
      name: "monster.golem.name.stone",
      files: ["BDGOLSTO", "BDMENGO", "NTGOLSTO", "TOMEGOL3", "WISTOGOL"],
      data: {
        level1: 14,
        bonusHp: 0,
        strength: 22,
        dexterity: 9,
        constitution: 20,
        intelligence: 3,
        wisdom: 11,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 8000,
        alignment: "NEUTRAL",
        morale: 20,
        general: "GIANTHUMANOID",
        race: "GOLEM",
        class: "GOLEM_STONE",
        gender: "NIETHER",
        size: "Large",
      },
    });
    stone.setAdditionalData({
      movement: { value: 6 },
      immunities: ["construct"],
      removeScripts: ["GOLSTO01"],
      removeItems: ["GOLSTO", "GOLSTONE", "IMMUNE2"],
      memorizedSpells: [{ file: SPELLS.Slow, memorizedCount: 1 }],
    });
    stone.addTrait({
      immunities: ["magic", "plusOneWeapons"],
    });
    this.createFists(stone, 3, 8, AbilityDamageTypeEnum.Crushing);
    stone.setBehavior({
      restHeal: true,
      abilities: [
        {
          preset: SPELLS.Slow,
          spell: {
            type: "reallyForce",
            selfTarget: true,
          },
          requireVocal: false,
          range: 10,
          timer: { name: "Slow", value: 12 },
        },
      ],
    });
    return stone;
  }

  /**
   * Iron Golem
   */
  private iron() {
    const iron = creatureFactory.create({
      monster: MonsterEnum.IronGolem,
      family: MonsterFamilyEnum.Golem,
      name: "monster.golem.name.iron",
      files: ["SHIRON"],
      data: {
        level1: 18,
        strength: 24,
        dexterity: 9,
        constitution: 20,
        intelligence: 3,
        wisdom: 11,
        charisma: 1,
        ac: 3,
        apr: 1,
        xpv: 13000,
        alignment: "NEUTRAL",
        morale: 20,
        general: "GIANTHUMANOID",
        race: "GOLEM",
        class: "GOLEM_IRON",
        gender: "NIETHER",
        size: "Large",
      },
    });
    iron.setAdditionalData({
      movement: { value: 6 },
      removeItems: ["GOLIRO", "IRONGOL", "IMMUNE3"],
      immunities: ["construct"],
      memorizedSpells: [
        {
          file: this.spell(Ids.CloudOfPoisonousGas).file,
          memorizedCount: 1,
        },
      ],
    });
    iron.addTrait({
      immunities: ["magic", "plusTwoWeapons", "lightning"],
      effects: [
        {
          opcode: EffectTypeEnum.FireResistanceModifier,
          value: 125,
          type: EffectStatisticModifierEnum.Set,
        },
        {
          opcode: EffectTypeEnum.MagicalFireResistanceModifier,
          value: 125,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    this.createFists(iron, 4, 10, AbilityDamageTypeEnum.Crushing);
    iron.setBehavior({
      restHeal: true,
      abilities: [this.ability(Ids.CloudOfPoisonousGas)],
    });
    return iron;
  }

  /**
   * Bone Golem
   */
  private bone() {
    const bone = creatureFactory.create({
      monster: MonsterEnum.BoneGolem,
      family: MonsterFamilyEnum.Golem,
      name: "monster.golem.name.bone",
      files: ["NTGOLBON"],
      data: {
        level1: 14,
        bonusHp: 0,
        strength: 17,
        dexterity: 13,
        constitution: 16,
        intelligence: 3,
        wisdom: 8,
        charisma: 1,
        ac: 0,
        apr: 1,
        xpv: 18000,
        alignment: "NEUTRAL",
        morale: 20,
        general: "GIANTHUMANOID",
        race: "GOLEM",
        class: "GOLEM_STONE",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    bone.setAdditionalData({
      movement: { value: 12 },
      immunities: ["construct", "skeletal"],
      removeItems: ["S3-8M3", "GOLCLA", "IMMUNE2", "HELMNOAN"],
      memorizedSpells: [
        { file: this.spell(Ids.HideousLaugh).file, memorizedCount: 1 },
      ],
    });
    bone.addTrait({
      immunities: ["magic", "fire", "cold"],
      effects: [
        {
          opcode: EffectTypeEnum.ElectricityResistanceModifier,
          value: 125,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    this.createFists(bone, 3, 8, AbilityDamageTypeEnum.Slashing);
    bone.setBehavior({
      restHeal: true,
      abilities: [this.ability(Ids.HideousLaugh)],
    });
    return bone;
  }

  /**
   * Juggernaut Golem
   */
  private juggernaut() {
    const juggernaut = creatureFactory.create({
      monster: MonsterEnum.JuggernautGolem,
      family: MonsterFamilyEnum.Golem,
      name: "monster.golem.name.juggernaut",
      files: ["TOMEGOL4"],
      data: {
        level1: 18,
        strength: 22,
        dexterity: 9,
        constitution: 20,
        intelligence: 3,
        wisdom: 11,
        charisma: 1,
        ac: 2,
        apr: 2,
        xpv: 11000,
        alignment: "NEUTRAL",
        morale: 16,
        general: "GIANTHUMANOID",
        race: "GOLEM",
        class: "GOLEM_STONE",
        gender: "NIETHER",
        size: "Large",
        animation: "GOLEM_CLAY",
      },
    });
    juggernaut.setAdditionalData({
      movement: { value: 3 },
      immunities: ["construct"],
      removeScripts: ["GOLSTO01", "GOLIRO01", "TOMEGOL4"],
      removeItems: ["IRONGOL"],
      memorizedSpells: [
        { file: this.spell(Ids.Charge).file, memorizedCount: 1 },
      ],
    });
    juggernaut.addTrait({ immunities: ["magic", "fire"] });
    this.createFists(juggernaut, 2, 6, AbilityDamageTypeEnum.Crushing);
    juggernaut.setBehavior({
      restHeal: true,
      abilities: [this.ability(Ids.Charge)],
    });
    return juggernaut;
  }

  createFists(
    creature: Creature,
    diceThrown: number,
    diceSize: number,
    damageType: AbilityDamageTypeEnum,
    castSpell?: WeaponCastSpell
  ) {
    return creature.addWeapon({
      weapon: {
        stringRef: "monster.golem.weapon.fists",
        icon: MonsterItemIconEnum.Fist,
        equippedSlot: ["WEAPON1"],
        header: {
          type: ItemAbilityTypeEnum.Melee,
          diceThrown,
          diceSize,
          damageType,
          speed: 4,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
        },
      },
      castSpell,
    });
  }

  /**
   * Haste
   */
  private createHaste() {
    return this.addSpell({
      name: "monster.golem.ability.haste",
      id: Ids.Haste,
      castingSound: "CAS_P04",
      icon: SPELLS.Haste,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.Caster,
          speed: 1,
          effects: [
            {
              opcode: EffectTypeEnum.RemoveSpellTypeProtections,
              maximumLevel: 9,
              type: "K1#SLOW",
              timing: EffectTimingEnum.InstantLimited,
              duration: 18,
            },
            {
              opcode: EffectTypeEnum.Haste,
              type: EffectHasteTypeEnum.NormalHaste,
              timing: EffectTimingEnum.InstantLimited,
              duration: 18,
            },
            {
              opcode: EffectTypeEnum.DisplayPortraitIcon,
              icon: PortraitIconEnum.Haste,
              timing: EffectTimingEnum.InstantLimited,
              duration: 18,
            },
            {
              opcode: EffectTypeEnum.LightingEffects,
              effect: LightingEffectEnum.AlterationAir,
              lightingTarget: LightingEffectTargetEnum.SpellTarget,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
            },
            {
              opcode: EffectTypeEnum.CreatureRGBColorFade,
              color: {
                red: 60,
                green: 60,
                blue: 120,
              },
              fadeSpeed: 25,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
            },
            {
              opcode: EffectTypeEnum.DisplayString,
              stringRef: StringRefUtils.getStringId("Hasted"),
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              resource: "EFF_M28",
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              timing: EffectTimingEnum.DelayPermanent,
              duration: 18,
              resource: "EFF_M29",
            },
          ],
        },
      ],
      ability: {
        spell: {
          type: "reallyForce",
          excludeStateChecks: ["STATE_HASTED"],
          remove: true,
        },
        triggers: [{ name: "Delay", params: [6] }],
      },
    });
  }

  /**
   * Hideous Laugh
   */
  private createHideousLaugh() {
    return this.addSpell({
      name: "monster.golem.ability.hideousLaugh",
      id: Ids.HideousLaugh,
      icon: SPELLS.CloakOfFear,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      options: { renew: 3 },
      headers: [
        {
          type: ItemAbilityTypeEnum.Ranged,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          speed: 1,
          projectile: "INAREANP",
          range: 30,
          effects: effectFactory.fear({
            duration: 42,
            saveType: SaveTypeEnum.Spell,
          }),
        },
      ],
      ability: {
        preset: SPELLS.CloakOfFear,
        spell: {
          type: "force",
        },
      },
    });
  }

  /**
   * Charge
   */
  private createCharge() {
    //TODO: this is a very basic idea of charge, many improvements can be done but since this golem is only used once by a mod, it is a low priority.
    // Anyone caught in the path of a juggernaut charge is run over by the thundering behemoth, though the juggernaut must make a normal attack roll if the victim can avoid the charge.
    // A hit indicates that the victim is crushed, suffering 10d10 points of damage
    // Should be like this:
    // 1. Choose a target, activate charge
    // 2. Run to target (no attack)
    // 3. Once within 5 range, switch to a new weapon that does 10d10 crushing damage then end charge
    // If target can't be reached within a reasonable amount of time, it can end charge and pick another target.
    // To make a better movement implementation: create several boots items and create/remove them (this is especially important for ending charge)
    return this.addSpell({
      name: "monster.golem.ability.charge.name",
      description: "monster.golem.ability.charge.description",
      id: Ids.Charge,
      icon: SPELLS.Haste,
      options: { renew: 5 },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.Caster,
          speed: 1,
          effects: [
            {
              ...effectFactory.naturalMovementSpeed(6),
              timing: EffectTimingEnum.InstantLimited,
              duration: 6,
            },
            {
              ...effectFactory.naturalMovementSpeed(9),
              timing: EffectTimingEnum.DelayLimited,
              duration: 6,
            },
            {
              ...effectFactory.naturalMovementSpeed(12),
              timing: EffectTimingEnum.DelayLimited,
              duration: 12,
            },
            {
              opcode: EffectTypeEnum.DisplayString,
              stringRef: "monster.golem.ability.charge.end",
              timing: EffectTimingEnum.DelayPermanent,
              duration: 24,
            },
          ],
        },
      ],
      ability: {
        spell: {
          selfTarget: true,
          type: "reallyForce",
        },
        triggers: [
          { name: "Range", params: ["NearestEnemyOf", 5], negation: true },
        ],
      },
    });
  }

  /**
   * Cloud of poisonous gas
   */
  private createCloudOfPoisonousGas() {
    return this.addSpell({
      name: "monster.golem.ability.cloudOfPoisonousGas.name",
      description: "monster.golem.ability.cloudOfPoisonousGas.description",
      id: Ids.CloudOfPoisonousGas,
      icon: SPELLS.Cloudkill,
      options: { renew: 7 },
      headers: [
        {
          type: ItemAbilityTypeEnum.Ranged,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.Caster,
          //projectile: "GOLCLOUD", // The gas cloud fills a 10-foot cube directly in front of it, which dissipates by the following round
          projectile: {
            copyFromFile: "GOLCLOUD", // dvstink
            name: "Golem poison cloud",
            particleColor: ParticleColorEnum.Green,
            areaEffectInfo: {
              areaProjectileFlags: [AreaProjectileEnum.AffectOnlyEnemies],
              explosionDelay: 12,
              triggerCount: 10, // 6 or 10
              triggerRadius: 128,
              areaOfEffect: 128,
            },
          },
          speed: 1,
          effects: [
            {
              opcode: EffectTypeEnum.UseEFFFile,
              idsFile: EffectIDSFileEnum.GENERAL,
              idsEntry: "UNDEAD",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
            },
            {
              opcode: EffectTypeEnum.ProtectionFromResourceAndMessage,
              type: "JA_POISON_IMMUNITY",
              timing: EffectTimingEnum.InstantLimited,
              duration: 1,
            },
            {
              opcode: EffectTypeEnum.Damage,
              type: EffectDamageTypeEnum.Poison,
              diceThrown: 1,
              diceSize: 10,
              saveTypes: [SaveTypeEnum.BypassMirrorImage],
            },
            {
              opcode: EffectTypeEnum.Slay,
              idsFile: EffectIDSFileEnum.EA,
              idsEntry: "ANYONE",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              maxLevel: 4,
            },
            {
              opcode: EffectTypeEnum.Slay,
              idsFile: EffectIDSFileEnum.EA,
              idsEntry: "ANYONE",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              minLevel: 5,
              maxLevel: 6,
              saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
              saveBonus: -4,
            },
          ],
        },
      ],
      ability: {
        targets: [{ name: "NearestEnemies", limit: 3 }],
        range: 10,
        spell: {
          type: "reallyForce",
          selfTarget: true,
        },
      },
    });
  }
}

export const createGolems = () => new GolemFamily();
