import { Creature } from "../model/final/creature";
import { Effect } from "../model/final/effect";
import { GrabFullConfig } from "../model/grab";
import { ClassIdentifier } from "../model/ids/class";
import { RaceIdentifier } from "../model/ids/race";
import { CastSpellEffect, RawEffect } from "../model/raw/effect";
import { EffectService } from "./effect.service";
import { UtilsService } from "./utils.service";

export class GrabService {
  static instance = new GrabService();

  private effectService = EffectService.instance;
  private utils = UtilsService.instance;

  getCastSpellGrabEffect(grab: GrabFullConfig): Effect {
    const rawEffect: CastSpellEffect = {
      opcode: "CastSpell",
      type: "CastInstantlyAtCasterLevel",
      probability1: grab.probability,
      saveTypes: grab.saveTypes,
      saveBonus: grab.saveBonus,
      resource: grab.file,
    };
    const effect = this.effectService.getEffects([rawEffect])[0];
    return effect;
  }

  getGrabProtectionEffect(grab: GrabFullConfig): Effect {
    const rawEffect: RawEffect = {
      opcode: "ProtectionFromSpell",
      resource: grab.file,
      duration: 1,
    };
    const effect = this.effectService.getEffects([rawEffect])[0];
    return effect;
  }

  getGrabCastSpellEffect(grab: GrabFullConfig): Effect {
    const rawEffect: CastSpellEffect = {
      opcode: "CastSpell",
      type: "CastInstantlyAtCasterLevel",
      resource: grab.file,
      duration: 1,
    };
    const effect = this.effectService.getEffects([rawEffect])[0];
    return effect;
  }

  getGrabbedEffects(creature: Creature, grab: GrabFullConfig): Effect[] {
    const rawEffects: RawEffect[] = [
      {
        opcode: "SetExtendedSpellState",
        state: grab.grabState,
        duration: grab.duration,
      },
      {
        opcode: "DisplayString",
        stringRef: grab.grabbedDisplayStringRef,
        timing: "InstantPermanentUntilDeath",
      },
      {
        opcode: "MovementRateBonus2",
        type: "Set",
        value: 0,
        duration: grab.duration,
      },
      {
        opcode: "PlaySound",
        timing: "InstantPermanentUntilDeath",
        resource: grab.startSound,
      },
      {
        opcode: "PlaySound",
        timing: "DelayPermanent",
        duration: grab.duration,
        resource: grab.endSound,
      },
      {
        opcode: "PlayVisualEffect",
        playWhere: "OverTargetAttached",
        resource: grab.visualEffect,
        duration: grab.duration,
      },
      {
        opcode: "DisplayPortraitIcon",
        icon: "Entangled",
        duration: grab.duration,
      },
      {
        opcode: "DexterityBonus",
        value: 8,
        type: "Set",
        duration: grab.duration,
      },
      {
        opcode: "ProtectionFromSpell",
        resource: grab.file,
      },
    ];
    const effects = this.effectService.getEffects(rawEffects);
    const immunityEffects = this.getGrabImmuneEffects(creature, grab);
    return [...immunityEffects, ...effects];
  }

  private getGrabImmuneEffects(
    creature: Creature,
    grab: GrabFullConfig
  ): Effect[] {
    if (!creature.data.size)
      throw new Error(`Creature size is needed to add grab immunities`);
    const races: RaceIdentifier[] = [...GrabImmuneCreatures.races];
    const classes: ClassIdentifier[] = [...GrabImmuneCreatures.classes];
    if ([SizeEnum.Huge, SizeEnum.Large].includes(creature.data.size)) {
      races.push(...HugeCreatures.races);
      classes.push(...HugeCreatures.classes);
    }
    if ([SizeEnum.Large].includes(creature.data.size)) {
      races.push(...LargeCreatures.races);
      classes.push(...LargeCreatures.classes);
    }
    const rawEffects: RawEffect[] = [];
    for (const i of races) {
      rawEffects.push({
        opcode: RawEffectTypeEnum.UseEFFFile,
        idsFile: RawEffectIDSFileEnum.RACE,
        idsEntry: `${this.utils.getIdsValue("race", i)}`,
        duration: 1,
        target: RawEffectTargetEnum.PresetTarget,
        resource: grab.file,
      });
    }
    for (const i of classes) {
      rawEffects.push({
        opcode: RawEffectTypeEnum.UseEFFFile,
        idsFile: RawEffectIDSFileEnum.CLASS,
        idsEntry: `${this.utils.getIdsValue("class", i)}`,
        duration: 1,
        target: RawEffectTargetEnum.PresetTarget,
        resource: grab.file,
      });
    }
    const effects = this.effectService.getEffects(rawEffects);
    return effects;
  }
}
