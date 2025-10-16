export type RawEffectGroupName =
  | "RestrainedEffects"
  | "CureAllEffects"
  | "ParalyzeEffects"
  | "PoisonTypeEffects";

export const EFFECT_GROUP_NAMES: (RawEffectGroupName | string)[] = [
  "RestrainedEffects",
  "CureAllEffects",
  "ParalyzeEffects",
  "PoisonTypeEffects",
];
