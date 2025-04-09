import { StringReferenceEnum } from "../../../config/stringRef";
import { EffectDamageTypeEnum } from "../final/enums";
import { RawSaveType } from "./enum";

export interface GrabSharedConfig {
  /**
   * Probability for triggering on hit
   */
  probability: number;

  saveTypes: RawSaveType[];
  saveBonus: number;

  /**
   * Grab duration in seconds, must be a multiple of 6
   */
  duration: number;
}

export interface GrabGlobalConfig extends GrabSharedConfig {
  grabState: string;
  grabStringRef: StringReferenceEnum;
  grabbedStringRef: StringReferenceEnum;
  startSound: string;
  endSound: string;
  visualEffect: string;
}

export interface RawGrabConfig extends Partial<GrabSharedConfig> {
  /**
   * Filename for SPL file (without extension)
   */
  file: string;

  /**
   * Weapon file that is able to grab
   */
  weaponFile: string;

  /**
   * Damage per round
   */
  damagePerRound?: {
    diceThrown: number;
    diceSize: number;
    type: EffectDamageTypeEnum;
  };
}

export type GrabConfig = GrabGlobalConfig & RawGrabConfig;
