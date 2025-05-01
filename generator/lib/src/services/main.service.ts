import chalk from "chalk";
import { GRAB_DEFAULT_CONFIG } from "../../config/grab";
import { CreatureAttack, CreatureAttackAction } from "../model/final/attack";
import {
  Creature,
  CreatureAdditionalData,
  CreatureAdjustment,
  CreatureData,
} from "../model/final/creature";
import { Effect, EffectFile } from "../model/final/effect";
import { EffectTypeEnum } from "../model/final/effect.type";
import {
  AbilityDamageTypeEnum,
  EffectIDSFileEnum,
  ItemAbilityCastingAnimationEnum,
  ItemAbilityFlagEnum,
  ItemAbilityLocationEnum,
  ItemAbilityPrimaryTypeEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  ItemAnimationEnum,
  ItemCategoryEnum,
  ItemFlagEnum,
  ProficiencyTypeEnum,
  SpellFlagEnum,
  SpellTypeEnum,
} from "../model/final/enums";
import { Item } from "../model/final/item";
import {
  AreaProjectileEnum,
  BamProjectileFlagsEnum,
  ParticleColorEnum,
  Projectile,
  ProjectileAnimationEnum,
  ProjectileBehaviorEnum,
  ProjectileExplosionEffectEnum,
  ProjectileExtendedFlagsEnum,
  ProjectileTypeEnum,
} from "../model/final/projectile";
import { Spell } from "../model/final/spell";
import { RawCreature, RawCreatureAdditionalData } from "../model/raw/creature";
import { RawEffect, RawEffectFile } from "../model/raw/effect";
import {
  RawAlterItem,
  RawCreateItem,
  RawItem,
  RawItemSlot,
} from "../model/raw/item";
import { RawProjectile } from "../model/raw/projectile";
import {
  RawAlterSpell,
  RawCreateSpell,
  RawMemorizedSpell,
  RawSpell,
} from "../model/raw/spell";
import { AbilityService } from "./ability.service";
import { BafGeneratorService } from "./baf-generator.service";
import { CreatureService } from "./creature.service";
import { EffectService } from "./effect.service";
import { ImmunityService } from "./immunity.service";
import { TargetService } from "./target.service";
import { UtilsService } from "./utils.service";
import { WeiduCoreService } from "./weidu-core.service";
import { WeiduCreatureService } from "./weidu-creature.service";
import { WeiduFunctionService } from "./weidu-function.service";
import { RawAdditionalCode, RawCustomCode } from "../model/raw/script";
import { AdditionalCode, CustomCode } from "../model/final/script";

export class MainService {
  private effectService = EffectService.instance;
  private bafService = BafGeneratorService.instance;
  private weiduCreatureService = WeiduCreatureService.instance;
  private weiduFunctionService = WeiduFunctionService.instance;
  private weiduCoreService = WeiduCoreService.instance;
  private immunityService = ImmunityService.instance;
  private creatureService = CreatureService.instance;
  private targerService = TargetService.instance;
  private abilityService = AbilityService.instance;
  private utils = UtilsService.instance;

  generateCommonCode(): Promise<void> {
    this.weiduCoreService.generateSpellStates();
    this.weiduFunctionService.generateFunctions();
    this.weiduCoreService.writeFile();
    return Promise.resolve();
  }

  processCreature(rawCreature: RawCreature): Promise<void> {
    console.log(chalk.bold(`Processing ${rawCreature.name}...`));
    const creature = this.getCreature(rawCreature);
    if (creature.bafFile) {
      this.bafService.generateBafScript(creature);
    }
    this.weiduCreatureService.generateWeiduScript(creature);
    return Promise.resolve();
  }

  private getCreature(rawCreature: RawCreature): Creature {
    const creature: Creature = {
      tracking: true,
      help: true,
      walk: false,
      combatWalk: true,
      restHeal: false,
      usePotions: false,
      useKitAbilities: false,
      hideInShadows: false,
      initActions: [],
      autoGenerate: {
        hitPoints: true,
        savingThrows: true,
        thac0: true,
        enchantment: true,
        meleeRange: true,
      },
      ...rawCreature,
      dialog: rawCreature.dialog ?? [],
      data: { ...rawCreature.data },
      abilities: this.abilityService.getAbilities(rawCreature.abilities),
      customCode: this.mapCustomCode(rawCreature.customCode),
      additionalCode: this.mapAdditionalCode(rawCreature.additionalCode),
      adjustments: this.mapAdjustments(rawCreature),
      additionalData: this.mapAdditionalData({
        additionalData: rawCreature.additionalData,
        spells: rawCreature.spells,
        items: rawCreature.items,
      }),
      notEnforceFiles: rawCreature.notEnforceFiles ?? [],
      items: this.mapItems(rawCreature.items),
      spells: this.mapSpells(rawCreature.spells),
      attack: this.mapAttack(rawCreature),
      projectiles: this.mapProjectiles(rawCreature.projectiles),
      effectFiles: this.mapEffectFiles(rawCreature.effectFiles),
    };
    if (creature.attack.dualWielding) {
      this.dualWielding(creature);
    }
    if (creature.data.movement) {
      creature.data.movement = this.creatureService.convertMovement(
        creature.data.movement
      );
    }
    this.transformAttackPerRound(creature.data);
    for (const a of creature.adjustments) {
      this.transformAttackPerRound(a.data);
    }
    this.immunityService.handleImmunities(creature);
    return creature;
  }

  private transformAttackPerRound(creature?: CreatureData) {
    if (!creature || !creature.apr) return;
    try {
      return this.creatureService.getAttacksPerRound(creature.apr);
    } catch {
      creature.doubleApr = true;
      if (creature.movement) {
        creature.movement = Math.round(creature.movement / 2);
      }
      switch (creature.apr) {
        case 6:
          creature.apr = 3;
          break;
        case 7:
          creature.apr = 9;
          break;
        case 8:
          creature.apr = 4;
          break;
        case 9:
          creature.apr = 10;
          break;
        case 10:
          creature.apr = 5;
          break;
      }
    }
  }

  private mapAdjustments(creature: RawCreature): CreatureAdjustment[] {
    if (!creature.adjustments) return [];
    const results: CreatureAdjustment[] = creature.adjustments.map((a) => ({
      ...a,
      noScript: a.noScript ?? false,
      noWeapon: a.noWeapon ?? false,
      summon: a.summon ?? false,
      additionalData: this.mapAdditionalData({
        additionalData: a.additionalData,
      }),
    }));
    return results;
  }

  private mapEffectFiles(effects?: RawEffectFile[]): EffectFile[] {
    if (!effects) return [];
    return effects.map((e) => {
      const effect = this.effectService.getEffect(e);
      return { ...effect, file: e.file };
    });
  }

  private mapAdditionalData(p: {
    additionalData?: RawCreatureAdditionalData;
    items?: RawItem[];
    spells?: RawSpell[];
  }): CreatureAdditionalData {
    p.additionalData = p.additionalData ?? {};
    const result: CreatureAdditionalData = {
      removeScripts: p.additionalData.removeScripts ?? [],
      removeItems: p.additionalData.removeItems ?? [],
      removeKnownSpells: p.additionalData.removeKnownSpells ?? true,
      removeMemorizedSpells: p.additionalData.removeMemorizedSpells ?? true,
      immunities: p.additionalData.immunities ?? [],
      itemSlots: this.mapItemSlots(p.additionalData.itemSlots, p.items),
      memorizedSpells: this.mapMemorizedSpells(
        p.additionalData.memorizedSpells,
        p.spells
      ),
      scriptLocation: p.additionalData.scriptLocation,
      proficiencies: p.additionalData.proficiencies ?? [],
      deleteEffectOpcodes: p.additionalData.deleteEffectOpcodes
        ? p.additionalData.deleteEffectOpcodes.map((o) => EffectTypeEnum[o])
        : [],
      effects: this.effectService.getEffects(p.additionalData.effects ?? []),
    };
    return result;
  }

  private dualWielding(creature: Creature) {
    if (!creature.data.apr)
      throw new Error(
        "Attacks per round need to be set for dual wielding flag"
      );
    creature.data.apr -= 1;
  }

  private mapAttack(creature: RawCreature): CreatureAttack {
    creature.attack = creature.attack ?? {};
    const defaultAction: CreatureAttackAction = {
      duration: 6,
      disableInterrupt: false,
      responseWeight: 100,
    };
    const actions: CreatureAttackAction[] = (creature.attack.actions ?? []).map(
      (a) => ({
        duration: a.duration ?? defaultAction.duration,
        responseWeight: a.responseWeight ?? defaultAction.responseWeight,
        disableInterrupt: a.disableInterrupt ?? defaultAction.disableInterrupt,
        weaponSlot: a.weaponSlot,
      })
    );
    const result: CreatureAttack = {
      ...creature.attack,
      actions: actions.length ? actions : [defaultAction],
      melee: creature.attack.melee ?? true,
      ranged: creature.attack.ranged ?? false,
      dualWielding: creature.attack.dualWielding ?? false,
      grab: creature.attack.grab
        ? { ...GRAB_DEFAULT_CONFIG, ...creature.attack.grab }
        : undefined,
      targetPriorities: this.targerService.getTargetPriorities(creature),
      targetStatusWeaponSlot: creature.attack.targetStatusWeaponSlot ?? [],
    };
    return result;
  }

  private mapItems(items: RawItem[] | undefined): Item[] {
    if (!items) return [];
    const results: Item[] = items.map((i) =>
      "copyFrom" in i ? this.mapAlterItem(i) : this.mapCreateItem(i)
    );
    return results;
  }

  private mapAlterItem(item: RawAlterItem): Item {
    return {
      ...item,
      immunities: item.immunities ?? [],
      diceSize: item.diceSize ?? 0,
      diceThrown: item.diceThrown ?? 0,
      type: item.type ? ItemAbilityTypeEnum[item.type] : undefined,
      flags: item.flags ? item.flags.map((f) => ItemFlagEnum[f]) : undefined,
      animation: item.animation ? ItemAnimationEnum[item.animation] : undefined,
      category: item.category ? ItemCategoryEnum[item.category] : undefined,
      proficiency: item.proficiency
        ? ProficiencyTypeEnum[item.proficiency]
        : undefined,
      location: item.location
        ? ItemAbilityLocationEnum[item.location]
        : undefined,
      target: item.target ? ItemAbilityTargetEnum[item.target] : undefined,
      damageType: item.damageType
        ? AbilityDamageTypeEnum[item.damageType]
        : undefined,
      abilityflags: item.abilityFlags
        ? item.abilityFlags.map((f) => ItemAbilityFlagEnum[f])
        : undefined,
      effects: item.effects ? this.mapEffects(item.effects) : [],
    };
  }

  private mapCreateItem(item: RawCreateItem): Item {
    const result: Item = {
      file: item.file,
      name: item.name,
      description: item.description,
      equippedSlot: item.equippedSlot,
      icon: item.icon,
      weight: item.weight,
      immunities: item.immunities ?? [],
      flags: item.flags ? item.flags.map((f) => ItemFlagEnum[f]) : undefined,
      animation: item.animation ? ItemAnimationEnum[item.animation] : undefined,
      category: item.category ? ItemCategoryEnum[item.category] : undefined,
      proficiency: item.proficiency
        ? ProficiencyTypeEnum[item.proficiency]
        : undefined,
      abilityflags: item.abilityFlags
        ? item.abilityFlags.map((f) => ItemAbilityFlagEnum[f])
        : undefined,
      effects: item.effects ? this.mapEffects(item.effects) : [],
    };
    if (item.type) {
      result.type = item.type ? ItemAbilityTypeEnum[item.type] : undefined;
      result.diceSize = item.diceSize ?? 0;
      result.diceThrown = item.diceThrown ?? 0;
      result.animationSwing = item.animationSwing;
      result.enchantment = item.enchantment;
      result.location = item.location
        ? ItemAbilityLocationEnum[item.location]
        : ItemAbilityLocationEnum.Weapon;
      result.target = item.target
        ? ItemAbilityTargetEnum[item.target]
        : ItemAbilityTargetEnum.LivingActor;
      result.damageType = item.damageType
        ? AbilityDamageTypeEnum[item.damageType]
        : AbilityDamageTypeEnum.None;
    }
    return result;
  }

  private mapItemSlots(
    itemSlots: RawItemSlot[] | undefined,
    items: RawItem[] | undefined
  ): RawItemSlot[] {
    const results: RawItemSlot[] = itemSlots ?? [];
    if (!items) return results;
    for (const item of items) {
      if (item.equippedSlot) {
        results.push({ file: item.file, slot: item.equippedSlot });
      }
    }
    return results;
  }

  private mapSpells(spells: RawSpell[] | undefined): Spell[] {
    if (!spells) return [];
    const results: Spell[] = spells.map((s) => {
      const result =
        "copyFrom" in s ? this.mapAlterSpell(s) : this.mapCreateSpell(s);
      if (s.icon) {
        result.spellbookIcon = `${s.icon}C`;
        result.memorizedIcon = `${s.icon}B`;
      }
      return result;
    });
    return results;
  }

  private mapAlterSpell(spell: RawAlterSpell): Spell {
    return {
      ...spell,
      spellType: spell.spellType ? SpellTypeEnum[spell.spellType] : undefined,
      primaryType: spell.primaryType
        ? ItemAbilityPrimaryTypeEnum[spell.primaryType]
        : undefined,
      secondaryType: spell.secondaryType
        ? ItemAbilitySecondaryTypeEnum[spell.secondaryType]
        : undefined,
      castingAnimation: spell.castingAnimation
        ? ItemAbilityCastingAnimationEnum[spell.castingAnimation]
        : undefined,
      type: spell.type ? ItemAbilityTypeEnum[spell.type] : undefined,
      location: spell.location
        ? ItemAbilityLocationEnum[spell.location]
        : undefined,
      target: spell.target ? ItemAbilityTargetEnum[spell.target] : undefined,
      flags: spell.flags ? spell.flags.map((f) => SpellFlagEnum[f]) : undefined,
      effects: spell.effects ? this.mapEffects(spell.effects) : [],
      removeOpcodes: (spell.deleteOpcodes ?? []).map((o) => EffectTypeEnum[o]),
      deleteHeaders: spell.deleteHeaders ?? [],
    };
  }

  private mapCreateSpell(spell: RawCreateSpell): Spell {
    return {
      ...spell,
      range: spell.range ?? 0,
      speed: spell.speed ?? 0,
      spellType: spell.spellType
        ? SpellTypeEnum[spell.spellType]
        : SpellTypeEnum.Innate,
      spellLevel: spell.spellLevel ?? 1,
      primaryType: spell.primaryType
        ? ItemAbilityPrimaryTypeEnum[spell.primaryType]
        : undefined,
      secondaryType: spell.secondaryType
        ? ItemAbilitySecondaryTypeEnum[spell.secondaryType]
        : undefined,
      castingAnimation: spell.castingAnimation
        ? ItemAbilityCastingAnimationEnum[spell.castingAnimation]
        : undefined,
      type: spell.type ? ItemAbilityTypeEnum[spell.type] : undefined,
      location: spell.location
        ? ItemAbilityLocationEnum[spell.location]
        : ItemAbilityLocationEnum.Ability,
      target: spell.target
        ? ItemAbilityTargetEnum[spell.target]
        : ItemAbilityTargetEnum.LivingActor,
      flags: spell.flags ? spell.flags.map((f) => SpellFlagEnum[f]) : undefined,
      effects: spell.effects ? this.mapEffects(spell.effects) : [],
      removeOpcodes: [],
      deleteHeaders: [],
    };
  }

  private mapMemorizedSpells(
    memorizedSpells: RawMemorizedSpell[] | undefined,
    spells: RawSpell[] | undefined
  ): RawMemorizedSpell[] {
    const results: RawMemorizedSpell[] = memorizedSpells ?? [];
    if (!spells) return results;
    for (const spell of spells) {
      if (spell.memorizedCount) {
        results.push({
          file: spell.file,
          memorizedCount: spell.memorizedCount,
        });
      }
    }
    return results;
  }

  private mapEffects(effects: RawEffect[]): Effect[] {
    const results = this.effectService.getEffects(effects);
    return results;
  }

  private mapCustomCode(
    customCodes: RawCustomCode[] | undefined
  ): CustomCode[] {
    if (!customCodes) return [];
    return customCodes.map((code) => ({
      ...code,
      abilities: this.abilityService.getAbilities(code.abilities),
      statements: code.statements ?? [],
    }));
  }

  private mapAdditionalCode(
    additionalCodes: RawAdditionalCode[] | undefined
  ): AdditionalCode[] {
    if (!additionalCodes) return [];
    return additionalCodes.map((code) => ({
      ...code,
      triggers: code.triggers ?? [],
      actions: code.actions ?? [],
    }));
  }

  private mapProjectiles(
    projectiles: RawProjectile[] | undefined
  ): Projectile[] {
    if (!projectiles) return [];
    const results: Projectile[] = projectiles.map((p) => ({
      ...p,
      type: p.type ? ProjectileTypeEnum[p.type] : undefined,
      behaviorFlags: (p.behaviorFlags ?? []).map(
        (f) => ProjectileBehaviorEnum[f]
      ),
      particleColor: p.particleColor
        ? ParticleColorEnum[p.particleColor]
        : undefined,
      extendedFlags: (p.extendedFlags ?? []).map(
        (f) => ProjectileExtendedFlagsEnum[f]
      ),
      idsTarget1: p.idsTarget1 ? EffectIDSFileEnum[p.idsTarget1] : undefined,
      idsTarget2: p.idsTarget2 ? EffectIDSFileEnum[p.idsTarget2] : undefined,
      bamProjectileFlags: (p.bamProjectileFlags ?? []).map(
        (f) => BamProjectileFlagsEnum[f]
      ),
      projectileSmokeAnimation: p.projectileSmokeAnimation
        ? ProjectileAnimationEnum[p.projectileSmokeAnimation]
        : undefined,
      fragmentAnimation: p.fragmentAnimation
        ? ProjectileAnimationEnum[p.fragmentAnimation]
        : undefined,
      areaProjectileFlags: (p.areaProjectileFlags ?? []).map(
        (f) => AreaProjectileEnum[f]
      ),
      explosionEffect: p.explosionEffect
        ? ProjectileExplosionEffectEnum[p.explosionEffect]
        : undefined,
    }));
    return results;
  }
}
