import { CreatureSize } from "../../../config/creatures";
import { AlignIdentifier } from "../ids/align";
import { AnimationIdentifiers } from "../ids/animate";
import { ClassIdentifier } from "../ids/class";
import { GenderIdentifier } from "../ids/gender";
import { GeneralIdentifier } from "../ids/general";
import { KitIdentifier } from "../ids/kit";
import { RaceIdentifier } from "../ids/race";

export interface CreatureData {
  level1: number;
  level2?: number;
  level3?: number;
  strength: number;
  exceptionalStrength?: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
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
  ac: number;
  thac0?: number;
  apr: number;
  xpv?: number;
  alignment?: AlignIdentifier;
  saveDeath?: number;
  saveWand?: number;
  savePolymorph?: number;
  saveBreath?: number;
  saveSpell?: number;
  morale?: number;
  general: GeneralIdentifier;
  race: RaceIdentifier;
  class: ClassIdentifier;
  kit?: KitIdentifier;
  gender?: GenderIdentifier;
  size: CreatureSize;
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
  doubleApr?: boolean;
  hideShadow?: number;
  moveSilent?: number;
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
  // moraleBreak?: number;
  // moraleRecovery?: number;
}
export type PartialCreatureData = Partial<Omit<CreatureData, "movement">>;

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
  { key: "hideShadow", fields: [{ index: 0x45, size: 1 }] },
  { key: "moveSilent", fields: [{ index: 0x68, size: 1 }] },
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
