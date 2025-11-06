import { GLOBAL_CONFIG } from "../../config/generate";
import { SPELLS } from "../../config/spell-names";
import effectFactory from "../../src/factories/effect.factory";
import {
  EffectCastSpellTypeEnum,
  EffectTimingEnum,
  EffectVisualEffectLocationEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTypeEnum,
  SaveTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import {
  AreaProjectileEnum,
  PartialProjectile,
  ProjectileAnimationEnum,
  ProjectileExplosionEffectEnum,
  ProjectileTypeEnum,
} from "../../src/model/spell-item/projectile";
import { PartialSpell } from "../../src/model/spell-item/spell-item";

const petrificationSave: { saveTypes: SaveTypeEnum[]; saveBonus: number } = {
  saveTypes: [SaveTypeEnum.PetrifyPolymorph],
  saveBonus: -4,
};

const projectile: PartialProjectile = {
  copyFromFile: "gaze",
  name: "Basilisk petrifying gaze",
  type: ProjectileTypeEnum.AreaOfEffect,
  areaEffectInfo: {
    areaProjectileFlags: [
      AreaProjectileEnum.AffectOnlyEnemies,
      AreaProjectileEnum.Coneshaped,
    ],
    triggerRadius: 255,
    areaOfEffect: 255,
    coneWidth: 60,
    fragmentAnimation: ProjectileAnimationEnum.NULL_ANIMATION,
    explosionEffect: ProjectileExplosionEffectEnum.NONE,
  },
};

export const petrification2e: PartialSpell = {
  name: "monster.basilisk.petrifyingGaze.name",
  description: "monster.basilisk.petrifyingGaze.description",
  secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
  memorizedCount: 1,
  options: {
    renew: 1,
  },
  icon: SPELLS.FleshToStone,
  headers: [
    {
      type: ItemAbilityTypeEnum.Ranged,
      projectile,
      range: 30,
      effects: [
        {
          opcode: EffectTypeEnum.Petrification,
          ...petrificationSave,
        },
        {
          opcode: EffectTypeEnum.DisplayString,
          stringRef: "monster.basilisk.petrifyingGaze.petrified",
          ...petrificationSave,
        },
        {
          opcode: EffectTypeEnum.PlaySound,
          resource: "MISC_06B",
          ...petrificationSave,
        },
        {
          opcode: EffectTypeEnum.PlayVisualEffect,
          playWhere: EffectVisualEffectLocationEnum.OverTargetUnattached,
          resource: "SPFLESHS.VVC",
          ...petrificationSave,
        },
        {
          opcode: EffectTypeEnum.CreatureRGBColorFade,
          color: { blue: 120, red: 120, green: 120 },
          fadeSpeed: 25,
          ...petrificationSave,
        },
      ],
    },
  ],
  ability: {
    name: "Petrification (2e)",
    targets: [
      {
        name: "NearestEnemies",
        random: true,
      },
    ],
    spell: {
      type: "force",
    },
  },
};

export const petrification5eTechnical: PartialSpell = {
  memorizedCount: 1,
  name: "monster.basilisk.petrifyingGaze.name",
  description: "monster.basilisk.petrifyingGaze.description",
  secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
  icon: SPELLS.FleshToStone,
  headers: [
    {
      type: ItemAbilityTypeEnum.Ranged,
      projectile,
      range: 30,
      effects: [
        {
          opcode: EffectTypeEnum.Petrification,
          timing: EffectTimingEnum.InstantPermanent,
          ...petrificationSave,
        },
        {
          opcode: EffectTypeEnum.DisplayString,
          stringRef: "monster.basilisk.petrifyingGaze.petrified",
          timing: EffectTimingEnum.InstantPermanent,
          ...petrificationSave,
        },
        {
          opcode: EffectTypeEnum.PlaySound,
          resource: "MISC_06B",
          timing: EffectTimingEnum.InstantPermanent,
          ...petrificationSave,
        },
        {
          opcode: EffectTypeEnum.PlayVisualEffect,
          playWhere: EffectVisualEffectLocationEnum.OverTargetUnattached,
          resource: "SPFLESHS.VVC",
          timing: EffectTimingEnum.InstantPermanent,
          ...petrificationSave,
        },
        {
          opcode: EffectTypeEnum.CreatureRGBColorFade,
          color: { blue: 120, red: 120, green: 120 },
          fadeSpeed: 25,
          timing: EffectTimingEnum.InstantPermanent,
          ...petrificationSave,
        },
      ],
    },
  ],
};

export const petrification5e: PartialSpell = {
  memorizedCount: 1,
  name: "monster.basilisk.petrifyingGaze.name",
  description: "monster.basilisk.petrifyingGaze.description",
  secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
  options: {
    renew: 1,
  },
  icon: SPELLS.FleshToStone,
  headers: [
    {
      type: ItemAbilityTypeEnum.Ranged,
      projectile,
      range: 30,
      effects: [
        {
          opcode: EffectTypeEnum.DisplayString,
          stringRef: "monster.basilisk.petrifyingGaze.turningToStone",
          ...petrificationSave,
        },
        ...effectFactory.restrained({ duration: 12, ...petrificationSave }),
        {
          opcode: EffectTypeEnum.CastSpell,
          timing: EffectTimingEnum.DelayLimited,
          duration: 12,
          type: EffectCastSpellTypeEnum.CastInstantlyAtCasterLevel,
          //   resource: petrification5eTechnical.file, //FIXME:
          ...petrificationSave,
        },
        {
          opcode: EffectTypeEnum.ProtectionFromSpell,
          timing: EffectTimingEnum.DelayLimited,
          duration: 12,
          ...petrificationSave,
        },
      ],
    },
  ],
  ability: {
    name: "Petrification (5e)",
    targets: [
      {
        name: "NearestEnemies",
        random: true,
      },
    ],
    spell: {
      excludeStateChecks: ["STATE_SLOWED"],
      excludeStatsChecks: ["HELD"],
      type: "force",
    },
  },
};
