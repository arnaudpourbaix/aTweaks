export const EFFECT_GROUP_NAMES = [
  "RestrainedEffects",
  "CureAllEffects",
  "ParalyzeEffects",
  "PoisonTypeEffects",
] as const;

export type EffectGroupName = (typeof EFFECT_GROUP_NAMES)[number];
