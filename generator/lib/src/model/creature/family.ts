import { MonsterFamilyEnum } from "../../../creatures/monster";
import effectService from "../../services/effects/effect.service";
import itemService from "../../services/item.service";
import spellService from "../../services/spell.service";
import { getFilename } from "../../services/utils/misc.func";
import { BaseEffect } from "../spell-item/effect";
import {
  EffectCastSpellTypeEnum,
  EffectTargetEnum,
} from "../spell-item/effect.enums";
import { EffectTypeEnum } from "../spell-item/effect.type";
import { PartialProjectile, Projectile } from "../spell-item/projectile";
import {
  Item,
  PartialItem,
  PartialSpell,
  PartialWeapon,
  Spell,
  Weapon,
  WeaponCastSpell,
} from "../spell-item/spell-item";
import { WithRequired } from "../utility-types";
import { CreatureAbilitySpell, RawCreatureAbility } from "./ability";
import { Creature } from "./creature";

export class CreatureFamily {
  name: MonsterFamilyEnum;
  creatures: Creature[];
  items: Item[];
  spells: Spell[];
  projectiles: Projectile[];

  constructor(name: MonsterFamilyEnum) {
    this.name = name;
    this.creatures = [];
    this.items = [];
    this.spells = [];
    this.projectiles = [];
  }

  addCreature(creature: Creature) {
    creature.validate(this.name);
    this.creatures.push(creature);
  }

  addProjectile(projectile: PartialProjectile, file?: string): Projectile {
    file ??= getFilename(this.projectiles.length + 1, this.name, "f");
    const result: Projectile = { ...projectile, file };
    this.projectiles.push(result);
    return result;
  }

  addSpell(spell: Omit<PartialSpell, "memorizedCount">, file?: string): Spell {
    if (spell.id !== undefined && this.spells.some((s) => s.id === spell.id)) {
      throw new Error(`Spell id ${spell.id} already defined`);
    }
    file ??= getFilename(this.spells.length + 1, this.name, "f");
    const result = spellService.getSpell(spell, file);
    this.spells.push(result);
    return result;
  }

  addItem(item: PartialItem): Item {
    if (item.id !== undefined && this.items.some((i) => i.id === item.id)) {
      throw new Error(`Item id ${item.id} already defined`);
    }
    const file = getFilename(this.items.length + 1, this.name, "f");
    const result = itemService.getItem(item, file);
    this.items.push(result);
    return result;
  }

  addWeapon({
    weapon,
    castSpell,
  }: {
    weapon: PartialWeapon;
    castSpell?: WeaponCastSpell;
  }) {
    const result = this.addItem(weapon) as Weapon;
    if (castSpell) this.attachSpellToWeapon(result, castSpell);
    return result;
  }

  private attachSpellToWeapon(weapon: Weapon, cast: WeaponCastSpell) {
    const spell = this.addSpell(cast.spell);
    spell.doc = false;
    const baseEffect: WithRequired<Omit<BaseEffect, "opcode">, "resource"> = {
      resource: spell.file,
      probability1: cast.probability1,
      probability2: cast.probability2,
      saveTypes: cast.saveTypes,
      saveBonus: cast.saveBonus,
    };
    weapon.header.effects.push(
      effectService.getEffect({
        opcode: EffectTypeEnum.CastSpell,
        type: EffectCastSpellTypeEnum.CastInstantlyAtCasterLevel,
        ...baseEffect,
      })
    );
    if (cast.remove) {
      weapon.header.effects.push(
        effectService.getEffect({
          opcode: EffectTypeEnum.RemoveSpell,
          target: EffectTargetEnum.Self,
          ...baseEffect,
        })
      );
    }
  }

  item(id: number): Item {
    const item = this.items.find((s) => s.id === id);
    if (!item) throw new Error(`No item found with id ${id}`);
    return item;
  }

  spell(id: number): Spell {
    const spell = this.spells.find((s) => s.id === id);
    if (!spell) throw new Error(`No spell found with id ${id}`);
    return spell;
  }

  creature(id: number): Creature {
    const creature = this.creatures.find((s) => s.id === id);
    if (!creature) throw new Error(`No creature found with id ${id}`);
    return creature;
  }

  ability(id: number): RawCreatureAbility {
    const spell = this.spell(id);
    if (!spell.ability) throw new Error(`No ability found for spell id ${id}`);
    return spell.ability;
  }

  projectile(id: number): Projectile {
    const proj = this.projectiles.find((s) => s.id === id);
    if (!proj) throw new Error(`No projectile found with id ${id}`);
    return proj;
  }

  preset(name: string) {
    return {
      preset: name,
    };
  }
}
