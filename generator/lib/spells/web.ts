import { SPELLS } from "../config/spell-names";
import {
  DamageEffect,
  RawBaseEffect,
  RawEffect,
} from "../src/model/raw/effect";
import { RawSpell } from "../src/model/raw/spell";
import {
  SpellProtection,
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../src/model/raw/spell-protection";
import { TranslationKey } from "../src/translations/i18n";

export const createSingleTargetWeb = ({
  file,
  stringRef,
  duration,
  saveBonus,
  description,
  damageEffect,
}: {
  file: string;
  stringRef?: TranslationKey;
  duration: number;
  description: TranslationKey;
  saveBonus?: number;
  damageEffect?: DamageEffect;
}): RawSpell => {
  const saves: RawBaseEffect = {
    saveTypes: ["ParalyzePoisonDeath"],
    saveBonus: saveBonus ?? 0,
  };
  const effects: RawEffect[] = [
    {
      opcode: "Web",
      timing: "InstantLimited",
      duration,
      ...saves,
    },
    {
      opcode: "Paralyze",
      timing: "InstantLimited",
      idsFile: "EA",
      idsEntry: "ANYONE",
      duration,
      ...saves,
    },
    {
      opcode: "DisplayPortraitIcon",
      icon: "Webbed",
      timing: "InstantLimited",
      duration,
      ...saves,
    },
    {
      opcode: "PlaySound",
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
        opcode: "ProtectionFromResourceAndMessage",
        type: protection.type,
        value,
        timing: "InstantLimited",
        duration: 1,
        resource: file,
      });
    }
  }
  if (damageEffect) {
    effects.push({
      ...damageEffect,
      ...saves,
    });
    for (let i = 6; i < duration; i += 6) {
      effects.push({
        ...damageEffect,
        timing: "DelayPermanent",
        duration: i,
        ...saves,
      });
    }
  }
  const spell: RawSpell = {
    file,
    memorizedCount: 1,
    infiniteUse: 1,
    stringRef: stringRef ?? "monster.spider.webTangle",
    icon: SPELLS.Web,
    description,
    secondaryType: "Disabling",
    headers: [
      {
        type: "Ranged",
        range: 5,
        projectile: "WEB1P",
        effects,
      },
    ],
  };
  return spell;
};
