import { describe, expect, it } from "vitest";
import { Creature } from "./creature";

function fakeCreature(): Creature {
  const creature = new Creature(1 as any);
  creature.data = { spells: { memorized: [] } } as any;
  return creature;
}

describe("addSpell", () => {
  it("pushes a memorized entry when memorizedCount is a positive number", () => {
    const creature = fakeCreature();
    const spell = creature.addSpell({ memorizedCount: 2 });
    expect(creature.data.spells.memorized).toEqual([
      { file: spell.file, memorizedCount: 2 },
    ]);
  });

  it("adds no memorized entry when memorizedCount is unset", () => {
    const creature = fakeCreature();
    creature.addSpell({});
    expect(creature.data.spells.memorized).toEqual([]);
  });

  it("pushes a memorized entry with memorizedCount: 0 (the 'remove memorized spell' sentinel)", () => {
    const creature = fakeCreature();
    const spell = creature.addSpell({ memorizedCount: 0 });
    expect(creature.data.spells.memorized).toEqual([
      { file: spell.file, memorizedCount: 0 },
    ]);
  });
});
