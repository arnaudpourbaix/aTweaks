import { describe, expect, it } from "vitest";
import descriptionService from "./description.service";

describe("getDiceValue (private)", () => {
  const service = descriptionService as any;

  it("returns empty string when neither dice nor value is set", () => {
    expect(service.getDiceValue({})).toBe("");
  });

  it("renders dice notation without a bonus when only dice is set", () => {
    expect(service.getDiceValue({ diceThrown: 2, diceSize: 6 })).toBe("2D6");
  });

  it("appends a signed bonus after the dice notation", () => {
    expect(
      service.getDiceValue({ diceThrown: 2, diceSize: 6, value: 3 }),
    ).toBe("2D6+3");
    expect(
      service.getDiceValue({ diceThrown: 2, diceSize: 6, value: -3 }),
    ).toBe("2D6-3");
  });

  it("strips the leading + from a positive diceless value", () => {
    expect(service.getDiceValue({ value: 5 })).toBe("5");
  });

  it("keeps the leading - from a negative diceless value", () => {
    expect(service.getDiceValue({ value: -5 })).toBe("-5");
  });
});
