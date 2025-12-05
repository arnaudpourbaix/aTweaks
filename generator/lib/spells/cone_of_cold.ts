import { SPELLS } from "../config/spell-names";
import {
  EffectDamageTypeEnum,
  EffectFlagsEnum,
  ItemAbilityCastingAnimationEnum,
  ItemAbilityLocationEnum,
  ItemAbilityPrimaryTypeEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  SaveTypeEnum,
  SpellFlagEnum,
  SpellTypeEnum,
} from "../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../src/model/spell-item/effect.type";
import { PartialProjectile } from "../src/model/spell-item/projectile";
import { PartialSpell, SpellOptions } from "../src/model/spell-item/spell-item";
import { TranslationKey } from "../translations/i18n";

export const createConeOfCold = ({
  id,
  description,
  projectile,
  options,
  damage,
}: {
  id: number;
  description: TranslationKey;
  projectile?: PartialProjectile;
  options?: SpellOptions;
  damage: {
    diceThrown: number;
    diceSize: number;
    amount: number;
  };
}): PartialSpell => ({
  id,
  name: "spell.coneOfCold.name",
  description,
  icon: SPELLS.ConeOfCold,
  options,
  castingSound: "CAS_M06",
  flags: [SpellFlagEnum.Hostile, SpellFlagEnum.BreakSanctuary],
  spellType: SpellTypeEnum.Wizard,
  castingAnimation: ItemAbilityCastingAnimationEnum.Invocation,
  primaryType: ItemAbilityPrimaryTypeEnum.Invoker,
  secondaryType: ItemAbilitySecondaryTypeEnum.OffensiveDamage,
  spellLevel: 5,
  headers: [
    {
      type: ItemAbilityTypeEnum.Melee,
      projectile: projectile ?? "CONECOLD",
      location: ItemAbilityLocationEnum.Spell,
      target: ItemAbilityTargetEnum.LivingActor,
      range: 10,
      speed: 1,
      effects: [
        {
          opcode: EffectTypeEnum.Damage,
          type: EffectDamageTypeEnum.Cold,
          amount: 0,
          diceSize: 8,
          diceThrown: 8,
          saveTypes: [SaveTypeEnum.Spell, SaveTypeEnum.BypassMirrorImage],
          saveBonus: -4,
          flags: [EffectFlagsEnum.SaveForHalf],
        },
        {
          opcode: EffectTypeEnum.PauseTarget,
          duration: 1,
        },
      ],
    },
  ],
  ability: {
    preset: SPELLS.ConeOfCold,
    spell: {
      id: undefined,
      type: "force",
      remove: true,
    },
    requireVocal: false,
  },
});
