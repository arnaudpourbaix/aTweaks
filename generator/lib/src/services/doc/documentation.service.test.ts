import { afterEach, describe, expect, it } from "vitest";
import { MonsterFamilyEnum } from "../../../creatures/monster";
import { Creature } from "../../model/creature/creature";
import { Family } from "../../model/creature/family";
import { ImmunityConfig } from "../../model/final/immunity";
import { State } from "../../state";
import documentationService from "./documentation.service";

function fakeCreatureForAddCreature(doubleApr: boolean): Creature {
  return {
    id: 1,
    name: "common.potion.use",
    data: {
      strength: 18,
      exceptionalStrength: undefined,
      dexterity: 12,
      constitution: 14,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      alignment: "CHAOTIC_EVIL",
      ac: 5,
      movement: { pnpValue: 12 },
      level1: { pnpValue: 5, type: "none", value: 5 },
      hp: 40,
      thac0: 15,
      apr: 2,
      doubleApr,
      size: "Large",
      morale: 12,
      xpv: 500,
      items: { equipped: [] },
      immunities: [],
    },
    behavior: { abilities: [], customCodes: [] },
  } as unknown as Creature;
}

describe("addCreature (doubleApr)", () => {
  it("doubles apr when doubleApr is true", () => {
    documentationService.addCreature(fakeCreatureForAddCreature(true));
    const html = (documentationService as any).monsters.at(-1) as string;
    expect(html).toContain(
      '<div class="stat"><dt>Attacks per Round</dt><dd>4</dd></div>',
    );
  });

  it("does not double apr when doubleApr is false", () => {
    documentationService.addCreature(fakeCreatureForAddCreature(false));
    const html = (documentationService as any).monsters.at(-1) as string;
    expect(html).toContain(
      '<div class="stat"><dt>Attacks per Round</dt><dd>2</dd></div>',
    );
  });
});

describe("getFamilyMenu", () => {
  it("builds a collapsible family entry linking to every creature in the family", () => {
    const family = {
      id: MonsterFamilyEnum.Bear,
      creatures: [
        { id: 4, name: "monster.bear.name.black" },
        { id: 5, name: "monster.bear.name.brown" },
      ],
    } as unknown as Family;

    expect(documentationService.getFamilyMenu(family)).toBe(
      '<li class="family"><details><summary>Bear</summary><ul>' +
        '<li><a href="#m4">Black Bear</a></li>' +
        '<li><a href="#m5">Brown Bear</a></li>' +
        "</ul></details></li>",
    );
  });

  it("produces an empty creature list for a family with no creatures", () => {
    const family = {
      id: MonsterFamilyEnum.Bear,
      creatures: [],
    } as unknown as Family;

    expect(documentationService.getFamilyMenu(family)).toBe(
      '<li class="family"><details><summary>Bear</summary><ul></ul></details></li>',
    );
  });
});

describe("addSpecial", () => {
  it("renders a caster special row as a stat-grid entry", () => {
    const creature = {
      data: { level1: { type: "caster", value: 9 } },
    } as unknown as Creature;
    const template = { text: "{{special}}" };

    documentationService.addSpecial(template, creature);

    expect(template.text).toBe(
      '<div class="stat"><dt>Special</dt><dd>Cast spells as a level 9 caster</dd></div>',
    );
  });

  it("renders a turn-undead special row as a stat-grid entry", () => {
    const creature = {
      data: { level1: { type: "turn", value: 3 } },
    } as unknown as Creature;
    const template = { text: "{{special}}" };

    documentationService.addSpecial(template, creature);

    expect(template.text).toBe(
      '<div class="stat"><dt>Special</dt><dd>Turned as a level 3 undead</dd></div>',
    );
  });

  it("renders nothing when the creature has no special casting/turning trait", () => {
    const creature = {
      data: { level1: { type: undefined, value: 0 } },
    } as unknown as Creature;
    const template = { text: "{{special}}" };

    documentationService.addSpecial(template, creature);

    expect(template.text).toBe("");
  });
});

describe("getCreatureTraits", () => {
  const originalImmunities = State.immunities;

  afterEach(() => {
    State.immunities = originalImmunities;
  });

  it("renders nothing when the creature has no traits, immunities, or trait items", () => {
    State.immunities = [];
    const creature = {
      data: { immunities: [], items: { equipped: [] } },
    } as unknown as Creature;
    const template = { text: "{{traits}}" };

    documentationService.getCreatureTraits(template, creature);

    expect(template.text).toBe("");
  });

  it("wraps trait content in a detail-section with a Traits heading when present", () => {
    State.immunities = [
      {
        name: "construct",
        type: "trait",
        stringRef: "common.traits.construct.name",
      } as unknown as ImmunityConfig,
    ];
    const creature = {
      data: { immunities: ["construct"], items: { equipped: [] } },
    } as unknown as Creature;
    const template = { text: "{{traits}}" };

    documentationService.getCreatureTraits(template, creature);

    expect(template.text).toBe(
      '<div class="detail-section"><h4>Traits</h4><div class="traits">' +
        '<h5><a href="#construct">Construct</a></h5>' +
        "</div></div>",
    );
  });

  it("renders a non-trait immunity's description as a paragraph under its own heading when present", () => {
    State.immunities = [
      {
        name: "poison",
        type: "immunity",
        stringRef: "common.traits.construct.name",
        description: "common.traits.construct.name",
      } as unknown as ImmunityConfig,
    ];
    const creature = {
      data: { immunities: ["poison"], items: { equipped: [] } },
    } as unknown as Creature;
    const template = { text: "{{traits}}" };

    documentationService.getCreatureTraits(template, creature);

    expect(template.text).toContain("<h5>");
    expect(template.text).toContain("<p>");
  });

  it("renders a non-trait immunity without a description as bare text", () => {
    State.immunities = [
      {
        name: "poison",
        type: "immunity",
        stringRef: "common.traits.construct.name",
      } as unknown as ImmunityConfig,
    ];
    const creature = {
      data: { immunities: ["poison"], items: { equipped: [] } },
    } as unknown as Creature;
    const template = { text: "{{traits}}" };

    documentationService.getCreatureTraits(template, creature);

    expect(template.text).not.toContain("<p>");
  });
});

describe("getTraits", () => {
  const originalImmunities = State.immunities;

  afterEach(() => {
    State.immunities = originalImmunities;
  });

  it("appends the description paragraph when the trait has one", () => {
    State.immunities = [
      {
        name: "construct",
        type: "trait",
        doc: true,
        stringRef: "common.traits.construct.name",
        description: "common.traits.construct.name",
      } as unknown as ImmunityConfig,
    ];
    expect(documentationService.getTraits()).toContain("<p>");
  });

  it("omits the description paragraph when the trait has none", () => {
    State.immunities = [
      {
        name: "construct",
        type: "trait",
        doc: true,
        stringRef: "common.traits.construct.name",
      } as unknown as ImmunityConfig,
    ];
    expect(documentationService.getTraits()).not.toContain("<p>");
  });
});

describe("getSpellQuantity", () => {
  it("returns 'unknown' when memorizedCount is 0 or undefined", () => {
    expect(documentationService.getSpellQuantity(undefined)).toBe("unknown");
    expect(documentationService.getSpellQuantity(0)).toBe("unknown");
  });

  it("returns 'X/day' when there is no renew value", () => {
    expect(documentationService.getSpellQuantity(3)).toBe("3/day");
  });

  it("returns 'at will' when renew is 1 (0 is falsy and hits the 'X/day' branch instead)", () => {
    expect(documentationService.getSpellQuantity(3, 1)).toBe("at will");
  });

  it("returns 'every N rounds' for a renew value above 1", () => {
    expect(documentationService.getSpellQuantity(3, 5)).toBe(
      "every 5 rounds",
    );
  });
});

describe("replace (private)", () => {
  it("throws when the token isn't present in the template", () => {
    const template = { text: "no tokens here" };
    expect(() =>
      (documentationService as any).replace(template, "missing", "x"),
    ).toThrow(/Token \{\{missing\}\} not found/);
  });

  it("replaces every occurrence of the token, falling back to empty string for undefined", () => {
    const template = { text: "{{key}} and {{key}} again" };
    (documentationService as any).replace(template, "key", undefined);
    expect(template.text).toBe(" and  again");
  });
});
