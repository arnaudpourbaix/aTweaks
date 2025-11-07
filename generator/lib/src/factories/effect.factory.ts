import { ATWEAKS_SPELLS, SPELLS } from "../../config/spell-names";
import { BaseEffect, DamageEffect, Effect } from "../model/spell-item/effect";
import {
  CharmTypeEnum,
  EffectBonusToEnum,
  EffectColorLocationEnum,
  EffectDispelResistanceEnum,
  EffectIDSFileEnum,
  EffectModifierTypeEnum,
  EffectStatisticModifierEnum,
  EffectTargetEnum,
  EffectTimingEnum,
  EffectVisualEffectLocationEnum,
  LightingEffectEnum,
  LightingEffectTargetEnum,
  PortraitIconEnum,
  SaveTypeEnum,
} from "../model/spell-item/effect.enums";
import { EffectTypeEnum } from "../model/spell-item/effect.type";
import effectService from "../services/effects/effect.service";
import { StringRefUtils } from "../services/utils/string-ref.utils";

class EffectFactory {
  damageOverTime(rounds: number, effect: DamageEffect): DamageEffect[] {
    const results: DamageEffect[] = [
      { ...effect, timing: EffectTimingEnum.InstantPermanent },
    ];
    for (let i = 1; i < rounds; i++) {
      results.push({
        ...effect,
        timing: EffectTimingEnum.DelayPermanent,
        duration: i * 6,
      });
    }
    return results;
  }

  paralyze(payload: {
    duration: number;
    lightingEffect?: LightingEffectEnum;
    saveBonus?: number;
    startSound?: string;
    endSound?: string;
    pulse?: { blue: number; green: number; red: number; speed: number };
  }) {
    const base: { saveTypes?: SaveTypeEnum[]; saveBonus?: number } = {
      saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
      saveBonus: payload.saveBonus,
    };
    const duration: { timing?: EffectTimingEnum; duration?: number } = {
      timing: EffectTimingEnum.InstantLimited,
      duration: payload.duration,
    };
    const effects: Effect[] = [
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
        resource: payload.startSound ?? "EFF_P11",
        ...base,
      },
      {
        opcode: EffectTypeEnum.PlaySound,
        resource: payload.endSound ?? "EFF_E05",
        ...duration,
        timing: EffectTimingEnum.DelayPermanent,
        ...base,
      },
      {
        opcode: EffectTypeEnum.CharacterColorPulse,
        timing: EffectTimingEnum.InstantPermanentUntilDeath,
        color: {
          blue: payload.pulse?.blue ?? 0,
          green: payload.pulse?.green ?? 57,
          red: payload.pulse?.red ?? 87,
        },
        location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
        cycleSpeed: payload.pulse?.speed ?? 25,
        ...base,
      },
      {
        opcode: EffectTypeEnum.LightingEffects,
        timing: EffectTimingEnum.InstantPermanentUntilDeath,
        lightingTarget: LightingEffectTargetEnum.SpellTarget,
        effect: payload.lightingEffect ?? LightingEffectEnum.NecromancyEarth,
        ...base,
      },
    ];
    return effectService.getEffects(effects);
  }

  restrained(payload: {
    duration: number;
    saveType?: SaveTypeEnum;
    saveBonus?: number;
  }) {
    const base: { saveTypes?: SaveTypeEnum[]; saveBonus?: number } = {
      saveTypes: payload.saveType ? [payload.saveType] : undefined,
      saveBonus: payload.saveBonus,
    };
    const duration: { timing?: EffectTimingEnum; duration?: number } = {
      timing: EffectTimingEnum.InstantLimited,
      duration: payload.duration,
    };
    const effects: Effect[] = [
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
    return effectService.getEffects(effects);
  }

  cureAll() {
    const base: BaseEffect = {
      timing: EffectTimingEnum.InstantPermanentUntilDeath,
      target: EffectTargetEnum.Self,
    };
    const effects: Effect[] = [
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
    return effectService.getEffects(effects);
  }

  charm(payload: {
    charmType: CharmTypeEnum;
    duration: number;
    saveType?: SaveTypeEnum;
    saveBonus?: number;
    dispelResistance?: EffectDispelResistanceEnum;
  }) {
    const effects: Effect[] = [
      {
        opcode: EffectTypeEnum.CharmCreature,
        generalType: "HUMANOID",
        charmType: payload.charmType,
        timing: EffectTimingEnum.InstantLimited,
        duration: payload.duration,
        dispelResistance: payload.dispelResistance,
        saveTypes: payload.saveType ? [payload.saveType] : undefined,
        saveBonus: payload.saveBonus,
      },
      {
        opcode: EffectTypeEnum.DisplayString,
        stringRef: StringRefUtils.getStringId("Dire charmed"),
        timing: EffectTimingEnum.InstantPermanentUntilDeath,
        dispelResistance: payload.dispelResistance,
        saveTypes: payload.saveType ? [payload.saveType] : undefined,
        saveBonus: payload.saveBonus,
      },
      {
        opcode: EffectTypeEnum.CharacterColorPulse,
        color: { red: 255, green: 144, blue: 147 },
        location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
        cycleSpeed: 30,
        timing: EffectTimingEnum.InstantLimited,
        duration: 1,
        dispelResistance: payload.dispelResistance,
        saveTypes: payload.saveType ? [payload.saveType] : undefined,
        saveBonus: payload.saveBonus,
      },
      {
        opcode: EffectTypeEnum.PlayVisualEffect,
        playWhere: EffectVisualEffectLocationEnum.OverTargetAttached,
        resource: "SPNWCHRM",
        timing: EffectTimingEnum.InstantLimited,
        duration: 3,
        dispelResistance: payload.dispelResistance,
        saveTypes: payload.saveType ? [payload.saveType] : undefined,
        saveBonus: payload.saveBonus,
      },
      {
        opcode: EffectTypeEnum.PlaySound,
        resource: "EFF_E07",
        timing: EffectTimingEnum.DelayLimited,
        duration: payload.duration,
        dispelResistance: payload.dispelResistance,
        saveTypes: payload.saveType ? [payload.saveType] : undefined,
        saveBonus: payload.saveBonus,
      },
    ];
    return effectService.getEffects(effects);
  }

  blindness(params: {
    duration: number;
    saveType?: SaveTypeEnum;
    saveBonus?: number;
    dispelResistance?: EffectDispelResistanceEnum;
  }) {
    const effects: Effect[] = [
      ATWEAKS_SPELLS.ColorSpray,
      ATWEAKS_SPELLS.ColorSprayRadiant,
      SPELLS.ColorSpray,
      SPELLS.MephitColorSpray,
    ].map((s) => ({
      opcode: EffectTypeEnum.ProtectionFromSpell,
      resource: s,
      timing: EffectTimingEnum.InstantLimited,
      duration: params.duration,
      dispelResistance: params.dispelResistance,
      saveTypes: params.saveType ? [params.saveType] : undefined,
      saveBonus: params.saveBonus,
    }));
    effects.push(
      {
        opcode: EffectTypeEnum.Blindness,
        timing: EffectTimingEnum.InstantLimited,
        duration: params.duration,
        dispelResistance: params.dispelResistance,
        saveTypes: params.saveType ? [params.saveType] : undefined,
        saveBonus: params.saveBonus,
      },
      {
        opcode: EffectTypeEnum.DisplayPortraitIcon,
        icon: PortraitIconEnum.Blind,
        timing: EffectTimingEnum.InstantLimited,
        duration: params.duration,
        dispelResistance: params.dispelResistance,
        saveTypes: params.saveType ? [params.saveType] : undefined,
        saveBonus: params.saveBonus,
      },
      {
        opcode: EffectTypeEnum.DisplayString,
        stringRef: StringRefUtils.getStringId("Blinded"),
        timing: EffectTimingEnum.InstantPermanentUntilDeath,
        dispelResistance: params.dispelResistance,
        saveTypes: params.saveType ? [params.saveType] : undefined,
        saveBonus: params.saveBonus,
      }
    );
    return effectService.getEffects(effects);
  }
}

const effectFactory = new EffectFactory();
export default effectFactory;
