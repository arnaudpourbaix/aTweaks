import { RawEffect } from "../src/model/raw/effect";
import { GrabConfig, GrabGlobalConfig } from "../src/model/raw/grab";
import { StringReferenceEnum } from "./stringRef";

export const GRAB_DEFAULT_CONFIG: GrabGlobalConfig = {
  probability: 100,
  grabState: "JA_GRAPPLE",
  duration: 12,
  saveTypes: ["Breath"],
  saveBonus: -2,
  grabStringRef: StringReferenceEnum.Grab,
  grabbedStringRef: StringReferenceEnum.Grabbed,
  startSound: "CRE_P01",
  endSound: "EFF_M22A",
  visualEffect: "rr#cnstr",
};

export const RAW_EFFECTS_FUNCTION = (grab: GrabConfig): RawEffect[] => [
  {
    opcode: "SetExtendedSpellState",
    state: grab.grabState,
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
    opcode: "DisplayPortraitIcon",
    icon: "Entangled",
    duration: grab.duration,
  },
  {
    opcode: "DexterityBonus",
    value: 8,
    type: "Set",
    duration: grab.duration,
  },
  {
    opcode: "ProtectionFromSpell",
    resource: grab.file,
  },
];
