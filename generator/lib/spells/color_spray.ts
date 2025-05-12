import { SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { PortraitIconEnum } from "../src/model/final/enums";
import { RawBaseEffect, RawEffect } from "../src/model/raw/effect";
import { RawSpell, RawSpellHeader } from "../src/model/raw/spell";
import { StringRefUtils } from "../src/services/string-ref.utils";

const baseEffect: RawBaseEffect = {
  dispelResistance: "DispelNotBypassResistance",
  saveTypes: ["Spell"],
};
const header: (level: number) => RawSpellHeader = (level: number) => ({
  type: "Melee",
  location: "Spell",
  target: "AnyPointWithinRange",
  minLevel: level,
  range: 30,
  projectile: "CSPRAY",
  effects: [
    ...colorEffects,
    ...sleepEffects(level),
    ...blindEffects(level),
    ...confusionEffects(level),
  ],
});
const colorEffects: RawEffect[] = [
  {
    opcode: "PauseTarget",
    timing: "InstantLimited",
    target: "Self",
    duration: 1,
    dispelResistance: "NaturalNonMagical",
  },
  {
    opcode: "SetColor",
    color: "GhostlyGreen",
    location: "ArmorBlueArmorTrimming",
    timing: "InstantLimited",
    duration: 6,
    ...baseEffect,
  },
  {
    opcode: "SetColor",
    color: "DarkGhostlyPink",
    location: "ArmorGreenHair",
    timing: "InstantLimited",
    duration: 6,
    ...baseEffect,
  },
  {
    opcode: "SetColor",
    color: "GhostlyGreen",
    location: "ArmorYellowSkinColor",
    timing: "InstantLimited",
    duration: 6,
    ...baseEffect,
  },
  {
    opcode: "SetColor",
    color: "DarkGhostlyPink",
    location: "ArmorRedStrapLeather",
    timing: "InstantLimited",
    duration: 6,
    ...baseEffect,
  },
  {
    opcode: "SetColor",
    color: "GhostlyGreen",
    location: "ArmorGreyBeltAmulet",
    timing: "InstantLimited",
    duration: 6,
    ...baseEffect,
  },
  {
    opcode: "SetColor",
    color: "DarkGhostlyPink",
    location: "ArmorPinkMajorColor",
    timing: "InstantLimited",
    duration: 6,
    ...baseEffect,
  },
  {
    opcode: "SetColor",
    color: "GhostlyGreen",
    location: "ArmorTealMinorColor",
    timing: "InstantLimited",
    duration: 6,
    ...baseEffect,
  },
];
const sleepEffects: (level: number) => RawEffect[] = (level: number) => {
  const effects: RawEffect[] = [
    {
      opcode: "Sleep",
      wakeOnDamage: true,
      timing: "InstantLimited",
      duration: 24,
      minLevel: 0,
      maxLevel: level,
      dispelResistance: "DispelNotBypassResistance",
      special: PortraitIconEnum.Sleep,
    },
  ];
  const results: RawEffect[] = [...effects];
  if (level > 5) {
    for (const effect of results) {
      effect.maxLevel = 5;
    }
    for (const effect of effects) {
      results.push({
        ...effect,
        minLevel: Math.min(6, level),
        maxLevel: level,
        saveTypes: ["Spell"],
      });
    }
  }
  return results;
};
const blindEffects: (level: number) => RawEffect[] = (level: number) => {
  const effects: RawEffect[] = [
    {
      opcode: "Blindness",
      timing: "InstantLimited",
      duration: 12,
      minLevel: level + 1,
      maxLevel: level + 2,
      ...baseEffect,
    },
    {
      opcode: "DisplayPortraitIcon",
      icon: "Blind",
      timing: "InstantLimited",
      duration: 12,
      minLevel: level + 1,
      maxLevel: level + 2,
      ...baseEffect,
    },
    {
      opcode: "CharacterColorPulse",
      color: { red: 127, green: 127, blue: 127 },
      location: "ArmorGreyBeltAmulet",
      cycleSpeed: 20,
      timing: "InstantLimited",
      duration: 1,
      minLevel: level + 1,
      maxLevel: level + 2,
      ...baseEffect,
    },
    {
      opcode: "DisplayString",
      stringRef: StringRefUtils.getStringId("Blinded"),
      timing: "InstantPermanentUntilDeath",
      minLevel: level + 1,
      maxLevel: level + 2,
      ...baseEffect,
    },
    {
      opcode: "PlayVisualEffect",
      playWhere: "OverTargetAttached",
      timing: "InstantLimited",
      duration: 3,
      resource: "SPH1HI01",
      minLevel: level + 1,
      maxLevel: level + 2,
      ...baseEffect,
    },
    {
      opcode: "PlayVisualEffect",
      playWhere: "OverTargetAttached",
      timing: "InstantLimited",
      duration: 3,
      resource: "SPHLHI02",
      minLevel: level + 1,
      maxLevel: level + 2,
      ...baseEffect,
    },
  ];
  return effects;
};
const confusionEffects: (level: number) => RawEffect[] = (level: number) => {
  const effects: RawEffect[] = [
    {
      opcode: "Confusion",
      timing: "InstantLimited",
      duration: 6,
      minLevel: level + 3,
      ...baseEffect,
    },
    {
      opcode: "DisplayPortraitIcon",
      icon: "Confused",
      timing: "InstantLimited",
      duration: 6,
      minLevel: level + 3,
      ...baseEffect,
    },
    {
      opcode: "PlayVisualEffect",
      playWhere: "OverTargetAttached",
      timing: "InstantLimited",
      duration: 6,
      resource: "SPCONFUS",
      minLevel: level + 3,
      ...baseEffect,
    },
    {
      opcode: "CharacterColorPulse",
      color: { red: 255, green: 183, blue: 0 },
      location: "ArmorGreyBeltAmulet",
      cycleSpeed: -96,
      timing: "InstantLimited",
      duration: 1,
      minLevel: level + 3,
      ...baseEffect,
    },
    {
      opcode: "DisplayString",
      stringRef: StringRefUtils.getStringId("Confused"),
      timing: "InstantPermanentUntilDeath",
      minLevel: level + 3,
      ...baseEffect,
    },
  ];
  return effects;
};

export const SPELL_COLOR_SPRAY: RawSpell = {
  name: "ColorSpray",
  file: SPELLS.ColorSpray,
  stringRef: TraStringReferenceEnum.ColorSpray,
  description: TraStringReferenceEnum.ColorSprayDescription,
  castingSound: "CAS_M08",
  flags: ["Hostile"],
  spellType: "Wizard",
  exclusionFlags: ["Abjurer"],
  castingAnimation: "Alteration",
  primaryType: "Transmuter",
  secondaryType: "Disabling",
  spellLevel: 1,
  icon: SPELLS.ColorSpray,
  headers: [...Array(20).keys()].map((i) => header(i + 1)),
};
