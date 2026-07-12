import { describe, expect, it } from "vitest";
import { MonsterEnum, MonsterFamilyEnum } from "../../../creatures/monster";
import { CreatureFamily } from "./family";
import { Creature } from "./creature";

class TestFamily extends CreatureFamily<Creature> {
  createCreature(id: MonsterEnum): Creature {
    return new Creature(id);
  }
}

function fakeFamily(): TestFamily {
  return new TestFamily(1 as any);
}

describe("creature", () => {
  it("throws when no creature in the family has the given id", () => {
    const family = fakeFamily();
    expect(() => family.creature(99)).toThrow(/No creature found with id 99/);
  });

  it("returns the creature with the matching id", () => {
    const family = fakeFamily();
    const cre = new Creature(5 as any);
    family.creatures.push(cre);
    expect(family.creature(5)).toBe(cre);
  });
});

describe("sequencer", () => {
  it("delegates to abilityService.getSequencer", () => {
    const family = fakeFamily();
    const result = family.sequencer([
      "SPWI219",
      "SPWI219",
      "SPWI219",
    ] as any);
    expect(result).toBeDefined();
  });
});

describe("item (override, family-wide fallback)", () => {
  it("falls back to searching creatures in the family when not found directly", () => {
    const family = fakeFamily();
    const cre = new Creature(1 as any);
    const item = { id: 7, file: "itm01" } as any;
    cre.items.push(item);
    family.creatures.push(cre);
    expect(family.item(7)).toBe(item);
  });

  it("re-throws the original error when not found anywhere in the family", () => {
    const family = fakeFamily();
    expect(() => family.item(99)).toThrow(/No item found with id 99/);
  });
});

describe("spell (override, family-wide fallback)", () => {
  it("falls back to searching creatures in the family when not found directly", () => {
    const family = fakeFamily();
    const cre = new Creature(1 as any);
    const spell = { id: 7, file: "spl01" } as any;
    cre.spells.push(spell);
    family.creatures.push(cre);
    expect(family.spell(7)).toBe(spell);
  });

  it("re-throws the original error when not found anywhere in the family", () => {
    const family = fakeFamily();
    expect(() => family.spell(99)).toThrow(/No spell found with id 99/);
  });
});

describe("projectile (override, family-wide fallback)", () => {
  it("falls back to searching creatures in the family when not found directly", () => {
    const family = fakeFamily();
    const cre = new Creature(1 as any);
    const proj = { id: 7, file: "pro01" } as any;
    cre.projectiles.push(proj);
    family.creatures.push(cre);
    expect(family.projectile(7)).toBe(proj);
  });

  it("keeps checking later creatures when an earlier one doesn't have it", () => {
    const family = fakeFamily();
    const first = new Creature(1 as any);
    const second = new Creature(2 as any);
    const proj = { id: 7, file: "pro01" } as any;
    second.projectiles.push(proj);
    family.creatures.push(first, second);
    expect(family.projectile(7)).toBe(proj);
  });

  it("re-throws the original error when not found anywhere in the family", () => {
    const family = fakeFamily();
    expect(() => family.projectile(99)).toThrow(
      /No projectile found with id 99/,
    );
  });
});
