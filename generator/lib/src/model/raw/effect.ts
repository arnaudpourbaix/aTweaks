import { GeneralIdentifiers } from "../ids/general";
import { SlotIdentifiers } from "../ids/slot";
import { SplStateIdentifiers } from "../ids/splstate";
import { ModifyStatsIdentifiers } from "../ids/stats";
import { RawEffectTypeEnum, RawSpecialEffectTypeEnum } from "./effect.type";
import {
  RawBerserkType,
  RawBonusHPHealFlag,
  RawCastSpellOnConditionTarget,
  RawCastSpellOnConditionType,
  RawCharmType,
  RawColor,
  RawDiseaseType,
  RawDispelEffectType,
  RawDispelEffectWeaponType,
  RawEffectBonusToEnum,
  RawEffectCastSpellType,
  RawEffectColorLocation,
  RawEffectDamageModeEnum,
  RawEffectDamageTypeEnum,
  RawEffectDispelResistanceEnum,
  RawEffectFlagsEnum,
  RawEffectHasteType,
  RawEffectIDSFile,
  RawEffectModifierTypeEnum,
  RawEffectStatisticModifierEnum,
  RawEffectTargetEnum,
  RawEffectTeleportType,
  RawEffectTimingEnum,
  RawEffectVisualEffectLocationEnum,
  RawKillTargetDeathType,
  RawLightingEffectEnum,
  RawLightingEffectTargetEnum,
  RawPoisonTypeEnum,
  RawPortraitIconEnum,
  RawProficiencyType,
  RawProtectionFromWeaponsType,
  RawRegenerationType,
  RawSaveTypeEnum,
  RawTranslucencyType,
} from "./enum";

export interface RawBaseEffect {
  // opcode: RawEffectTypeEnum;
  target?: RawEffectTargetEnum;
  power?: number;
  /**
   * default: InstantLimited
   */
  timing?: RawEffectTimingEnum;
  /**
   * default: NaturalNonMagical
   */
  dispelResistance?: RawEffectDispelResistanceEnum;
  duration?: number;
  /**
   * default 100
   */
  probability1?: number;
  probability2?: number;
  saveTypes?: RawSaveTypeEnum[];
  saveBonus?: number;
  diceThrown?: number;
  diceSize?: number;
  flags?: RawEffectFlagsEnum[];
  resource?: string;
  special?: number;
  /**
   * Global effect
   */
  global?: boolean;
  comment?: string;
}

export interface RawSharedEffect {
  target?: RawEffectTargetEnum;
  power?: number;
  timing?: RawEffectTimingEnum;
  dispelResistance?: RawEffectDispelResistanceEnum;
  duration?: number;
  probability1?: number;
  probability2?: number;
  saveTypes?: RawSaveTypeEnum[];
  saveBonus?: number;
}

export type ArmorClassBonusEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.ArmorClassBonus;
  value: number;
  bonusTo: RawEffectBonusToEnum;
};

export type CastSpellEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.CastSpell;
  castingLevel?: number;
  type: RawEffectCastSpellType;
};

export type DamageEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.Damage;
  amount?: number;
  type: RawEffectDamageTypeEnum;
  damageMode?: RawEffectDamageModeEnum;
};

export type SetColorEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.SetColor;
  color: RawColor;
  location: RawEffectColorLocation;
};

export type ColorPulseEffect = RawBaseEffect & {
  opcode:
    | RawEffectTypeEnum.CharacterColorPulse
    | RawEffectTypeEnum.SetColorGlowPulse;
  color: {
    red: number;
    green: number;
    blue: number;
  };
  location: RawEffectColorLocation;
  cycleSpeed: number;
};

export type SetColorGlowEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.SetColorGlowSolid;
  color: {
    red: number;
    green: number;
    blue: number;
  };
  location: RawEffectColorLocation;
};

export type StatisticModifierEffect = RawBaseEffect & {
  opcode:
    | RawEffectTypeEnum.DexterityBonus
    | RawEffectTypeEnum.IntelligenceBonus
    | RawEffectTypeEnum.StrengthBonus
    | RawEffectTypeEnum.ConstitutionBonus
    | RawEffectTypeEnum.SlashingResistanceModifier
    | RawEffectTypeEnum.CrushingResistanceModifier
    | RawEffectTypeEnum.PiercingResistanceModifier
    | RawEffectTypeEnum.MissilesResistanceModifier
    | RawEffectTypeEnum.FireResistanceModifier
    | RawEffectTypeEnum.ColdResistanceModifier
    | RawEffectTypeEnum.MagicalColdResistanceModifier
    | RawEffectTypeEnum.MagicalFireResistanceModifier
    | RawEffectTypeEnum.AcidResistanceModifier
    | RawEffectTypeEnum.ElectricityResistanceModifier
    | RawEffectTypeEnum.MagicDamageResistanceModifier
    | RawEffectTypeEnum.MaximumHPModifier
    | RawEffectTypeEnum.MoraleModifier
    | RawEffectTypeEnum.MoraleBreakModifier
    | RawEffectTypeEnum.FatigueBonus
    | RawEffectTypeEnum.AllSavingThrowsBonus
    | RawEffectTypeEnum.SaveVsBreathModifier
    | RawEffectTypeEnum.SaveVsDeathModifier
    | RawEffectTypeEnum.SaveVsPetrificationModifier
    | RawEffectTypeEnum.SaveVsSpellModifier
    | RawEffectTypeEnum.SaveVsWandModifier;
  value: number;
  type: RawEffectStatisticModifierEnum;
};

export type ModifierTypeEffect = RawBaseEffect & {
  opcode:
    | RawEffectTypeEnum.MovementRateBonus
    | RawEffectTypeEnum.MovementRateBonus2
    | RawEffectTypeEnum.Thac0Bonus
    | RawEffectTypeEnum.OffhandThac0Bonus;
  value: number;
  type: RawEffectModifierTypeEnum;
};

export type IconEffect = RawBaseEffect & {
  opcode:
    | RawEffectTypeEnum.DisplayPortraitIcon
    | RawEffectTypeEnum.PreventPortraitIcon;
  icon: RawPortraitIconEnum;
};

export type StringRefEffect = RawBaseEffect & {
  opcode:
    | RawEffectTypeEnum.DisplayString
    | RawEffectTypeEnum.ProtectionFromSpell
    | RawEffectTypeEnum.ProtectionFromDisplaySpecificString;
  stringRef?: number;
};

export type LightingEffectsEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.LightingEffects;
  lightingTarget: RawLightingEffectTargetEnum;
  effect: RawLightingEffectEnum;
};

export type PlayVisualEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.PlayVisualEffect;
  playWhere: RawEffectVisualEffectLocationEnum;
  resource: string;
};

export type IdsEffect = RawBaseEffect & {
  opcode:
    | RawEffectTypeEnum.Slay
    | RawEffectTypeEnum.UseEFFFile
    | RawEffectTypeEnum.Paralyze
    | RawEffectTypeEnum.Hold
    | RawEffectTypeEnum.DamageVsCreatureTypeModifier
    | RawEffectTypeEnum.Thac0VsCreatureTypeModifier;
  idsEntry: string;
  idsFile: RawEffectIDSFile;
};

export type HasteEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.Haste;
  type: RawEffectHasteType;
};

export type ProtectionFromOpcodeEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.ProtectionFromOpcode;
  type: RawEffectTypeEnum;
};

export type PoisonEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.Poison;
  amount: number;
  type: RawPoisonTypeEnum;
};

export type PoisonResistanceModifierEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.PoisonResistanceModifier;
  value: number;
};

export type ProtectionFromResourceEffect = RawBaseEffect & {
  opcode:
    | RawEffectTypeEnum.ProtectionFromResource
    | RawEffectTypeEnum.ProtectionFromResourceAndMessage;
  value: string;
  type: string;
};

export type ScriptingStateModifierEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.ScriptingStateModifier;
  value: number;
  state: ModifyStatsIdentifiers;
};

export type SetExtendedSpellStateEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.SetExtendedSpellState;
  state: SplStateIdentifiers | string;
};

export type CreatureRGBColorFadeEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.CreatureRGBColorFade;
  color: {
    red: number;
    green: number;
    blue: number;
  };
  fadeSpeed: number;
};

export type TeleportEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.Teleport;
  type: RawEffectTeleportType;
};

export type DiseaseEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.Disease;
  amount: number;
  type: RawDiseaseType;
  icon?: RawPortraitIconEnum;
};

export type RegenerationEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.Regeneration;
  amount: number;
  type: RawRegenerationType;
  icon?: RawPortraitIconEnum;
};

export type SleepEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.Sleep | RawEffectTypeEnum.Sleep20HP;
  wakeOnDamage: boolean;
};

export type CharmCreatureEffect = RawBaseEffect & {
  opcode:
    | RawEffectTypeEnum.CharmCreature
    | RawEffectTypeEnum.CharmControlCreature;
  generalType: GeneralIdentifiers;
  charmType: RawCharmType;
};

export type ProtectionFromProjectileEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.ProtectionFromProjectile;
  projectile: number;
};

export type PolymorphIntoSpecificEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.PolymorphIntoSpecific;
  type: number;
};

export type KillTargetEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.KillTarget;
  displayText: boolean;
  type: RawKillTargetDeathType;
};

export type LevelDrainEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.LevelDrain;
  amount: number;
};

export type BerserkEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.Berserk;
  type: RawBerserkType;
};

export type ProficiencyModifierEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.ProficiencyModifier;
  amount: number;
  type: RawProficiencyType;
};

export type ProtectionFromWeaponsEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.ProtectionFromWeapons;
  enchantment: number;
  type: RawProtectionFromWeaponsType;
};

export type TranslucencyEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.Translucency;
  amount: number;
  type: RawTranslucencyType;
};

export type MinimumHPEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.MinimumHP;
  value: number;
};

export type CastSpellOnConditionEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.CastSpellOnCondition;
  conditionTarget: RawCastSpellOnConditionTarget;
  condition: RawCastSpellOnConditionType;
};

export type RemoveSpellTypeProtectionsEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.RemoveSpellTypeProtections;
  maximumLevel: number;
  type: string;
};

export type DispelEffectsEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.DispelEffects;
  level: number;
  dispelType?: RawDispelEffectType;
  magicWeaponDispelType?: RawDispelEffectWeaponType;
};

export type CurrentHPbonusEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.CurrentHPbonus;
  value: number;
  type: RawEffectModifierTypeEnum;
  healFlags?: RawBonusHPHealFlag;
};

export type CreateItemInSlotEffect = RawBaseEffect & {
  opcode: RawEffectTypeEnum.CreateItemInSlot;
  slot: SlotIdentifiers;
};

export type RestrainedEffect = RawBaseEffect & {
  opcode: RawSpecialEffectTypeEnum.RestrainedEffects;
};

export type CureAllEffectsEffect = RawBaseEffect & {
  opcode: RawSpecialEffectTypeEnum.CureAllEffects;
};

export type ParamLessEffect = RawBaseEffect & {
  opcode:
    | RawEffectTypeEnum.Blindness
    | RawEffectTypeEnum.Confusion
    | RawEffectTypeEnum.CureBerserk
    | RawEffectTypeEnum.CureBlindness
    | RawEffectTypeEnum.CureConfusion
    | RawEffectTypeEnum.CureDeafness
    | RawEffectTypeEnum.CureDisease
    | RawEffectTypeEnum.CureFeeblemindedness
    | RawEffectTypeEnum.CurePoison
    | RawEffectTypeEnum.CureSleep
    | RawEffectTypeEnum.CureStun
    | RawEffectTypeEnum.Blur
    | RawEffectTypeEnum.DeathKill60HP
    | RawEffectTypeEnum.ImmunityToTurnUndead
    | RawEffectTypeEnum.Infravision
    | RawEffectTypeEnum.InvisibilityDetection
    | RawEffectTypeEnum.ModifyCollisionBehavior
    | RawEffectTypeEnum.Panic
    | RawEffectTypeEnum.Petrification
    | RawEffectTypeEnum.PlaySound
    | RawEffectTypeEnum.ProtectionFromAnimation
    | RawEffectTypeEnum.ProtectionFromBackstab
    | RawEffectTypeEnum.ProtectionFromProjectile
    | RawEffectTypeEnum.RemoveFear
    | RawEffectTypeEnum.RemoveItem
    | RawEffectTypeEnum.RemoveParalysis
    | RawEffectTypeEnum.RemoveSpecificAreaEffect
    | RawEffectTypeEnum.RemoveSpell
    | RawEffectTypeEnum.Slow
    | RawEffectTypeEnum.Stun
    | RawEffectTypeEnum.Stun90HP
    | RawEffectTypeEnum.Web;
};

export type RawEffect =
  | ParamLessEffect
  | ArmorClassBonusEffect
  | BerserkEffect
  | CastSpellEffect
  | CastSpellOnConditionEffect
  | ColorPulseEffect
  | CharmCreatureEffect
  | CreateItemInSlotEffect
  | CreatureRGBColorFadeEffect
  | CurrentHPbonusEffect
  | DamageEffect
  | DiseaseEffect
  | DispelEffectsEffect
  | HasteEffect
  | IconEffect
  | IdsEffect
  | KillTargetEffect
  | LevelDrainEffect
  | LightingEffectsEffect
  | MinimumHPEffect
  | ModifierTypeEffect
  | PlayVisualEffect
  | PoisonEffect
  | PoisonResistanceModifierEffect
  | PolymorphIntoSpecificEffect
  | ProficiencyModifierEffect
  | ProtectionFromOpcodeEffect
  | ProtectionFromProjectileEffect
  | ProtectionFromResourceEffect
  | ProtectionFromWeaponsEffect
  | RegenerationEffect
  | RemoveSpellTypeProtectionsEffect
  | ScriptingStateModifierEffect
  | SetColorEffect
  | SetColorGlowEffect
  | SetExtendedSpellStateEffect
  | SleepEffect
  | StatisticModifierEffect
  | StringRefEffect
  | TeleportEffect
  | TranslucencyEffect
  | RestrainedEffect
  | CureAllEffectsEffect;
