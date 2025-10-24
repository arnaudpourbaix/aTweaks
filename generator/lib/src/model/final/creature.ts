import { ImmunityName } from "../../../config/immunity-name";
import { TranslationKey } from "../../translations/i18n";
import { AlignIdentifier } from "../ids/align";
import { AnimationIdentifiers } from "../ids/animate";
import { ClassIdentifier } from "../ids/class";
import { GenderIdentifier } from "../ids/gender";
import { GeneralIdentifier } from "../ids/general";
import { KitIdentifier } from "../ids/kit";
import { RaceIdentifier } from "../ids/race";
import { CreatureAbility } from "./ability";
import { CreatureAttack } from "./attack";
import { Effect, EffectFile } from "./effect";
import { CreatureSize, ItemSlot, ProficiencyTypeEnum } from "./effect.enums";
import { EffectTypeEnum } from "./effect.type";
import { Projectile } from "./projectile";
import { AdditionalCode, CustomCode } from "./script";
import { EquippedItem, Item, Spell } from "./spell-item";

export interface BaseCreature {
  files: string[];
  data: CreatureData;
  additionalData: CreatureAdditionalData;
}

export interface Creature extends BaseCreature {
  name: TranslationKey;

  /**
   * Filename for BAF file (without extension, relative path from mod folder)
   */
  bafFile?: string;

  /**
   * Filename for TPA file (without extension, relative path from mod folder)
   */
  tpaFile: string;

  /**
   * Asking or responding to help shouts (default: true)
   */
  help: boolean;

  /**
   * Will initiate dialog (values are creature script name)
   */
  dialog: string[];

  /**
   * Can track enemies when no one in sight ? (default: true)
   */
  tracking: boolean;

  /**
   * Random walk outside of combat (default: false)
   */
  walk: boolean;

  /**
   * Random walk within combat when nothing else to do (default: true)
   */
  combatWalk: boolean;

  /**
   * Fully heal while resting (default: false)
   */
  restHeal: boolean;

  /**
   * Can use potions (default: false)
   */
  usePotions: boolean;

  /**
   * Can use kit abilities (default: false)
   */
  useKitAbilities: boolean;

  /**
   * Able to hide in shadows (default: false)
   */
  hideInShadows: boolean;

  attack: CreatureAttack;
  canPolymorph: boolean;

  customCode: CustomCode[];
  additionalCode: AdditionalCode[];

  data: CreatureData;
  additionalData: CreatureAdditionalData;

  /**
   * For these files, keep existing creature values if they are better
   */
  notEnforceFiles: string[];
  adjustments: CreatureAdjustment[];

  abilities: CreatureAbility[];
  items: Item[];
  spells: Spell[];
  projectiles: Projectile[];
  effectFiles: EffectFile[];
  newFiles: { files: string[]; copyFrom: string }[];

  /**
   * Auto-generate some creature data (true by default)
   */
  autoGenerate: CreatureAutoGenerate;
}

export interface MemorizedSpell {
  /**
   * Filename for SPL file (without extension)
   */
  file: string;

  memorizedCount?: number;
}

export type ScriptLocation =
  | "Override"
  | "Class"
  | "Race"
  | "General"
  | "Default";

export interface CreatureAutoGenerate {
  thac0?: boolean;
  hitPoints?: boolean;
  savingThrows?: boolean;
  enchantment?: boolean;
  meleeRange?: boolean;
}

export interface CreatureAdjustment extends BaseCreature {
  /**
   * Is it a summon ?
   */
  summon: boolean;
  /**
   * Don't assign a script
   */
  noScript: boolean;
  /**
   * Don't assign a weapon
   */
  noWeapon: boolean;
}

export interface CreatureData {
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
  thac0?: number;
  apr?: number;
  xpv?: number;
  alignment?: AlignIdentifier;
  saveDeath?: number;
  saveWand?: number;
  savePolymorph?: number;
  saveBreath?: number;
  saveSpell?: number;
  morale?: number;
  general?: GeneralIdentifier;
  race?: RaceIdentifier;
  class?: ClassIdentifier;
  kit?: KitIdentifier;
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
  movement?: number;
  // doubleApr?: boolean;
  // crushingAC?: number;
  // missileAC?: number;
  // piercingAC?: number;
  // slashingAC?: number;
  // resistFire?: number;
  // resistCold?: number;
  // resistElectricity?: number;
  // resistAcid?: number;
  // resistMagic?: number;
  // resistSlashing?: number;
  // resistCrushing?: number;
  // resistPiercing?: number;
  // resistMissile?: number;
  // hideShadow?: number;
  // moveSilent?: number;
  // moraleBreak?: number;
  // moraleRecovery?: number;
}

export interface CreatureAdditionalData {
  /**
   * BAF scripts to remove from CRE
   */
  removeScripts: string[];
  /**
   * BAF Script location. Auto if empty, at the top tier possible.
   * Will raise an error at install if location was not empty (safety measure)
   */
  scriptLocation?: ScriptLocation;

  proficiencies: { type: ProficiencyTypeEnum; value: number }[];

  removeItems: string[];
  itemSlots: EquippedItem[];
  immunities: ImmunityName[];

  removeKnownSpells: boolean;
  removeMemorizedSpells?: boolean;
  memorizedSpells: MemorizedSpell[];

  deleteEffectOpcodes: EffectTypeEnum[];
  removeEffects: boolean;
  effects: Effect[];
}

export const CREATURE_DATA: {
  key: keyof CreatureData;
  fields: { index: number; size: number }[];
}[] = [
  { key: "xpv", fields: [{ index: 0x14, size: 4 }] },
  {
    key: "hp",
    fields: [
      { index: 0x24, size: 2 },
      { index: 0x26, size: 2 },
    ],
  },
  {
    key: "ac",
    fields: [
      { index: 0x46, size: 2 },
      { index: 0x48, size: 2 },
    ],
  },
  // { key: "crushingAC", fields: [{ index: 0x4a, size: 2 }] },
  // { key: "missileAC", fields: [{ index: 0x4c, size: 2 }] },
  // { key: "piercingAC", fields: [{ index: 0x4e, size: 2 }] },
  // { key: "slashingAC", fields: [{ index: 0x50, size: 2 }] },
  { key: "thac0", fields: [{ index: 0x52, size: 1 }] },
  { key: "apr", fields: [{ index: 0x53, size: 1 }] },
  { key: "saveDeath", fields: [{ index: 0x54, size: 1 }] },
  { key: "saveWand", fields: [{ index: 0x55, size: 1 }] },
  { key: "savePolymorph", fields: [{ index: 0x56, size: 1 }] },
  { key: "saveBreath", fields: [{ index: 0x57, size: 1 }] },
  { key: "saveSpell", fields: [{ index: 0x58, size: 1 }] },
  // {
  //   key: "resistFire",
  //   fields: [
  //     { index: 0x59, size: 1 },
  //     { index: 0x5e, size: 1 },
  //   ],
  // },
  // {
  //   key: "resistCold",
  //   fields: [
  //     { index: 0x5a, size: 1 },
  //     { index: 0x5f, size: 1 },
  //   ],
  // },
  // { key: "resistElectricity", fields: [{ index: 0x5b, size: 1 }] },
  // { key: "resistAcid", fields: [{ index: 0x5c, size: 1 }] },
  // { key: "resistMagic", fields: [{ index: 0x5d, size: 1 }] },
  // { key: "resistSlashing", fields: [{ index: 0x60, size: 1 }] },
  // { key: "resistCrushing", fields: [{ index: 0x61, size: 1 }] },
  // { key: "resistPiercing", fields: [{ index: 0x62, size: 1 }] },
  // { key: "resistMissile", fields: [{ index: 0x63, size: 1 }] },
  { key: "level1", fields: [{ index: 0x234, size: 1 }] },
  { key: "level2", fields: [{ index: 0x235, size: 1 }] },
  { key: "level3", fields: [{ index: 0x236, size: 1 }] },
  {
    key: "gender",
    fields: [
      { index: 0x237, size: 1 },
      { index: 0x275, size: 1 },
    ],
  },
  { key: "strength", fields: [{ index: 0x238, size: 1 }] },
  { key: "exceptionalStrength", fields: [{ index: 0x239, size: 1 }] },
  { key: "intelligence", fields: [{ index: 0x23a, size: 1 }] },
  { key: "wisdom", fields: [{ index: 0x23b, size: 1 }] },
  { key: "dexterity", fields: [{ index: 0x23c, size: 1 }] },
  { key: "constitution", fields: [{ index: 0x23d, size: 1 }] },
  { key: "charisma", fields: [{ index: 0x23e, size: 1 }] },
  { key: "morale", fields: [{ index: 0x23f, size: 1 }] },
  // { key: "moraleBreak", fields: [{ index: 0x240, size: 1 }] },
  // { key: "moraleRecovery", fields: [{ index: 0x242, size: 1 }] },
  { key: "general", fields: [{ index: 0x271, size: 1 }] },
  { key: "race", fields: [{ index: 0x272, size: 1 }] },
  { key: "class", fields: [{ index: 0x273, size: 1 }] },
  { key: "kit", fields: [{ index: 0x246, size: 2 }] },
  { key: "alignment", fields: [{ index: 0x27b, size: 1 }] },
  // { key: "hideShadow", fields: [{ index: 0x45, size: 1 }] },
  // { key: "moveSilent", fields: [{ index: 0x68, size: 1 }] },
  { key: "animation", fields: [{ index: 0x28, size: 4 }] },
  { key: "modAnimation", fields: [{ index: 0x28, size: 4 }] },
  { key: "metalColor", fields: [{ index: 0x2c, size: 1 }] },
  { key: "minorColor", fields: [{ index: 0x2d, size: 1 }] },
  { key: "majorColor", fields: [{ index: 0x2e, size: 1 }] },
  { key: "skinColor", fields: [{ index: 0x2f, size: 1 }] },
  { key: "leatherColor", fields: [{ index: 0x30, size: 1 }] },
  { key: "armorColor", fields: [{ index: 0x31, size: 1 }] },
  { key: "hairColor", fields: [{ index: 0x32, size: 1 }] },
];
