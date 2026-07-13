import { describe, expect, it } from "vitest";
import { EffectIDSFileEnum } from "../model/spell-item/effect.enums";
import { EffectTypeEnum } from "../model/spell-item/effect.type";
import effectFactory from "./effect.factory";

describe("paralyze", () => {
  it("adds a generic ANYONE Hold effect when races is omitted", () => {
    const effects = effectFactory.paralyze({ duration: 6 });
    expect(effects).toContainEqual(
      expect.objectContaining({
        opcode: EffectTypeEnum.Hold,
        idsFile: EffectIDSFileEnum.EA,
        idsEntry: "ANYONE",
      }),
    );
  });

  it("adds a Hold effect per race when races is a non-empty list, instead of the generic fallback", () => {
    const effects = effectFactory.paralyze({
      duration: 6,
      races: ["HUMAN", "GNOLL"],
    });
    expect(effects).toContainEqual(
      expect.objectContaining({
        opcode: EffectTypeEnum.Hold,
        idsFile: EffectIDSFileEnum.RACE,
        idsEntry: "HUMAN",
      }),
    );
    expect(effects).toContainEqual(
      expect.objectContaining({
        opcode: EffectTypeEnum.Hold,
        idsFile: EffectIDSFileEnum.RACE,
        idsEntry: "GNOLL",
      }),
    );
    expect(effects).not.toContainEqual(expect.objectContaining({ idsEntry: "ANYONE" }));
  });

  it("falls back to the generic ANYONE Hold effect when races is an empty array, instead of adding no Hold effect at all", () => {
    const effects = effectFactory.paralyze({ duration: 6, races: [] });
    expect(effects).toContainEqual(
      expect.objectContaining({
        opcode: EffectTypeEnum.Hold,
        idsFile: EffectIDSFileEnum.EA,
        idsEntry: "ANYONE",
      }),
    );
  });
});
