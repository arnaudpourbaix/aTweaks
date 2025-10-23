import { MonsterEnum, MonsterFamilyEnum } from "../../creatures/monster";
import { Cre } from "../model/classes/cre";
import { CreBehavior, CreItem, CreSpell } from "../model/classes/cre-types";
import { CreatureAttack } from "../model/final/attack";
import { CreatureAdditionalData, CreatureData } from "../model/final/creature";
import { Item, Spell } from "../model/final/spell-item";
import { file } from "../services/misc.func";
import { TranslationKey } from "../translations/i18n";

class Factory {
  create(p: {
    name: TranslationKey;
    monster: MonsterEnum;
    family: MonsterFamilyEnum;
    files: string[];
    data: CreatureData;
    additionalData: Partial<CreatureAdditionalData>;
    behavior: Partial<CreBehavior>;
  }): Cre {
    const cre = new Cre();
    cre.name = p.name;
    cre.monster = p.monster;
    cre.family = p.family;
    cre.files = p.files;
    cre.data = p.data;
    this.setAdditionalData(cre, p.additionalData);
    this.setBehavior(cre, p.behavior);
    return cre;
  }

  setAdditionalData(cre: Cre, additionalData: Partial<CreatureAdditionalData>) {
    cre.additionalData = {
      removeScripts: [],
      proficiencies: [],
      removeItems: [],
      itemSlots: [],
      immunities: [],
      removeKnownSpells: true,
      removeMemorizedSpells: true,
      memorizedSpells: [],
      deleteEffectOpcodes: [],
      removeEffects: true,
      effects: [],
      ...additionalData,
    };
  }

  setBehavior(cre: Cre, behavior: Partial<CreBehavior>) {
    cre.behavior = {
      dialog: [],
      help: true,
      tracking: true,
      walk: false,
      combatWalk: true,
      restHeal: false,
      usePotions: false,
      useKitAbilities: false,
      hideInShadows: false,
      canPolymorph: false,
      abilities: [],
      customCode: [],
      additionalCode: [],
      ...behavior,
    };
  }

  setAttack(cre: Cre, attack: Partial<CreatureAttack>) {
    cre.attack = {
      actions: [],
      dualWielding: false,
      melee: true,
      ranged: false,
      targetPriorities: [],
      targetStatusWeaponSlot: [],
      ...attack,
    };
  }

  addSpell(cre: Cre, spell: CreSpell): Spell {
    const result: Spell = {
      effects: [],
      headers: [],
      ...spell,
      file: file(cre.spells.length + 1, cre.monster),
    };
    cre.spells.push(result);
    return result;
  }

  addItem(cre: Cre, item: CreItem) {
    const result: Item = {
      effects: [],
      immunities: [],
      equippedSlot: [],
      ...item,
      file: file(cre.items.length + 1, cre.monster),
    };
    cre.items.push(result);
    return result;
  }

  addWeapon(creature: Cre, weapon: CreItem) {}
}

const CreatureFactory = new Factory();

export default CreatureFactory;
