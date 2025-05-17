import { ATWEAKS_CREATURES } from "../config/creatures";
import { SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawEffect } from "../src/model/raw/effect";
import { RawSpell } from "../src/model/raw/spell";

const baseEffect: RawEffect = {
  opcode: "UseEFFFile",
  target: "Self",
  idsFile: "EA",
  idsEntry: "ANYONE",
  timing: "InstantLimited",
  duration: 120,
  dispelResistance: "NotDispelBypassResistance",
};

export const SPELL_CALL_WOODLAND_BEEINGS: RawSpell = {
  name: "CallWoodlandBeeings",
  file: SPELLS.CallWoodlandBeeings,
  copyFrom: SPELLS.CallWoodlandBeeings,
  description: TraStringReferenceEnum.CallWoodlandBeeingsDescription,
  icon: SPELLS.CallWoodlandBeeings,
  deleteHeaders: true,
  effects: [
    {
      opcode: "ProtectionFromResourceAndMessage",
      target: "Self",
      // LPF ADD_EFFECT INT_VAR header=1 opcode=324 target=1 duration=1 parameter2=JA_NOT_OUTDOOR_CHECK STR_VAR resource=~sppr410~ END
      type: "110", // SPLSTATE = specified value
      value: "CHAOTIC_COMMANDS", // CHAOTIC_COMMANDS 41
      timing: "InstantLimited",
      dispelResistance: "NaturalNonMagical",
      duration: 1,
      resource: SPELLS.CallWoodlandBeeings,
      global: true,
    },
  ],
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
          probability1: 55,
        },
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.HamadryadSummon,
          probability1: 85,
          probability2: 55,
        },
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.Treant5hd,
          probability1: 100,
          probability2: 85,
        },
      ],
    },
    {
      type: "Melee",
      minLevel: 10,
      location: "Spell",
      target: "AnyPointWithinRange",
      range: 25,
      effects: [
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.HamadryadSummon,
          probability1: 55,
        },
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.Treant5hd,
          probability1: 85,
          probability2: 55,
        },
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.Treant7hd,
          probability1: 100,
          probability2: 85,
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
          resource: ATWEAKS_CREATURES.Treant7hd,
          probability1: 55,
        },
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.Treant9hd,
          probability1: 85,
          probability2: 55,
        },
        {
          ...baseEffect,
          resource: ATWEAKS_CREATURES.Treant11hd,
          probability1: 100,
          probability2: 85,
        },
      ],
    },
  ],
};
