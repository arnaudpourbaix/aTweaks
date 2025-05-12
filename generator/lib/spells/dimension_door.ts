import { SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawSpell } from "../src/model/raw/spell";

export const SPELL_DIMENSION_DOOR: RawSpell = {
  name: "DimensionDoor",
  file: SPELLS.DimensionDoor,
  stringRef: TraStringReferenceEnum.DimensionDoor,
  description: TraStringReferenceEnum.DimensionDoorDescription,
  castingSound: "CAS_M08",
  flags: ["NoLOSRequired"],
  spellType: "Wizard",
  exclusionFlags: ["Abjurer"],
  castingAnimation: "Alteration",
  primaryType: "Transmuter",
  secondaryType: "NonCombat",
  spellLevel: 4,
  icon: SPELLS.DimensionDoor,
  headers: [
    {
      type: "Melee",
      location: "Spell",
      target: "AnyPointWithinRange",
      range: 900,
      effects: [
        {
          opcode: "LightingEffects",
          target: "Self",
          lightingTarget: "SpellTarget",
          effect: "HitDoor",
          timing: "InstantPermanentUntilDeath",
          dispelResistance: "DispelNotBypassResistance",
        },
        {
          opcode: "PlaySound",
          target: "Self",
          resource: "EFF_M09",
          timing: "InstantPermanentUntilDeath",
          dispelResistance: "DispelNotBypassResistance",
        },
        {
          opcode: "PlayVisualEffect",
          target: "Self",
          playWhere: "AtTargetPoint",
          resource: "SPDIMNDR",
          timing: "InstantLimited",
          duration: 1,
          dispelResistance: "DispelNotBypassResistance",
        },
        {
          opcode: "Teleport",
          target: "Self",
          type: "Default",
          timing: "DelayPermanent",
          duration: 1,
          dispelResistance: "DispelNotBypassResistance",
        },
        {
          opcode: "Invisibility",
          type: "Normal",
          target: "Self",
          timing: "InstantLimited",
          duration: 1,
          dispelResistance: "DispelNotBypassResistance",
        },
      ],
    },
  ],
};
