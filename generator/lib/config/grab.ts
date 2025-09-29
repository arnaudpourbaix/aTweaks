import { RawEffect } from "../src/model/raw/effect";
import { CreatureSize } from "../src/model/raw/enum";
import { GrabConfig, GrabGlobalConfig } from "../src/model/raw/grab";
import { SPELL_STATES } from "./ability-presets";
import { TraStringReferenceEnum } from "./stringRef";

/**
 * Grab attack:
 * A character's opponent's AC against a touch attack does not include any armor bonus, shield bonus, or natural armor bonus
 * d20 + Base Attack Bonus + Strenth Modifier + *Special Size Modifier*
 *
 * You lose your Dexterity Bonus to AC against opponents you are not grappling. That is to say, you keep it against the one you are grappling.
 * You are unable to move unlesss you succeed an opposed grapple check
 * You may attack your grappled opponent with an unarmed strike, natural or light weapon, at a -4 modifier to the attack.
 * You may cast a spell when grappled or pinned, providing the cast time is 1 standard action or less.
 * You may damage your opponent without the use of an actual attack by succeeding an opposed grapple check. This special attack deals damage equal to an unarmed strike, and functions the same way, including negatives to strike lethally and Monk class abilities.
 * You may escape from being grappled by succeeding an opposed grapple check.
 * You can move at half your speed (bringing the entire brawl with you, no matter how big) by succeeding an opposed grapple check. This requires a standard action, and you must beat each opponent.
 * You can hold your opponent immobile by pinning them. This is done by using an attack to enact an opposed grapple check.
 * If an opponent is holding a light weapon, you can turn that sumbitch around on them and shank them with it by making an attack roll with the weapon at a -4 penalty. They retain the weapon, but part of it will be in their liver.
 *
 */
export const GRAB_DEFAULT_CONFIG: GrabGlobalConfig = {
  probability: 100,
  grabbedState: SPELL_STATES.grabbed,
  grabbingState: SPELL_STATES.grabbing,
  duration: 12,
  saveType: "ParalyzePoisonDeath",
  saveBonus: 99, // will be calculated
  grabStringRef: TraStringReferenceEnum.Grab,
  grabbedStringRef: TraStringReferenceEnum.Grabbed,
  startSound: "CRE_P01",
  endSound: "EFF_M22A",
  visualEffect: "rr#cnstr",
};

export const GRAB_CHECK_CREATURE_SIZE: { size: CreatureSize; bonus: number }[] =
  [
    { size: "Tiny", bonus: -8 },
    { size: "Small", bonus: -4 },
    { size: "Medium", bonus: 0 },
    { size: "Large", bonus: 4 },
    { size: "Huge", bonus: 8 },
    { size: "Gargantuan", bonus: 12 },
    { size: "Colossal", bonus: 16 },
  ];

export const GRAB_EFFECTS_FUNCTION = (grab: GrabConfig): RawEffect[] => [
  {
    opcode: "SetExtendedSpellState",
    state: grab.grabbedState,
    duration: grab.duration,
  },
  {
    opcode: "DisplayString",
    stringRef: grab.grabbedStringRef,
    timing: "InstantPermanentUntilDeath",
  },
  {
    opcode: "MovementRateBonus2",
    type: "Set",
    value: 0,
    duration: grab.duration,
  },
  {
    opcode: "DexterityBonus",
    value: 8, // Grabbed creature loose AC from their dexterity bonus
    type: "Set",
    duration: grab.duration,
  },
  {
    opcode: "ArmorClassBonus",
    bonusTo: "AllWeapons",
    value: -4, // Opponents get +4 bonus on their attack rolls against grabbed target
    duration: grab.duration,
  },
  {
    opcode: "Thac0Bonus",
    type: "Increment",
    value: -4,
    duration: grab.duration,
  },
  {
    opcode: "DisplayPortraitIcon",
    icon: "Entangled",
    duration: grab.duration,
  },
  {
    opcode: "PlaySound",
    timing: "InstantPermanentUntilDeath",
    resource: grab.startSound,
  },
  {
    opcode: "PlaySound",
    timing: "DelayPermanent",
    duration: grab.duration,
    resource: grab.endSound,
  },
  {
    opcode: "PlayVisualEffect",
    playWhere: "OverTargetAttached",
    resource: grab.visualEffect,
    duration: grab.duration,
  },
  {
    opcode: "ProtectionFromSpell",
    resource: grab.file,
    duration: grab.duration,
  },
];
