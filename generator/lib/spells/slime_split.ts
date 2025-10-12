import { SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawSpell } from "../src/model/raw/spell";

export const createCreatureSplit = ({
  file,
  description,
  resource,
  visualEffect,
}: {
  file: string;
  description: string[];
  resource: string;
  visualEffect: string;
}): RawSpell => ({
  name: "Split",
  file,
  memorizedCount: 1,
  stringRef: TraStringReferenceEnum.Split,
  icon: SPELLS.MirrorImages,
  description,
  headers: [
    {
      type: "Magical",
      target: "Caster",
      effects: [
        {
          opcode: "PlayVisualEffect",
          playWhere: "OverTargetAttached",
          resource: visualEffect,
          timing: "InstantPermanentUntilDeath",
        },
        {
          opcode: "SummonCreature",
          mode: "MatchTarget3",
          timing: "InstantPermanentUntilDeath",
          resource,
        },
        {
          opcode: "SummonCreature",
          mode: "MatchTarget3",
          timing: "InstantPermanentUntilDeath",
          resource,
        },
        {
          opcode: "RemoveCreature",
          timing: "InstantPermanentUntilDeath",
        },
      ],
    },
  ],
});
