import { TargetStatusName } from "../../../config/target-name";
import { GrabConfig } from "./grab";
import { TargetPriority } from "../script/target";
import { PartialBy } from "../utility-types";
import { ScriptWeaponSlot } from "./item";

export interface CreatureAttack {
  /**
   * Allow melee attack (default: true)
   */
  melee: boolean;

  /**
   * Allow range attack (default: false)
   */
  ranged: boolean;

  /**
   * Maximum range for selecting a target (usefull when creature can leap/teleport at will)
   */
  maxRange?: number;

  /**
   * Uses this when a monster have several attacks per round with 2 different weapons.
   * It makes sure that both weapons are properly used.
   * It will:
   * - remove one attack per round (because offhand gives one)
   * - gives 3 points in two weapons fighting
   * - add a bonus to hit of +2 to offhand.
   */
  dualWielding?: boolean;

  /**
   * If it can grab, you need to set up this property
   */
  grab?: GrabConfig;

  /**
   * Target priorities in combat
   */
  targetPriorities: TargetPriority[];

  /**
   * Allow to select a specific weapon slot when target is affected by a list of status
   */
  targetStatusWeaponSlot: {
    status: TargetStatusName[];
    slot: ScriptWeaponSlot;
  }[];

  /**
   * Default weapon slot, when no specific configuration exists
   */
  defaultWeaponSlot?: ScriptWeaponSlot;

  /**
   * Not needed if creature has only one weapon (melee or ranged).
   * If omitted, creature won't use SelectWeaponAbility to select a weapon.
   */
  actions: CreatureAttackAction[];
}

export interface CreatureAttackAction {
  responseWeight: number;
  weaponSlot?: ScriptWeaponSlot;
  /**
   * If true, disable interrupt while attacking (false by default)
   */
  disableInterrupt: boolean;
}
