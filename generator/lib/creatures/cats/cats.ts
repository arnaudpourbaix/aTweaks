import { MonsterItemIconEnum } from "../../config/item";
import creatureFactory from "../../src/factories/creature.factory";
import { Creature } from "../../src/model/creature/creature";
import { CreatureFamily } from "../../src/model/creature/family";
import {
  AbilityDamageTypeEnum,
  CastSpellOnConditionTargetEnum,
  EffectBonusToEnum,
  EffectDamageTypeEnum,
  EffectDispelResistanceEnum,
  EffectStatisticModifierEnum,
  InvisibilityTypeEnum,
  ItemAbilityFlagEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import creatureService from "../../src/services/creature.service";
import { hunterCustomCode } from "../common";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

export class CatFamily extends CreatureFamily {
  constructor() {
    super(MonsterFamilyEnum.Cat);
    this.addCreature(this.jaguar());
    this.addCreature(this.leopard());
    this.addCreature(this.lion());
    this.addCreature(this.mountainLion());
    this.addCreature(this.hellcat());
    this.addCreature(this.displacerBeast());
  }

  /**
   * Jaguar
   */
  private jaguar() {
    const jaguar = creatureFactory.create({
      monster: MonsterEnum.Jaguar,
      family: MonsterFamilyEnum.Cat,
      name: "monster.cat.name.jaguar",
      files: [
        "BDHELP04",
        "CATJAG01",
        // "BDSHA06B", //TODO: Panther Spirit
      ],
      data: {
        level1: 4,
        bonusHp: 1,
        strength: 14,
        dexterity: 15,
        constitution: 10,
        intelligence: 4,
        wisdom: 14,
        charisma: 7,
        ac: 6,
        apr: 3,
        xpv: 420,
        alignment: "NEUTRAL",
        morale: 9,
        general: "ANIMAL",
        race: "CAT",
        class: "CAT",
        gender: "NIETHER",
        size: "Large",
      },
    });
    jaguar.setAdditionalData({
      movement: { value: 15 },
      removeItems: ["CATJAG"],
    });
    this.createPaws(jaguar, 1, 3, { diceThrown: 1, diceSize: 4 });
    this.createJaws(jaguar, 1, 8);
    jaguar.setBehavior({ customCodes: [hunterCustomCode] });
    jaguar.setAdjustments([{ files: ["BDHELP04"], summon: true }]);
    return jaguar;
  }

  /**
   * Leopard
   */
  private leopard() {
    const leopard = creatureFactory.create({
      monster: MonsterEnum.Leopard,
      family: MonsterFamilyEnum.Cat,
      name: "monster.cat.name.leopard",
      files: ["CATJAGSU"],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 16,
        dexterity: 19,
        constitution: 15,
        intelligence: 4,
        wisdom: 12,
        charisma: 6,
        ac: 6,
        apr: 3,
        xpv: 270,
        alignment: "NEUTRAL",
        morale: 9,
        general: "ANIMAL",
        race: "CAT",
        class: "CAT",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    leopard.setAdditionalData({
      movement: { value: 15 },
      removeItems: ["CATJAGSU"],
    });
    this.createPaws(leopard, 1, 3, { diceThrown: 1, diceSize: 4 });
    this.createJaws(leopard, 1, 6);
    leopard.setAdjustments([{ files: ["CATJAGSU"], summon: true }]);
    return leopard;
  }

  /**
   * Lion
   */
  private lion() {
    const lion = creatureFactory.create({
      monster: MonsterEnum.Lion,
      family: MonsterFamilyEnum.Cat,
      name: "monster.cat.name.lion",
      files: [
        "BDHELP02",
        "CATLIOSU",
        "CATLIOWP", // Joolon
        // "SPIRLION", //TODO: Spirit Lion
        // "SPLION1", //TODO: Spirit Lion
        // "SPLION2", //TODO: Spirit Lion
        // "SPLION3", //TODO: Spirit Lion
        // "SPLION4", //TODO: Spirit Lion
        // "SPLION5", //TODO: Spirit Lion
      ],
      data: {
        level1: 5,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 13,
        intelligence: 4,
        wisdom: 12,
        charisma: 8,
        ac: 5,
        apr: 3,
        xpv: 650,
        alignment: "NEUTRAL",
        morale: 9,
        general: "ANIMAL",
        race: "CAT",
        class: "CAT",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    lion.setAdditionalData({
      movement: { value: 12 },
      removeItems: ["CATLIO"],
    });
    this.createPaws(lion, 1, 4, { diceThrown: 1, diceSize: 6 });
    this.createJaws(lion, 1, 10);
    lion.setAdjustments([{ files: ["CATLIOSU"], summon: true }]);
    return lion;
  }

  /**
   * Mountain Lion
   */
  private mountainLion() {
    const mountainLion = creatureFactory.create({
      monster: MonsterEnum.MountainLion,
      family: MonsterFamilyEnum.Cat,
      name: "monster.cat.name.mountainLion",
      files: ["CATLIM01"],
      data: {
        level1: 3,
        bonusHp: 1,
        strength: 17,
        dexterity: 15,
        constitution: 13,
        intelligence: 4,
        wisdom: 12,
        charisma: 8,
        ac: 6,
        apr: 3,
        xpv: 270,
        alignment: "NEUTRAL",
        morale: 9,
        general: "ANIMAL",
        race: "CAT",
        class: "CAT",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    mountainLion.setAdditionalData({
      movement: { value: 12 },
      removeItems: ["P1-6"],
      removeScripts: [],
    });
    this.createPaws(mountainLion, 1, 3, { diceThrown: 1, diceSize: 4 });
    this.createJaws(mountainLion, 1, 6);
    mountainLion.setBehavior({ customCodes: [hunterCustomCode] });
    return mountainLion;
  }

  /**
   * Hellcat
   */
  private hellcat() {
    const hellcat = creatureFactory.create({
      monster: MonsterEnum.Hellcat,
      family: MonsterFamilyEnum.Cat,
      name: "monster.cat.name.hellcat",
      files: ["BDHELCAT"],
      data: {
        level1: 7,
        bonusHp: 2,
        strength: 21,
        dexterity: 21,
        constitution: 19,
        intelligence: 10,
        wisdom: 14,
        charisma: 10,
        ac: 5,
        apr: 3,
        xpv: 5000,
        alignment: "LAWFUL_EVIL",
        morale: 13,
        general: "MONSTER",
        race: "DEMONIC",
        class: "CAT",
        gender: "NIETHER",
        size: "Large",
        hideShadow: 100,
        moveSilent: 100,
      },
    });
    hellcat.setAdditionalData({
      movement: { value: 15 },
      removeItems: ["BDHELCAT", "RINGDEMN", "IPSION"],
      removeScripts: ["BDHELCAT"],
      deleteEffectOpcodes: [
        EffectTypeEnum.Blur,
        EffectTypeEnum.ProtectionFromBackstab,
      ],
    });
    hellcat.addTrait({
      immunities: ["mindSpells", "normalWeapons", "extraplanar"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 20,
          type: EffectStatisticModifierEnum.Set,
        },
        {
          opcode: EffectTypeEnum.Invisibility,
          type: InvisibilityTypeEnum.Improved,
        },
      ],
    });
    this.createPaws(hellcat, 1, 4, { diceThrown: 2, diceSize: 4 });
    this.createJaws(hellcat, 2, 6);
    return hellcat;
  }

  /**
   * Displacer Beast
   */
  private displacerBeast() {
    const displacerBeast = creatureFactory.create({
      monster: MonsterEnum.DisplacerBeast,
      family: MonsterFamilyEnum.Cat,
      name: "monster.cat.name.displacerBeast",
      files: ["BDDISPBE", "BDDISPBP"],
      data: {
        level1: 6,
        strength: 18,
        dexterity: 15,
        constitution: 16,
        intelligence: 4,
        wisdom: 12,
        charisma: 8,
        ac: 6,
        apr: 2,
        xpv: 975,
        alignment: "LAWFUL_EVIL",
        morale: 14,
        general: "MONSTER",
        race: "CAT",
        class: "CAT",
        gender: "NIETHER",
        size: "Large",
        saveDeath: 7,
        saveWand: 9,
        savePolymorph: 8,
        saveBreath: 8,
        saveSpell: 10,
      },
    });
    displacerBeast.setAdditionalData({
      movement: { value: 15 },
      removeItems: ["BDDISPBE"],
    });
    displacerBeast.addTrait({
      immunities: ["magic", "fire", "cold"],
      effects: [
        {
          opcode: EffectTypeEnum.ArmorClassBonus,
          bonusTo: EffectBonusToEnum.AllWeapons,
          value: 2,
          dispelResistance:
            EffectDispelResistanceEnum.NotDispelBypassResistance,
        },
        {
          opcode: EffectTypeEnum.Blur,
          dispelResistance:
            EffectDispelResistanceEnum.NotDispelBypassResistance,
        },
        {
          opcode: EffectTypeEnum.MirrorImageEffect,
          amount: 1,
          dispelResistance:
            EffectDispelResistanceEnum.NotDispelBypassResistance,
        },
        {
          opcode: EffectTypeEnum.CastSpellOnCondition,
          condition: "AttackedBy([ANYONE])",
          conditionTarget: CastSpellOnConditionTargetEnum.Myself,
          resource: "BDDISPLC",
          dispelResistance:
            EffectDispelResistanceEnum.NotDispelBypassResistance,
        },
      ],
    });
    displacerBeast.addWeapon({
      weapon: {
        stringRef: "monster.cat.weapon.tentacles",
        icon: MonsterItemIconEnum.Jelly,
        equippedSlot: ["WEAPON1"],
        header: {
          type: ItemAbilityTypeEnum.Melee,
          range: 5,
          diceThrown: 2,
          diceSize: 4,
          damageType: AbilityDamageTypeEnum.PiercingOrCrushing,
          speed: 3,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
        },
      },
    });
    displacerBeast.setAdjustments([
      {
        files: ["BDDISPBP"],
        data: {
          level1: 9,
          xpv: 1200,
          strength: 19,
          constitution: 19,
          ac: 2,
          saveDeath: 7,
          saveWand: 9,
          savePolymorph: 8,
          saveBreath: 8,
          saveSpell: 10,
        },
      },
    ]);
    return displacerBeast;
  }

  createPaws(
    creature: Creature,
    diceThrown: number,
    diceSize: number,
    rear: {
      diceThrown: number;
      diceSize: number;
    }
  ) {
    const amount = creatureService.getStrengthModifier(creature.data);
    return creature.addWeapon({
      weapon: {
        stringRef: "monster.cat.weapon.claws",
        icon: MonsterItemIconEnum.Wolf,
        equippedSlot: ["WEAPON1"],
        header: {
          type: ItemAbilityTypeEnum.Melee,
          diceThrown,
          diceSize,
          damageType: AbilityDamageTypeEnum.Slashing,
          speed: 5,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
        },
      },
      castSpell: {
        probability1: 20,
        spell: {
          name: "monster.cat.rearClawsAttack.name",
          secondaryType: ItemAbilitySecondaryTypeEnum.OffensiveDamage,
          headers: [
            {
              type: ItemAbilityTypeEnum.Melee,
              range: 5,
              effects: [
                {
                  opcode: EffectTypeEnum.Damage,
                  type: EffectDamageTypeEnum.Slashing,
                  diceThrown: rear.diceThrown,
                  diceSize: rear.diceSize,
                  amount,
                },
                {
                  opcode: EffectTypeEnum.Damage,
                  type: EffectDamageTypeEnum.Slashing,
                  diceThrown: rear.diceThrown,
                  diceSize: rear.diceSize,
                  amount,
                },
              ],
            },
          ],
        },
      },
    });
  }

  createJaws(creature: Creature, diceThrown: number, diceSize: number) {
    return creature.addWeapon({
      weapon: {
        stringRef: "monster.cat.weapon.jaws",
        icon: MonsterItemIconEnum.Jaws,
        equippedSlot: ["SHIELD"],
        header: {
          type: ItemAbilityTypeEnum.Melee,
          diceThrown: diceThrown,
          diceSize: diceSize,
          damageType: AbilityDamageTypeEnum.Piercing,
          speed: 3,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
        },
      },
    });
  }
}

export const createCats = () => new CatFamily();
