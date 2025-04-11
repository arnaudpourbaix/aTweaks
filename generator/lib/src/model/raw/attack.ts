import { TargetStatusName } from "../../../config/target-name";
import { WeaponSlot } from "../ids/slot";
import { RawGrabConfig } from "./grab";

export interface RawCreatureAttack {
  /**
   * Allow melee attack (default: true)
   */
  melee?: boolean;

  /**
   * Allow range attack (default: false)
   */
  ranged?: boolean;

  /**
   * Target priorities
   */
  targetStatusPriorities?: TargetStatusName[];

  /**
   * Allow to select a specific weapon slot when target is affected by a list of status
   */
  targetStatusWeaponSlot?: { status: TargetStatusName[]; slot: WeaponSlot }[];

  /**
   * Default weapon slot, when no specific configuration exists
   */
  defaultWeaponSlot?: WeaponSlot;

  /**
   * Not needed if creature has only one weapon (melee or ranged).
   * If omitted, creature won't use SelectWeaponAbility to select a weapon.
   */
  actions?: RawCreatureAttackAction[];

  /**
   * Uses this when a monster have several attacks per round with 2 different weapons.
   * It makes sure that both weapons are properly used.
   * It will:
   * - remove one attack per round (because offhand gives one)
   * - gives 3 points in two weapons fighting
   * - add a bonus to hit of +2 to offhand.
   * - (add a bonus to hit of +4 to mainhand and +8 to offhand.)
   *
   */
  dualWielding?: boolean;

  /**
   * If it can grab, you need to set up this property
   */
  grab?: RawGrabConfig;
}

export interface RawCreatureAttackAction {
  /**
   * Default: 100
   */
  responseWeight?: number;
  weaponSlot?: WeaponSlot;
  /**
   * Default is one round
   */
  duration?: number;
  /**
   * If true, disable interrupt while attacking (false by default)
   */
  disableInterrupt?: boolean;
}
