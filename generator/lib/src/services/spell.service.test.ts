import { describe, expect, it } from "vitest";
import {
  EffectTargetEnum,
  ItemAbilityTypeEnum,
  SpellTypeEnum,
} from "../model/spell-item/effect.enums";
import { EffectTypeEnum } from "../model/spell-item/effect.type";
import spellService from "./spell.service";
import translationService from "./translation.service";

// a registered custom stringRef, since translationService.from() throws for an unregistered one
// (addProjectile() reads spell.name for its console.log).
const SPELL_NAME = translationService.addCustomTranslation(["Test Spell"]);

describe("getSpell", () => {
  it("defaults doc/level/type when omitted", () => {
    const result = spellService.getSpell({ name: SPELL_NAME }, "spl01");
    expect(result.doc).toBe("both");
    expect(result.level).toBe(1);
    expect(result.type).toBe(SpellTypeEnum.Innate);
  });

  it("forces type back to Innate when explicitly undefined and there's no copyFrom", () => {
    const result = spellService.getSpell({ name: SPELL_NAME, type: undefined }, "spl02");
    expect(result.type).toBe(SpellTypeEnum.Innate);
  });

  it("leaves type undefined when explicitly undefined but copyFrom is set", () => {
    const result = spellService.getSpell(
      { name: SPELL_NAME, type: undefined, copyFrom: "SPWI100" },
      "spl03",
    );
    expect(result.type).toBeUndefined();
  });

  it("forces level back to 1 when explicitly undefined and there's no copyFrom", () => {
    const result = spellService.getSpell({ name: SPELL_NAME, level: undefined }, "spl04");
    expect(result.level).toBe(1);
  });

  it("leaves level undefined when explicitly undefined but copyFrom is set", () => {
    const result = spellService.getSpell(
      { name: SPELL_NAME, level: undefined, copyFrom: "SPWI100" },
      "spl05",
    );
    expect(result.level).toBeUndefined();
  });

  it("appends C to a 3-digit icon", () => {
    const result = spellService.getSpell({ name: SPELL_NAME, icon: "SPL123" }, "spl06");
    expect(result.icon).toBe("SPL123C");
  });

  it("leaves an icon not ending in 3 digits untouched", () => {
    const result = spellService.getSpell({ name: SPELL_NAME, icon: "SPL12A" }, "spl07");
    expect(result.icon).toBe("SPL12A");
  });

  it("throws when a header has no type", () => {
    expect(() =>
      spellService.getSpell({ name: SPELL_NAME, headers: [{} as any] }, "spl08"),
    ).toThrow(/Header type is required!/);
  });

  it("defaults header range/speed/minLevel/location/target when omitted", () => {
    const result = spellService.getSpell(
      {
        name: SPELL_NAME,
        headers: [{ type: ItemAbilityTypeEnum.Magical }],
      },
      "spl09",
    );
    expect(result.headers[0]).toMatchObject({
      range: 0,
      speed: 0,
      minLevel: 0,
    });
  });

  it("adds racial resistances when a header has a Charm/Sleep effect and addRacialResistances isn't disabled", () => {
    const result = spellService.getSpell(
      {
        name: SPELL_NAME,
        headers: [
          {
            type: ItemAbilityTypeEnum.Magical,
            effects: [
              {
                opcode: EffectTypeEnum.CharmCreature,
                target: EffectTargetEnum.PresetTarget,
              } as any,
            ],
          },
        ],
      },
      "spl10",
    );
    expect(result.headers[0].effects.some((e) => e.opcode === EffectTypeEnum.UseEFFFile)).toBe(
      true,
    );
  });

  it("does not add racial resistances when addRacialResistances is explicitly false", () => {
    const result = spellService.getSpell(
      {
        name: SPELL_NAME,
        options: { addRacialResistances: false },
        headers: [
          {
            type: ItemAbilityTypeEnum.Magical,
            effects: [
              {
                opcode: EffectTypeEnum.CharmCreature,
                target: EffectTargetEnum.PresetTarget,
              } as any,
            ],
          },
        ],
      },
      "spl11",
    );
    expect(result.headers[0].effects.some((e) => e.opcode === EffectTypeEnum.UseEFFFile)).toBe(
      false,
    );
  });
});

describe("getGroupRessources", () => {
  it("throws when the group is not defined", () => {
    expect(() => spellService.getGroupRessources("not-a-real-group" as any)).toThrow(
      /Group not-a-real-group is not defined/,
    );
  });

  it("returns the group's spell resrefs when the group is defined", () => {
    expect(spellService.getGroupRessources("acidSpells" as any)).toBeInstanceOf(Array);
  });
});

describe("addProjectile (private, via header.projectile object)", () => {
  it("adds a projectile and sets header.projectile to the spell file", () => {
    const result = spellService.getSpell(
      {
        name: SPELL_NAME,
        headers: [
          {
            type: ItemAbilityTypeEnum.Magical,
            projectile: { name: "Test Projectile" },
          },
        ],
      },
      "spl13",
    );
    expect(result.projectiles).toHaveLength(1);
    expect(result.headers[0].projectile).toBe("spl13");
  });

  it("does not add a duplicate projectile when two headers both reference an object projectile", () => {
    const proj = { name: "Test Projectile" } as any;
    const result = spellService.getSpell(
      {
        name: SPELL_NAME,
        headers: [
          { type: ItemAbilityTypeEnum.Magical, projectile: proj },
          { type: ItemAbilityTypeEnum.Ranged, projectile: proj },
        ],
      },
      "spl14",
    );
    expect(result.projectiles).toHaveLength(1);
  });
});

describe("useEffectFile (racial resistance skip-add dedup)", () => {
  it("does not push a duplicate effect file when two headers both trigger racial resistances", () => {
    const charmEffect = {
      opcode: EffectTypeEnum.CharmCreature,
      target: EffectTargetEnum.PresetTarget,
    } as any;
    const result = spellService.getSpell(
      {
        name: SPELL_NAME,
        headers: [
          { type: ItemAbilityTypeEnum.Magical, effects: [charmEffect] },
          { type: ItemAbilityTypeEnum.Magical, effects: [charmEffect] },
        ],
      },
      "spl12",
    );
    const fileCount = result.effectFiles.filter((e) => e.file === "spl12").length;
    expect(fileCount).toBe(1);
  });
});
