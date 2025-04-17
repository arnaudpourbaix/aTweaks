import { ImmunityName } from "../../../config/immunity-name";
import { AlignIdentifier } from "../ids/align";
import { AnimationIdentifiers } from "../ids/animate";
import { ClassIdentifier } from "../ids/class";
import { GenderIdentifier } from "../ids/gender";
import { GeneralIdentifier } from "../ids/general";
import { RaceIdentifier } from "../ids/race";
import { RawCreatureAbility } from "./ability";
import { Actions } from "./actions";
import { RawCreatureAttack } from "./attack";
import { RawEffect } from "./effect";
import { RawEffectOpcode } from "./effect.type";
import { CreatureSize, RawProficiencyType } from "./enum";
import { RawItem, RawItemSlot } from "./item";
import { RawProjectile } from "./projectile";
import { CustomCode } from "./script";
import { RawMemorizedSpell, RawSpell } from "./spell";

export interface RawCreature {
  name: string;
  /**
   * Filename for BAF file (without extension)
   */
  bafFile?: string;

  /**
   * Filename for TPA file (without extension)
   */
  tpaFile: string;

  /**
   * Asking or responding to help shouts (default: true)
   */
  help?: boolean;

  /**
   * Can track enemies when no one in sight ? (default: true)
   */
  tracking?: boolean;

  /**
   * Random walk outside of combat (default: false)
   */
  walk?: boolean;

  /**
   * Random walk within combat when nothing else to do (default: true)
   */
  combatWalk?: boolean;

  /**
   * Fully heal while resting (default: false)
   */
  restHeal?: boolean;

  /**
   * Able to hide in shadows (default: false)
   */
  hideInShadows?: boolean;

  attack?: RawCreatureAttack;

  initActions?: Actions.Action[];

  customCode?: CustomCode[];

  data: RawCreatureData;
  additionalData: RawCreatureAdditionalData;

  files: string[];
  /**
   * For these files, keep existing creature values if they are better
   */
  notEnforceFiles?: string[];
  adjustments?: RawCreatureAdjustment[];

  abilities?: RawCreatureAbility[];
  items?: RawItem[];
  spells?: RawSpell[];
  projectiles?: RawProjectile[];

  /**
   * Auto-generate some creature data (true by default)
   */
  autoGenerate?: RawCreatureAutoGenerate;
}

export interface RawCreatureAutoGenerate {
  thac0: boolean;
  hitPoints: boolean;
  savingThrows: boolean;
  enchantment: boolean;
  meleeRange: boolean;
}

export interface RawCreatureAdjustment {
  files: string[];
  data?: RawCreatureData;
  additionalData?: RawCreatureAdditionalData;
  /**
   * Is it a summon ?
   */
  summon?: boolean;
  /**
   * Don't assign a script
   */
  noScript?: boolean;
  /**
   * Don't assign a weapon
   */
  noWeapon?: boolean;
}

export interface RawCreatureData {
  level1?: number;
  level2?: number;
  level3?: number;
  strength?: number;
  exceptionalStrength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  movement?: number;
  hp?: number;
  /**
   * Bonus HP (+x). For example, Hit Dice 6+1, bonus is 1
   */
  bonusHp?: number;
  /**
   * Specific case when creature have more HP or can fight when HP is below 0 like some bears.
   */
  specialBonusHp?: number;
  ac?: number;
  crushingAC?: number;
  missileAC?: number;
  piercingAC?: number;
  slashingAC?: number;
  resistFire?: number;
  resistCold?: number;
  resistElectricity?: number;
  resistAcid?: number;
  resistMagic?: number;
  resistSlashing?: number;
  resistCrushing?: number;
  resistPiercing?: number;
  resistMissile?: number;
  thac0?: number;
  apr?: number;
  xpv?: number;
  hideShadow?: number;
  moveSilent?: number;
  alignment?: AlignIdentifier;
  saveDeath?: number;
  saveWand?: number;
  savePolymorph?: number;
  saveBreath?: number;
  saveSpell?: number;
  morale?: number;
  moraleBreak?: number;
  moraleRecovery?: number;
  general?: GeneralIdentifier;
  race?: RaceIdentifier;
  class?: ClassIdentifier;
  gender?: GenderIdentifier;
  size?: CreatureSize;
  animation?: AnimationIdentifiers;
  modAnimation?: string;
  metalColor?: number;
  minorColor?: number;
  majorColor?: number;
  skinColor?: number;
  leatherColor?: number;
  armorColor?: number;
  hairColor?: number;
}

export interface RawCreatureAdditionalData {
  /**
   * BAF scripts to remove from CRE
   */
  removeScripts?: string[];
  /**
   * BAF Script location. Auto if empty, at the top tier possible.
   * Will raise an error at install if location was not empty (safety measure)
   */
  scriptLocation?: RawScriptLocation;

  proficiencies?: { type: RawProficiencyType; value: number }[];

  removeItems?: string[];
  itemSlots?: RawItemSlot[];
  immunities?: ImmunityName[];

  removeKnownSpells?: boolean;
  removeMemorizedSpells?: boolean;
  memorizedSpells?: RawMemorizedSpell[];
  effects?: RawEffect[];
  deleteEffectOpcodes?: RawEffectOpcode[];
}

export type RawScriptLocation =
  | "Override"
  | "Class"
  | "Race"
  | "General"
  | "Default";
