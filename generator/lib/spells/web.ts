import { SPELLS } from "../config/spell-names";
import {
  SpellProtection,
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../src/model/raw/spell-protection";
import {
  BaseEffect,
  DamageEffect,
  Effect,
} from "../src/model/spell-item/effect";
import {
  EffectIDSFileEnum,
  EffectTimingEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTypeEnum,
  PortraitIconEnum,
  SaveTypeEnum,
} from "../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../src/model/spell-item/effect.type";
import { Spell } from "../src/model/spell-item/spell-item";
import effectService from "../src/services/effects/effect.service";
import spellService from "../src/services/spell.service";
import { TranslationKey } from "../translations/i18n";

export const createSingleTargetWeb = ({
  file,
  name,
  duration,
  saveBonus,
  description,
  damageEffect,
}: {
  file: string;
  name?: TranslationKey;
  duration: number;
  description: TranslationKey;
  saveBonus?: number;
  damageEffect?: DamageEffect;
}): Spell => {
  const saves: BaseEffect = {
    saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
    saveBonus: saveBonus ?? 0,
  };
  const effects: Effect[] = [
    {
      opcode: EffectTypeEnum.Web,
      timing: EffectTimingEnum.InstantLimited,
      duration,
      ...saves,
    },
    {
      opcode: EffectTypeEnum.Paralyze,
      timing: EffectTimingEnum.InstantLimited,
      idsFile: EffectIDSFileEnum.EA,
      idsEntry: "ANYONE",
      duration,
      ...saves,
    },
    {
      opcode: EffectTypeEnum.DisplayPortraitIcon,
      icon: PortraitIconEnum.Webbed,
      timing: EffectTimingEnum.InstantLimited,
      duration,
      ...saves,
    },
    {
      opcode: EffectTypeEnum.PlaySound,
      resource: "EFF_P27",
      ...saves,
    },
  ];
  const protections: { type: SpellProtection; values: (string | number)[] }[] =
    [
      {
        type: {
          stat: SpellProtectionStat.CircleSize,
          relation: SpellProtectionRelation.Greater,
          value: 3,
        },
        values: [0],
      },
      {
        type: {
          stat: SpellProtectionStat.Splstate,
          relation: SpellProtectionRelation.Equal,
        },
        values: ["BLUE_FIRESHIELD", "RED_FIRESHIELD", "FREE_ACTION"],
      },
      {
        type: {
          stat: SpellProtectionStat.Race,
          relation: SpellProtectionRelation.Equal,
        },
        values: ["WRAITH", "MIST", "SHADOW", "ELEMENTAL", "SLIME"],
      },
    ];
  for (const protection of protections) {
    for (const value of protection.values) {
      effects.unshift({
        opcode: EffectTypeEnum.ProtectionFromResourceAndMessage,
        type: protection.type,
        value,
        timing: EffectTimingEnum.InstantLimited,
        duration: 1,
        resource: file,
      });
    }
  }
  if (damageEffect) {
    effects.push(
      ...effectService.getDamageOverTime(1, { ...damageEffect, ...saves })
    );
  }
  const spell = spellService.getSpell(
    {
      memorizedCount: 1,
      name: name ?? "monster.spider.webTangle.name",
      description,
      icon: SPELLS.Web,
      options: { renew: 1 },
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      headers: [
        {
          type: ItemAbilityTypeEnum.Ranged,
          range: 5,
          projectile: "WEB1P",
          effects,
        },
      ],
    },
    file
  );
  return spell;
};
