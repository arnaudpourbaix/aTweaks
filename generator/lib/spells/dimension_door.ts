import { SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawSpellType } from "../src/model/raw/enum";
import { RawSpell } from "../src/model/raw/spell";

export const createDimensionDoor = ({
  spellLevel,
  infiniteUse,
  spellType,
  file,
  memorizedCount,
}: {
  file: string;
  spellLevel: number;
  spellType: RawSpellType;
  infiniteUse?: number;
  memorizedCount?: number;
}): RawSpell => ({
  name: "DimensionDoor",
  file,
  memorizedCount,
  stringRef: TraStringReferenceEnum.DimensionDoor,
  description: TraStringReferenceEnum.DimensionDoorDescription,
  castingSound: "CAS_M08",
  flags: ["NoLOSRequired"],
  spellType,
  exclusionFlags: ["Abjurer"],
  castingAnimation: "Alteration",
  primaryType: "Transmuter",
  secondaryType: "NonCombat",
  spellLevel,
  icon: SPELLS.DimensionDoor,
  infiniteUse,
  headers: [
    {
      type: "Melee",
      location: ["Wizard", "Priest"].includes(spellType) ? "Spell" : "Ability",
      target: "AnyPointWithinRange",
      range: 900,
      speed: 1,
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
});

export const SPELL_DIMENSION_DOOR: RawSpell = createDimensionDoor({
  file: SPELLS.DimensionDoor,
  spellLevel: 4,
  spellType: "Wizard",
});
