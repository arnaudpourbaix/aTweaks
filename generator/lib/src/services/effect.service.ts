import { EFFECT_GROUP_NAMES } from "../../config/effect-group-name";
import { EFFECT_GROUPS } from "../../config/effect-groups";
import { BaseEffect, Effect } from "../model/final/effect";
import { EffectTypeEnum } from "../model/final/effect.type";
import {
  CastSpellOnConditionTargetEnum,
  CharmTypeEnum,
  ColorEnum,
  DiseaseTypeEnum,
  DispelEffectTypeEnum,
  DispelEffectWeaponTypeEnum,
  EffectBonusToEnum,
  EffectCastSpellTypeEnum,
  EffectColorLocationEnum,
  EffectDamageModeEnum,
  EffectDamageTypeEnum,
  EffectDispelResistanceEnum,
  EffectFlagsEnum,
  EffectHasteTypeEnum,
  EffectIDSFileEnum,
  EffectModifierTypeEnum,
  EffectStatisticModifierEnum,
  EffectTargetEnum,
  EffectTeleportTypeEnum,
  EffectTimingEnum,
  EffectVisualEffectLocationEnum,
  getCastSpellOnConditionValue,
  InvisibilityTypeEnum,
  KillTargetDeathTypeEnum,
  LightingEffectEnum,
  LightingEffectTargetEnum,
  OverrideCreatureDataFieldEnum,
  PoisonTypeEnum,
  PortraitIconEnum,
  ProficiencyTypeEnum,
  ProtectionFromWeaponsTypeEnum,
  RegenerationTypeEnum,
  SaveTypeEnum,
  TranslucencyTypeEnum,
} from "../model/final/enums";
import { StringReference } from "../model/misc";
import {
  ArmorClassBonusEffect,
  BerserkEffect,
  CastSpellEffect,
  CastSpellOnConditionEffect,
  CharmCreatureEffect,
  ColorPulseEffect,
  CreateItemInSlotEffect,
  CreatureRGBColorFadeEffect,
  CurrentHPbonusEffect,
  DamageEffect,
  DiseaseEffect,
  DispelEffectsEffect,
  HasteEffect,
  IconEffect,
  IdsEffect,
  InvisibilityEffect,
  KillTargetEffect,
  LevelDrainEffect,
  LightingEffectsEffect,
  MakeUnselectableEffect,
  MinimumHPEffect,
  ModifierTypeEffect,
  NoCollisionDetectionEffect,
  OverrideCreatureDataEffect,
  PlayVisualEffect,
  PoisonEffect,
  PolymorphIntoSpecificEffect,
  ProficiencyModifierEffect,
  ProtectionFromOpcodeEffect,
  ProtectionFromProjectileEffect,
  ProtectionFromResourceEffect,
  ProtectionFromWeaponsEffect,
  RawBaseEffect,
  RawEffect,
  RawEffectGroup,
  RegenerationEffect,
  RemoveOpcodeEffect,
  RemoveSpellTypeProtectionsEffect,
  ScriptingStateModifierEffect,
  SetColorEffect,
  SetExtendedSpellStateEffect,
  SleepEffect,
  StatisticModifierEffect,
  StringRefEffect,
  TeleportEffect,
  TranslucencyEffect,
} from "../model/raw/effect";
import { RawEffectOpcode } from "../model/raw/effect.type";
import { RawPortraitIcon } from "../model/raw/enum";
import { UtilsService } from "./utils.service";

export class EffectService {
  static instance = new EffectService();

  private utils = UtilsService.instance;

  getEffects(effects: RawEffect[]): Effect[] {
    const results: Effect[] = effects.reduce((acc, effect) => {
      if (EFFECT_GROUP_NAMES.includes(effect.opcode)) {
        acc.push(...this.getGroupEffects(effect as RawEffectGroup));
        return acc;
      }
      acc.push(this.getEffect(effect));
      return acc;
    }, [] as Effect[]);
    return results;
  }

  getEffect(effect: RawEffect): Effect {
    if (EFFECT_GROUP_NAMES.includes(effect.opcode))
      throw new Error(
        `Effects group ${effect.opcode} can't be processed in getEffect`
      );
    const result: Effect = {
      ...this.getBaseEffect(effect),
      opcode: EffectTypeEnum[effect.opcode as RawEffectOpcode],
      parameter1: "0",
      parameter2: "0",
    };
    switch (result.opcode) {
      case EffectTypeEnum.ArmorClassBonus:
        result.parameter1 = `${(<ArmorClassBonusEffect>effect).value}`;
        result.parameter2 = `${
          EffectBonusToEnum[(<ArmorClassBonusEffect>effect).bonusTo]
        }`;
        break;
      case EffectTypeEnum.CastSpell:
        result.parameter1 = `${(<CastSpellEffect>effect).castingLevel ?? 0}`;
        result.parameter2 = `${
          EffectCastSpellTypeEnum[(<CastSpellEffect>effect).type]
        }`;
        break;
      case EffectTypeEnum.Damage:
        this.damage(result, effect as DamageEffect);
        break;
      case EffectTypeEnum.DexterityBonus:
      case EffectTypeEnum.IntelligenceBonus:
      case EffectTypeEnum.StrengthBonus:
      case EffectTypeEnum.ConstitutionBonus:
      case EffectTypeEnum.SlashingResistanceModifier:
      case EffectTypeEnum.CrushingResistanceModifier:
      case EffectTypeEnum.PiercingResistanceModifier:
      case EffectTypeEnum.MissilesResistanceModifier:
      case EffectTypeEnum.FireResistanceModifier:
      case EffectTypeEnum.ColdResistanceModifier:
      case EffectTypeEnum.MagicalColdResistanceModifier:
      case EffectTypeEnum.MagicalFireResistanceModifier:
      case EffectTypeEnum.AcidResistanceModifier:
      case EffectTypeEnum.ElectricityResistanceModifier:
      case EffectTypeEnum.MagicDamageResistanceModifier:
      case EffectTypeEnum.MoraleModifier:
      case EffectTypeEnum.MaximumHPModifier:
      case EffectTypeEnum.MoraleBreakModifier:
      case EffectTypeEnum.FatigueBonus:
      case EffectTypeEnum.AllSavingThrowsBonus:
      case EffectTypeEnum.SaveVsBreathModifier:
      case EffectTypeEnum.SaveVsDeathModifier:
      case EffectTypeEnum.SaveVsPetrificationModifier:
      case EffectTypeEnum.SaveVsSpellModifier:
      case EffectTypeEnum.SaveVsWandModifier:
        result.parameter1 = `${(<StatisticModifierEffect>effect).value}`;
        result.parameter2 = `${
          EffectStatisticModifierEnum[(<StatisticModifierEffect>effect).type]
        }`;
        break;
      case EffectTypeEnum.AttackDamageBonus:
      case EffectTypeEnum.MovementRateBonus:
      case EffectTypeEnum.MovementRateBonus2:
      case EffectTypeEnum.Thac0Bonus:
      case EffectTypeEnum.OffhandThac0Bonus:
        result.parameter1 = `${(<ModifierTypeEffect>effect).value}`;
        result.parameter2 = `${
          EffectModifierTypeEnum[(<ModifierTypeEffect>effect).type]
        }`;
        break;
      case EffectTypeEnum.DisplayPortraitIcon:
      case EffectTypeEnum.PreventPortraitIcon:
        result.parameter2 = `${PortraitIconEnum[(<IconEffect>effect).icon]}`;
        break;
      case EffectTypeEnum.DisplayString:
      case EffectTypeEnum.ProtectionFromSpell:
      case EffectTypeEnum.ProtectionFromDisplaySpecificString:
        if ((<StringRefEffect>effect).stringRef) {
          result.parameter1 = `${this.utils.resolveStringRef(
            (<StringRefEffect>effect).stringRef as StringReference
          )}`;
        }
        break;
      case EffectTypeEnum.LightingEffects:
        result.parameter1 = `${
          LightingEffectTargetEnum[
            (<LightingEffectsEffect>effect).lightingTarget
          ]
        }`;
        result.parameter2 = `${
          LightingEffectEnum[(<LightingEffectsEffect>effect).effect]
        }`;
        break;
      case EffectTypeEnum.PlayVisualEffect:
        result.parameter2 = `${
          EffectVisualEffectLocationEnum[(<PlayVisualEffect>effect).playWhere]
        }`;
        break;
      case EffectTypeEnum.Slay:
      case EffectTypeEnum.UseEFFFile:
      case EffectTypeEnum.Paralyze:
      case EffectTypeEnum.Hold:
      case EffectTypeEnum.DamageVsCreatureTypeModifier:
      case EffectTypeEnum.Thac0VsCreatureTypeModifier:
        result.parameter1 = `IDS_OF_SYMBOL (~${(<IdsEffect>effect).idsFile}~ ~${
          (<IdsEffect>effect).idsEntry
        }~)`;
        result.parameter2 = `${EffectIDSFileEnum[(<IdsEffect>effect).idsFile]}`;
        break;
      case EffectTypeEnum.CharacterColorPulse:
      case EffectTypeEnum.SetColorGlowPulse:
        result.parameter1 = `${
          ((<ColorPulseEffect>effect).color.red << 8) +
          ((<ColorPulseEffect>effect).color.green << 16) +
          ((<ColorPulseEffect>effect).color.blue << 24)
        }`;
        result.parameter2 = `${
          EffectColorLocationEnum[(<ColorPulseEffect>effect).location] +
          ((<ColorPulseEffect>effect).cycleSpeed << 16)
        }`;
        break;
      case EffectTypeEnum.SetColor:
        result.parameter1 = `${ColorEnum[(<SetColorEffect>effect).color]}`;
        result.parameter2 = `${
          EffectColorLocationEnum[(<SetColorEffect>effect).location]
        }`;
        break;
      case EffectTypeEnum.SetColorGlowSolid:
        result.parameter1 = `${
          ((<ColorPulseEffect>effect).color.red << 8) +
          ((<ColorPulseEffect>effect).color.green << 16) +
          ((<ColorPulseEffect>effect).color.blue << 24)
        }`;
        result.parameter2 = `${
          EffectColorLocationEnum[(<SetColorEffect>effect).location]
        }`;
        break;
      case EffectTypeEnum.Haste:
        result.parameter2 = `${
          EffectHasteTypeEnum[(<HasteEffect>effect).type]
        }`;
        break;
      case EffectTypeEnum.ProtectionFromOpcode:
        result.parameter2 = `${
          EffectTypeEnum[(<ProtectionFromOpcodeEffect>effect).type]
        }`;
        break;
      case EffectTypeEnum.Poison:
        result.parameter1 = `${(<PoisonEffect>effect).amount}`;
        result.parameter2 = `${PoisonTypeEnum[(<PoisonEffect>effect).type]}`;
        break;
      case EffectTypeEnum.PoisonResistanceModifier:
        result.parameter1 = `${(<ArmorClassBonusEffect>effect).value}`;
        break;
      case EffectTypeEnum.ProtectionFromResource:
      case EffectTypeEnum.ProtectionFromResourceAndMessage:
        result.parameter1 = (<ProtectionFromResourceEffect>effect).value;
        result.parameter2 = (<ProtectionFromResourceEffect>effect).type;
        break;
      case EffectTypeEnum.ScriptingStateModifier:
        this.scriptingStateModifier(
          result,
          effect as ScriptingStateModifierEffect
        );
        break;
      case EffectTypeEnum.SetExtendedSpellState:
        result.parameter2 = `(IDS_OF_SYMBOL (~splstate~ ~${
          (effect as SetExtendedSpellStateEffect).state
        }~))`;
        result.special = 1;
        break;
      case EffectTypeEnum.CreatureRGBColorFade:
        result.parameter1 = `${
          ((<CreatureRGBColorFadeEffect>effect).color.red << 8) +
          ((<CreatureRGBColorFadeEffect>effect).color.green << 16) +
          ((<CreatureRGBColorFadeEffect>effect).color.blue << 24)
        }`;
        result.parameter2 = `${
          (<CreatureRGBColorFadeEffect>effect).fadeSpeed << 16
        }`;
        break;
      case EffectTypeEnum.Teleport:
        result.parameter2 = `${
          EffectTeleportTypeEnum[(<TeleportEffect>effect).type]
        }`;
        break;
      case EffectTypeEnum.MinimumHP:
        result.parameter1 = `${(<MinimumHPEffect>effect).value}`;
        break;
      case EffectTypeEnum.Disease:
        result.parameter1 = `${(<DiseaseEffect>effect).amount}`;
        result.parameter2 = `${DiseaseTypeEnum[(<DiseaseEffect>effect).type]}`;
        if ((<DiseaseEffect>effect).icon)
          result.special =
            PortraitIconEnum[(<DiseaseEffect>effect).icon as RawPortraitIcon];
        break;
      case EffectTypeEnum.Regeneration:
        result.parameter1 = `${(<RegenerationEffect>effect).amount}`;
        result.parameter2 = `${
          RegenerationTypeEnum[(<RegenerationEffect>effect).type]
        }`;
        if ((<RegenerationEffect>effect).icon)
          result.special =
            PortraitIconEnum[
              (<RegenerationEffect>effect).icon as RawPortraitIcon
            ];
        break;
      case EffectTypeEnum.Sleep:
      case EffectTypeEnum.Sleep20HP:
        result.parameter2 = `${(<SleepEffect>effect).wakeOnDamage ? 0 : 1}`;
        break;
      case EffectTypeEnum.CharmCreature:
      case EffectTypeEnum.CharmControlCreature:
        result.parameter1 = `IDS_OF_SYMBOL (~GENERAL~ ~${
          (<CharmCreatureEffect>effect).generalType
        }~)`;
        result.parameter2 = `${
          CharmTypeEnum[(<CharmCreatureEffect>effect).charmType]
        }`;
        break;
      case EffectTypeEnum.ProtectionFromProjectile:
        result.parameter2 = `${
          (<ProtectionFromProjectileEffect>effect).projectile
        }`;
        break;
      case EffectTypeEnum.PolymorphIntoSpecific:
        result.parameter2 = `${(<PolymorphIntoSpecificEffect>effect).type}`;
        break;
      case EffectTypeEnum.KillTarget:
        result.parameter1 = `${(<KillTargetEffect>effect).displayText ? 0 : 1}`;
        result.parameter2 = `${
          KillTargetDeathTypeEnum[(<KillTargetEffect>effect).type]
        }`;
        break;
      case EffectTypeEnum.LevelDrain:
        result.parameter1 = `${(<LevelDrainEffect>effect).amount}`;
        break;
      case EffectTypeEnum.Berserk:
        result.parameter2 = `${(<BerserkEffect>effect).type}`;
        break;
      case EffectTypeEnum.ProficiencyModifier:
        result.parameter1 = `${(<ProficiencyModifierEffect>effect).amount}`;
        result.parameter2 = `${
          ProficiencyTypeEnum[(<ProficiencyModifierEffect>effect).type]
        }`;
        break;
      case EffectTypeEnum.DispelEffects:
        if ((<DispelEffectsEffect>effect).dispelType)
          result.parameter1 = `${
            DispelEffectTypeEnum[(<DispelEffectsEffect>effect).dispelType ?? 0]
          }`;
        if ((<DispelEffectsEffect>effect).magicWeaponDispelType)
          result.parameter2 = `${
            DispelEffectWeaponTypeEnum[
              (<DispelEffectsEffect>effect).magicWeaponDispelType ?? 0
            ]
          }`;
        break;
      case EffectTypeEnum.ProtectionFromWeapons:
        result.parameter1 = `${
          (<ProtectionFromWeaponsEffect>effect).enchantment
        }`;
        result.parameter2 = `${
          ProtectionFromWeaponsTypeEnum[
            (<ProtectionFromWeaponsEffect>effect).type
          ]
        }`;
        break;
      case EffectTypeEnum.Translucency:
        result.parameter1 = `${(<TranslucencyEffect>effect).amount}`;
        result.parameter2 = `${
          TranslucencyTypeEnum[(<TranslucencyEffect>effect).type]
        }`;
        break;
      case EffectTypeEnum.CastSpellOnCondition:
        result.parameter1 = `${
          CastSpellOnConditionTargetEnum[
            (<CastSpellOnConditionEffect>effect).conditionTarget
          ]
        }`;
        result.parameter2 = `${getCastSpellOnConditionValue(
          (<CastSpellOnConditionEffect>effect).condition
        )}`;
        break;
      case EffectTypeEnum.RemoveSpellTypeProtections:
        result.parameter1 = `${
          (<RemoveSpellTypeProtectionsEffect>effect).maximumLevel
        }`;
        result.parameter2 = `${
          (<RemoveSpellTypeProtectionsEffect>effect).type
        }`;
        break;
      case EffectTypeEnum.CurrentHPbonus:
        result.parameter1 = `${(<CurrentHPbonusEffect>effect).value}`;
        result.parameter2 = `${
          EffectModifierTypeEnum[(<CurrentHPbonusEffect>effect).type]
        }`; //TODO: handle flag if necessary
        break;
      case EffectTypeEnum.CreateItemInSlot:
        result.parameter1 = `IDS_OF_SYMBOL (~slots~ ~${
          (<CreateItemInSlotEffect>effect).slot
        }~)`;
        break;
      case EffectTypeEnum.RemoveOpcode:
        result.parameter1 = (<RemoveOpcodeEffect>effect).param;
        result.parameter2 = `${
          EffectTypeEnum[(<RemoveOpcodeEffect>effect).opcodeToRemove]
        }`;
        break;
      case EffectTypeEnum.Invisibility:
        result.parameter2 = `${
          InvisibilityTypeEnum[(<InvisibilityEffect>effect).type]
        }`;
        break;
      case EffectTypeEnum.MakeUnselectable:
        if (!(<MakeUnselectableEffect>effect).disableDialog)
          result.parameter1 = `1`;
        result.parameter2 = `1`;
        break;
      case EffectTypeEnum.NoCollisionDetection:
        if (!(<NoCollisionDetectionEffect>effect).passWalls)
          result.parameter2 = `1`;
        break;
      case EffectTypeEnum.OverrideCreatureData:
        result.parameter1 = `${(<OverrideCreatureDataEffect>effect).value}`;
        result.parameter2 = `${
          OverrideCreatureDataFieldEnum[
            (<OverrideCreatureDataEffect>effect).field
          ]
        }`;
        break;
      case EffectTypeEnum.ImmunityToTurnUndead:
      case EffectTypeEnum.ProtectionFromBackstab:
      case EffectTypeEnum.InvisibilityDetection:
      case EffectTypeEnum.ModifyCollisionBehavior:
        result.parameter2 = `1`;
        break;
    }
    return result;
  }

  private damage(result: Effect, effect: DamageEffect) {
    const mode = effect.damageMode
      ? EffectDamageModeEnum[effect.damageMode]
      : EffectDamageModeEnum.Normal;
    const type = EffectDamageTypeEnum[effect.type];
    result.parameter1 = `${effect.amount ?? 0}`;
    result.parameter2 = `${mode + (type << 16)}`;
  }

  private scriptingStateModifier(
    result: Effect,
    effect: ScriptingStateModifierEffect
  ): void {
    if (effect.value < 0 || effect.value > 35)
      throw new Error(
        `Value for opcode ${EffectTypeEnum.ScriptingStateModifier} must be between 0 and 35, found: ${effect.value}`
      );
    result.parameter1 = `${effect.value}`;
    result.parameter2 = `IDS_OF_SYMBOL (~stat~ ~${effect.state}~) - 156`;
  }

  getGroupEffects(effect: RawEffectGroup) {
    const groupEffects = EFFECT_GROUPS.find((g) => g.group === effect.opcode);
    if (!groupEffects)
      throw new Error(`Effects group ${effect.opcode} not found`);
    return this.getEffects(groupEffects.effectsFn(effect));
  }

  getBaseEffect(effect: RawBaseEffect): BaseEffect {
    const defaultTarget = !!effect.global
      ? EffectTargetEnum.Self
      : EffectTargetEnum.PresetTarget;
    const defaultTiming = !!effect.global
      ? EffectTimingEnum.InstantWhileEquipped
      : EffectTimingEnum.InstantLimited;
    const result: BaseEffect = {
      opcode: EffectTypeEnum.ArmorClassBonus,
      target: effect.target ? EffectTargetEnum[effect.target] : defaultTarget,
      power: effect.power,
      timing: effect.timing ? EffectTimingEnum[effect.timing] : defaultTiming,
      dispelResistance: effect.dispelResistance
        ? EffectDispelResistanceEnum[effect.dispelResistance]
        : EffectDispelResistanceEnum.NaturalNonMagical,
      duration: effect.duration,
      probability1: effect.probability1 ?? 100,
      probability2: effect.probability2,
      diceThrown: effect.diceThrown,
      diceSize: effect.diceSize,
      saveTypes: effect.saveTypes
        ? effect.saveTypes.map((s) => SaveTypeEnum[s])
        : undefined,
      saveBonus: effect.saveBonus,
      resource: effect.resource,
      flags: effect.flags
        ? effect.flags.map((f) => EffectFlagsEnum[f])
        : undefined,
      special: effect.special,
      global: effect.global ?? false,
    };
    return result;
  }
}
