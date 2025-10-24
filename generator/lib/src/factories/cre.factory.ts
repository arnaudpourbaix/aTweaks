import { MonsterEnum, MonsterFamilyEnum } from "../../creatures/monster";
import { Cre } from "../model/classes/cre";
import { CreBehavior, CreItem, CreSpell } from "../model/classes/cre-types";
import { CreatureAttack, CreatureAttackAction } from "../model/final/attack";
import { CreatureAdditionalData, CreatureData } from "../model/final/creature";
import { Item, Spell } from "../model/final/spell-item";
import { file } from "../services/misc.func";
import { TranslationKey } from "../translations/i18n";

class CreatureFactory {
  create(p: {
    name: TranslationKey;
    monster: MonsterEnum;
    family: MonsterFamilyEnum;
    files: string[];
    data: CreatureData;
  }): Cre {
    const cre = new Cre();
    cre.name = p.name;
    cre.monster = p.monster;
    cre.family = p.family;
    cre.files = p.files;
    cre.data = p.data;
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
    const defaultAction: CreatureAttackAction = {
      disableInterrupt: false,
      responseWeight: 100,
    };
    const actions: CreatureAttackAction[] = (attack.actions ?? []).map((a) => ({
      responseWeight: a.responseWeight ?? defaultAction.responseWeight,
      disableInterrupt: a.disableInterrupt ?? defaultAction.disableInterrupt,
      weaponSlot: a.weaponSlot,
    }));
    const result: CreatureAttack = {
      grab: creature.attack.grab
        ? { ...GRAB_DEFAULT_CONFIG, ...creature.attack.grab }
        : undefined,
      targetPriorities: this.targerService.getTargetPriorities(creature),
      targetStatusWeaponSlot: creature.attack.targetStatusWeaponSlot ?? [],
    };

    cre.attack = {
      actions: actions.length ? actions : [defaultAction],
      dualWielding: attack.dualWielding ?? false,
      melee: attack.melee ?? true,
      ranged: attack.ranged ?? false,
      targetPriorities: [],
      targetStatusWeaponSlot: attack.targetStatusWeaponSlot ?? [],
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

const creatureFactory = new CreatureFactory();
export default creatureFactory;
