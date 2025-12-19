import { MonsterItemIconEnum } from "../../../config/item";
import { MonsterFamilyEnum } from "../../../creatures/monster";
import { TranslationKey } from "../../../translations/i18n";
import creatureFactory from "../../factories/creature.factory";
import targetService from "../../services/baf/target.service";
import grabService from "../../services/effects/grab.service";
import translationService from "../../services/translation.service";
import { ImmunityName } from "../final/immunity";
import { StringReference } from "../final/stringref";
import { ClassIdentifier } from "../ids/class";
import { Effect, EffectFile } from "../spell-item/effect";
import {
  EffectTargetEnum,
  EffectTimingEnum,
  ItemCategoryEnum,
} from "../spell-item/effect.enums";
import {
  Item,
  PartialItem,
  PartialSpell,
  PartialWeapon,
  Spell,
  WeaponCastSpell,
} from "../spell-item/spell-item";
import { AtLeast, PartialBy, WithRequired } from "../utility-types";
import { AbstractCreature } from "./abstract-creature";
import { CreatureAdditionalData } from "./additional-data";
import {
  CreatureAttack,
  CreatureAttackAction,
  PartialCreatureAttack,
} from "./attack";
import { CreatureBehavior, PartialCreatureBehavior } from "./behavior";
import { CreatureData } from "./data";
import { CreatureGrabConfig } from "./grab";
import { ItemSlot, JEWEL_SLOTS } from "./item";

export interface BaseCreature {
  files: string[];
  data: Partial<CreatureData>;
  additionalData: CreatureAdditionalData;
}

export class Creature extends AbstractCreature implements BaseCreature {
  fileType: "m" | "f" = "m";
  /**
   * Will produce usefull WEIDU logs (false by default)
   */
  logging!: boolean;
  name!: TranslationKey;
  family!: MonsterFamilyEnum;
  data!: CreatureData;
  additionalData!: CreatureAdditionalData;
  behavior!: CreatureBehavior;
  attack!: CreatureAttack;
  files: string[] = [];
  newFiles: CreatureNewFile[] = [];

  /**
   * For these files, keep existing creature values if they are better
   */
  notEnforceFiles: string[] = [];
  adjustments: CreatureAdjustment[] = [];
  effectFiles: EffectFile[] = [];

  /**
   * Auto-generate some creature data (true by default)
   */
  autoGenerate: CreatureAutoGenerate = {
    thac0: true,
    hitPoints: true,
    enchantment: true,
    meleeRange: true,
  };
  valid?: boolean;

  setData(data: Partial<CreatureData>) {
    creatureFactory.setData(this, data);
  }

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
    const defaultAction: CreatureAttackAction = {
      disableInterrupt: false,
      responseWeight: 100,
    };
    const actions: CreatureAttackAction[] = (attack.actions ?? []).map((a) => ({
      responseWeight: a.responseWeight ?? defaultAction.responseWeight,
      disableInterrupt: a.disableInterrupt ?? defaultAction.disableInterrupt,
      weaponSlot: a.weaponSlot,
    }));
    this.attack = {
      actions: actions.length ? actions : [defaultAction],
      melee: attack.melee ?? true,
      ranged: attack.ranged ?? false,
      dualWielding: false,
      targetPriorities: targetService.getTargetPriorities(this, attack),
      targetStatusWeaponSlot: attack.targetStatusWeaponSlot ?? [],
      defaultWeaponSlot: attack.defaultWeaponSlot,
      selectWeapons: attack.selectWeapons ?? [],
    };
  }

  setAdjustments(adjustments: PartialCreatureAdjustment[]) {
    creatureFactory.setAdjustments(this, adjustments);
  }

  override addSpell(spell: PartialSpell): Spell {
    const result = super.addSpell(spell);
    if (spell.memorizedCount) {
      this.additionalData.memorizedSpells.push({
        file: result.file,
        memorizedCount: spell.memorizedCount,
      });
    }
    return result;
  }

  override addItem(item: PartialItem): Item {
    const result = super.addItem(item);
    if (item.equippedSlot) {
      this.additionalData.equippedItems.push({
        file: result.file,
        slot: item.equippedSlot,
      });
    }
    return result;
  }

  equipItem(item: Item, slot?: ItemSlot[]): void {
    creatureFactory.equipItem(this, item, slot);
  }

  override addWeapon({
    weapon,
    grab,
    castSpell,
  }: {
    weapon: PartialWeapon;
    grab?: CreatureGrabConfig;
    castSpell?: WeaponCastSpell;
  }) {
    const result = super.addWeapon({ weapon, castSpell });
    if (grab) grabService.attachGrabToWeapon(this, result, grab);
    return result;
  }

  addTrait(payload: {
    id?: number;
    description?: StringReference;
    immunities?: ImmunityName[];
    effects?: Effect[];
    equippedSlot?: ItemSlot;
  }): Item {
    const stringRef = translationService.addCustomTranslation([
      `${translationService.from(this.name)} ${translationService.from(
        "common.creatureTraits"
      )}`,
    ]);
    const item = this.addItem({
      id: payload.id,
      stringRef,
      description: payload.description,
      effects: (payload.effects ?? []).map(
        (e) =>
          ({
            ...e,
            timing: EffectTimingEnum.InstantWhileEquipped,
            target: EffectTargetEnum.Self,
          } as Effect)
      ),
      immunities: payload.immunities,
      equippedSlot: payload.equippedSlot ? [payload.equippedSlot] : JEWEL_SLOTS,
      category: ItemCategoryEnum.Rings,
      icon: MonsterItemIconEnum.Traits,
    });
    item.trait = true;
    return item;
  }

  validate(family: MonsterFamilyEnum) {
    creatureFactory.validate(this, family);
  }
}

export interface CreatureNewFile {
  files: string[];
  copyFromExisting?: string;
  copyFrom?: string;
  stringRef?: StringReference;
}

export interface CreatureAutoGenerate {
  thac0?: boolean;
  hitPoints?: boolean;
  savingThrows?: {
    level: number;
    classe?: ClassIdentifier;
    bonus?: {
      saveDeath?: number;
      saveWand?: number;
      savePolymorph?: number;
      saveBreath?: number;
      saveSpell?: number;
    };
  };
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
  Omit<CreatureAdjustment, "additionalData">,
  "summon" | "noWeapon" | "data"
> & { additionalData?: Partial<CreatureAdditionalData> };
