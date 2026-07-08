import { afterEach, describe, expect, it } from "vitest";
import { MonsterFamilyEnum } from "../../../creatures/monster";
import { Creature } from "../../model/creature/creature";
import { Family } from "../../model/creature/family";
import { ImmunityConfig } from "../../model/final/immunity";
import { State } from "../../state";
import documentationService from "./documentation.service";

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
});
