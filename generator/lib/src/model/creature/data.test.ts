import { describe, expect, it } from "vitest";
import {
  CREATURE_DATA_FIELDS,
  CreatureData,
  DATA_DEFAULT,
  Level,
} from "./data";
import { Movement } from "./movement";

function field(key: keyof CreatureData) {
  const entry = CREATURE_DATA_FIELDS.find((f) => f.key === key);
  if (!entry) throw new Error(`No CREATURE_DATA_FIELDS entry for ${key}`);
  return entry;
}

function baseData(overrides: Partial<CreatureData>): CreatureData {
  return { ...DATA_DEFAULT, ...overrides } as CreatureData;
}

describe("CREATURE_DATA_FIELDS 'movement'", () => {
  it("emits the converted engine value when not attached to an item", () => {
    const data = baseData({ movement: new Movement(12) });
    expect(field("movement").value!(data)).toBe("10");
  });

  it("emits nothing when the movement is instead carried by an item (0x28 slot conflict avoided)", () => {
    const movement = new Movement(12);
    movement.bindItem("SOME_ITEM");
    const data = baseData({ movement });
    expect(field("movement").value!(data)).toBeUndefined();
  });

  it("the setter wraps a plain number into a Movement instance", () => {
    const data = baseData({});
    field("movement").setter!(data, 12);
    expect(data.movement).toBeInstanceOf(Movement);
    expect(data.movement!.pnpValue).toBe(12);
  });
});

describe("CREATURE_DATA_FIELDS 'level1'/'level2'/'level3'", () => {
  it("the setter wraps a plain number shorthand into a Level object with type 'none'", () => {
    const data = baseData({});
    field("level1").setter!(data, 8);
    expect(data.level1).toEqual({ pnpValue: 8, value: 8, type: "none" });
  });

  it("the setter passes through an already-built Level object unchanged", () => {
    const data = baseData({});
    const level: Level = { pnpValue: 8, value: 6, type: "caster" };
    field("level1").setter!(data, level);
    expect(data.level1).toBe(level);
  });

  it("the value getter reads the resolved (engine) value, not the pnp value", () => {
    const data = baseData({
      level1: { pnpValue: 8, value: 6, type: "caster" },
    });
    expect(field("level1").value!(data)).toBe("6");
  });
});
