import { describe, expect, it } from "vitest";
import translationService from "./translation.service";

describe("stringRef", () => {
  it("throws when the key was never registered", () => {
    expect(() => translationService.stringRef("not.a.real.key" as any)).toThrow(
      /key not\.a\.real\.key not registered/,
    );
  });

  it("returns the registered stringRef for a known key", () => {
    expect(translationService.stringRef("common.potion.use")).toBeTypeOf(
      "number",
    );
  });
});

describe("fromOptional", () => {
  it("returns an empty string for undefined", () => {
    expect(translationService.fromOptional(undefined)).toBe("");
  });

  it("resolves a real reference when provided", () => {
    expect(translationService.fromOptional("common.potion.use")).toBe(
      "*quaffs a potion*",
    );
  });
});

describe("from (numeric stringRef)", () => {
  it("throws when the custom stringRef was never registered", () => {
    expect(() => translationService.from(999999999)).toThrow(
      /stringRef not found: 999999999/,
    );
  });

  it("resolves a custom translation added via addCustomTranslation", () => {
    const stringRef = translationService.addCustomTranslation(["hello"]);
    expect(translationService.from(stringRef)).toBe("hello");
  });

  it("fromStringRef (private) defaults lang when called without one directly", () => {
    const stringRef = translationService.addCustomTranslation(["hi"]);
    expect((translationService as any).fromStringRef(stringRef)).toBe("hi");
  });
});

describe("interpolate", () => {
  it("throws when a provided var is undefined", () => {
    expect(() =>
      translationService.interpolate("common.potion.use", {
        foo: undefined as any,
      }),
    ).toThrow(/Found undefined in key for var foo/);
  });
});
