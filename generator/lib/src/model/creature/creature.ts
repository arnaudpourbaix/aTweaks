import { MonsterEnum, MonsterFamilyEnum } from "../../../creatures/monster";
import { TranslationKey } from "../../../translations/i18n";
import creatureFactory from "../../factories/creature.factory";
import { EffectFile } from "../spell-item/effect";
import { Projectile } from "../spell-item/projectile";
import {
  Item,
  PartialItem,
  PartialSpell,
  PartialWeapon,
  Spell,
  Weapon,
  WeaponCastSpell,
} from "../spell-item/spell-item";
import { AtLeast, PartialBy, WithRequired } from "../utility-types";
import { CreatureAdditionalData } from "./additional-data";
import { CreatureAttack, PartialCreatureAttack } from "./attack";
import { CreatureBehavior, PartialCreatureBehavior } from "./behavior";
import { CreatureData } from "./data";
import { CreatureGrabConfig } from "./grab";

export interface BaseCreature {
  files: string[];
  data: CreatureData;
  additionalData: CreatureAdditionalData;
}

export class Creature implements BaseCreature {
  name!: TranslationKey;
  monster!: MonsterEnum;
  family!: MonsterFamilyEnum;
  data!: CreatureData;
  additionalData!: CreatureAdditionalData;
  behavior!: CreatureBehavior;
  attack!: CreatureAttack;
  files: string[] = [];
  newFiles: { files: string[]; copyFrom: string }[] = [];

  /**
   * For these files, keep existing creature values if they are better
   */
  notEnforceFiles: string[] = [];
  adjustments: CreatureAdjustment[] = [];

  items: (Item | Weapon)[] = [];
  spells: Spell[] = [];
  projectiles: Projectile[] = [];
  effectFiles: EffectFile[] = [];

  /**
   * Auto-generate some creature data (true by default)
   */
  autoGenerate: CreatureAutoGenerate = {
    thac0: true,
    hitPoints: true,
    savingThrows: true,
    enchantment: true,
    meleeRange: true,
  };

  setAdditionalData(
    additionalData: AtLeast<
      WithRequired<CreatureAdditionalData, "movement">,
      "movement"
    >
  ) {
    creatureFactory.setAdditionalData(this, additionalData);
  }

  setBehavior(behavior: PartialCreatureBehavior) {
    creatureFactory.setBehavior(this, behavior);
  }

  setAttack(attack: PartialCreatureAttack) {
    creatureFactory.setAttack(this, attack);
  }

  setAdjustments(adjustments: PartialCreatureAdjustment[]) {
    creatureFactory.setAdjustments(this, adjustments);
  }

  addSpell(spell: PartialSpell): Spell {
    return creatureFactory.addSpell(this, spell);
  }

  addItem(item: PartialItem) {
    return creatureFactory.addItem(this, item);
  }

  addWeapon({
    weapon,
    grab,
    castSpell,
  }: {
    weapon: PartialWeapon;
    grab?: CreatureGrabConfig;
    castSpell?: WeaponCastSpell;
  }) {
    return creatureFactory.addWeapon({ cre: this, weapon, grab, castSpell });
  }

  isValid(): boolean {
    return creatureFactory.isValid(this);
  }
}

export interface CreatureAutoGenerate {
  thac0?: boolean;
  hitPoints?: boolean;
  savingThrows?: boolean;
  enchantment?: boolean;
  meleeRange?: boolean;
}

export interface CreatureAdjustment extends BaseCreature {
  /**
   * Is it a summon ?
   */
  summon: boolean;
  /**
   * Don't assign a weapon
   */
  noWeapon: boolean;
}

export type PartialCreatureAdjustment = PartialBy<
  CreatureAdjustment,
  "summon" | "noWeapon" | "data" | "additionalData"
>;
