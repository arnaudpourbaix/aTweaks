import chalk from "chalk";
import { MonsterEnum, MonsterFamilyEnum } from "../../../creatures/monster";
import { TranslationKey } from "../../../translations/i18n";
import { AbstractCreature } from "./abstract-creature";
import { Creature, CreatureAutoGenerate, CreatureNewFile } from "./creature";
import { CreatureData } from "./data";
import translationService from "../../services/translation.service";
import { ADDITIONAL_DATA_DEFAULT } from "./additional-data";
import { Item, Spell } from "../spell-item/spell-item";
import { Projectile } from "../spell-item/projectile";

export interface Family {
  id: number;
  items: Item[];
  projectiles: Projectile[];
  creatures: Creature[];
  spells: Spell[];
}

export abstract class CreatureFamily<T extends Creature>
  extends AbstractCreature
  implements Family
{
  fileType: "m" | "f" = "f";
  creatures: T[];

  constructor(id: MonsterFamilyEnum) {
    super(id);
    this.creatures = [];
  }

  abstract createCreature(id: MonsterEnum): T;

  create(p: {
    name: TranslationKey;
    monster: MonsterEnum;
    files: string[];
    newFiles?: CreatureNewFile[];
    data: Omit<CreatureData, "movement">;
    autoGenerate?: CreatureAutoGenerate;
    logging?: boolean;
  }): T {
    console.log(chalk.bold(`\nCreating ${translationService.from(p.name)}...`));
    const cre = this.createCreature(p.monster);
    cre.name = p.name;
    cre.family = this.id;
    cre.files = p.files;
    cre.newFiles = p.newFiles ?? [];
    cre.data = p.data;
    cre.additionalData = structuredClone(ADDITIONAL_DATA_DEFAULT);
    cre.logging = p.logging ?? false;
    if (p.autoGenerate) {
      cre.autoGenerate = { ...cre.autoGenerate, ...p.autoGenerate };
      console.log("autogenerate", cre.autoGenerate);
    }
    this.creatures.push(cre);
    return cre;
  }

  createFrom(p: {
    name: TranslationKey;
    from: T;
    monster: MonsterEnum;
    files: string[];
    newFiles?: CreatureNewFile[];
  }): T {
    const cre = structuredClone(p.from);
    Object.setPrototypeOf(cre, p.from);
    cre.id = p.monster;
    cre.name = p.name;
    cre.files = p.files;
    cre.newFiles = p.newFiles ?? [];
    cre.items = [];
    cre.spells = [];
    cre.effectFiles = [];
    cre.projectiles = [];
    cre.valid = undefined;
    console.log(
      chalk.bold(
        `\nCreating ${translationService.from(
          cre.name
        )} from ${translationService.from(p.from.name)}...`
      )
    );
    this.creatures.push(cre);
    return cre;
  }

  addCreature(creature: T) {
    creature.validate(this.id);
  }

  creature(id: MonsterEnum): T {
    const creature = this.creatures.find((s) => s.id === id);
    if (!creature) throw new Error(`No creature found with id ${id}`);
    return creature;
  }

  preset(name: string) {
    return {
      preset: name,
    };
  }

  override item(id: number): Item {
    try {
      return super.item(id);
    } catch (e) {
      let item: Item | undefined;
      for (const creature of this.creatures) {
        item = creature.items.find((s) => s.id === id);
        if (item) return item;
      }
      throw e;
    }
  }

  override spell(id: number): Spell {
    try {
      return super.spell(id);
    } catch (e) {
      let spell: Spell | undefined;
      for (const creature of this.creatures) {
        spell = creature.spells.find((s) => s.id === id);
        if (spell) return spell;
      }
      throw e;
    }
  }

  override projectile(id: number): Projectile {
    try {
      return super.projectile(id);
    } catch (e) {
      let proj: Projectile | undefined;
      for (const creature of this.creatures) {
        proj = creature.projectiles.find((s) => s.id === id);
        if (proj) return proj;
      }
      throw e;
    }
  }
}
