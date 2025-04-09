import { RawBaseEffect, RawEffect } from "../src/model/raw/effect";
import { RawEffectTiming, RawSaveType } from "../src/model/raw/enum";
import { RawEffectGroupName } from "./effect-group-name";
import { StringReferenceEnum } from "./stringRef";

export const EFFECT_GROUPS: {
  group: RawEffectGroupName;
  effectsFn: (effect: RawEffect) => RawEffect[];
}[] = [
  {
    group: "RestrainedEffects",
    effectsFn: (effect: RawEffect) => {
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
          stringRef: StringReferenceEnum.Restrained,
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
    effectsFn: (effect: RawEffect) => {
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
];
