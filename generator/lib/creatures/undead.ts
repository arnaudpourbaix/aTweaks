import { MonsterItemIconEnum } from "../config/item";
import { FNP_SPELLS, SPELLS } from "../config/spell-names";
import {
  COMMON_PROJECTILES,
  CommonProjectileFiles,
} from "../spells/projectiles";
import effectFactory from "../src/factories/effect.factory";
import { Durations } from "../src/model/constants";
import { Creature } from "../src/model/creature/creature";
import { CreatureFamily } from "../src/model/creature/family";
import { ItemSlot } from "../src/model/creature/item";
import { StringReference } from "../src/model/final/stringref";
import { BaseEffect, Effect } from "../src/model/spell-item/effect";
import {
  AbilityDamageTypeEnum,
  DiseaseTypeEnum,
  EffectCastSpellTypeEnum,
  EffectColorLocationEnum,
  EffectDamageTypeEnum,
  EffectDispelResistanceEnum,
  EffectIDSFileEnum,
  EffectModifierTypeEnum,
  EffectStatisticModifierEnum,
  EffectTargetEnum,
  EffectTimingEnum,
  InvisibilityTypeEnum,
  ItemAbilityCastingAnimationEnum,
  ItemAbilityFlagEnum,
  ItemAbilityLocationEnum,
  ItemAbilityPrimaryTypeEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  KillTargetDeathTypeEnum,
  LightingEffectEnum,
  LightingEffectTargetEnum,
  PortraitIconEnum,
  RemoveEffectsByResourceTypeEnum,
  SaveTypeEnum,
  SpellExclusionFlagEnum,
  SpellFlagEnum,
  SpellTypeEnum,
} from "../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../src/model/spell-item/effect.type";
import { ProjectileBehaviorEnum } from "../src/model/spell-item/projectile";
import {
  PartialSpell,
  WeaponCastSpell,
} from "../src/model/spell-item/spell-item";
import {
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../src/model/spell-item/spell-protection";
import { MonsterEnum, MonsterFamilyEnum } from "./monster";

enum Ids {
  AuraOfEvil,
  BansheeFearAura,
  CarrionStench,
  DeathWail,
  GhoulTouch,
  GhoulLordTouch,
  GhastTouch,
  GhoulRottingDisease,
  GreaterMummyRottingDisease,
  GreaterMummyFearAura,
  MummyFearAura,
  MummyRottingDisease,
  WallOfIce,
}

class Undead extends Creature {
  createTouch(p: {
    diceThrown: number;
    diceSize: number;
    effects?: Effect[];
    slot?: ItemSlot;
  }) {
    return this.addWeapon({
      weapon: {
        stringRef: "monster.undead.weapon.touch",
        icon: MonsterItemIconEnum.Fist,
        equippedSlot: [p.slot ?? "WEAPON1"],
        header: {
          type: ItemAbilityTypeEnum.Melee,
          diceThrown: p.diceThrown,
          diceSize: p.diceSize,
          damageType: AbilityDamageTypeEnum.Crushing,
          speed: 3,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
          effects: p.effects,
        },
      },
    });
  }

  createClaws(
    diceThrown: number,
    diceSize: number,
    castSpell?: WeaponCastSpell,
  ) {
    return this.addWeapon({
      weapon: {
        stringRef: "monster.undead.weapon.claws",
        icon: MonsterItemIconEnum.Ghoul,
        equippedSlot: ["WEAPON1"],
        header: {
          type: ItemAbilityTypeEnum.Melee,
          diceThrown,
          diceSize,
          damageType: AbilityDamageTypeEnum.Slashing,
          speed: 5,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
        },
      },
      castSpells: castSpell ? [castSpell] : undefined,
    });
  }

  createJaws(
    diceThrown: number,
    diceSize: number,
    castSpells?: WeaponCastSpell[],
  ) {
    return this.addWeapon({
      weapon: {
        stringRef: "monster.undead.weapon.jaws",
        icon: MonsterItemIconEnum.Jaws,
        equippedSlot: ["SHIELD"],
        header: {
          type: ItemAbilityTypeEnum.Melee,
          diceThrown: diceThrown,
          diceSize: diceSize,
          damageType: AbilityDamageTypeEnum.Piercing,
          speed: 3,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
        },
      },
      castSpells,
    });
  }

  /**
   * Banshee Fear Aura
   */
  createBansheeFearAura() {
    return this.addSpell({
      name: "monster.undead.ability.bansheeFearAura.name",
      description: "monster.undead.ability.bansheeFearAura.description",
      id: Ids.BansheeFearAura,
      memorizedCount: 1,
      icon: SPELLS.CloakOfFear,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      options: { renew: 1 },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          speed: 1,
          projectile: CommonProjectileFiles.AreaOfSightNonParty,
          range: 30,
          effects: effectFactory.fear({
            duration: Durations.turn,
            saveType: SaveTypeEnum.Spell,
          }),
        },
      ],
      ability: {
        preset: SPELLS.CloakOfFear,
        spell: {
          type: "force",
          remove: true,
        },
      },
    });
  }

  /**
   * Death wail
   */
  createDeathWail() {
    return this.addSpell({
      name: "monster.undead.ability.deathWail.name",
      description: "monster.undead.ability.deathWail.description",
      id: Ids.DeathWail,
      memorizedCount: 1,
      icon: SPELLS.WailOfTheBanshee,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          speed: 1,
          projectile: CommonProjectileFiles.AreaOfSightNonParty,
          range: 30,
          effects: [
            {
              opcode: EffectTypeEnum.Slay,
              idsFile: EffectIDSFileEnum.EA,
              idsEntry: "ANYONE",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.Spell],
            },
            {
              opcode: EffectTypeEnum.LightingEffects,
              effect: LightingEffectEnum.HitFingerOfDeath,
              lightingTarget: LightingEffectTargetEnum.SpellTarget,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.Spell],
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "CAS_M07",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.Spell],
            },
          ],
        },
      ],
      ability: {
        preset: SPELLS.WailOfTheBanshee,
        spell: {
          type: "force",
          remove: true,
        },
      },
    });
  }

  /**
   * Wall of Ice
   */
  createWallOfIce() {
    return this.addSpell({
      name: "monster.undead.ability.iceWall.name",
      description: "monster.undead.ability.iceWall.description",
      id: Ids.WallOfIce,
      memorizedCount: 1,
      icon: "RR#ICEW",
      primaryType: ItemAbilityPrimaryTypeEnum.Invoker,
      secondaryType: ItemAbilitySecondaryTypeEnum.OffensiveDamage,
      castingSound: "CAS_M06",
      castingAnimation: ItemAbilityCastingAnimationEnum.Invocation,
      exclusionFlags: [SpellExclusionFlagEnum.Enchanter],
      flags: [SpellFlagEnum.Hostile],
      type: SpellTypeEnum.Wizard,
      level: 4,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Spell,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          speed: 4,
          projectile: {
            name: "Wall of Ice",
            copyFromFile: "ICESTORM",
            speed: 20,
            behaviorFlags: [ProjectileBehaviorEnum.UseHeight],
            impactSound: "EFF_M34",
            areaEffectInfo: {
              areaOfEffect: 341,
              triggerCount: 1,
              explosionDelay: 10,
            },
          },
          range: 40,
          effects: [
            {
              opcode: EffectTypeEnum.Damage,
              type: EffectDamageTypeEnum.Cold,
              diceThrown: 2,
              diceSize: 10,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.BypassMirrorImage],
            },
            {
              opcode: EffectTypeEnum.Damage,
              type: EffectDamageTypeEnum.Crushing,
              diceThrown: 1,
              diceSize: 10,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.BypassMirrorImage],
            },
          ],
        },
        //TODO: level 24 header with 6d10 cold and 3d10 crushing, who is using this one??
      ],
      ability: {
        preset: SPELLS.IceStorm,
        spell: {
          type: "noDec",
        },
      },
    });
  }

  /**
   * Ghoul Touch
   */
  createGhoulTouch() {
    return this.addSpell({
      name: "monster.undead.ability.ghoulTouch.name",
      description: "monster.undead.ability.ghoulTouch.description",
      id: Ids.GhoulTouch,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          range: 5,
          effects: [
            {
              opcode: EffectTypeEnum.ProtectionFromResourceAndMessage,
              type: {
                stat: SpellProtectionStat.General,
                relation: SpellProtectionRelation.NotEqual,
              },
              value: "HUMANOID",
            },
            {
              opcode: EffectTypeEnum.ProtectionFromResourceAndMessage,
              type: {
                stat: SpellProtectionStat.Race,
                relation: SpellProtectionRelation.Equal,
              },
              value: "ELF",
            },
            ...effectFactory.paralyze({
              duration: 5 * Durations.round,
              saveType: SaveTypeEnum.ParalyzePoisonDeath,
            }),
          ],
        },
      ],
    });
  }

  /**
   * Ghast Touch
   */
  createGhastTouch() {
    return this.addSpell({
      name: "monster.undead.ability.ghastTouch.name",
      description: "monster.undead.ability.ghastTouch.description",
      id: Ids.GhastTouch,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          range: 5,
          effects: [
            {
              opcode: EffectTypeEnum.ProtectionFromResourceAndMessage,
              type: {
                stat: SpellProtectionStat.General,
                relation: SpellProtectionRelation.NotEqual,
              },
              value: "HUMANOID",
            },
            ...effectFactory.paralyze({
              duration: 7 * Durations.round,
              saveType: SaveTypeEnum.ParalyzePoisonDeath,
            }),
          ],
        },
      ],
    });
  }

  /**
   * Ghoul Lord Touch
   */
  createGhoulLordTouch() {
    return this.addSpell({
      name: "monster.undead.ability.ghoulLordTouch.name",
      description: "monster.undead.ability.ghoulLordTouch.description",
      id: Ids.GhoulLordTouch,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          range: 5,
          effects: [
            {
              opcode: EffectTypeEnum.ProtectionFromResourceAndMessage,
              type: {
                stat: SpellProtectionStat.General,
                relation: SpellProtectionRelation.NotEqual,
              },
              value: "HUMANOID",
            },
            ...effectFactory.paralyze({
              duration: Durations.turn,
              saveType: SaveTypeEnum.ParalyzePoisonDeath,
            }),
          ],
        },
      ],
    });
  }

  /**
   * Carrion Stench
   */
  createCarrionStench() {
    const base: BaseEffect = {
      saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
      saveBonus: -2,
      timing: EffectTimingEnum.InstantLimited,
      duration: 2 * Durations.round,
      dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
    };
    return this.addSpell({
      name: "monster.undead.ability.carrionStench.name",
      description: "monster.undead.ability.carrionStench.description",
      id: Ids.CarrionStench,
      options: { renew: 1 },
      memorizedCount: 1,
      headers: [
        {
          type: ItemAbilityTypeEnum.Ranged,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          projectile: "IDPRO282",
          range: 5,
          effects: [
            {
              opcode: EffectTypeEnum.RemoveEffectsByResource,
              type: RemoveEffectsByResourceTypeEnum.Default,
              dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
            },
            {
              opcode: EffectTypeEnum.Thac0Bonus,
              type: EffectModifierTypeEnum.Increment,
              value: -2,
              ...base,
            },
            {
              opcode: EffectTypeEnum.DisplayPortraitIcon,
              icon: PortraitIconEnum.Nauseated,
              ...base,
            },
            {
              opcode: EffectTypeEnum.DisplayString,
              stringRef: "monster.undead.ability.carrionStench.message",
              ...base,
            },
          ],
        },
      ],
      ability: {
        targets: [
          {
            name: "NearestEnemies",
            limit: 3,
          },
        ],
        spell: {
          type: "reallyForce",
          selfTarget: true,
        },
        range: 5,
      },
    });
  }

  /**
   * Ghoul Lord Rotting Disease
   */
  createGhoulRottingDisease() {
    // PnP: Loose 10 hit points and 1 point from their Constitution and Charisma scores each day
    // Disease can be cured and thus, we can't reapply disease each day
    // Also, time is a bit different in game and I have replaced days by 8 hours (a rest)
    // Instead of gradually loosing con and cha, I have set a one time disease with -4
    return this.addSpell({
      name: "monster.undead.ability.ghoulRottingDisease.name",
      description: "monster.undead.ability.ghoulRottingDisease.description",
      id: Ids.GhoulRottingDisease,
      secondaryType: "Disease",
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          range: 5,
          effects: [
            {
              opcode: EffectTypeEnum.RemoveEffectsByResource,
              type: RemoveEffectsByResourceTypeEnum.Default,
              dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
            },
            {
              opcode: EffectTypeEnum.Disease,
              type: DiseaseTypeEnum.OneDamagePerAmountSeconds,
              amount: 100, // 10 every 8 hours
              icon: PortraitIconEnum.Diseased,
              timing: EffectTimingEnum.InstantLimited,
              duration: 100 * Durations.day,
              dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
            },
            {
              opcode: EffectTypeEnum.Disease,
              type: DiseaseTypeEnum.ReduceConstitutionByAmount,
              amount: 4,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
            },
            {
              opcode: EffectTypeEnum.Disease,
              type: DiseaseTypeEnum.ReduceCharismaByAmount,
              amount: 4,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
            },
          ],
        },
      ],
    });
  }

  /**
   * Mummy Rotting Disease
   */
  createMummyRottingDisease(greater: boolean) {
    // Mummy: PnP is 1-6 months, replaced by 6 days in the game
    // Greater Mummy: PnP is 1-6 days, replaced by 48 hours in the game
    const count = 6;
    const interval = greater ? Durations.eightHours : Durations.day;
    const description: StringReference = greater
      ? "monster.undead.ability.mummyRottingDisease.greaterDescription"
      : "monster.undead.ability.mummyRottingDisease.description";
    const disease: { type: DiseaseTypeEnum; amount: number }[] = [
      { type: DiseaseTypeEnum.ReduceCharismaByAmount, amount: 2 },
    ];
    if (greater) {
      disease.push(
        { type: DiseaseTypeEnum.ReduceStrengthByAmount, amount: 1 },
        { type: DiseaseTypeEnum.ReduceConstitutionByAmount, amount: 1 },
      );
    }
    const diseaseEffects: Effect[] = Array.from(Array(count), (e, i) =>
      disease.map(
        (e) =>
          ({
            opcode: EffectTypeEnum.Disease,
            type: e.type,
            amount: e.amount,
            icon: PortraitIconEnum.Diseased,
            timing: EffectTimingEnum.DelayPermanent,
            duration: (i + 1) * interval,
            dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
          }) as Effect,
      ),
    ).flat();
    return this.addSpell({
      name: "monster.undead.ability.mummyRottingDisease.name",
      description,
      id: greater ? Ids.GreaterMummyRottingDisease : Ids.MummyRottingDisease,
      secondaryType: "Disease",
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          range: 5,
          effects: [
            {
              opcode: EffectTypeEnum.CharacterColorPulse,
              color: { red: 43, green: 79, blue: 0 },
              cycleSpeed: 0,
              location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
              timing: EffectTimingEnum.InstantLimited,
              duration: 2,
            },
            {
              opcode: EffectTypeEnum.DisplayString,
              stringRef: "monster.undead.ability.mummyRottingDisease.diseased",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
            },
            {
              opcode: EffectTypeEnum.DisplayPortraitIcon,
              icon: PortraitIconEnum.Diseased,
              timing: EffectTimingEnum.InstantLimited,
              duration: count * interval,
            },
            ...diseaseEffects,
            {
              opcode: EffectTypeEnum.DisplayString,
              stringRef: "monster.undead.ability.mummyRottingDisease.warning",
              timing: EffectTimingEnum.DelayPermanent,
              duration: (count - 1) * interval,
            },
            {
              opcode: EffectTypeEnum.DisplayString,
              stringRef: "monster.undead.ability.mummyRottingDisease.death",
              timing: EffectTimingEnum.DelayPermanent,
              duration: count * interval - 1,
            },
            {
              opcode: EffectTypeEnum.KillTarget,
              type: KillTargetDeathTypeEnum.Normal,
              displayText: true,
              timing: EffectTimingEnum.DelayPermanent,
              duration: count * interval,
              dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
            },
            {
              opcode: EffectTypeEnum.ProtectionFromSpell,
              timing: EffectTimingEnum.InstantLimited,
              duration: count * interval,
              dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
            },
          ],
          immunityEffect: {
            names: ["cureWoundSpells"],
            duration: count * interval,
            dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
          },
        },
      ],
    });
  }

  /**
   * Mummy Fear Aura
   */
  createMummyFearAura(greater: boolean) {
    const humanBonus = greater ? -1 : 2;
    const othersBonus = greater ? -3 : 0;
    const description: StringReference = greater
      ? "monster.undead.ability.mummyFearAura.greaterDescription"
      : "monster.undead.ability.mummyFearAura.description";
    const humans = this.createMummyFearAuraTechnical(humanBonus, false);
    const others = this.createMummyFearAuraTechnical(othersBonus, true);
    return this.addSpell({
      name: "monster.undead.ability.mummyFearAura.name",
      description,
      id: greater ? Ids.GreaterMummyFearAura : Ids.MummyFearAura,
      memorizedCount: 1,
      icon: SPELLS.CloakOfFear,
      options: { renew: 2 },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          speed: 1,
          projectile: CommonProjectileFiles.AreaOfSightNonParty,
          range: 30,
          effects: [
            {
              opcode: EffectTypeEnum.CastSpell,
              type: EffectCastSpellTypeEnum.CastInstantlyAtCasterLevel,
              resource: others.file,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
            },
            {
              opcode: EffectTypeEnum.UseEFFFile,
              idsFile: EffectIDSFileEnum.RACE,
              idsEntry: "HUMAN",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
            },
          ],
        },
      ],
      effectFiles: [
        {
          opcode: EffectTypeEnum.CastSpell,
          type: EffectCastSpellTypeEnum.CastInstantlyAtCasterLevel,
          resource: humans.file,
          timing: EffectTimingEnum.InstantPermanentUntilDeath,
        },
      ],
      ability: {
        preset: SPELLS.CloakOfFear,
        spell: {
          type: "force",
          remove: true,
        },
      },
    });
  }
  createMummyFearAuraTechnical(saveBonus: number, excludeHumans: boolean) {
    const duration = 3 * Durations.round;
    const saveType = SaveTypeEnum.Spell;
    const effects: Effect[] = [
      ...effectFactory.paralyze({
        duration,
        saveType,
        saveBonus,
        pulse: {
          red: 128,
          green: 64,
          blue: 0,
          speed: 20,
        },
      }),
      ...effectFactory.fear({
        duration,
        saveType,
        saveBonus,
        startSound: "",
        endSound: "",
      }),
      {
        opcode: EffectTypeEnum.DisplayString,
        stringRef: "monster.undead.ability.mummyFearAura.frightened",
        timing: EffectTimingEnum.InstantPermanentUntilDeath,
        saveTypes: [saveType],
        saveBonus,
      },
    ];
    const spell: PartialSpell = {
      name: "monster.undead.ability.mummyFearAura.name",
      secondaryType: "Fear",
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Spell,
          target: ItemAbilityTargetEnum.LivingActor,
          effects,
        },
      ],
      effectFiles: [],
    };
    if (excludeHumans) {
      effects.unshift({
        opcode: EffectTypeEnum.UseEFFFile,
        idsFile: EffectIDSFileEnum.RACE,
        idsEntry: "HUMAN",
        timing: EffectTimingEnum.InstantLimited,
        duration: 1,
      });
    }
    return this.addSpell(spell);
  }

  /**
   * Aura of Evil
   */
  createAuraOfEvil() {
    // Ghoul lords do radiate an aura of evil. In fact, this effect is so potent that those of good alignment suffer a -4 on all attack rolls when within 30 feet of these creatures.
    // In addition, all persons who are forced to make a fear or horror check because of an encounter with a ghoul lord must do so with a -2 penalty.
    const base: BaseEffect = {
      timing: EffectTimingEnum.InstantLimited,
      duration: Durations.round,
      dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
    };
    return this.addSpell({
      name: "monster.undead.ability.auraOfEvil.name",
      description: "monster.undead.ability.auraOfEvil.description",
      id: Ids.AuraOfEvil,
      options: { renew: 1 },
      memorizedCount: 1,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          projectile: CommonProjectileFiles.AreaOfSightNonParty,
          range: 1,
          effects: [
            {
              opcode: EffectTypeEnum.UseEFFFile,
              idsFile: EffectIDSFileEnum.ALIGN,
              idsEntry: "MASK_GOOD",
              ...base,
            },
            {
              opcode: EffectTypeEnum.DisplayPortraitIcon,
              icon: PortraitIconEnum.Nauseated,
              ...base,
            },
            {
              opcode: EffectTypeEnum.DisplayString,
              stringRef: "monster.undead.ability.auraOfEvil.message",
              ...base,
            },
            {
              opcode: EffectTypeEnum.ProtectionFromSpell,
              ...base,
            },
          ],
        },
      ],
      effectFiles: [
        {
          opcode: EffectTypeEnum.Thac0Bonus,
          type: EffectModifierTypeEnum.Increment,
          value: -4,
          ...base,
        },
      ],
      ability: {
        targets: [
          {
            name: "NearestEnemies",
            limit: 3,
          },
        ],
        spell: {
          type: "reallyForce",
          selfTarget: true,
        },
      },
    });
  }
}

class UndeadFamily extends CreatureFamily<Undead> {
  constructor() {
    super(MonsterFamilyEnum.Undead);
    this.addCreature(this.banshee());
    // this.addCreature(this.deathKnight());
    this.addCreature(this.ghoul());
    this.addCreature(this.ghast());
    this.addCreature(this.ghoulLord());
    this.addCreature(this.mummy());
    this.addCreature(this.greaterMummy());
    // this.addCreature(this.shadow());
    // this.addCreature(this.skeleton());
    // this.addCreature(this.skeletonWarrior());
    // this.addCreature(this.spectre());
    // this.addCreature(this.wight());
    // this.addCreature(this.wraith());
    // this.addCreature(this.zombie());
    // this.addCreature(this.zombieJuju());
    // this.addCreature(this.zombieSea());
  }
  createCreature(id: MonsterEnum): Undead {
    return new Undead(id);
  }
  /**
   * Banshee
   */
  private banshee() {
    const banshee = this.create({
      monster: MonsterEnum.Banshee,
      name: "monster.undead.name.banshee",
      files: [
        "BD302BAN", // Banshee
        "banshe01", //ToB Banshee
        "firmon01", //Unused critter from Firkraag's
        "dsbanshe", //DSotSC
        "f_wailin", //Drizzt Saga
      ],
      data: {
        level1: { pnpValue: 7, value: 17, type: "turn" }, // to approximate their "turned as special undead" from PnP
        strength: 9,
        dexterity: 14,
        constitution: 10,
        intelligence: 16,
        wisdom: 11,
        charisma: 17,
        ac: 0,
        apr: 1,
        xpv: 4000,
        alignment: "CHAOTIC_EVIL",
        morale: 13,
        general: "UNDEAD",
        race: "WRAITH",
        class: "SPECTRE",
        gender: "NIETHER",
        size: "Medium",
        movement: 15,
        immunities: ["undead"],
        items: {
          remove: ["IMMUNE1", "B1-8M2", "IMMCHS"],
        },
        script: {
          remove: ["BDBANSH"],
        },
      },
    });
    banshee.createBansheeFearAura();
    banshee.createDeathWail();
    banshee.addTrait({
      immunities: [
        "nonMagicalWeapons",
        "magicResistance",
        "incorporeal",
        "cold",
        "lightning",
      ],
    });
    banshee.createTouch({
      diceThrown: 1,
      diceSize: 8,
    });
    banshee.setBehavior({
      restHeal: true,
      abilities: [
        this.ability(Ids.DeathWail),
        this.ability(Ids.BansheeFearAura),
      ],
    });
    return banshee;
  }
  /**
   * Death Knight
   */
  private deathKnight() {
    //TODO:
    const knight = this.create({
      monster: MonsterEnum.DeathKnight,
      name: "monster.undead.name.deathKnight",
      files: [
        "C02DEMKN", // Demon Knight
        "DEATHK", // Demon Knight
        "gooddeat", // Durlag's Tower DK mirror fiend
        "DEATHK1", // Demon Knight
        "DECK615", // Demon Knight
        "DVDEATHK", // Death Knight
        "NTDEATH1", // Demonknight
        "NTDEATHK", // Demonknight
        "deathkni", // Plain Death Knight used in ToB
        "deck615", // DoMT hitman
        "uddeath", // Undeadark Death Knights
        "uddeath2", // Underdark Death Knight leader
        "cmskel03", // Dark Horizons
        "cmskel04", // Dark Horizons
        "YSDWFGR2", // Fishing For Trouble
        "YSDWFGRD", // Fishing For Trouble
        "YSDWFKNT", // Fishing For Trouble
        "F_DEATHK", // Drizzt Saga
        "F_DEATHL", // Drizzt Saga
        "NTDEATH1", // NTotSC
        "NTGGOTHA", // NTotSC
      ],
      data: {
        level1: 9,
        strength: 18,
        exceptionalStrength: 100,
        dexterity: 11,
        constitution: 11,
        intelligence: 18,
        wisdom: 16,
        charisma: 10,
        ac: 0,
        apr: 1,
        xpv: 6000,
        alignment: "CHAOTIC_EVIL",
        morale: 17,
        general: "UNDEAD",
        race: "SKELETON",
        class: "DEATHKNIGHT",
        gender: "NIETHER",
        size: "Medium",
        movement: 12,
        immunities: ["undead", "skeletal", "turnUndead"],
        items: {
          remove: ["HELM15", "SHLD06", "RINGDEMN"],
        },
        spells: {
          memorized: [
            { file: SPELLS.DetectInvisibility, memorizedCount: 1 },
            { file: SPELLS.DispelMagic, memorizedCount: 2 },
            { file: SPELLS.PowerWordBlind, memorizedCount: 1 },
            { file: SPELLS.PowerWordKill, memorizedCount: 1 },
            { file: SPELLS.PowerWordStun, memorizedCount: 1 },
            // Symbol of Pain: rr#spain.spl
          ],
        },
      },
    });
    knight.createWallOfIce();
    knight.addTrait({
      immunities: ["turnUndead"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 75,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    knight.setBehavior({
      restHeal: true,
      abilities: [
        { preset: SPELLS.DetectInvisibility, spell: { type: "noDec" } },
        this.ability(Ids.WallOfIce),
      ],
    });
    return knight;
  }

  /**
   * Ghast
   */
  private ghast() {
    const ghast = this.create({
      monster: MonsterEnum.Ghast,
      name: "monster.undead.name.ghast",
      files: [
        "BDGHAST", // Ghast
        "BSGHAST1", // Ghast
        "BPGHAS01", // Ghast
        "GHAST", // Ghast
        "GHASTD", // Durlag's Tower Ghast Trap Ghast
        "GHASTS", // Tiax' summoned ghast
        "GHASTF01", // Fell Ghast
        "GRAEL", // Grael
        "SEWERF3", // Sewerfolk
        "BHGHOUL2",
        "BHGHOUL4",
        "ghast01", // BG2 standard Ghast
        "ghastgsu",
        "gmayor", // Theshal
        "nevm3", // Nev's undead trap Ghast
        "theshal",
        "besamen", // Quest Pack
        "bpghast", // BP
        "bsghast1", // BST mod
        "CDI4GHST", // IWDification
        "MH#GLGHA", // Made in heaven Q&E
        "sghastgr", // Bonehill
        "sk#algol", // Neh'taniel
        "sk#ssp3", // Neh'taniel
        "XGHAST1", // Mod added
        "XGHAST2", // Mod added
      ],
      data: {
        level1: 4,
        strength: 16,
        dexterity: 17,
        constitution: 10,
        intelligence: 12,
        wisdom: 10,
        charisma: 6,
        ac: 4,
        apr: 3,
        xpv: 650,
        alignment: "CHAOTIC_EVIL",
        morale: 14,
        general: "UNDEAD",
        race: "GHOUL",
        class: "GHOUL_GHAST",
        gender: "NIETHER",
        size: "Medium",
        movement: 15,
        immunities: ["undead"],
        items: {
          remove: ["ring95", "ghast1"],
        },
        script: {
          remove: ["movep1"],
        },
        effects: {
          remove: [EffectTypeEnum.ProtectionFromBackstab],
        },
      },
    });
    ghast.createGhastTouch();
    ghast.createClaws(1, 4, {
      spell: this.spell(Ids.GhastTouch).file,
    });
    ghast.createJaws(1, 8, [
      {
        spell: this.spell(Ids.GhastTouch).file,
      },
    ]);
    ghast.createCarrionStench();
    ghast.setBehavior({
      restHeal: true,
      abilities: [this.ability(Ids.CarrionStench)],
    });
    ghast.setAdjustments([
      { files: ["GHASTS"], summon: true },
      {
        files: ["GRAEL"],
        data: {
          // he starts dialog with shoutdlg
          level1: 11,
          xpv: 5000,
          strength: 18,
          exceptionalStrength: 100,
          ac: -4,
        },
      },
    ]);
    return ghast;
  }

  /**
   * Ghoul
   */
  private ghoul() {
    const ghoul = this.create({
      monster: MonsterEnum.Ghoul,
      name: "monster.undead.name.ghoul",
      files: [
        "AC#FPGHL", // Ghoul
        "GHOUL", // Ghoul
        "GHOULSU", // Ghoul
        "WAGHOUL", // Ghoul
        "KORAX", // Korax the Ghoul
        "BHGHOUL1",
        "ghoul01",
        "GTCIT1",
        "GTCIT2",
        "bodakmd", // BP
        "ghuldmod", // PofQuestPack
        "MH#GLGHO", // Made in heaven Q&E
        "lacedo01", // Lacedon
        "sahlace", // Lacedon
        "JA#SUTY1", // Mod added Lacedon
        "JA#SUTY3", // Mod added Lacedon
      ],
      data: {
        level1: 2,
        strength: 13,
        dexterity: 15,
        constitution: 10,
        intelligence: 7,
        wisdom: 10,
        charisma: 6,
        ac: 6,
        apr: 3,
        xpv: 175,
        alignment: "CHAOTIC_EVIL",
        morale: 12,
        general: "UNDEAD",
        race: "GHOUL",
        class: "GHOUL",
        gender: "NIETHER",
        size: "Medium",
        movement: 9,
        immunities: ["undead"],
        items: {
          remove: ["ring95", "ghoul1", "ringkora"],
        },
        script: {
          remove: ["ghoul"],
        },
        effects: {
          remove: [EffectTypeEnum.ProtectionFromBackstab],
        },
      },
    });
    ghoul.createGhoulTouch();
    ghoul.createClaws(1, 3, {
      spell: this.spell(Ids.GhoulTouch).file,
    });
    ghoul.createJaws(1, 6, [
      {
        spell: this.spell(Ids.GhoulTouch).file,
      },
    ]);
    ghoul.setBehavior({
      restHeal: true,
    });
    ghoul.setAdjustments([
      { files: ["GHOULSU"], summon: true },
      { files: ["KORAX"], data: { level1: 4 } },
    ]);
    return ghoul;
  }

  /**
   * Ghoul Lord
   */
  private ghoulLord() {
    const lord = this.create({
      monster: MonsterEnum.GhoulLord,
      name: "monster.undead.name.ghoulLord",
      files: [
        "BPGHGR01", // Greater Ghoul
        "GHOULLOR", // Greater Ghoul
        "BDGHASTG", // Greater Ghast
        "ghogr01",
        "gholor01",
        "riftcr01",
        "lacedo02", //Sahuagin Greater Lacedon
        "cmghau01", //Dark Horizons
        "MALKAL", // Mal-Kalen
      ],
      data: {
        level1: { pnpValue: 6, value: 7, type: "turn" },
        strength: 18,
        dexterity: 17,
        constitution: 13,
        intelligence: 14,
        wisdom: 11,
        charisma: 13,
        ac: 4,
        apr: 3,
        xpv: 3000,
        alignment: "CHAOTIC_EVIL",
        morale: 14,
        general: "UNDEAD",
        race: "GHOUL",
        class: "GHOUL_GHAST",
        gender: "NIETHER",
        animation: "GHOUL_GREATER",
        size: "Medium",
        movement: 15,
        immunities: ["undead"],
        items: {
          remove: ["ring95", "ghast1", "BDGHASTG", "ghoul1"],
        },
        script: {
          remove: ["ghoul", "BDGHASTG"],
        },
        effects: {
          remove: [EffectTypeEnum.ProtectionFromBackstab],
        },
      },
    });
    lord.addTrait({ immunities: ["nonSilverNonMagicalWeapons"] });
    lord.createGhoulLordTouch();
    lord.createGhoulRottingDisease();
    lord.createAuraOfEvil();
    lord.createClaws(1, 6, {
      spell: this.spell(Ids.GhoulLordTouch).file,
    });
    lord.createJaws(1, 10, [
      {
        spell: this.spell(Ids.GhoulLordTouch).file,
      },
      {
        spell: this.spell(Ids.GhoulRottingDisease).file,
        saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
      },
    ]);
    lord.setBehavior({
      restHeal: true,
      abilities: [this.ability(Ids.AuraOfEvil)],
    });
    lord.setAdjustments([
      {
        files: [
          "MALKAL", // Mal-Kalen
        ],
        data: { class: "GHOUL_REVEANT" },
      },
    ]);
    return lord;
  }

  /**
   * Mummy
   */
  private mummy() {
    const mummy = this.create({
      monster: MonsterEnum.Mummy,
      name: "monster.undead.name.mummy",
      files: [
        // "BDMUMM01", // Mummy //FIXME: just for test!
        "BDMUMMY", // Fanegonorom
        "AC#FPMMY", // Bog Mummy
        "mummy",
        "mummy01",
        "F_MUMMY", // Drizzt Saga
        "O#LLARU1", // Mod added
        "O#LLARU2", // Mod added
        "O#LLARU3", // Mod added
        "O#LLARU4", // Mod added
        "O#LLARU5", // Mod added
        "O#LLARU6", // Mod added
        "mumx1", // TDD
      ],
      data: {
        level1: 6,
        bonusHp: 3,
        strength: 16,
        dexterity: 8,
        constitution: 15,
        intelligence: 7,
        wisdom: 10,
        charisma: 12,
        ac: 3,
        apr: 1,
        xpv: 3000,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "UNDEAD",
        race: "GHOUL",
        class: "GHOUL_REVEANT",
        animation: "MUMMY",
        gender: "NIETHER",
        size: "Medium",
        movement: 6,
        immunities: ["undead"],
        items: {
          remove: ["ring95", "immune1", "bdmumm01", "mummyw"],
        },
        script: {
          remove: ["bdmumm01"],
        },
        effects: {
          remove: [EffectTypeEnum.ProtectionFromBackstab],
        },
      },
    });
    mummy.addTrait({
      immunities: ["physicalDamageResistance", "cold", "nonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.FireResistanceModifier,
          type: EffectStatisticModifierEnum.Set,
          value: -33,
        },
        {
          opcode: EffectTypeEnum.MagicalFireResistanceModifier,
          type: EffectStatisticModifierEnum.Set,
          value: -33,
        },
      ],
    });
    mummy.createMummyFearAura(false);
    mummy.createMummyRottingDisease(false);
    mummy.createClaws(1, 12, {
      spell: this.spell(Ids.MummyRottingDisease).file,
    });
    mummy.setBehavior({ abilities: [this.ability(Ids.MummyFearAura)] });
    return mummy;
  }
  /**
   * Greater Mummy
   */
  private greaterMummy() {
    // Age: 400-499
    const greater = this.create({
      monster: MonsterEnum.GreaterMummy,
      name: "monster.undead.name.greaterMummy",
      files: [
        "mumgre01",
        "riftcr03",
        "MUMMYX1", // TDD
        "BDMUMM01", //FIXME: just for test!
      ],
      data: {
        level1: { pnpValue: 12, value: 20, type: "caster" },
        bonusHp: 3,
        strength: 15,
        dexterity: 16,
        constitution: 15,
        intelligence: 18,
        wisdom: 22,
        charisma: 20,
        ac: 10, //FIXME: -2
        apr: 1,
        xpv: 16000,
        alignment: "LAWFUL_EVIL",
        morale: 18,
        general: "UNDEAD",
        race: "GHOUL",
        class: "CLERIC",
        animation: "MUMMY",
        gender: "NIETHER",
        size: "Medium",
        movement: 9,
        immunities: ["undead"],
        items: {
          remove: ["ring95", "immune2", "immune3", "mumgrew"],
        },
        script: {
          remove: ["bdmumm01"],
        },
        effects: {
          remove: [EffectTypeEnum.ProtectionFromBackstab],
        },
        spells: {
          memorized: [
            // level 1 (12):
            { file: FNP_SPELLS.CauseDisease.file, memorizedCount: 3 },
            { file: FNP_SPELLS.Doom.file, memorizedCount: 3 },
            { file: SPELLS.Command, memorizedCount: 6 },
            // { file: FNP_SPELLS.FrostFingers.file, memorizedCount: 6 },
            // level 2 (12):
            { file: FNP_SPELLS.Forbiddance.file, memorizedCount: 5 },
            { file: FNP_SPELLS.RigidThinking.file, memorizedCount: 4 },
            { file: FNP_SPELLS.Shatter.file, memorizedCount: 2 },
            { file: FNP_SPELLS.Shield.file, memorizedCount: 1 },
            // level 3 (12):
            { file: FNP_SPELLS.CircleOfBones.file, memorizedCount: 3 },
            { file: FNP_SPELLS.CloakOfFear.file, memorizedCount: 3 },
            { file: FNP_SPELLS.ShadowMonsters.file, memorizedCount: 3 },
            { file: FNP_SPELLS.CauseSeriousWounds.file, memorizedCount: 3 },
            // level 4 (11):
            { file: FNP_SPELLS.AnimateDead.file, memorizedCount: 2 },
            { file: FNP_SPELLS.CauseCriticalWounds.file, memorizedCount: 2 },
            { file: FNP_SPELLS.DemiShadowMonsters.file, memorizedCount: 2 },
            { file: FNP_SPELLS.Emotion.file, memorizedCount: 1 },
            { file: FNP_SPELLS.GreaterMalison.file, memorizedCount: 1 },
            { file: FNP_SPELLS.Poison.file, memorizedCount: 2 },
            { file: FNP_SPELLS.WavesOfFatigue.file, memorizedCount: 1 },
            // level 5 (9):
            { file: FNP_SPELLS.Chaos.file, memorizedCount: 1 },
            { file: FNP_SPELLS.CloudOfPestilence.file, memorizedCount: 1 },
            { file: FNP_SPELLS.MassCauseLightWounds.file, memorizedCount: 1 },
            { file: FNP_SPELLS.Shades.file, memorizedCount: 1 },
            { file: FNP_SPELLS.SlayLiving.file, memorizedCount: 2 },
            { file: FNP_SPELLS.WavesOfAgony.file, memorizedCount: 2 },
            { file: FNP_SPELLS.GreaterCommand.file, memorizedCount: 1 },
            // level 6 (5):
            { file: FNP_SPELLS.DolorousDecay.file, memorizedCount: 2 },
            { file: FNP_SPELLS.Harm.file, memorizedCount: 1 },
            { file: FNP_SPELLS.MagicResistance.file, memorizedCount: 1 },
            { file: FNP_SPELLS.SummonShadows.file, memorizedCount: 1 },
            // level 7 (2):
            { file: FNP_SPELLS.FingerOfDeath.file, memorizedCount: 1 },
            { file: FNP_SPELLS.Wither.file, memorizedCount: 1 },
          ],
        },
      },
    });
    greater.addTrait({
      immunities: ["physicalDamageResistance", "cold", "plusTwoWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          type: EffectStatisticModifierEnum.Set,
          value: 20,
        },
        {
          opcode: EffectTypeEnum.FireResistanceModifier,
          type: EffectStatisticModifierEnum.Set,
          value: 100,
        },
        {
          opcode: EffectTypeEnum.ElectricityResistanceModifier,
          type: EffectStatisticModifierEnum.Set,
          value: -50,
        },
      ],
    });
    greater.createMummyFearAura(true);
    greater.createMummyRottingDisease(true);
    greater.createClaws(3, 6, {
      spell: this.spell(Ids.GreaterMummyRottingDisease).file,
    });
    greater.setBehavior({
      abilities: [
        // this.ability(Ids.GreaterMummyFearAura),
        // this.preset(FNP_SPELLS.DemiShadowMonsters.file),
        // this.preset(FNP_SPELLS.AnimateDead.file),
        // this.preset(FNP_SPELLS.CircleOfBones.file),
        // this.preset(FNP_SPELLS.CauseCriticalWounds.file),
        // this.preset(FNP_SPELLS.ShadowMonsters.file),
        // this.preset(FNP_SPELLS.CauseSeriousWounds.file),
        // this.preset(FNP_SPELLS.Shield.file),
        // this.preset(FNP_SPELLS.RigidThinking.file),
        // this.preset(FNP_SPELLS.Forbiddance.file),
        // this.preset(FNP_SPELLS.Shatter.file),
        // this.preset(FNP_SPELLS.CauseDisease.file),
        // this.preset(FNP_SPELLS.Doom.file),
        // this.preset(SPELLS.Command),
      ],
      dialog: ["mumgre01"],
    });
    return greater;
  }
  /**
   * Shadow
   */
  private shadow() {
    const shadow = this.create({
      monster: MonsterEnum.Shadow,
      name: "monster.undead.name.shadow",
      files: [
        "BDHELP03", // Sword Spider
        "BDSPID7L", // Seven-Legged Spider
        "BPSPID03", // Sword Spider
        "PLYSPID", // Sword Spider
        "SPIDSW", // Sword Spider
        "SPIDSW01", // Sword Spider
        "SPIDSWSU", // Sword Spider
        "BPSPID01", // Spider
        "GV#SPID", // Spider
        "WISPID01", // Spider
        "WISPID02", // Spider
        "WISPID03", // Lightning Sword Spider (+2 electricity damage with leg)
      ],
      data: {
        level1: 5,
        bonusHp: 5,
        thac0: 15,
        strength: 16,
        dexterity: 18,
        constitution: 14,
        intelligence: 9,
        wisdom: 14,
        charisma: 4,
        ac: 3,
        apr: 2,
        xpv: 2000,
        alignment: "CHAOTIC_EVIL",
        morale: 13,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_SWORD",
        gender: "NIETHER",
        size: "Huge",
        movement: 12,
      },
    });
    shadow.createTouch({
      diceThrown: 2,
      diceSize: 4,
    });
    shadow.setBehavior({
      abilities: [this.ability(Ids.BansheeFearAura)],
    });
    shadow.setAdjustments([]);
    return shadow;
  }
  /**
   * Skeleton
   */
  private skeleton() {
    const skeleton = this.create({
      monster: MonsterEnum.Skeleton,
      name: "monster.undead.name.skeleton",
      files: [
        "SMSPID02", // Vortex Spider
      ],
      data: {
        level1: 7,
        bonusHp: 4,
        strength: 15,
        dexterity: 15,
        constitution: 12,
        intelligence: 7,
        wisdom: 10,
        charisma: 6,
        ac: 4,
        apr: 1,
        xpv: 2700,
        alignment: "CHAOTIC_EVIL",
        morale: 10,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_PHASE",
        gender: "NIETHER",
        size: "Large",
        movement: 12,
      },
    });
    skeleton.addTrait({
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    skeleton.setBehavior({
      abilities: [
        {
          preset: SPELLS.Slow,
          spell: {
            resource: SPELLS.VortexWeb,
            type: "force",
          },
          timer: { name: "VortexWeb", value: 30 },
        },
      ],
    });
    return skeleton;
  }
  /**
   * Skeleton Warrior
   */
  private skeletonWarrior() {
    const warrior = this.create({
      monster: MonsterEnum.SkeletonWarrior,
      name: "monster.undead.name.skeletonWarrior",
      files: [
        "C#Q04009", // Wraith Spider
        "SPIDWR", // Wraith Spider
        "SPIDWR01", // Wraith Spider
        "TTSPID", // Wraith Spider
        // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
        movement: 12,
      },
    });
    warrior.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    warrior.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return warrior;
  }
  /**
   * Spectre
   */
  private spectre() {
    const spectre = this.create({
      monster: MonsterEnum.Spectre,
      name: "monster.undead.name.spectre",
      files: [
        "C#Q04009", // Wraith Spider
        "SPIDWR", // Wraith Spider
        "SPIDWR01", // Wraith Spider
        "TTSPID", // Wraith Spider
        // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
        movement: 12,
      },
    });
    spectre.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    spectre.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return spectre;
  }
  /**
   * Wight
   */
  private wight() {
    const wight = this.create({
      monster: MonsterEnum.Wight,
      name: "monster.undead.name.wight",
      files: [
        "BDYMORI", // Wight
        "BDJUNIA2", // Junia
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
        movement: 12,
      },
    });
    wight.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    wight.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return wight;
  }
  /**
   * Wraith
   */
  private wraith() {
    const wraith = this.create({
      monster: MonsterEnum.Wraith,
      name: "monster.undead.name.wraith",
      files: [
        "AC#FPWRA", // Wraith
        "BDWRAI01", // Wraith
        "BDWRAI02", // Wraith
        "BDWRAIT1", // Wraith
        "BPWRAI01", // Wraith
        "DVWRAITH", // Why did you not speak before now?
        "NTBPWATC", // Catacomb Warder
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
        movement: 12,
      },
    });
    wraith.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    wraith.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return wraith;
  }
  /**
   * Zombie
   */
  private zombie() {
    const zombie = this.create({
      monster: MonsterEnum.Zombie,
      name: "monster.undead.name.zombie",
      files: [
        "C#Q04009", // Wraith Spider
        "SPIDWR", // Wraith Spider
        "SPIDWR01", // Wraith Spider
        "TTSPID", // Wraith Spider
        // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
        movement: 12,
      },
    });
    zombie.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    zombie.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return zombie;
  }
  /**
   * Zombie juju
   */
  private zombieJuju() {
    const wraith = this.create({
      monster: MonsterEnum.ZombieJuju,
      name: "monster.undead.name.zombieJuju",
      files: [
        "C#Q04009", // Wraith Spider
        "SPIDWR", // Wraith Spider
        "SPIDWR01", // Wraith Spider
        "TTSPID", // Wraith Spider
        // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
        movement: 12,
      },
    });
    wraith.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    wraith.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return wraith;
  }
  /**
   * Zombie Sea
   */
  private zombieSea() {
    const wraith = this.create({
      monster: MonsterEnum.ZombieSea,
      name: "monster.undead.name.zombieSea",
      files: [
        "C#Q04009", // Wraith Spider
        "SPIDWR", // Wraith Spider
        "SPIDWR01", // Wraith Spider
        "TTSPID", // Wraith Spider
        // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
        movement: 12,
      },
    });
    wraith.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    wraith.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return wraith;
  }
}

export const createUndeads = () => new UndeadFamily();
