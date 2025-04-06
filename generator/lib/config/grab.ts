import { RawGrabGlobalConfig } from "../src/model/raw/grab";

export const GRAB_DEFAULT_CONFIG: RawGrabGlobalConfig = {
  probability: 100,
  grabState: "JA_GRAPPLE",
  duration: 12,
  saveTypes: ["Breath"],
  saveBonus: -2,
  grabDisplayStringRef: 3000,
  grabbedDisplayStringRef: 3001,
  startSound: "CRE_P01",
  endSound: "EFF_M22A",
  visualEffect: "rr#cnstr",
};
