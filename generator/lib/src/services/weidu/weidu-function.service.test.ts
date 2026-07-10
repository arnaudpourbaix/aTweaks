import { describe, expect, it } from "vitest";
import { ImmunityConfig } from "../../model/final/immunity";
import { CodeLine } from "../../model/misc";
import { PortraitIconEnum } from "../../model/spell-item/effect.enums";
import weiduFunctionService from "./weidu-function.service";

function fakeImmunity(overrides: Partial<ImmunityConfig> = {}): ImmunityConfig {
  return {
    name: "poison",
    type: "immunity",
    doc: true,
    immunities: [],
    preventEffects: [],
    preventIcons: [],
    displayIcons: [],
    strings: [],
    animations: [],
    spellGroups: [],
    displaySpellIneffective: false,
    effects: [],
    overrides: [],
    ...overrides,
  };
}

describe("callImmunityFunction", () => {
  it("emits a display_icons STR_VAR when the immunity config sets displayIcons", () => {
    const lines: CodeLine[] = [];
    weiduFunctionService.callImmunityFunction(
      lines,
      fakeImmunity({
        displayIcons: [PortraitIconEnum.ProtectionFromPoison],
      }),
      0,
    );
    expect(lines).toHaveLength(1);
    expect(lines[0].code).toContain('display_icons="30"');
  });

  it("emits both prevent_icons and display_icons together, keeping them distinct", () => {
    const lines: CodeLine[] = [];
    weiduFunctionService.callImmunityFunction(
      lines,
      fakeImmunity({
        preventIcons: [PortraitIconEnum.Poisoned],
        displayIcons: [PortraitIconEnum.ProtectionFromPoison],
      }),
      0,
    );
    expect(lines[0].code).toContain('prevent_icons="6"');
    expect(lines[0].code).toContain('display_icons="30"');
  });

  it("omits display_icons entirely when displayIcons is empty", () => {
    const lines: CodeLine[] = [];
    weiduFunctionService.callImmunityFunction(lines, fakeImmunity(), 0);
    expect(lines[0].code).not.toContain("display_icons");
  });
});
