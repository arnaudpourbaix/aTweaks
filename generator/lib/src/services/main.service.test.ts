import { describe, expect, it, vi } from "vitest";
import { Creature } from "../model/creature/creature";
import bafGeneratorService from "./baf/baf-generator.service";
import mainService from "./main.service";
import weiduCreatureService from "./weidu/weidu-creature.service";

function fakeCreature(valid: boolean | undefined): Creature {
  return { valid, name: "test" } as unknown as Creature;
}

describe("isCreatureValid", () => {
  it("returns false and warns when valid is undefined (not yet validated)", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    expect(mainService.isCreatureValid(fakeCreature(undefined))).toBe(false);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("has not been validated"),
    );
  });

  it("returns false and warns when valid is explicitly false", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    expect(mainService.isCreatureValid(fakeCreature(false))).toBe(false);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("is not valid"),
    );
  });

  it("returns true without warning when valid is true", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    expect(mainService.isCreatureValid(fakeCreature(true))).toBe(true);
    expect(logSpy).not.toHaveBeenCalled();
  });
});

describe("generateCreature", () => {
  it("skips baf/weidu generation for an invalid creature", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const bafSpy = vi
      .spyOn(bafGeneratorService, "generate")
      .mockImplementation(() => {});
    const weiduSpy = vi
      .spyOn(weiduCreatureService, "generateWeiduScript")
      .mockImplementation(() => {});
    mainService.generateCreature(fakeCreature(false), []);
    expect(bafSpy).not.toHaveBeenCalled();
    expect(weiduSpy).not.toHaveBeenCalled();
    bafSpy.mockRestore();
    weiduSpy.mockRestore();
  });
});
