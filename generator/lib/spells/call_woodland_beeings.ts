import { ATWEAKS_CREATURES } from "../config/creatures";
import { SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawEffect } from "../src/model/raw/effect";
import { RawSpell } from "../src/model/raw/spell";

const baseEffect: RawEffect = {
  opcode: "UseEFFFile",
  idsFile: "EA",
  idsEntry: "ANYONE",
  timing: "InstantLimited",
  duration: 180,
  dispelResistance: "NotDispelBypassResistance",
};

export const SPELL_CALL_WOODLAND_BEEINGS: RawSpell = {
  name: "CallWoodlandBeeings",
  file: SPELLS.CallWoodlandBeeings,
  copyFrom: SPELLS.CallWoodlandBeeings,
  stringRef: TraStringReferenceEnum.CallWoodlandBeeingsDescription,
  icon: SPELLS.CallWoodlandBeeings,
  deleteHeaders: true,
  headers: [
    {
      type: "Melee",
      minLevel: 7,
      location: "Spell",
      target: "AnyPointWithinRange",
      range: 25,
      effects: [
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.DryadSummon,
          probability1: 75,
          probability2: 0,
        },
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.DryadSummon,
          probability1: 75,
          probability2: 0,
        },
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.TreantVeryYoung,
          probability1: 100,
          probability2: 75,
        },
      ],
    },
    {
      type: "Melee",
      minLevel: 13,
      location: "Spell",
      target: "AnyPointWithinRange",
      range: 25,
      effects: [
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.TreantYoung,
          probability1: 75,
          probability2: 0,
        },
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.Treant,
          probability1: 100,
          probability2: 75,
        },
      ],
    },
    {
      type: "Melee",
      minLevel: 20,
      location: "Spell",
      target: "AnyPointWithinRange",
      range: 25,
      effects: [
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.Treant,
          probability1: 75,
          probability2: 0,
        },
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.TreantElder,
          probability1: 100,
          probability2: 75,
        },
      ],
    },
  ],
};
