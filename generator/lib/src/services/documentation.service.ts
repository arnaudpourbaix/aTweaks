import * as fs from "fs";
import path from "path";
import { GLOBAL_CONFIG } from "../../config/generate";
import { CreatureAbility } from "../model/creature/ability";
import { Creature } from "../model/creature/creature";
import { ImmunityConfig } from "../model/final/immunity";
import { Actions } from "../model/script/actions";
import { Item, Spell } from "../model/spell-item/spell-item";
import { State } from "../state";
import creatureService from "./creature.service";
import itemService from "./item.service";
import translationService from "./translation.service";
import { CreatureFamily } from "../model/creature/family";
import { MonsterFamilyEnum } from "../../creatures/monster";

class DocumentationService {
  private families: string[] = [];
  private monsters: string[] = [];

  generate() {
    let content = fs.readFileSync("lib/templates/index.html").toString();
    const template = { text: content };
    this.replace(template, "monsters", this.monsters.join(""));
    this.replace(template, "families", this.families.join(""));
    this.replace(template, "traits", this.getTraits());
    fs.writeFileSync(
      path.join(State.modFolder, "docs/monsters.html"),
      template.text
    );
  }

  addFamily(family: CreatureFamily) {
    this.families.push(
      `<li><a href="#m${family.creatures[0].monster}">${
        MonsterFamilyEnum[family.name]
      }</a></li>`
    );
    for (const creature of family.creatures) {
      this.addCreature(creature);
    }
  }

  addCreature(creature: Creature) {
    console.log(
      `Generating documentation for ${translationService.from(creature.name)}`
    );
    let content = fs.readFileSync("lib/templates/monster.html").toString();
    let template = { text: content };
    let str = `${creature.data.strength}`;
    this.replace(template, "id", `m${creature.monster}`);
    if (creature.data.exceptionalStrength)
      str += `/${creature.data.exceptionalStrength}`;
    this.replace(template, "name", translationService.from(creature.name));
    this.replace(template, "str", str);
    this.replace(template, "dex", creature.data.dexterity);
    this.replace(template, "con", creature.data.constitution);
    this.replace(template, "int", creature.data.intelligence);
    this.replace(template, "wis", creature.data.wisdom);
    this.replace(template, "cha", creature.data.charisma);
    this.replace(template, "align", creature.data.alignment);
    this.replace(template, "ac", creatureService.getFinalArmorClass(creature));
    this.replace(template, "movement", creature.additionalData.movement?.value);
    this.replace(template, "level", creature.data.level1);
    this.replace(template, "hp", creature.data.hp);
    this.replace(template, "thac0", creature.data.thac0);
    this.replace(
      template,
      "apr",
      creature.data.apr! * (creature.data.doubleApr ? 2 : 1)
    );
    this.replace(template, "size", creature.data.size);
    this.replace(template, "morale", creature.data.morale);
    this.replace(template, "xp", creature.data.xpv);
    this.getCreatureAttacks(template, creature);
    this.getCreatureTraits(template, creature);
    this.getCreatureSpells(template, creature);
    this.monsters.push(template.text);
  }

  getCreatureAttacks(template: { text: string }, creature: Creature) {
    let attacks = "";
    for (const equippedItem of creature.additionalData.equippedItems) {
      if (itemService.isEquippedWeapon(equippedItem)) {
        const weapon = State.items.find((i) => i.file === equippedItem.file);
        if (weapon && weapon.doc) {
          attacks += `<div class="weapon">${translationService.from(
            weapon.description!
          )}</div><hr/>`;
        }
      }
    }
    this.replace(template, "attacks", attacks);
  }

  getCreatureTraits(template: { text: string }, creature: Creature) {
    let result = "";
    const immunities = creature.additionalData.immunities.map(
      (name) => State.immunities.find((i) => i.name === name) as ImmunityConfig
    );
    let traits: string[] = [];
    for (const immunity of immunities.filter((i) => i.type === "trait")) {
      traits.push(
        `<a href="#${immunity.name}">${translationService.from(
          immunity.stringRef!
        )}</a>`
      );
    }
    if (traits) result += `<h5>${traits.join(", ")}</h5>`;
    for (const equippedItem of creature.additionalData.equippedItems) {
      const item = State.items.find((i) => i.file === equippedItem.file);
      if (item?.trait) {
        const desc = translationService.from(item.description!);
        result += `<div>${desc}</div>`;
      }
    }
    for (const immunity of immunities.filter((i) => i.type !== "trait")) {
      result += `<h5>${translationService.from(immunity.stringRef!)}</h5>`;
      if (immunity.description)
        result += `<p>${translationService.from(immunity.description)}</p>`;
    }
    this.replace(template, "traits", result);
  }

  getCreatureSpells(template: { text: string }, creature: Creature) {
    let spells = "";
    const abilities = [
      ...creature.behavior.abilities,
      ...creature.behavior.customCodes.map((c) => c.abilities).flat(),
    ].filter((a) => a.resource);
    for (const ability of abilities) {
      spells += this.getCreatureSpell(creature, ability);
    }
    if (spells) {
      spells = `<h4>Abilities</h4><div class="abilities">${spells}</div>`;
    }
    this.replace(template, "abilities", spells);
  }

  getCreatureSpell(creature: Creature, ability: CreatureAbility) {
    const memorized = creature.additionalData.memorizedSpells.find(
      (m) => m.file === ability.resource
    );
    const spell = State.spells.find((s) => s.file === ability.resource);
    let result = "";
    if (spell && spell.doc && memorized) {
      const title = `<h5>${translationService.from(
        spell.name!
      )} (${this.getSpellQuantity(
        memorized.memorizedCount,
        spell.options?.renew
      )})</h5>`;
      result = `${title}<p>${translationService.from(spell.description!)}</p>`;
    } else if (memorized) {
      const timer = ability.actions.find(
        (t) =>
          t.name === "SetGlobalTimer" &&
          t.params[0] !== GLOBAL_CONFIG.bafConstants.roundTimer
      ) as Actions.SetGlobalTimer | undefined;
      const rounds = ability.timer
        ? Math.round(ability.timer.value / 6)
        : undefined;
      result = `<h5>${translationService.from(
        ability.name
      )} (${this.getSpellQuantity(memorized.memorizedCount, rounds)})</h5>`;
    }
    return result;
  }

  getTraits() {
    let result = "";
    for (const immunity of State.immunities.sort((a, b) =>
      a.name > b.name ? 1 : -1
    )) {
      if (immunity.type === "trait" && immunity.doc) {
        result += `<h5><a id="${immunity.name}">${translationService.from(
          immunity.stringRef!
        )}</a></h5>`;
        if (immunity.description)
          result += `<p>${translationService.from(immunity.description!)}</p>`;
      }
    }
    return result;
  }

  getSpellQuantity(memorizedCount: number | undefined, renew?: number): string {
    if (!memorizedCount) return "unknown";
    if (!renew) return `${memorizedCount}/day`;
    if (renew <= 1) return "at will";
    return `every ${renew} rounds`;
  }

  private replace(
    template: { text: string },
    key: string,
    value: string | number | undefined
  ) {
    key = `{{${key}}}`;
    if (!template.text.includes(key))
      throw new Error(`Token ${key} not found !`);
    template.text = template.text.replace(
      new RegExp(key, "g"),
      `${value ?? ""}`
    );
  }
}

const documentationService = new DocumentationService();
export default documentationService;
