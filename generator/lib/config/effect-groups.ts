import { RawEffect } from "../src/model/raw/effect";
import { RawEffectTiming, RawSaveType } from "../src/model/raw/enum";
import { RawEffectGroupName } from "./effect-group-name";

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
          stringRef: 4003, //FIXME:
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
];
