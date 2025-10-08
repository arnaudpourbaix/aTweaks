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
import { EffectIDSFileEnum } from "../model/final/enums";
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
  RawCreatureAdjustment,
  RawCreatureAutoGenerate,
  RawCreatureData,
} from "../model/raw/creature";
import { RawEffectFile } from "../model/raw/effect";
import { RawItem } from "../model/raw/item";
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
import { ItemService } from "./item.service";
import { SpellService } from "./spell.service";
import { TargetService } from "./target.service";
import { UtilsService } from "./utils.service";
import { WeiduCoreService } from "./weidu-core.service";
import { WeiduCreatureService } from "./weidu-creature.service";
import { WeiduFunctionService } from "./weidu-function.service";
import figureSet from "figures";

export class MainService {
  private effectService = EffectService.instance;
  private spellService = SpellService.instance;
  private itemService = ItemService.instance;
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
    console.log(chalk.bold(`\nProcessing ${rawCreature.name}...`));
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
      items: this.itemService.mapItems(rawCreature.items),
      spells: this.spellService.mapSpells(rawCreature.spells, effectFiles),
      attack: this.mapAttack(rawCreature),
      projectiles: this.mapProjectiles(rawCreature.projectiles),
      effectFiles: this.mapEffectFiles(rawCreature.effectFiles),
    };
    this.checkData({
      creature,
      data: creature.data,
      isAdjustment: false,
    });
    for (const a of creature.adjustments) {
      this.checkData({
        creature,
        data: a.data,
        isAdjustment: true,
      });
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
    const results: CreatureAdjustment[] = creature.adjustments.map((a) =>
      this.mapAdjustment(creature, a)
    );
    return results;
  }

  private mapAdjustment(
    creature: RawCreature,
    adjustment: RawCreatureAdjustment
  ): CreatureAdjustment {
    const result: CreatureAdjustment = {
      ...adjustment,
      noScript: adjustment.noScript ?? false,
      noWeapon: adjustment.noWeapon ?? false,
      summon: adjustment.summon ?? false,
      additionalData: this.mapAdditionalData({
        additionalData: adjustment.additionalData,
        isAdjustment: true,
      }),
    };
    return result;
  }

  private mapEffectFiles(effects?: RawEffectFile[]): EffectFile[] {
    if (!effects) return [];
    return effects.map((e) => {
      const effect = this.effectService.getEffect(e);
      return { ...effect, file: e.file };
    });
  }

  private checkData(p: {
    creature: Creature;
    data?: CreatureData;
    isAdjustment: boolean;
  }): void {
    const data = p.data ?? {};
    if (p.creature.attack.dualWielding && !p.isAdjustment) {
      if (!data.apr)
        throw new Error(
          "Attacks per round need to be set for dual wielding flag"
        );
      data.apr -= 1;
      console.log(
        `${figureSet.arrowRight} setting dual wield: ${data.apr} APR +1 offhand`
      );
    }
    if (data.movement) {
      data.movement = this.creatureService.convertMovement(data.movement);
      console.log(`${figureSet.arrowRight} movement set to ${data.movement}`);
    }
    this.transformAttackPerRound(p.creature.data);
    const movement = data.movement ?? p.creature.data.movement;
    if (data.kit === "BARBARIAN" && movement) {
      data.movement = movement + 2;
      console.log(
        `${figureSet.arrowRight} movement increased by 2 (barbarian): ${data.movement}`
      );
    }
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
      itemSlots: this.itemService.mapItemSlots(
        p.additionalData.itemSlots,
        p.items
      ),
      memorizedSpells: this.spellService.mapMemorizedSpells(
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
