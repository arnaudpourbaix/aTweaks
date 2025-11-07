import * as fs from "fs";
import path from "path";
import { Creature } from "../model/creature/creature";
import { ImmunityConfig } from "../model/final/immunity";
import { State } from "../state";
import itemService from "./item.service";
import translationService from "./translation.service";
import creatureService from "./creature.service";
import { Item, Spell } from "../model/spell-item/spell-item";

class DocumentationService {
  private monsters: string[] = [];
  private spells: Spell[] = [];
  private items: Item[] = [];

  generate() {
    let content = fs.readFileSync("lib/templates/index.html").toString();
    const template = { text: content };
    this.replace(template, "monsters", this.monsters.join(""));
    this.replace(template, "traits", this.getTraits());
    fs.writeFileSync(
      path.join(State.modFolder, "doc/monsters.html"),
      template.text
    );
  }

  addCreature(creature: Creature) {
    this.spells.push(...creature.spells);
    this.items.push(...creature.items);
    let content = fs.readFileSync("lib/templates/monster.html").toString();
    let template = { text: content };
    let str = `${creature.data.strength}`;
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
        const weapon = creature.items.find((i) => i.file === equippedItem.file);
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
    // for (const item of creature.items.filter((i) => i.trait)) {
    //   //TODO:
    //   traits.push(
    //     `<a href="#${item.stringRef}">${translationService.from(
    //       item.stringRef!
    //     )}</a>`
    //   );
    // }
    if (traits) result += `<h5>${traits.join(", ")}</h5>`;
    for (const immunity of immunities.filter((i) => i.type !== "trait")) {
      result += `<h5>${translationService.from(immunity.stringRef!)}</h5>`;
      if (immunity.description)
        result += `<p>${translationService.from(immunity.description)}</p>`;
    }
    this.replace(template, "traits", result);
  }

  getCreatureSpells(template: { text: string }, creature: Creature) {
    let spells = "";
    for (const memorized of creature.additionalData.memorizedSpells) {
      const spell = this.spells.find((s) => s.file === memorized.file);
      if (spell && spell.doc) {
        spells += `<h5>${translationService.from(
          spell.name!
        )} (${this.getSpellQuantity(
          spell.memorizedCount,
          spell.options?.renew
        )})</h5>`;
        spells += `<p>${translationService.from(spell.description!)}</p>`;
      }
    }
    if (spells) {
      spells = `<h4>Abilities</h4><div class="abilities">${spells}</div>`;
    }
    this.replace(template, "abilities", spells);
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

  getSpellQuantity(
    memorizedCount: number | undefined,
    renew: number | undefined
  ): string {
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
