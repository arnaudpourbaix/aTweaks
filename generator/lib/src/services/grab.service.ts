import { GrabImmuneCreatures, HugeCreatures, LargeCreatures } from "../../config/grab";
import { Creature } from "../model/final/creature";
import { Effect } from "../model/final/effect";
import { GrabFullConfig, } from "../model/grab";
import { ClassIdentifiers } from "../model/ids/class";
import { RaceIdentifiers } from "../model/ids/race";
import { CastSpellEffect, RawEffect } from "../model/raw/effect";
import { RawEffectTypeEnum } from "../model/raw/effect.type";
import { RawEffectCastSpellTypeEnum, RawEffectIDSFileEnum, RawEffectModifierTypeEnum, RawEffectStatisticModifierEnum, RawEffectTargetEnum, RawEffectTimingEnum, RawEffectVisualEffectLocationEnum, RawPortraitIconEnum, SizeEnum } from "../model/raw/enum";
import { EffectService } from "./effect.service";
import { UtilsService } from "./utils.service";

export class GrabService {
    static instance = new GrabService();

    private effectService = EffectService.instance
    private utils = UtilsService.instance;

    getCastSpellGrabEffect(grab: GrabFullConfig): Effect {
        const rawEffect: CastSpellEffect = {
            opcode: RawEffectTypeEnum.CastSpell,
            type: RawEffectCastSpellTypeEnum.CastInstantlyAtCasterLevel,
            probability1: grab.probability,
            saveTypes: grab.saveTypes,
            saveBonus: grab.saveBonus,
            resource: grab.file
        };
        const effect = this.effectService.getEffects([rawEffect])[0];
        return effect;
    }

    getGrabProtectionEffect(grab: GrabFullConfig): Effect {
        const rawEffect: RawEffect = {
            opcode: RawEffectTypeEnum.ProtectionFromSpell,
            resource: grab.file,
            duration: 1,
        };
        const effect = this.effectService.getEffects([rawEffect])[0];
        return effect;
    }

    getGrabCastSpellEffect(grab: GrabFullConfig): Effect {
        const rawEffect: CastSpellEffect = {
            opcode: RawEffectTypeEnum.CastSpell,
            type: RawEffectCastSpellTypeEnum.CastInstantlyAtCasterLevel,
            resource: grab.file,
            duration: 1,
        };
        const effect = this.effectService.getEffects([rawEffect])[0];
        return effect;
    }

    getGrabbedEffects(creature: Creature, grab: GrabFullConfig): Effect[] {
        const rawEffects: RawEffect[] = [
            {
                opcode: RawEffectTypeEnum.SetExtendedSpellState,
                state: grab.grabState,
                duration: grab.duration
            },
            {
                opcode: RawEffectTypeEnum.DisplayString,
                stringRef: grab.grabbedDisplayStringRef,
                timing: RawEffectTimingEnum.InstantPermanentUntilDeath
            },
            {
                opcode: RawEffectTypeEnum.MovementRateBonus2,
                type: RawEffectModifierTypeEnum.Set,
                value: 0,
                duration: grab.duration
            },
            {
                opcode: RawEffectTypeEnum.PlaySound,
                timing: RawEffectTimingEnum.InstantPermanentUntilDeath,
                resource: grab.startSound
            },
            {
                opcode: RawEffectTypeEnum.PlaySound,
                timing: RawEffectTimingEnum.DelayPermanent,
                duration: grab.duration,
                resource: grab.endSound
            },
            {
                opcode: RawEffectTypeEnum.PlayVisualEffect,
                playWhere: RawEffectVisualEffectLocationEnum.OverTargetAttached,
                resource: grab.visualEffect,
                duration: grab.duration
            },
            {
                opcode: RawEffectTypeEnum.DisplayPortraitIcon,
                icon: RawPortraitIconEnum.Entangled,
                duration: grab.duration
            },
            {
                opcode: RawEffectTypeEnum.DexterityBonus,
                value: 8,
                type: RawEffectStatisticModifierEnum.Set,
                duration: grab.duration
            },
            {
                opcode: RawEffectTypeEnum.ProtectionFromSpell,
                resource: grab.file
            }
        ]
        const effects = this.effectService.getEffects(rawEffects);
        const immunityEffects = this.getGrabImmuneEffects(creature, grab);
        return [...immunityEffects, ...effects];
    }

    private getGrabImmuneEffects(creature: Creature, grab: GrabFullConfig): Effect[] {
        if (!creature.data.size) throw new Error(`Creature size is needed to add grab immunities`);
        const races: RaceIdentifiers[] = [...GrabImmuneCreatures.races];
        const classes: ClassIdentifiers[] = [...GrabImmuneCreatures.classes];
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
                idsEntry: `${this.utils.getIdsValue('race', i)}`,
                duration: 1,
                target: RawEffectTargetEnum.PresetTarget,
                resource: grab.file
            });
        }
        for (const i of classes) {
            rawEffects.push({
                opcode: RawEffectTypeEnum.UseEFFFile,
                idsFile: RawEffectIDSFileEnum.CLASS,
                idsEntry: `${this.utils.getIdsValue('class', i)}`,
                duration: 1,
                target: RawEffectTargetEnum.PresetTarget,
                resource: grab.file
            });
        }
        const effects = this.effectService.getEffects(rawEffects);
        return effects;
    }

}