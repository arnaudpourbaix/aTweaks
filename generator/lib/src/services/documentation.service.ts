import * as fs from "fs";
import path from "path";
import { Creature } from "../model/creature/creature";
import { ItemAbilityLocationEnum } from "../model/spell-item/effect.enums";
import { State } from "../state";
import translationService from "./translation.service";
import { WEAPON_SLOTS } from "../model/creature/item";
import utils from "./utils/utils.service";
import itemService from "./item.service";
import { ImmunityConfig } from "../model/final/immunity";

class DocumentationService {
  private monsters: string[] = [];

  generate() {
    let template = fs.readFileSync("lib/templates/index.html").toString();
    template = this.replace(template, "monsters", this.monsters.join(""));
    fs.writeFileSync(path.join(State.modFolder, "doc/monsters.html"), template);
  }

  addCreature(creature: Creature) {
    let template = fs.readFileSync("lib/templates/monster.html").toString();
    let str = `${creature.data.strength}`;
    if (creature.data.exceptionalStrength)
      str += `/${creature.data.exceptionalStrength}`;
    template = this.replace(
      template,
      "name",
      translationService.from(creature.name)
    );
    template = this.replace(template, "str", str);
    template = this.replace(template, "dex", creature.data.dexterity);
    template = this.replace(template, "con", creature.data.constitution);
    template = this.replace(template, "int", creature.data.intelligence);
    template = this.replace(template, "wis", creature.data.wisdom);
    template = this.replace(template, "cha", creature.data.charisma);
    template = this.replace(template, "align", creature.data.alignment);
    template = this.replace(template, "ac", creature.data.ac);
    template = this.replace(template, "movement", creature.data.movement);
    template = this.replace(template, "level", creature.data.level1);
    template = this.replace(template, "hp", creature.data.hp);
    template = this.replace(template, "thac0", creature.data.thac0);
    template = this.replace(template, "apr", creature.data.apr);
    template = this.replace(template, "size", creature.data.size);
    template = this.replace(template, "morale", creature.data.morale);
    template = this.replace(template, "xp", creature.data.xpv);
    let weapons = "";
    for (const equippedItem of creature.additionalData.equippedItems) {
      if (itemService.isEquippedWeapon(equippedItem)) {
        const weapon = creature.items.find((i) => i.file === equippedItem.file);
        if (weapon && weapon.doc) {
          weapons += `<div class="weapon">${translationService.from(
            weapon.description!
          )}</div>`;
        }
      }
    }
    template = this.replace(template, "weapons", weapons);
    let traits = "";
    for (const name of creature.additionalData.immunities) {
      const immunity = State.immunities.find(
        (i) => i.name === name
      ) as ImmunityConfig;
      traits += `<h5>${translationService.from(immunity.stringRef!)}</h5>`;
      if (immunity.description)
        traits += `<p>${translationService.from(immunity.description)}</p>`;
    }
    template = this.replace(template, "traits", traits);
    let spells = "";
    for (const memorized of creature.additionalData.memorizedSpells) {
      const spell = creature.spells.find((s) => s.file === memorized.file);
      if (spell && spell.doc) {
        spells += `<h5>${translationService.from(spell.name!)}</h5>`;
        spells += `<p>${translationService.from(spell.description!)}</p>`;
      }
    }
    template = this.replace(template, "abilities", spells);
    // </div>

    // <!-- ================== Spell and Abilities ================== -->
    // <h2>
    //   <a id="Abilities_and_special"
    //     >Abilities and special traits</a
    //   >
    // </h2>
    // <div class="section">
    //   <span class="item-title"><a id="Acidic_Enzymes">Acidic Enzymes</a></span
    //   >
    //   <div class="item">The ankheg can squirt a stream of acidic enzymes once every six hours to a distance of 30 feet.
    //     A victim struck by the stream of acidic enzymes suffers 8d4 points of damage (half damage if the victim rolls a successful saving throw vs. poison).
    //     It uses this attack technique only when desperate.
    //   </div>
    // </div>
    this.monsters.push(template);
  }

  private replace(
    text: string,
    key: string,
    value: string | number | undefined
  ) {
    key = `{{${key}}}`;
    if (!text.includes(key)) throw new Error(`Token ${key} not found !`);
    return text.replace(new RegExp(key, "g"), `${value ?? ""}`);
  }
}

const documentationService = new DocumentationService();
export default documentationService;
