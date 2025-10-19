import {
  RawBaseEffect,
  RawEffect,
  RawEffectGroup,
  RawParalyzeEffectGroup,
  RawPoisonTypeEffectGroup,
} from "../src/model/raw/effect";
import { RawEffectTiming, RawSaveType } from "../src/model/raw/enum";
import { PoisonService } from "../src/services/poison.service";
import { RawEffectGroupName } from "./effect-group-name";
import { TraStringReferenceEnum } from "./stringRef";

export const EFFECT_GROUPS: {
  group: RawEffectGroupName;
  effectsFn: (effect: RawEffectGroup) => RawEffect[];
}[] = [
  {
    group: "RestrainedEffects",
    effectsFn: (effect) => {
      const base: { saveTypes?: RawSaveType[]; saveBonus?: number } = {
        saveTypes: effect.saveTypes,
        saveBonus: effect.saveBonus,
      };
      const duration: { timing?: RawEffectTiming; duration?: number } = {
        timing: "InstantLimited",
        duration: effect.duration,
      };
      const rawEffects: RawEffect[] = [
        {
          opcode: "DisplayString",
          stringRef: TraStringReferenceEnum.Restrained,
          timing: "InstantPermanentUntilDeath",
          ...base,
        },
        {
          opcode: "LightingEffects",
          timing: "InstantPermanentUntilDeath",
          lightingTarget: "SpellTarget",
          effect: "AbjurationEarth",
          ...base,
        },
        {
          opcode: "Slow",
          ...duration,
          ...base,
        },
        {
          opcode: "MovementRateBonus2",
          type: "Set",
          value: 0,
          ...duration,
          ...base,
        },
        {
          opcode: "Thac0Bonus",
          type: "Increment",
          value: -4,
          ...duration,
          ...base,
        },
        {
          opcode: "ArmorClassBonus",
          value: -4,
          bonusTo: "AllWeapons",
          ...duration,
          ...base,
        },
        {
          opcode: "SaveVsBreathModifier",
          value: -4,
          type: "Increment",
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
      const base: RawBaseEffect = {
        timing: "InstantPermanentUntilDeath",
        target: "Self",
      };
      const rawEffects: RawEffect[] = [
        {
          opcode: "CureBerserk",
          ...base,
        },
        {
          opcode: "CureBlindness",
          ...base,
        },
        {
          opcode: "CureConfusion",
          ...base,
        },
        {
          opcode: "CureDeafness",
          ...base,
        },
        {
          opcode: "CureDisease",
          ...base,
        },
        {
          opcode: "CureFeeblemindedness",
          ...base,
        },
        {
          opcode: "CurePoison",
          ...base,
        },
        {
          opcode: "CureSleep",
          ...base,
        },
        {
          opcode: "CureStun",
          ...base,
        },
        {
          opcode: "RemoveParalysis",
          ...base,
        },
        {
          opcode: "RemoveFear",
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
      const base: { saveTypes?: RawSaveType[]; saveBonus?: number } = {
        saveTypes: effect.saveTypes,
        saveBonus: effect.saveBonus,
      };
      const duration: { timing?: RawEffectTiming; duration?: number } = {
        timing: "InstantLimited",
        duration: effect.duration,
      };
      const rawEffects: RawEffect[] = [
        {
          opcode: "Paralyze",
          idsFile: "EA",
          idsEntry: "ANYONE",
          ...duration,
          ...base,
        },
        {
          opcode: "DisplayPortraitIcon",
          icon: "Held",
          ...duration,
          ...base,
        },
        {
          opcode: "PlaySound",
          timing: "InstantPermanentUntilDeath",
          resource: "EFF_P11",
          ...base,
        },
        {
          opcode: "PlaySound",
          resource: "EFF_E05",
          ...duration,
          timing: "DelayPermanent",
          ...base,
        },
        {
          opcode: "CharacterColorPulse",
          timing: "InstantPermanentUntilDeath",
          color: { blue: 0, green: 57, red: 87 },
          location: "ArmorGreyBeltAmulet",
          cycleSpeed: 25,
          ...base,
        },
        {
          opcode: "LightingEffects",
          timing: "InstantPermanentUntilDeath",
          lightingTarget: "SpellTarget",
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
