import { describe, expect, it } from "vitest";
import { Creature } from "../../model/creature/creature";
import { TargetList } from "../../model/script/target";
import targetService from "./target.service";

describe("targetObject", () => {
  it("returns an empty string when every field is omitted", () => {
    expect(targetService.targetObject({})).toBe("");
  });

  it("returns just the allegiance when it's the only field set", () => {
    expect(targetService.targetObject({ ea: "EVILCUTOFF" })).toBe(
      "EVILCUTOFF",
    );
  });

  it("keeps zero placeholders between two set fields but trims trailing zeros", () => {
    expect(
      targetService.targetObject({ ea: "EVILCUTOFF", clazz: "FIGHTER_ALL" }),
    ).toBe("EVILCUTOFF.0.0.FIGHTER_ALL");
  });

  it("joins every field in order when all are set", () => {
    expect(
      targetService.targetObject({
        ea: "EVILCUTOFF",
        general: "HUMANOID",
        race: "HUMAN",
        clazz: "FIGHTER_ALL",
        specific: "GNOLL",
        gender: "MALE",
        align: "CHAOTICEVIL",
      }),
    ).toBe(
      "EVILCUTOFF.HUMANOID.HUMAN.FIGHTER_ALL.GNOLL.MALE.CHAOTICEVIL",
    );
  });
});

describe("getList", () => {
  it("returns the players list with allegianceCheck false", () => {
    expect(targetService.getList("Players")).toEqual({
      targets: ["Player1", "Player2", "Player3", "Player4", "Player5", "Player6"],
      allegianceCheck: false,
    });
  });

  it("throws for a name that isn't in TARGET_LISTS", () => {
    expect(() => targetService.getList("NotARealList" as any)).toThrow(
      /Target list NotARealList is not defined/,
    );
  });
});

describe("combineListWithTriggers", () => {
  it("appends the given triggers to each target list's existing triggers", () => {
    const lists: TargetList[] = [
      { name: "Players", triggers: [{ name: "See", params: ["PC"] }] },
      { name: "NearestEnemies" },
    ];
    const result = targetService.combineListWithTriggers(lists, [
      { name: "Range", params: ["Myself", 30] },
    ]);
    expect(result).toEqual([
      {
        name: "Players",
        triggers: [
          { name: "See", params: ["PC"] },
          { name: "Range", params: ["Myself", 30] },
        ],
      },
      {
        name: "NearestEnemies",
        triggers: [{ name: "Range", params: ["Myself", 30] }],
      },
    ]);
  });

  it("does not mutate the original target list objects", () => {
    const original: TargetList = { name: "Players" };
    targetService.combineListWithTriggers([original], [
      { name: "Range", params: ["Myself", 30] },
    ]);
    expect(original.triggers).toBeUndefined();
  });
});

describe("getTriggersFromTargetList", () => {
  it("returns the target's own triggers untouched when no status is set", () => {
    const target: TargetList = {
      name: "Players",
      triggers: [{ name: "See", params: ["PC"] }],
    };
    expect(targetService.getTriggersFromTargetList(target)).toEqual({
      triggers: [],
      targetTriggers: [{ name: "See", params: ["PC"] }],
    });
  });

  it("adds a status's own triggers and targetTriggers for includeStatus", () => {
    const target: TargetList = { name: "Players", includeStatus: ["Sleep"] };
    const { triggers, targetTriggers } =
      targetService.getTriggersFromTargetList(target);
    expect(triggers).toEqual([
      { name: "Allegiance", params: ["Myself", "ENEMY"] },
    ]);
    expect(targetTriggers).toEqual([
      { name: "StateCheck", params: ["{Target}", "STATE_SLEEPING"] },
    ]);
  });

  it("negates a status's targetTriggers for excludeStatus, leaving its own triggers untouched", () => {
    const target: TargetList = { name: "Players", excludeStatus: ["Sleep"] };
    const { triggers, targetTriggers } =
      targetService.getTriggersFromTargetList(target);
    expect(triggers).toEqual([
      { name: "Allegiance", params: ["Myself", "ENEMY"] },
    ]);
    expect(targetTriggers).toEqual([
      {
        name: "StateCheck",
        params: ["{Target}", "STATE_SLEEPING"],
        negation: true,
      },
    ]);
  });
});

describe("getTargetFromAbility", () => {
  it("resolves a known target list name to its target strings", () => {
    expect(
      targetService.getTargetFromAbility("Players", undefined, undefined),
    ).toEqual({
      targets: ["Player1", "Player2", "Player3", "Player4", "Player5", "Player6"],
      allegianceCheck: false,
    });
  });

  it("limits the resolved list when limit is provided", () => {
    expect(
      targetService.getTargetFromAbility("Players", 2, undefined),
    ).toEqual({
      targets: ["Player1", "Player2"],
      allegianceCheck: false,
    });
  });

  it("falls back to the raw identifier when it isn't a known target list name", () => {
    expect(
      targetService.getTargetFromAbility(
        "GOODCUTOFF" as any,
        undefined,
        undefined,
      ),
    ).toEqual({
      targets: "GOODCUTOFF",
      allegianceCheck: false,
    });
  });
});

function fakeCreature(intelligence?: number): Creature {
  return {
    data: { intelligence },
    spells: [],
  } as unknown as Creature;
}

describe("getTargetPriorities", () => {
  it("defaults to NoCheck for enemies and Sleep for players when intelligence is unset", () => {
    expect(
      targetService.getTargetPriorities(fakeCreature(undefined), {}),
    ).toEqual([
      { targets: ["NearestEnemies"], status: ["NoCheck"] },
      { targets: ["Players"], status: ["Sleep"] },
    ]);
  });

  it("includes intelligence-gated statuses once intelligence reaches 8", () => {
    expect(
      targetService.getTargetPriorities(fakeCreature(8), {}),
    ).toEqual([
      {
        targets: ["NearestEnemies"],
        status: ["Slowed", "Able", "Held", "Stunned", "NoCheck"],
      },
      { targets: ["Players"], status: ["Sleep"] },
    ]);
  });

  it("throws when a targetPriority entry has neither status nor targets", () => {
    expect(() =>
      targetService.getTargetPriorities(fakeCreature(8), {
        targetPriorities: [{}],
      }),
    ).toThrow(/Empty targetPriority is not allowed/);
  });

  it("defaults status to allStatus for a Players-only entry and targetStatus otherwise", () => {
    const result = targetService.getTargetPriorities(fakeCreature(8), {
      targetPriorities: [{ targets: ["Players"] }, { targets: ["Animals"] }],
    });
    expect(result[0]).toEqual({
      targets: ["Players"],
      status: ["Slowed", "Able", "Held", "Stunned", "NoCheck", "Sleep"],
    });
    expect(result[1]).toEqual({
      targets: ["Animals"],
      status: ["Slowed", "Able", "Held", "Stunned", "NoCheck"],
    });
  });

  it("does not add default leftover priorities once an explicit entry already covers every status", () => {
    const result = targetService.getTargetPriorities(fakeCreature(8), {
      targetPriorities: [
        {
          targets: ["NearestEnemies"],
          status: ["Slowed", "Able", "Held", "Stunned", "NoCheck"],
        },
        { targets: ["Players"], status: ["Sleep"] },
      ],
    });
    expect(result).toHaveLength(2);
  });
});
