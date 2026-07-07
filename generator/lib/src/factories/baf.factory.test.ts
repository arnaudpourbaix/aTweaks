import { describe, expect, it } from "vitest";
import { ScriptTarget } from "../model/constants";
import { Statements } from "../model/script/script";
import bafFactory from "./baf.factory";
import responseFactory from "./response.factory";
import triggerFactory from "./trigger.factory";

describe("addStatementsFromTargetList", () => {
  it("emits one statement per target, resolving the trigger token to each target", () => {
    const statements: Statements = [];
    bafFactory.addStatementsFromTargetList({
      statements,
      triggers: [triggerFactory.range(30)],
      targets: ["[GOODCUTOFF]", ScriptTarget.myself],
      responses: responseFactory.response([
        { name: "AttackOneRound", params: [ScriptTarget.token] } as any,
      ]),
      comment: "Attack nearest",
    });

    expect(statements).toHaveLength(2);
    expect(statements[0].triggers[0]).toMatchObject({
      params: ["[GOODCUTOFF]", 30],
    });
    expect(statements[1].triggers[0]).toMatchObject({
      params: [ScriptTarget.myself, 30],
    });
  });

  it("only puts the comment on the first generated statement", () => {
    const statements: Statements = [];
    bafFactory.addStatementsFromTargetList({
      statements,
      triggers: [triggerFactory.range(30)],
      targets: ["[GOODCUTOFF]", "[EVILCUTOFF]"],
      responses: responseFactory.response([]),
      comment: "Attack nearest",
    });

    expect(statements[0].comment).toBe("Attack nearest");
    expect(statements[1].comment).toBe("");
  });

  it("resolves the response action target to LastSeenBy, except when the target is Myself", () => {
    const statements: Statements = [];
    bafFactory.addStatementsFromTargetList({
      statements,
      triggers: [triggerFactory.range(30)],
      targets: ["[GOODCUTOFF]", ScriptTarget.myself],
      responses: responseFactory.response([
        { name: "AttackOneRound", params: [ScriptTarget.token] } as any,
      ]),
    });

    expect((statements[0].responses[0].actions[0] as any).params).toEqual([
      ScriptTarget.lastSeen,
    ]);
    expect((statements[1].responses[0].actions[0] as any).params).toEqual([
      ScriptTarget.myself,
    ]);
  });

  it("reverses target order when reverse is set", () => {
    const statements: Statements = [];
    bafFactory.addStatementsFromTargetList({
      statements,
      triggers: [triggerFactory.range(30)],
      targets: ["[GOODCUTOFF]", "[EVILCUTOFF]"],
      responses: responseFactory.response([]),
      reverse: true,
    });

    expect(statements[0].triggers[0]).toMatchObject({
      params: ["[EVILCUTOFF]", 30],
    });
    expect(statements[1].triggers[0]).toMatchObject({
      params: ["[GOODCUTOFF]", 30],
    });
  });
});
