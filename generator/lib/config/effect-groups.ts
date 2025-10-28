import { BaseEffect, Effect } from "../src/model/spell-item/effect";
import {
  EffectBonusToEnum,
  EffectColorLocationEnum,
  EffectIDSFileEnum,
  EffectModifierTypeEnum,
  EffectStatisticModifierEnum,
  EffectTargetEnum,
  EffectTimingEnum,
  LightingEffectEnum,
  LightingEffectTargetEnum,
  PortraitIconEnum,
  SaveTypeEnum,
} from "../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../src/model/spell-item/effect.type";
import { PoisonService } from "../src/services/poison.service";
import { EffectGroupName } from "./effect-group-name";

export const EFFECT_GROUPS: {
  group: EffectGroupName;
  effectsFn: (effect: RawEffectGroup) => Effect[];
}[] = [
  {
    group: "RestrainedEffects",
    effectsFn: (effect) => {
      const base: { saveTypes?: SaveTypeEnum[]; saveBonus?: number } = {
        saveTypes: effect.saveTypes,
        saveBonus: effect.saveBonus,
      };
      const duration: { timing?: EffectTimingEnum; duration?: number } = {
        timing: EffectTimingEnum.InstantLimited,
        duration: effect.duration,
      };
      const rawEffects: Effect[] = [
        {
          opcode: EffectTypeEnum.DisplayString,
          stringRef: "spell.restrained",
          timing: EffectTimingEnum.InstantPermanentUntilDeath,
          ...base,
        },
        {
          opcode: EffectTypeEnum.LightingEffects,
          timing: EffectTimingEnum.InstantPermanentUntilDeath,
          lightingTarget: LightingEffectTargetEnum.SpellTarget,
          effect: LightingEffectEnum.AbjurationEarth,
          ...base,
        },
        {
          opcode: EffectTypeEnum.Slow,
          ...duration,
          ...base,
        },
        {
          opcode: EffectTypeEnum.MovementRateBonus2,
          type: EffectModifierTypeEnum.Set,
          value: 0,
          ...duration,
          ...base,
        },
        {
          opcode: EffectTypeEnum.Thac0Bonus,
          type: EffectModifierTypeEnum.Increment,
          value: -4,
          ...duration,
          ...base,
        },
        {
          opcode: EffectTypeEnum.ArmorClassBonus,
          value: -4,
          bonusTo: EffectBonusToEnum.AllWeapons,
          ...duration,
          ...base,
        },
        {
          opcode: EffectTypeEnum.SaveVsBreathModifier,
          value: -4,
          type: EffectStatisticModifierEnum.Increment,
          ...duration,
          ...base,
        },
      ];
      return rawEffects;
    },
  },
  {
    group: "CureAllEffects",
    effectsFn: (effect) => {
      const base: BaseEffect = {
        timing: EffectTimingEnum.InstantPermanentUntilDeath,
        target: EffectTargetEnum.Self,
      };
      const rawEffects: Effect[] = [
        {
          opcode: EffectTypeEnum.CureBerserk,
          ...base,
        },
        {
          opcode: EffectTypeEnum.CureBlindness,
          ...base,
        },
        {
          opcode: EffectTypeEnum.CureConfusion,
          ...base,
        },
        {
          opcode: EffectTypeEnum.CureDeafness,
          ...base,
        },
        {
          opcode: EffectTypeEnum.CureDisease,
          ...base,
        },
        {
          opcode: EffectTypeEnum.CureFeeblemindedness,
          ...base,
        },
        {
          opcode: EffectTypeEnum.CurePoison,
          ...base,
        },
        {
          opcode: EffectTypeEnum.CureSleep,
          ...base,
        },
        {
          opcode: EffectTypeEnum.CureStun,
          ...base,
        },
        {
          opcode: EffectTypeEnum.RemoveParalysis,
          ...base,
        },
        {
          opcode: EffectTypeEnum.RemoveFear,
          ...base,
        },
      ];
      return rawEffects;
    },
  },
  {
    group: "ParalyzeEffects",
    effectsFn: (eff) => {
      const effect = eff as RawParalyzeEffectGroup;
      const base: { saveTypes?: SaveTypeEnum[]; saveBonus?: number } = {
        saveTypes: effect.saveTypes,
        saveBonus: effect.saveBonus,
      };
      const duration: { timing?: EffectTimingEnum; duration?: number } = {
        timing: EffectTimingEnum.InstantLimited,
        duration: effect.duration,
      };
      const rawEffects: Effect[] = [
        {
          opcode: EffectTypeEnum.Paralyze,
          idsFile: EffectIDSFileEnum.EA,
          idsEntry: "ANYONE",
          ...duration,
          ...base,
        },
        {
          opcode: EffectTypeEnum.DisplayPortraitIcon,
          icon: PortraitIconEnum.Held,
          ...duration,
          ...base,
        },
        {
          opcode: EffectTypeEnum.PlaySound,
          timing: EffectTimingEnum.InstantPermanentUntilDeath,
          resource: "EFF_P11",
          ...base,
        },
        {
          opcode: EffectTypeEnum.PlaySound,
          resource: "EFF_E05",
          ...duration,
          timing: EffectTimingEnum.DelayPermanent,
          ...base,
        },
        {
          opcode: EffectTypeEnum.CharacterColorPulse,
          timing: EffectTimingEnum.InstantPermanentUntilDeath,
          color: { blue: 0, green: 57, red: 87 },
          location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
          cycleSpeed: 25,
          ...base,
        },
        {
          opcode: EffectTypeEnum.LightingEffects,
          timing: EffectTimingEnum.InstantPermanentUntilDeath,
          lightingTarget: LightingEffectTargetEnum.SpellTarget,
          effect: effect.lightningEffect,
          ...base,
        },
      ];
      return rawEffects;
    },
  },
  {
    group: "PoisonTypeEffects",
    effectsFn: (eff) =>
      PoisonService.instance.getEffects(eff as RawPoisonTypeEffectGroup),
  },
];
