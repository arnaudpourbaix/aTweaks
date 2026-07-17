import { describe, expect, it } from "vitest";
import { Creature } from "../../model/creature/creature";
import { MainCreatureData } from "../../model/creature/data";
import abilityOrderService from "./ability-order.service";
import { SPELL_PRIORITY_ORDER } from "../../../config/spell-priority-order";

function fakeCreature(p: { memorized?: { file: string }[] } = {}): Creature {
  const creature = new Creature(1);
  creature.name = "common.potion.use";
  creature.data = { spells: { memorized: p.memorized ?? [] } } as unknown as MainCreatureData;
  creature.adjustments = [];
  return creature;
}

describe("resolve", () => {
  it("orders memorized spells by their SPELL_PRIORITY_ORDER index", () => {
    SPELL_PRIORITY_ORDER.push("test-priority-a", "test-priority-b");
    try {
      const creature = fakeCreature({
        memorized: [{ file: "test-priority-b" }, { file: "test-priority-a" }],
      });
      expect(abilityOrderService.resolve(creature)).toEqual([
        { preset: "test-priority-a" },
        { preset: "test-priority-b" },
      ]);
    } finally {
      SPELL_PRIORITY_ORDER.pop();
      SPELL_PRIORITY_ORDER.pop();
    }
  });

  it("returns an empty array when nothing is memorized", () => {
    const creature = fakeCreature();
    expect(abilityOrderService.resolve(creature)).toEqual([]);
  });
});
