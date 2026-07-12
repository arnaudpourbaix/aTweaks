import { describe, expect, it, vi } from "vitest";
import { Creature } from "../model/creature/creature";
import { Item } from "../model/spell-item/spell-item";
import creatureFactory from "./creature.factory";

function fakeCreature(): Creature {
  const creature = new Creature(1 as any);
  creature.data = { items: { equipped: [] } } as any;
  creature.items = [];
  return creature;
}

describe("checkValidation", () => {
  it("throws when the creature was already validated", () => {
    const creature = fakeCreature();
    creature.valid = true;
    creature.name = "common.potion.use" as any;
    expect(() => creatureFactory.checkValidation(creature)).toThrow(
      /has already been validated/,
    );
  });

  it("does not throw when valid is still unset", () => {
    const creature = fakeCreature();
    creature.valid = undefined;
    expect(() => creatureFactory.checkValidation(creature)).not.toThrow();
  });
});

describe("equipItem", () => {
  it("throws when no slot is given and the item has no equippedSlot either", () => {
    const creature = fakeCreature();
    const item = { file: "itm01", stringRef: 123 } as unknown as Item;
    expect(() => creatureFactory.equipItem(creature, item)).toThrow(
      /No slot defined for 123/,
    );
  });

  it("pushes the item onto data.items.equipped", () => {
    const creature = fakeCreature();
    const item = { file: "itm01" } as unknown as Item;
    creatureFactory.equipItem(creature, item, ["LRING"]);
    expect(creature.data.items.equipped).toEqual([
      { file: "itm01", slot: ["LRING"] },
    ]);
  });

  it("warns when the target slot is already occupied by an item on the creature", () => {
    const creature = fakeCreature();
    const existingItem = { file: "old01", stringRef: 456 } as unknown as Item;
    creature.items.push(existingItem);
    creature.data.items.equipped.push({ file: "old01", slot: ["LRING"] });
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const newItem = { file: "new01" } as unknown as Item;
    creatureFactory.equipItem(creature, newItem, ["LRING"]);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("already attributed to"),
    );
  });

  it("does not detect the conflict when the existing entry's slot is stored as a bare string rather than an array (known gap, cosmetic-only warning)", () => {
    const creature = fakeCreature();
    const existingItem = { file: "old01", stringRef: 456 } as unknown as Item;
    creature.items.push(existingItem);
    // some real creature configs store slot as a bare string, e.g. ogres.ts:553
    creature.data.items.equipped.push({ file: "old01", slot: "LRING" } as any);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const newItem = { file: "new01" } as unknown as Item;
    creatureFactory.equipItem(creature, newItem, ["LRING"]);
    expect(logSpy).not.toHaveBeenCalled();
    // the item is still equipped regardless - this warning is purely informational
    expect(creature.data.items.equipped).toContainEqual({
      file: "new01",
      slot: ["LRING"],
    });
  });
});
