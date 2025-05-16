import { StringReference } from "../misc";
import {
  RawAreaProjectile,
  RawBamProjectileFlags,
  RawEffectIDSFile,
  RawParticleColor,
  RawProjectileAnimation,
  RawProjectileBehavior,
  RawProjectileExplosionEffect,
  RawProjectileExtendedFlags,
  RawProjectileType,
} from "./enum";

export interface RawProjectile {
  file: string;
  copyFromFile: string;
  description: string;
  type?: RawProjectileType;
  speed?: number;
  behaviorFlags?: RawProjectileBehavior[];
  fireSound?: string;
  impactSound?: string;
  sourceAnimation?: string;
  particleColor?: RawParticleColor;
  projectileWidth?: number;
  extendedFlags?: RawProjectileExtendedFlags[];
  stringRef?: StringReference;
  color?: {
    red: number;
    green: number;
    blue: number;
  };
  colorSpeed?: number;
  screenShakeAmount?: number;
  idsTarget1?: RawEffectIDSFile;
  idsTarget2?: RawEffectIDSFile;
  defaultSpell?: string;
  successSpell?: string;

  projectileInfo?: RawProjectileInfo;
  areaEffectInfo?: RawProjectileAreaEffectInfo;
}

export interface RawProjectileInfo {
  bamProjectileFlags?: RawBamProjectileFlags[];
  projectileSmokeAnimation?: RawProjectileAnimation;
}

export interface RawProjectileAreaEffectInfo {
  areaProjectileFlags?: RawAreaProjectile[];
  rayCount?: number;
  /**
   * divide by approx 8.5 to receive diameter in feet
   */
  triggerRadius?: number;
  /**
   * divide by approx 8.5 to receive diameter in feet
   */
  areaOfEffect?: number;
  explosionSound?: string;
  /**
   * Determines how often (in ticks, 100 ticks = 1 round) the projectile checks for targets within its Trap Size. The total duration is generally Frequency * # Repetitions.
   * Targets outside its Trap Size but within its Explosion Size are checked every tick of the duration.
   */
  explosionDelay?: number;
  fragmentAnimation?: RawProjectileAnimation;
  secondaryProjectile?: number;
  triggerCount?: number;
  explosionEffect?: RawProjectileExplosionEffect;
  explosionColor?: number;
  explosionProjectile?: number;
  explosionAnimation?: number;
  coneWidth?: number;

  travelingProjectileAnimation?: string;
  shadowAnimation?: string;
  lightSpotIntensity?: number;
  lightSpotWidth?: number;
  lightSpotHeight?: number;
  palette?: string;
  projectileColours?: string;
  smokePuffDelay?: number;
  smokeColours?: string;
  faceTargetGranularity?: number;
  trailingAnimation1?: string;
  trailingAnimation2?: string;
  trailingAnimation3?: string;
  trailingNumber1?: number;
  trailingNumber2?: number;
  trailingNumber3?: number;
}
