import { RawSaveType } from "./enum";

export interface RawGrabGlobalConfig {
  grabState: string;
  grabDisplayStringRef: number;
  grabbedDisplayStringRef: number;
  startSound: string;
  endSound: string;
  visualEffect: string;
  /**
   * Probability for triggering on hit
   */
  probability: number;

  saveTypes: RawSaveType[];
  saveBonus: number;

  /**
   * Grab duration (in seconds, should be a multiple of 6)
   */
  duration: number;
}
