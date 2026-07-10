import { describe, expect, it } from "vitest";
import { RawCreatureAbility, RawCreatureSequencerAbility } from "../../model/creature/ability";
import abilityService from "./ability.service";

describe("getAbilities", () => {
  it("returns an empty array when abilities is undefined", () => {
    expect(abilityService.getAbilities(undefined)).toEqual([]);
  });

  it("fills in default flags and pulls actionsBefore/actionsAfter into actions", () => {
    const [ability] = abilityService.getAbilities([
      {
        name: "ability.unknown",
        actionsBefore: [{ name: "SetGlobal", params: ["A", "LOCALS", 1] }],
        actionsAfter: [{ name: "SetGlobal", params: ["B", "LOCALS", 1] }],
      },
    ]);
    expect(ability.infiniteUse).toBe(false);
    expect(ability.requireVocal).toBe(false);
    expect(ability.disableInterrupt).toBe(false);
    expect(ability.canUseWhenPolymorphed).toBe(false);
    expect(ability.isSpell).toBe(false);
    expect(ability.targets).toEqual([]);
    expect(ability.triggers).toEqual([]);
    expect(ability.actions).toEqual([
      { name: "SetGlobal", params: ["A", "LOCALS", 1] },
      { name: "SetGlobal", params: ["B", "LOCALS", 1] },
    ]);
  });

  it("wraps a single non-array target into a one-element target list", () => {
    const [ability] = abilityService.getAbilities([
      { name: "ability.unknown", targets: { name: "Players" } as any },
    ]);
    expect(ability.targets).toEqual([{ name: "Players" }]);
  });

  it("preserves explicit overrides instead of the defaults", () => {
    const [ability] = abilityService.getAbilities([
      { name: "ability.unknown", requireVocal: true, disableInterrupt: true },
    ]);
    expect(ability.requireVocal).toBe(true);
    expect(ability.disableInterrupt).toBe(true);
  });

  it("adds a RandomNumGT trigger when probability is below 100", () => {
    const [ability] = abilityService.getAbilities([
      { name: "ability.unknown", probability: 50 },
    ]);
    expect(ability.triggers).toHaveLength(1);
    expect(ability.triggers[0].name).toBe("RandomNumGT");
  });

  it("does not add a probability trigger when probability is 100 or unset", () => {
    const [withHundred] = abilityService.getAbilities([
      { name: "ability.unknown", probability: 100 },
    ]);
    const [withNone] = abilityService.getAbilities([
      { name: "ability.unknown" },
    ]);
    expect(withHundred.triggers).toEqual([]);
    expect(withNone.triggers).toEqual([]);
  });

  it("assigns increasing RandomNumGT global ids across multiple probabilistic abilities", () => {
    const abilities = abilityService.getAbilities([
      { name: "ability.unknown", probability: 50 },
      { name: "ability.unknown", probability: 30 },
    ]);
    const [firstNum] = abilities[0].triggers[0].params as number[];
    const [secondNum] = abilities[1].triggers[0].params as number[];
    expect(secondNum).toBeGreaterThan(firstNum);
  });
});

describe("getAbilities - single spell", () => {
  it("builds a Spell action targeting LastSeenBy by default (selfTarget not set)", () => {
    const [ability] = abilityService.getAbilities([
      {
        name: "ability.unknown",
        spell: { id: "SPWI001" as any, memorizedSpellCheck: false },
      },
    ]);
    expect(ability.isSpell).toBe(true);
    expect(ability.actions).toEqual([
      { name: "Spell", params: ["LastSeenBy", "SPWI001"] },
    ]);
  });

  it("targets Myself when the spell has selfTarget set", () => {
    const [ability] = abilityService.getAbilities([
      {
        name: "ability.unknown",
        spell: {
          id: "SPWI001" as any,
          memorizedSpellCheck: false,
          selfTarget: true,
        },
      },
    ]);
    expect(ability.actions).toEqual([
      { name: "Spell", params: ["Myself", "SPWI001"] },
    ]);
  });

  it("targets LastSeenBy when the ability has targets and requires a memorized-spell check", () => {
    const [ability] = abilityService.getAbilities([
      {
        name: "ability.unknown",
        targets: [{ name: "Players" }],
        spell: { id: "SPWI001" as any },
      },
    ]);
    expect(ability.triggers[0]).toEqual({
      name: "HaveSpell",
      params: ["SPWI001"],
    });
    expect(ability.actions).toEqual([
      { name: "Spell", params: ["LastSeenBy", "SPWI001"] },
    ]);
  });

  it("throws when a spell has neither an id nor a resource", () => {
    expect(() =>
      abilityService.getAbilities([
        { name: "ability.unknown", spell: {} },
      ]),
    ).toThrow(/No spell specified for ability ability.unknown/);
  });

  it("marks infiniteUse true for non-normal spell types that aren't removed", () => {
    const [ability] = abilityService.getAbilities([
      {
        name: "ability.unknown",
        spell: { id: "SPWI001" as any, type: "force" },
      },
    ]);
    expect(ability.infiniteUse).toBe(true);
  });

  it("emits a RemoveSpell action when a non-normal spell is marked remove", () => {
    const [ability] = abilityService.getAbilities([
      {
        name: "ability.unknown",
        spell: { id: "SPWI001" as any, type: "force", remove: true },
      },
    ]);
    expect(ability.actions).toEqual([
      { name: "ForceSpell", params: ["LastSeenBy", "SPWI001"] },
      { name: "RemoveSpell", params: ["SPWI001"] },
    ]);
  });

  it("adds negated exclude-state/stat/spellstate checks as triggers", () => {
    const [ability] = abilityService.getAbilities([
      {
        name: "ability.unknown",
        spell: {
          id: "SPWI001" as any,
          memorizedSpellCheck: false,
          excludeStateChecks: ["STATE_SILENCED" as any],
          excludeStatsChecks: ["STR" as any],
          excludeSpellStates: ["some_spellstate"],
        },
      },
    ]);
    expect(ability.triggers).toEqual([
      { name: "StateCheck", params: ["Myself", "STATE_SILENCED"], negation: true },
      { name: "CheckStatGT", params: ["Myself", 0, "STR"], negation: true },
      { name: "CheckSpellState", params: ["Myself", "some_spellstate"], negation: true },
    ]);
  });
});

describe("getAbilities - multi-spell (spells array)", () => {
  it("marks isSpell true and emits one Spell action per spell", () => {
    const [ability] = abilityService.getAbilities([
      {
        name: "ability.unknown",
        spells: [
          { id: "SPWI001" as any, type: "normal" },
          { id: "SPWI002" as any, type: "normal" },
        ],
      } as any,
    ]);
    expect(ability.isSpell).toBe(true);
    expect(ability.infiniteUse).toBe(false);
    expect(ability.actions).toEqual([
      { name: "Spell", params: ["LastSeenBy", "SPWI001"] },
      { name: "Spell", params: ["LastSeenBy", "SPWI002"] },
    ]);
  });

  it("throws when spells mix selfTarget true and false", () => {
    expect(() =>
      abilityService.getAbilities([
        {
          name: "ability.unknown",
          spells: [
            { id: "SPWI001" as any, selfTarget: true },
            { id: "SPWI002" as any, selfTarget: false },
          ],
        } as any,
      ]),
    ).toThrow(/Every spells must have the same target in ability ability.unknown/);
  });
});

describe("getMinorSequencer / getSequencer", () => {
  it("builds a 2-spell sequencer with the MinorSequencer name and the standard probability/triggers", () => {
    const ability = abilityService.getMinorSequencer([
      "SPWI219", // Vocalize
      "SPWI206", // Invisibility
    ] as any);
    expect(ability.name).toBe("ability.MinorSequencer");
    expect(ability.requireVocal).toBe(false);
    expect(ability.probability).toBe(70);
    expect(ability.spells).toHaveLength(2);
  });

  it("throws for an unknown preset name", () => {
    expect(() =>
      abilityService.getMinorSequencer(["not_a_real_preset", "x"] as any),
    ).toThrow(/Unknown preset not_a_real_preset/);
  });
});

describe("getCustomCodes", () => {
  it("returns an empty array when customCodes is undefined", () => {
    expect(abilityService.getCustomCodes(undefined)).toEqual([]);
  });

  it("defaults statements to an empty array and resolves nested abilities", () => {
    const [customCode] = abilityService.getCustomCodes([
      {
        location: "attack",
        type: "insertBefore",
        abilities: [{ name: "ability.unknown" }],
      } as any,
    ]);
    expect(customCode.statements).toEqual([]);
    expect(customCode.abilities).toHaveLength(1);
    expect(customCode.abilities[0].name).toBe("ability.unknown");
  });
});
