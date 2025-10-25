export type ItemSlot =
  | "HELMET"
  | "ARMOR"
  | "SHIELD"
  | "GLOVES"
  | "LRING"
  | "RRING"
  | "AMULET"
  | "BELT"
  | "BOOTS"
  | "WEAPON1"
  | "WEAPON2"
  | "WEAPON3"
  | "WEAPON4"
  | "QUIVER1"
  | "QUIVER2"
  | "QUIVER3"
  | "QUIVER4"
  | "CLOAK"
  | "QITEM1"
  | "QITEM2"
  | "QITEM3";

export const WEAPON_SLOTS: ItemSlot[] = [
  "WEAPON1",
  "WEAPON2",
  "WEAPON3",
  "WEAPON4",
  "SHIELD",
];

export const JEWEL_SLOTS: ItemSlot[] = [
  "LRING",
  "RRING",
  "AMULET",
  "BELT",
  "GLOVES",
  "CLOAK",
];

export type ScriptWeaponSlot = "SLOT_WEAPON" | "SLOT_WEAPON1" | "SLOT_WEAPON2";

export interface EquippedItem {
  /**
   * Filename for ITM file (without extension)
   */
  file: string;
  slot: ItemSlot | ItemSlot[];
  /**
   * default: 1
   */
  quantity?: number;
  /**
   * default: false
   */
  unstealable?: boolean;
  /**
   * default: true
   */
  undroppable?: boolean;
}
