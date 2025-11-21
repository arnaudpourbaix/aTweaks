import { MonsterFamilyEnum } from "../../../creatures/monster";
import itemService from "../../services/item.service";
import spellService from "../../services/spell.service";
import { getFilename } from "../../services/utils/misc.func";
import {
  Item,
  PartialItem,
  PartialSpell,
  Spell,
} from "../spell-item/spell-item";
import { Creature } from "./creature";

export class CreatureFamily {
  name: MonsterFamilyEnum;
  creatures: Creature[];
  items: Item[];
  spells: Spell[];

  constructor(name: MonsterFamilyEnum) {
    this.name = name;
    this.creatures = [];
    this.items = [];
    this.spells = [];
  }

  addCreature(creature: Creature) {
    creature.validate();
    this.creatures.push(creature);
  }

  addSpell(spell: PartialSpell, file?: string): Spell {
    file ??= getFilename(this.spells.length + 1, this.name, "f");
    const result = spellService.getSpell(spell, file);
    this.spells.push(result);
    return result;
  }

  addItem(item: PartialItem): Item {
    const file = getFilename(this.items.length + 1, this.name, "f");
    const result = itemService.getItem(item, file);
    this.items.push(result);
    return result;
  }
}
