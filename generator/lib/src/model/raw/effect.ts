import { RawEffectGroupName } from "../../../config/effect-group-name";
import { GeneralIdentifier } from "../ids/general";
import { SlotIdentifier } from "../ids/slot";
import { SplStateIdentifier } from "../ids/splstate";
import { StatsIdentifier } from "../ids/stats";
import { StringReference } from "../misc";
import { RawEffectOpcode } from "./effect.type";
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
  RawEffectBonusTo,
  RawEffectCastSpellType,
  RawEffectColorLocation,
  RawEffectDamageMode,
  RawEffectDamageType,
  RawEffectDispelResistance,
  RawEffectFlags,
  RawEffectHasteType,
  RawEffectIDSFile,
  RawEffectModifierType,
  RawEffectStatisticModifier,
  RawEffectTarget,
  RawEffectTeleportType,
  RawEffectTiming,
  RawEffectVisualEffectLocation,
  RawInvisibilityType,
  RawKillTargetDeathType,
  RawLightingEffect,
  RawLightingEffectTarget,
  RawPoisonType,
  RawPortraitIcon,
  RawProficiencyType,
  RawProtectionFromWeaponsType,
  RawRegenerationType,
  RawSaveType,
  RawTranslucencyType,
} from "./enum";

export interface RawBaseEffect {
  // opcode: RawEffectTypeEnum;
  target?: RawEffectTarget;
  power?: number;
  /**
   * default: InstantLimited
   */
  timing?: RawEffectTiming;
  /**
   * default: NaturalNonMagical
   */
  dispelResistance?: RawEffectDispelResistance;
  duration?: number;
  /**
   * default 100
   */
  probability1?: number;
  probability2?: number;
  saveTypes?: RawSaveType[];
  saveBonus?: number;
  diceThrown?: number;
  diceSize?: number;
  flags?: RawEffectFlags[];
  resource?: string;
  special?: number;
  /**
   * Global effect
   */
  global?: boolean;
  comment?: string;
}

export type ArmorClassBonusEffect = RawBaseEffect & {
  opcode: "ArmorClassBonus";
  value: number;
  bonusTo: RawEffectBonusTo;
};

export type CastSpellEffect = RawBaseEffect & {
  opcode: "CastSpell";
  castingLevel?: number;
  type: RawEffectCastSpellType;
};

export type DamageEffect = RawBaseEffect & {
  opcode: "Damage";
  amount?: number;
  type: RawEffectDamageType;
  damageMode?: RawEffectDamageMode;
};

export type SetColorEffect = RawBaseEffect & {
  opcode: "SetColor";
  color: RawColor;
  location: RawEffectColorLocation;
};

export type ColorPulseEffect = RawBaseEffect & {
  opcode: "CharacterColorPulse" | "SetColorGlowPulse";
  color: {
    red: number;
    green: number;
    blue: number;
  };
  location: RawEffectColorLocation;
  cycleSpeed: number;
};

export type SetColorGlowEffect = RawBaseEffect & {
  opcode: "SetColorGlowSolid";
  color: {
    red: number;
    green: number;
    blue: number;
  };
  location: RawEffectColorLocation;
};

export type StatisticModifierEffect = RawBaseEffect & {
  opcode:
    | "DexterityBonus"
    | "IntelligenceBonus"
    | "StrengthBonus"
    | "ConstitutionBonus"
    | "SlashingResistanceModifier"
    | "CrushingResistanceModifier"
    | "PiercingResistanceModifier"
    | "MissilesResistanceModifier"
    | "FireResistanceModifier"
    | "ColdResistanceModifier"
    | "MagicalColdResistanceModifier"
    | "MagicalFireResistanceModifier"
    | "AcidResistanceModifier"
    | "ElectricityResistanceModifier"
    | "MagicDamageResistanceModifier"
    | "MaximumHPModifier"
    | "MoraleModifier"
    | "MoraleBreakModifier"
    | "FatigueBonus"
    | "AllSavingThrowsBonus"
    | "SaveVsBreathModifier"
    | "SaveVsDeathModifier"
    | "SaveVsPetrificationModifier"
    | "SaveVsSpellModifier"
    | "SaveVsWandModifier";
  value: number;
  type: RawEffectStatisticModifier;
};

export type ModifierTypeEffect = RawBaseEffect & {
  opcode:
    | "MovementRateBonus"
    | "MovementRateBonus2"
    | "Thac0Bonus"
    | "OffhandThac0Bonus";
  value: number;
  type: RawEffectModifierType;
};

export type IconEffect = RawBaseEffect & {
  opcode: "DisplayPortraitIcon" | "PreventPortraitIcon";
  icon: RawPortraitIcon;
};

export type StringRefEffect = RawBaseEffect & {
  opcode:
    | "DisplayString"
    | "ProtectionFromSpell"
    | "ProtectionFromDisplaySpecificString";
  stringRef?: StringReference;
};

export type LightingEffectsEffect = RawBaseEffect & {
  opcode: "LightingEffects";
  lightingTarget: RawLightingEffectTarget;
  effect: RawLightingEffect;
};

export type PlayVisualEffect = RawBaseEffect & {
  opcode: "PlayVisualEffect";
  playWhere: RawEffectVisualEffectLocation;
  resource: string;
};

export type IdsEffect = RawBaseEffect & {
  opcode:
    | "Slay"
    | "UseEFFFile"
    | "Paralyze"
    | "Hold"
    | "DamageVsCreatureTypeModifier"
    | "Thac0VsCreatureTypeModifier";
  idsEntry: string;
  idsFile: RawEffectIDSFile;
};

export type HasteEffect = RawBaseEffect & {
  opcode: "Haste";
  type: RawEffectHasteType;
};

export type ProtectionFromOpcodeEffect = RawBaseEffect & {
  opcode: "ProtectionFromOpcode";
  type: RawEffectOpcode;
};

export type PoisonEffect = RawBaseEffect & {
  opcode: "Poison";
  amount: number;
  type: RawPoisonType;
};

export type PoisonResistanceModifierEffect = RawBaseEffect & {
  opcode: "PoisonResistanceModifier";
  value: number;
};

export type ProtectionFromResourceEffect = RawBaseEffect & {
  opcode: "ProtectionFromResource" | "ProtectionFromResourceAndMessage";
  value: string;
  type: string;
};

export type ScriptingStateModifierEffect = RawBaseEffect & {
  opcode: "ScriptingStateModifier";
  value: number;
  state: StatsIdentifier;
};

export type SetExtendedSpellStateEffect = RawBaseEffect & {
  opcode: "SetExtendedSpellState";
  state: SplStateIdentifier | string;
};

export type CreatureRGBColorFadeEffect = RawBaseEffect & {
  opcode: "CreatureRGBColorFade";
  color: {
    red: number;
    green: number;
    blue: number;
  };
  fadeSpeed: number;
};

export type TeleportEffect = RawBaseEffect & {
  opcode: "Teleport";
  type: RawEffectTeleportType;
};

export type DiseaseEffect = RawBaseEffect & {
  opcode: "Disease";
  amount: number;
  type: RawDiseaseType;
  icon?: RawPortraitIcon;
};

export type RegenerationEffect = RawBaseEffect & {
  opcode: "Regeneration";
  amount: number;
  type: RawRegenerationType;
  icon?: RawPortraitIcon;
};

export type SleepEffect = RawBaseEffect & {
  opcode: "Sleep" | "Sleep20HP";
  wakeOnDamage: boolean;
};

export type CharmCreatureEffect = RawBaseEffect & {
  opcode: "CharmCreature" | "CharmControlCreature";
  generalType: GeneralIdentifier;
  charmType: RawCharmType;
};

export type ProtectionFromProjectileEffect = RawBaseEffect & {
  opcode: "ProtectionFromProjectile";
  projectile: number;
};

export type PolymorphIntoSpecificEffect = RawBaseEffect & {
  opcode: "PolymorphIntoSpecific";
  type: number;
};

export type KillTargetEffect = RawBaseEffect & {
  opcode: "KillTarget";
  displayText: boolean;
  type: RawKillTargetDeathType;
};

export type LevelDrainEffect = RawBaseEffect & {
  opcode: "LevelDrain";
  amount: number;
};

export type BerserkEffect = RawBaseEffect & {
  opcode: "Berserk";
  type: RawBerserkType;
};

export type ProficiencyModifierEffect = RawBaseEffect & {
  opcode: "ProficiencyModifier";
  amount: number;
  type: RawProficiencyType;
};

export type ProtectionFromWeaponsEffect = RawBaseEffect & {
  opcode: "ProtectionFromWeapons";
  enchantment: number;
  type: RawProtectionFromWeaponsType;
};

export type TranslucencyEffect = RawBaseEffect & {
  opcode: "Translucency";
  amount: number;
  type: RawTranslucencyType;
};

export type MinimumHPEffect = RawBaseEffect & {
  opcode: "MinimumHP";
  value: number;
};

export type CastSpellOnConditionEffect = RawBaseEffect & {
  opcode: "CastSpellOnCondition";
  conditionTarget: RawCastSpellOnConditionTarget;
  condition: RawCastSpellOnConditionType;
};

export type RemoveSpellTypeProtectionsEffect = RawBaseEffect & {
  opcode: "RemoveSpellTypeProtections";
  maximumLevel: number;
  type: string;
};

export type DispelEffectsEffect = RawBaseEffect & {
  opcode: "DispelEffects";
  level: number;
  dispelType?: RawDispelEffectType;
  magicWeaponDispelType?: RawDispelEffectWeaponType;
};

export type CurrentHPbonusEffect = RawBaseEffect & {
  opcode: "CurrentHPbonus";
  value: number;
  type: RawEffectModifierType;
  healFlags?: RawBonusHPHealFlag;
};

export type CreateItemInSlotEffect = RawBaseEffect & {
  opcode: "CreateItemInSlot";
  slot: SlotIdentifier;
};

export type RawEffectGroup = RawBaseEffect & {
  opcode: RawEffectGroupName;
};

export type RemoveOpcodeEffect = RawBaseEffect & {
  opcode: "RemoveOpcode";
  opcodeToRemove: RawEffectOpcode;
  param: string;
};

export type InvisibilityEffect = RawBaseEffect & {
  opcode: "Invisibility";
  type: RawInvisibilityType;
};

export type ParamLessEffect = RawBaseEffect & {
  opcode:
    | "Blindness"
    | "Confusion"
    | "CureBerserk"
    | "CureBlindness"
    | "CureConfusion"
    | "CureDeafness"
    | "CureDisease"
    | "CureFeeblemindedness"
    | "CurePoison"
    | "CureSleep"
    | "CureStun"
    | "Blur"
    | "DeathKill60HP"
    | "ImmunityToTurnUndead"
    | "Infravision"
    | "InvisibilityDetection"
    | "ModifyCollisionBehavior"
    | "Panic"
    | "Petrification"
    | "PlaySound"
    | "ProtectionFromAnimation"
    | "ProtectionFromBackstab"
    | "ProtectionFromProjectile"
    | "RemoveFear"
    | "RemoveItem"
    | "RemoveParalysis"
    | "RemoveSpecificAreaEffect"
    | "RemoveSpell"
    | "Slow"
    | "Stun"
    | "Stun90HP"
    | "Web";
};

export type RawEffect =
  | ParamLessEffect
  | RawEffectGroup
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
  | InvisibilityEffect
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
  | RemoveOpcodeEffect
  | RemoveSpellTypeProtectionsEffect
  | ScriptingStateModifierEffect
  | SetColorEffect
  | SetColorGlowEffect
  | SetExtendedSpellStateEffect
  | SleepEffect
  | StatisticModifierEffect
  | StringRefEffect
  | TeleportEffect
  | TranslucencyEffect;
