import { describe, expect, it } from "vitest";
import { EquippedItem } from "../model/creature/item";
import itemService from "./item.service";

function fakeEquippedItem(slot: EquippedItem["slot"]): EquippedItem {
  return { file: "wpn01", slot };
}

describe("isEquippedWeapon", () => {
  it("returns true for a single weapon slot", () => {
    expect(itemService.isEquippedWeapon(fakeEquippedItem("WEAPON1"))).toBe(
      true,
    );
  });

  it("returns false for a single non-weapon slot", () => {
    expect(itemService.isEquippedWeapon(fakeEquippedItem("HELMET"))).toBe(
      false,
    );
  });

  it("returns true when every slot in the array is a weapon slot", () => {
    expect(
      itemService.isEquippedWeapon(fakeEquippedItem(["WEAPON1", "SHIELD"])),
    ).toBe(true);
  });

  it("returns false when any slot in the array is not a weapon slot", () => {
    expect(
      itemService.isEquippedWeapon(fakeEquippedItem(["WEAPON1", "HELMET"])),
    ).toBe(false);
  });

  it("returns false for a single-element array with a non-weapon slot", () => {
    expect(itemService.isEquippedWeapon(fakeEquippedItem(["HELMET"]))).toBe(
      false,
    );
  });

  it("returns false for an empty slot array", () => {
    expect(itemService.isEquippedWeapon(fakeEquippedItem([]))).toBe(false);
  });
});
