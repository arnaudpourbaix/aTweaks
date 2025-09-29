import { TraStringReferenceEnum } from "../../../config/stringRef";
import { EffectDamageTypeEnum } from "../final/enums";
import { RawSaveType } from "./enum";

export interface GrabSharedConfig {
  /**
   * Probability for triggering on hit
   */
  probability: number;

  saveType: RawSaveType;
  saveBonus: number;

  /**
   * Grab duration in seconds, must be a multiple of 6
   */
  duration: number;
}

export interface GrabGlobalConfig extends GrabSharedConfig {
  grabbedState: string;
  grabbingState: string;
  grabStringRef: TraStringReferenceEnum;
  grabbedStringRef: TraStringReferenceEnum;
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
   * Grabbing a prone target gives +4 attack roll modifier
   */
  onlyGrabProneTarget?: boolean;

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
