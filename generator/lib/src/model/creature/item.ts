import { SlotIdentifier } from "../ids/slot";

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

export const WEAPON_SLOTS: { slot: ItemSlot; id: SlotIdentifier }[] = [
  { slot: "WEAPON1", id: "SLOT_WEAPON0" },
  { slot: "WEAPON2", id: "SLOT_WEAPON1" },
  { slot: "WEAPON3", id: "SLOT_WEAPON2" },
  { slot: "WEAPON4", id: "SLOT_WEAPON3" },
  { slot: "SHIELD", id: "SLOT_SHIELD" },
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
