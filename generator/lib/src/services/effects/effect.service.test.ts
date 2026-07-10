import { describe, expect, it } from "vitest";
import {
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../../model/spell-item/spell-protection";
import { Effect } from "../../model/spell-item/effect";
import {
  AttackModifierTypeEnum,
  EffectBonusToEnum,
  EffectColorLocationEnum,
  EffectDamageModeEnum,
  EffectDamageTypeEnum,
  EffectIDSFileEnum,
  EffectStatisticModifierEnum,
  EffectTargetEnum,
  EffectTimingEnum,
} from "../../model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../model/spell-item/effect.type";
import effectService from "./effect.service";

describe("getEffect", () => {
  it("fills parameter1/parameter2 for a plain value+type case (StatisticModifier)", () => {
    const effect: Effect = {
      opcode: EffectTypeEnum.DexterityBonus,
      value: 3,
      type: EffectStatisticModifierEnum.Increment,
    };
    effectService.getEffect(effect);
    expect(effect.parameter1).toBe("3");
    expect(effect.parameter2).toBe(`${EffectStatisticModifierEnum.Increment}`);
  });

  it("builds an IDS_OF_SYMBOL lookup for IDS-file cases (Hold)", () => {
    const effect: Effect = {
      opcode: EffectTypeEnum.Hold,
      idsFile: EffectIDSFileEnum.GENERAL,
      idsEntry: "SOME_ENTRY",
      duration: 1,
    };
    effectService.getEffect(effect);
    expect(effect.parameter1).toBe("IDS_OF_SYMBOL (~GENERAL~ ~SOME_ENTRY~)");
    expect(effect.parameter2).toBe(`${EffectIDSFileEnum.GENERAL}`);
  });

  it("packs RGB color and location/cycleSpeed bit math for color-pulse cases", () => {
    const effect: Effect = {
      opcode: EffectTypeEnum.CharacterColorPulse,
      color: { red: 1, green: 2, blue: 3 },
      location: EffectColorLocationEnum.ArmorTealMinorColor,
      cycleSpeed: 4,
    };
    effectService.getEffect(effect);
    expect(effect.parameter1).toBe(`${(1 << 8) + (2 << 16) + (3 << 24)}`);
    expect(effect.parameter2).toBe(`${1 + (4 << 16)}`);
  });

  it("falls back to the raw value when a numeric stringRef isn't registered anywhere", () => {
    const effect: Effect = {
      opcode: EffectTypeEnum.DisplayString,
      stringRef: 999999,
    };
    effectService.getEffect(effect);
    expect(effect.parameter1).toBe("999999");
  });

  describe("damage", () => {
    it("encodes amount/mode/type for a Normal-mode damage effect", () => {
      const effect: Effect = {
        opcode: EffectTypeEnum.Damage,
        amount: 10,
        type: EffectDamageTypeEnum.Fire,
      };
      effectService.getEffect(effect);
      expect(effect.parameter1).toBe("10");
      expect(effect.parameter2).toBe(
        `${EffectDamageModeEnum.Normal + (EffectDamageTypeEnum.Fire << 16)}`,
      );
    });

    it("defaults amount to 0 and honors an explicit damageMode", () => {
      const effect: Effect = {
        opcode: EffectTypeEnum.Damage,
        type: EffectDamageTypeEnum.Acid,
        damageMode: EffectDamageModeEnum.SetToPercent,
      };
      effectService.getEffect(effect);
      expect(effect.parameter1).toBe("0");
      expect(effect.parameter2).toBe(
        `${EffectDamageModeEnum.SetToPercent + (EffectDamageTypeEnum.Acid << 16)}`,
      );
    });
  });

  describe("protectionFromResource", () => {
    it("resolves a named SpellProtectionName directly, keeping a numeric value in parameter1", () => {
      const effect: Effect = {
        opcode: EffectTypeEnum.ProtectionFromResource,
        type: "CLERIC",
        value: 5,
      };
      effectService.getEffect(effect);
      expect(effect.parameter1).toBe("5");
      expect(effect.parameter2).toBe("CLERIC");
    });

    it("throws when a named SpellProtectionName has a non-numeric value", () => {
      const effect: Effect = {
        opcode: EffectTypeEnum.ProtectionFromResource,
        type: "CLERIC",
        value: "not-a-number",
      };
      expect(() => effectService.getEffect(effect)).toThrow(
        /Can't determine param1/,
      );
    });

    it("resolves an object-type protection to its EXISTING_SPELL_PROTECTIONS index", () => {
      const effect: Effect = {
        opcode: EffectTypeEnum.ProtectionFromResource,
        type: {
          stat: SpellProtectionStat.Ea,
          value: 0,
          relation: SpellProtectionRelation.GreaterOrEqual,
        },
        value: 5,
      };
      effectService.getEffect(effect);
      expect(effect.parameter1).toBe("5");
      expect(effect.parameter2).toBe("0");
    });

    it("builds an IDS_OF_SYMBOL lookup for a string value against an object-type protection", () => {
      const effect: Effect = {
        opcode: EffectTypeEnum.ProtectionFromResource,
        type: {
          stat: SpellProtectionStat.Ea,
          value: 0,
          relation: SpellProtectionRelation.GreaterOrEqual,
        },
        value: "SOME_TEXT",
      };
      effectService.getEffect(effect);
      expect(effect.parameter1).toBe("IDS_OF_SYMBOL (~ea~ ~SOME_TEXT~)");
      expect(effect.parameter2).toBe("0");
    });

    it("throws when no entry in EXISTING_SPELL_PROTECTIONS matches the object type", () => {
      const effect: Effect = {
        opcode: EffectTypeEnum.ProtectionFromResource,
        type: {
          stat: SpellProtectionStat.Ea,
          value: 12345,
          relation: SpellProtectionRelation.Equal,
        },
      };
      expect(() => effectService.getEffect(effect)).toThrow(
        /Unknown spell protection/,
      );
    });

    it("throws when the matched protection's stat has no known IDS file", () => {
      const effect: Effect = {
        opcode: EffectTypeEnum.ProtectionFromResource,
        type: {
          stat: SpellProtectionStat.CircleSize,
          value: 3,
          relation: SpellProtectionRelation.Greater,
        },
        value: "not-numeric",
      };
      expect(() => effectService.getEffect(effect)).toThrow(
        /Can't find IDS file for/,
      );
    });
  });

  describe("scriptingStateModifier", () => {
    it("encodes value and state into parameter1/parameter2", () => {
      const effect: Effect = {
        opcode: EffectTypeEnum.ScriptingStateModifier,
        value: 10,
        state: "SOME_STATE" as never,
      };
      effectService.getEffect(effect);
      expect(effect.parameter1).toBe("10");
      expect(effect.parameter2).toBe(
        "IDS_OF_SYMBOL (~stat~ ~SOME_STATE~) - 156",
      );
    });

    it("throws when value is outside 0-35", () => {
      const effect: Effect = {
        opcode: EffectTypeEnum.ScriptingStateModifier,
        value: 36,
        state: "SOME_STATE" as never,
      };
      expect(() => effectService.getEffect(effect)).toThrow(
        /must be between 0 and 35/,
      );
    });
  });

  describe("ModifyAttacksPerRound", () => {
    it("resolves a normal apr value via the attacks-per-round table", () => {
      const effect: Effect = {
        opcode: EffectTypeEnum.ModifyAttacksPerRound,
        value: 2,
        type: AttackModifierTypeEnum.Set,
      };
      effectService.getEffect(effect);
      expect(effect.parameter1).toBe("2");
      expect(effect.parameter2).toBe(`${AttackModifierTypeEnum.Set}`);
    });

    it("throws when the apr value resolves to a double-apr engine value", () => {
      const effect: Effect = {
        opcode: EffectTypeEnum.ModifyAttacksPerRound,
        value: 8,
        type: AttackModifierTypeEnum.Set,
      };
      expect(() => effectService.getEffect(effect)).toThrow(
        /Can't have more than 5 APR/,
      );
    });
  });
});

describe("getEffects", () => {
  it("maps every effect in the array through getEffect", () => {
    const effects: Effect[] = [
      {
        opcode: EffectTypeEnum.ArmorClassBonus,
        value: 1,
        bonusTo: EffectBonusToEnum.AllWeapons,
      },
      {
        opcode: EffectTypeEnum.ArmorClassBonus,
        value: 2,
        bonusTo: EffectBonusToEnum.AllWeapons,
      },
    ];
    const results = effectService.getEffects(effects);
    expect(results.map((e) => e.parameter1)).toEqual(["1", "2"]);
  });

  it("applies options.base target/timing defaults to every effect", () => {
    const effects: Effect[] = [
      { opcode: EffectTypeEnum.MinimumHP, value: 1 },
      { opcode: EffectTypeEnum.MinimumHP, value: 2 },
    ];
    const results = effectService.getEffects(effects, {
      base: {
        target: EffectTargetEnum.Self,
        timing: EffectTimingEnum.InstantPermanentUntilDeath,
      },
    });
    expect(results.every((e) => e.target === EffectTargetEnum.Self)).toBe(true);
    expect(
      results.every(
        (e) => e.timing === EffectTimingEnum.InstantPermanentUntilDeath,
      ),
    ).toBe(true);
  });
});

describe("setDefaultEffectValues", () => {
  it("applies default target/timing/dispelResistance/probability1", () => {
    const effect: Effect = { opcode: EffectTypeEnum.MinimumHP, value: 1 };
    effectService.setDefaultEffectValues(effect);
    expect(effect.target).toBe(EffectTargetEnum.PresetTarget);
    expect(effect.timing).toBe(EffectTimingEnum.InstantLimited);
    expect(effect.probability1).toBe(100);
  });

  it("does not override already-set target/timing/probability1", () => {
    const effect: Effect = {
      opcode: EffectTypeEnum.MinimumHP,
      value: 1,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.DelayPermanent,
      probability1: 50,
    };
    effectService.setDefaultEffectValues(effect);
    expect(effect.target).toBe(EffectTargetEnum.Self);
    expect(effect.timing).toBe(EffectTimingEnum.DelayPermanent);
    expect(effect.probability1).toBe(50);
  });

  it("prefers the provided base target/timing over the built-in defaults", () => {
    const effect: Effect = { opcode: EffectTypeEnum.MinimumHP, value: 1 };
    effectService.setDefaultEffectValues(effect, {
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantPermanentUntilDeath,
    });
    expect(effect.target).toBe(EffectTargetEnum.Self);
    expect(effect.timing).toBe(EffectTimingEnum.InstantPermanentUntilDeath);
  });

  it("defaults diceSize/diceThrown from minLevel/maxLevel when unset", () => {
    const effect: Effect = {
      opcode: EffectTypeEnum.MinimumHP,
      value: 1,
      minLevel: 3,
      maxLevel: 5,
    };
    effectService.setDefaultEffectValues(effect);
    expect(effect.diceSize).toBe(3);
    expect(effect.diceThrown).toBe(5);
  });
});
