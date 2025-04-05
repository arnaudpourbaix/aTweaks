import { GrabFullConfig } from "../src/model/grab";
import { RawSaveTypeEnum } from "../src/model/raw/enum";

export const GRAB_DEFAULT_CONFIG: GrabFullConfig = {
  file: "",
  weaponFile: "",
  probability: 100,
  grabState: "JA_GRAPPLE",
  duration: 12,
  saveTypes: [RawSaveTypeEnum.Breath],
  saveBonus: -2,
  grabDisplayStringRef: 3000,
  grabbedDisplayStringRef: 3001,
  startSound: "CRE_P01",
  endSound: "EFF_M22A",
  visualEffect: "rr#cnstr",
};
