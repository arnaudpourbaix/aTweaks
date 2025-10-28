import { SPELLS } from "../config/spell-names";
import {
  EffectTimingEnum,
  EffectVisualEffectLocationEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  SummonCreatureModeEnum,
} from "../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../src/model/spell-item/effect.type";
import { Spell } from "../src/model/spell-item/spell-item";
import spellService from "../src/services/spell.service";
import { TranslationKey } from "../translations/i18n";

export const createCreatureSplit = ({
  file,
  description,
  resource,
  visualEffect,
}: {
  file: string;
  description: TranslationKey;
  resource: string;
  visualEffect: string;
}): Spell =>
  spellService.getSpell(
    {
      name: "spell.slimeSplit.name",
      description,
      memorizedCount: 1,
      icon: SPELLS.MirrorImages,
      headers: [
        {
          type: ItemAbilityTypeEnum.Magical,
          target: ItemAbilityTargetEnum.Caster,
          effects: [
            {
              opcode: EffectTypeEnum.PlayVisualEffect,
              playWhere: EffectVisualEffectLocationEnum.OverTargetAttached,
              resource: visualEffect,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
            },
            {
              opcode: EffectTypeEnum.SummonCreature,
              mode: SummonCreatureModeEnum.MatchTarget3,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              resource,
            },
            {
              opcode: EffectTypeEnum.SummonCreature,
              mode: SummonCreatureModeEnum.MatchTarget3,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              resource,
            },
            {
              opcode: EffectTypeEnum.RemoveCreature,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
            },
          ],
        },
      ],
    },
    file
  );
