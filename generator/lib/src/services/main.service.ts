import chalk from "chalk";
import { GRAB_DEFAULT_CONFIG } from "../../config/grab";
import { CreatureAttack, CreatureAttackAction } from "../model/final/attack";
import {
  Creature,
  CreatureAdditionalData,
  CreatureAdjustment,
  CreatureData,
} from "../model/final/creature";
import { EffectFile } from "../model/final/effect";
import { EffectTypeEnum } from "../model/final/effect.type";
import {
  AbilityDamageTypeEnum,
  EffectIDSFileEnum,
  ItemAbilityFlagEnum,
  ItemAbilityLocationEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  ItemAnimationEnum,
  ItemCategoryEnum,
  ItemFlagEnum,
  ProficiencyTypeEnum,
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
import { AdditionalCode, CustomCode } from "../model/final/script";
import {
  RawCreature,
  RawCreatureAdditionalData,
  RawCreatureAutoGenerate,
} from "../model/raw/creature";
import { RawEffectFile } from "../model/raw/effect";
import {
  RawAlterItem,
  RawCreateItem,
  RawItem,
  RawItemSlot,
} from "../model/raw/item";
import { RawProjectile } from "../model/raw/projectile";
import { RawAdditionalCode, RawCustomCode } from "../model/raw/script";
import { RawMemorizedSpell, RawSpell } from "../model/raw/spell";
import { AbilityService } from "./ability.service";
import { BafGeneratorService } from "./baf-generator.service";
import { CreatureService } from "./creature.service";
import { DescriptionService } from "./description.service";
import { EffectService } from "./effect.service";
import { GrabService } from "./grab.service";
import { ImmunityService } from "./immunity.service";
import { SpellService } from "./spell.service";
import { TargetService } from "./target.service";
import { UtilsService } from "./utils.service";
import { WeiduCoreService } from "./weidu-core.service";
import { WeiduCreatureService } from "./weidu-creature.service";
import { WeiduFunctionService } from "./weidu-function.service";
import { ItemSlot } from "../model/raw/enum";

export class MainService {
  private effectService = EffectService.instance;
  private spellService = SpellService.instance;
  private bafService = BafGeneratorService.instance;
  private weiduCreatureService = WeiduCreatureService.instance;
  private weiduFunctionService = WeiduFunctionService.instance;
  private weiduCoreService = WeiduCoreService.instance;
  private immunityService = ImmunityService.instance;
  private creatureService = CreatureService.instance;
  private targerService = TargetService.instance;
  private abilityService = AbilityService.instance;
  private descriptionService = DescriptionService.instance;
  private grabService = GrabService.instance;
  private utils = UtilsService.instance;

  generateCommonCode(): Promise<void> {
    this.weiduCoreService.generateSpellStates();
    this.weiduCoreService.generateProtectionSpells();
    this.weiduFunctionService.generateSpellResources();
    this.weiduFunctionService.generateSpellFunctions();
    this.weiduFunctionService.generateImmunities();
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
    const effectFiles: RawEffectFile[] = rawCreature.effectFiles ?? [];
    const autoGenerate: RawCreatureAutoGenerate = {
      hitPoints: true,
      savingThrows: true,
      thac0: true,
      enchantment: true,
      meleeRange: true,
    };
    const creature: Creature = {
      tracking: true,
      help: true,
      walk: false,
      combatWalk: true,
      restHeal: false,
      usePotions: false,
      useKitAbilities: false,
      hideInShadows: false,
      canPolymorph: false,
      initActions: [],
      ...rawCreature,
      autoGenerate: rawCreature.autoGenerate
        ? { ...autoGenerate, ...rawCreature.autoGenerate }
        : autoGenerate,
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
        isAdjustment: false,
      }),
      notEnforceFiles: rawCreature.notEnforceFiles ?? [],
      items: this.mapItems(rawCreature.items),
      spells: this.spellService.mapSpells(rawCreature.spells, effectFiles),
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
    this.grabService.addGrabEffects(creature);
    this.creatureService.checkWeapons(creature);
    this.descriptionService.generate(creature);
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
        isAdjustment: true,
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
    isAdjustment: boolean;
  }): CreatureAdditionalData {
    p.additionalData = p.additionalData ?? {};
    let removeMemorizedSpells = p.additionalData.removeMemorizedSpells;
    if (removeMemorizedSpells === undefined && !p.isAdjustment) {
      removeMemorizedSpells = true;
    }
    const result: CreatureAdditionalData = {
      removeScripts: p.additionalData.removeScripts ?? [],
      removeItems: p.additionalData.removeItems ?? [],
      removeKnownSpells: p.additionalData.removeKnownSpells ?? true,
      removeMemorizedSpells,
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
      disableInterrupt: false,
      responseWeight: 100,
    };
    const actions: CreatureAttackAction[] = (creature.attack.actions ?? []).map(
      (a) => ({
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
      equippedSlot: this.utils.getItemSlots(item.equippedSlot),
      immunities: item.immunities ?? [],
      diceSize: item.diceSize ?? 0,
      diceThrown: item.diceThrown ?? 0,
      damageBonus: item.damageBonus,
      bonusToHit: item.bonusToHit,
      speed: item.speed ?? 0,
      type: item.type ? ItemAbilityTypeEnum[item.type] : undefined,
      range: item.range,
      projectile: item.projectile,
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
      effects: item.effects ? this.effectService.getEffects(item.effects) : [],
    };
  }

  private mapCreateItem(item: RawCreateItem): Item {
    const result: Item = {
      file: item.file,
      stringRef: item.stringRef,
      description: item.description,
      equippedSlot: this.utils.getItemSlots(item.equippedSlot),
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
      effects: item.effects ? this.effectService.getEffects(item.effects) : [],
    };
    if (item.type) {
      result.type = item.type ? ItemAbilityTypeEnum[item.type] : undefined;
      result.range = item.range;
      result.projectile = item.projectile;
      result.diceSize = item.diceSize ?? 0;
      result.diceThrown = item.diceThrown ?? 0;
      result.speed = item.speed ?? 0;
      result.damageBonus = item.damageBonus;
      result.bonusToHit = item.bonusToHit;
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
      color: p.color
        ? (p.color.red << 8) + (p.color.green << 16) + (p.color.blue << 24)
        : undefined,
      projectileInfo: {
        ...p.projectileInfo,
        bamProjectileFlags: (p.projectileInfo?.bamProjectileFlags ?? []).map(
          (f) => BamProjectileFlagsEnum[f]
        ),
        projectileSmokeAnimation: p.projectileInfo?.projectileSmokeAnimation
          ? ProjectileAnimationEnum[p.projectileInfo?.projectileSmokeAnimation]
          : undefined,
      },
      areaEffectInfo: {
        ...p.areaEffectInfo,
        areaProjectileFlags: (p.areaEffectInfo?.areaProjectileFlags ?? []).map(
          (f) => AreaProjectileEnum[f]
        ),
        fragmentAnimation: p.areaEffectInfo?.fragmentAnimation
          ? ProjectileAnimationEnum[p.areaEffectInfo?.fragmentAnimation]
          : undefined,
        explosionEffect: p.areaEffectInfo?.explosionEffect
          ? ProjectileExplosionEffectEnum[p.areaEffectInfo?.explosionEffect]
          : undefined,
      },
    }));
    return results;
  }
}
