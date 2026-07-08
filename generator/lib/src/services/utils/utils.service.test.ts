import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { describe, expect, it } from "vitest";
import { MonsterFamilyEnum } from "../../../creatures/monster";
import { Spell } from "../../model/spell-item/spell-item";
import { SpellTypeEnum } from "../../model/spell-item/effect.enums";
import { SpellProtectionStat } from "../../model/spell-item/spell-protection";
import { Actions } from "../../model/script/actions";
import { Triggers } from "../../model/script/triggers";
import { State } from "../../state";
import utils from "./utils.service";

describe("objectKeys", () => {
  it("returns the object's own keys typed as keyof T", () => {
    expect(utils.objectKeys({ a: 1, b: 2 })).toEqual(["a", "b"]);
  });
});

describe("getKeyByValue", () => {
  it("finds the first key matching the value", () => {
    expect(utils.getKeyByValue({ a: 1, b: 2 }, 2)).toBe("b");
  });

  it("returns undefined when no key matches", () => {
    expect(utils.getKeyByValue({ a: 1 }, 99)).toBeUndefined();
  });
});

describe("replaceParamTokens", () => {
  it("replaces token occurrences in string params in place", () => {
    const params: (string | number)[] = ["hello $NAME", 42, "$NAME again"];
    utils.replaceParamTokens(params, [{ key: "$NAME", value: "world" }]);
    expect(params).toEqual(["hello world", 42, "world again"]);
  });
});

describe("replaceActionTokens", () => {
  it("replaces params on a cloned array without mutating the input", () => {
    const actions: Actions.Action[] = [
      { name: "Wait", params: ["$N"] } as unknown as Actions.Action,
    ];
    const result = utils.replaceActionTokens(actions, [
      { key: "$N", value: "5" },
    ]);
    expect((result[0] as any).params).toEqual(["5"]);
    expect((actions[0] as any).params).toEqual(["$N"]);
  });
});

describe("replaceTriggerTokens", () => {
  it("recurses into nested triggers (e.g. Or)", () => {
    const triggers: Triggers.Trigger[] = [
      {
        name: "Or",
        triggers: [{ name: "Global", params: ["$FLAG", "LOCALS", 1] }],
      } as unknown as Triggers.Trigger,
    ];
    const result = utils.replaceTriggerTokens(triggers, [
      { key: "$FLAG", value: "MY_FLAG" },
    ]);
    expect((result[0] as any).triggers[0].params).toEqual([
      "MY_FLAG",
      "LOCALS",
      1,
    ]);
  });

  it("replaces params on a leaf trigger", () => {
    const triggers: Triggers.Trigger[] = [
      { name: "Global", params: ["$FLAG", "LOCALS", 1] } as unknown as Triggers.Trigger,
    ];
    const result = utils.replaceTriggerTokens(triggers, [
      { key: "$FLAG", value: "MY_FLAG" },
    ]);
    expect((result[0] as any).params).toEqual(["MY_FLAG", "LOCALS", 1]);
  });
});

describe("getSpellResourceFromIds", () => {
  it.each([
    ["1123", "SPPR123"],
    ["2456", "SPWI456"],
    ["3789", "SPIN789"],
    ["4001", "SPCL001"],
  ])("maps ids code %s to resref %s", (ids, expected) => {
    expect(utils.getSpellResourceFromIds(ids)).toBe(expected);
  });

  it("returns just the number with no prefix for an unknown type digit", () => {
    expect(utils.getSpellResourceFromIds("9123")).toBe("123");
  });
});

describe("getSpellFunctionName", () => {
  it("uses the last dot-separated segment of the name as the function suffix", () => {
    const spell = { name: "spell.fireball.name" } as unknown as Spell;
    expect(utils.getSpellFunctionName(spell)).toBe("create_spell_fireball");
  });

  it("skips a trailing 'name' segment and uses the segment before it", () => {
    const spell = { name: "spell.fireball.desc.name" } as unknown as Spell;
    expect(utils.getSpellFunctionName(spell)).toBe("create_spell_desc");
  });

  it("throws if the spell name is a numeric string reference", () => {
    const spell = { name: 12345 } as unknown as Spell;
    expect(() => utils.getSpellFunctionName(spell)).toThrow(
      "can't handle a number in name!",
    );
  });
});

describe("getSpellResourceFunctionName", () => {
  it("accepts a plain group name string", () => {
    expect(utils.getSpellResourceFunctionName("poison" as any)).toBe(
      "get_poison_resources",
    );
  });

  it("accepts a SpellGroup object and reads its name", () => {
    expect(
      utils.getSpellResourceFunctionName({ name: "disease" } as any),
    ).toBe("get_disease_resources");
  });
});

describe("getFile", () => {
  it("splits a forward-slash path into file/name/ext", () => {
    expect(utils.getFile("lib/pnp-monster/bear/ja#m4.baf")).toEqual({
      file: "ja#m4.baf",
      name: "ja#m4",
      ext: "baf",
    });
  });

  it("normalizes backslashes before splitting", () => {
    expect(utils.getFile("lib\\pnp-monster\\bear\\ja#m4.baf")).toEqual({
      file: "ja#m4.baf",
      name: "ja#m4",
      ext: "baf",
    });
  });
});

describe("getFamilyFolder", () => {
  it("lowercases the family enum name into the pnp-monster path", () => {
    expect(utils.getFamilyFolder(MonsterFamilyEnum.Bear)).toBe(
      "lib/pnp-monster/bear",
    );
  });
});

describe("getIdsFileFromSpellProtectionStat", () => {
  it("maps each stat needing an ids lookup to its ids file name", () => {
    expect(
      utils.getIdsFileFromSpellProtectionStat(SpellProtectionStat.Race),
    ).toBe("race");
    expect(
      utils.getIdsFileFromSpellProtectionStat(SpellProtectionStat.Align),
    ).toBe("align");
  });

  it("returns an empty string for stats with no ids file", () => {
    expect(
      utils.getIdsFileFromSpellProtectionStat(
        SpellProtectionStat.CircleSize,
      ),
    ).toBe("");
  });
});

describe("getMemorizedSpellType", () => {
  it("maps wizard/priest/innate spell types", () => {
    expect(utils.getMemorizedSpellType(SpellTypeEnum.Wizard)).toBe("wizard");
    expect(utils.getMemorizedSpellType(SpellTypeEnum.Priest)).toBe("priest");
    expect(utils.getMemorizedSpellType(SpellTypeEnum.Innate)).toBe("innate");
  });

  it("returns null for types with no memorized-spell equivalent", () => {
    expect(utils.getMemorizedSpellType(SpellTypeEnum.Psionic)).toBeNull();
    expect(utils.getMemorizedSpellType(undefined)).toBeNull();
  });
});

describe("getSpellInfosByFilename", () => {
  it("infers wizard level from an SPWI resref", () => {
    expect(utils.getSpellInfosByFilename("SPWI312")).toEqual({
      type: "wizard",
      level: 3,
    });
  });

  it("infers priest level from an SPPR resref", () => {
    expect(utils.getSpellInfosByFilename("spPR205")).toEqual({
      type: "priest",
      level: 2,
    });
  });

  it("treats SPIN/SPCL resrefs as level-1 innate", () => {
    expect(utils.getSpellInfosByFilename("SPIN123")).toEqual({
      type: "innate",
      level: 1,
    });
    expect(utils.getSpellInfosByFilename("SPCL456")).toEqual({
      type: "innate",
      level: 1,
    });
  });

  it("returns null for an unrecognized resref", () => {
    expect(utils.getSpellInfosByFilename("MISC99")).toBeNull();
  });
});

describe("shuffleArray", () => {
  it("returns a permutation with the same elements", () => {
    const input = [1, 2, 3, 4, 5];
    const result = utils.shuffleArray(input);
    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual([...input].sort());
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3];
    utils.shuffleArray(input);
    expect(input).toEqual([1, 2, 3]);
  });
});

describe("writeFile", () => {
  it("normalizes all line endings to CRLF regardless of the input mix", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "atweaks-writefile-"));
    const originalModFolder = State.modFolder;
    State.modFolder = tempDir;
    try {
      const file = path.join(tempDir, "mixed.txt");
      utils.writeFile(
        file,
        "line one\r\nline two\nline three\r\nline four\n",
      );
      const written = fs.readFileSync(file, "utf-8");
      expect(written).toBe(
        "line one\r\nline two\r\nline three\r\nline four\r\n",
      );
    } finally {
      State.modFolder = originalModFolder;
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
