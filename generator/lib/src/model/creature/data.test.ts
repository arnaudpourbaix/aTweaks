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

  it("level2's setter also passes through an already-built Level object unchanged", () => {
    const data = baseData({});
    const level: Level = { pnpValue: 9, value: 7, type: "caster" };
    field("level2").setter!(data, level);
    expect(data.level2).toBe(level);
  });
});

describe("CREATURE_DATA_FIELDS 'spells'", () => {
  it("a boolean removeMemorized always overwrites the current value", () => {
    const data = baseData({
      spells: { removeKnown: undefined, removeMemorized: ["OLD"], memorized: [] },
    });
    field("spells").setter!(data, { removeMemorized: false });
    expect(data.spells.removeMemorized).toBe(false);
  });

  it("merges an array removeMemorized into an existing array", () => {
    const data = baseData({
      spells: { removeKnown: undefined, removeMemorized: ["OLD"], memorized: [] },
    });
    field("spells").setter!(data, { removeMemorized: ["NEW"] });
    expect(data.spells.removeMemorized).toEqual(["OLD", "NEW"]);
  });

  it("replaces a non-array removeMemorized (e.g. still the boolean default) with the new array", () => {
    const data = baseData({
      spells: { removeKnown: undefined, removeMemorized: true, memorized: [] },
    });
    field("spells").setter!(data, { removeMemorized: ["NEW"] });
    expect(data.spells.removeMemorized).toEqual(["NEW"]);
  });

  it("leaves removeMemorized untouched when not provided", () => {
    const data = baseData({
      spells: { removeKnown: undefined, removeMemorized: true, memorized: [] },
    });
    field("spells").setter!(data, {});
    expect(data.spells.removeMemorized).toBe(true);
  });
});

describe("CREATURE_DATA_FIELDS 'effects'", () => {
  it("pushes provided effects onto the list", () => {
    const data = baseData({ effects: { remove: undefined, list: [] } });
    const effect = { opcode: 1 } as any;
    field("effects").setter!(data, { list: [effect] });
    expect(data.effects.list).toEqual([effect]);
  });

  it("a boolean remove always overwrites the current value", () => {
    const data = baseData({ effects: { remove: [1], list: [] } });
    field("effects").setter!(data, { remove: false });
    expect(data.effects.remove).toBe(false);
  });

  it("merges an array remove into an existing array", () => {
    const data = baseData({ effects: { remove: [1], list: [] } });
    field("effects").setter!(data, { remove: [2 as any] });
    expect(data.effects.remove).toEqual([1, 2]);
  });

  it("replaces a non-array remove with the new array", () => {
    const data = baseData({ effects: { remove: undefined, list: [] } });
    field("effects").setter!(data, { remove: [1 as any] });
    expect(data.effects.remove).toEqual([1]);
  });

  it("leaves remove untouched when not provided", () => {
    const data = baseData({ effects: { remove: [1], list: [] } });
    field("effects").setter!(data, {});
    expect(data.effects.remove).toEqual([1]);
  });
});
