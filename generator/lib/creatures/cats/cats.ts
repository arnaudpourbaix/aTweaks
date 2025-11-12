import { MonsterItemIconEnum } from "../../config/item";
import creatureFactory from "../../src/factories/creature.factory";
import {
  AbilityDamageTypeEnum,
  EffectDamageTypeEnum,
  EffectStatisticModifierEnum,
  InvisibilityTypeEnum,
  ItemAbilityFlagEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import {
  PartialWeapon,
  WeaponCastSpell,
} from "../../src/model/spell-item/spell-item";
import creatureService from "../../src/services/creature.service";
import { hunterCustomCode } from "../common";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

const createPaws = (payload: {
  diceSize: number;
  diceThrown: number;
  damageBonus?: number;
  rear: {
    diceSize: number;
    diceThrown: number;
    damageBonus?: number;
  };
}): {
  weapon: PartialWeapon;
  castSpell: WeaponCastSpell;
} => ({
  weapon: {
    stringRef: "monster.cat.weapon.claws",
    icon: MonsterItemIconEnum.Wolf,
    equippedSlot: ["WEAPON1"],
    header: {
      type: ItemAbilityTypeEnum.Melee,
      damageBonus: payload.damageBonus,
      diceThrown: payload.diceThrown,
      diceSize: payload.diceSize,
      damageType: AbilityDamageTypeEnum.Slashing,
      speed: 3,
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
              diceThrown: payload.rear.diceThrown,
              diceSize: payload.rear.diceSize,
              amount: payload.rear.damageBonus,
            },
            {
              opcode: EffectTypeEnum.Damage,
              type: EffectDamageTypeEnum.Slashing,
              diceThrown: payload.rear.diceThrown,
              diceSize: payload.rear.diceSize,
              amount: payload.rear.damageBonus,
            },
          ],
        },
      ],
    },
  },
});

const createJaws = (payload: {
  diceSize: number;
  diceThrown: number;
}): {
  weapon: PartialWeapon;
} => ({
  weapon: {
    stringRef: "monster.cat.weapon.jaws",
    icon: MonsterItemIconEnum.Jaws,
    equippedSlot: ["SHIELD"],
    header: {
      type: ItemAbilityTypeEnum.Melee,
      diceThrown: payload.diceThrown,
      diceSize: payload.diceSize,
      damageType: AbilityDamageTypeEnum.Piercing,
      speed: 3,
      abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
    },
  },
});

export const createCats = () => {
  /**
   * Jaguar
   */
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
  jaguar.addWeapon(
    createPaws({
      diceThrown: 1,
      diceSize: 3,
      rear: {
        diceThrown: 1,
        diceSize: 4,
        damageBonus: creatureService.getStrengthModifier(jaguar.data),
      },
    })
  );
  jaguar.addWeapon(createJaws({ diceThrown: 1, diceSize: 8 }));
  jaguar.setBehavior({ customCode: [hunterCustomCode] });
  jaguar.setAdjustments([{ files: ["BDHELP04"], summon: true }]);
  jaguar.validate();

  /**
   * Leopard
   */
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
  leopard.addWeapon(
    createPaws({
      diceThrown: 1,
      diceSize: 3,
      rear: {
        diceThrown: 1,
        diceSize: 4,
        damageBonus: creatureService.getStrengthModifier(leopard.data),
      },
    })
  );
  leopard.addWeapon(createJaws({ diceThrown: 1, diceSize: 6 }));
  leopard.setAdjustments([{ files: ["CATJAGSU"], summon: true }]);
  leopard.validate();

  /**
   * Lion
   */
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
  lion.addWeapon(
    createPaws({
      diceThrown: 1,
      diceSize: 4,
      rear: {
        diceThrown: 1,
        diceSize: 6,
        damageBonus: creatureService.getStrengthModifier(lion.data),
      },
    })
  );
  lion.addWeapon(createJaws({ diceThrown: 1, diceSize: 10 }));
  lion.setAdjustments([{ files: ["CATLIOSU"], summon: true }]);
  lion.validate();

  /**
   * Mountain Lion
   */
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
  mountainLion.addWeapon(
    createPaws({
      diceThrown: 1,
      diceSize: 3,
      rear: {
        diceThrown: 1,
        diceSize: 4,
        damageBonus: creatureService.getStrengthModifier(mountainLion.data),
      },
    })
  );
  mountainLion.addWeapon(createJaws({ diceThrown: 1, diceSize: 6 }));
  mountainLion.setBehavior({ customCode: [hunterCustomCode] });
  mountainLion.validate();

  /**
   * Wild Tiger
   */
  // const wildTiger = creatureFactory.create({
  //   monster: MonsterEnum.MountainLion,
  //   family: MonsterFamilyEnum.Cat,
  //   name: "monster.cat.name.wildTiger",
  //   files: [],
  //   data: {
  //     level1: 5,
  //     bonusHp: 5,
  //     strength: 17,
  //     dexterity: 15,
  //     constitution: 14,
  //     intelligence: 4,
  //     wisdom: 12,
  //     charisma: 8,
  //     ac: 6,
  //     apr: 3,
  //     xpv: 650,
  //     alignment: "NEUTRAL",
  //     morale: 9,
  //     general: "ANIMAL",
  //     race: "CAT",
  //     class: "CAT",
  //     gender: "NIETHER",
  //     size: "Large",
  //   },
  // });
  // wildTiger.setAdditionalData({
  //   movement: { value: 12 },
  //   removeItems: [],
  //   removeScripts: [],
  // });
  // wildTiger.addWeapon(
  //   createPaws({
  //     diceThrown: 1,
  //     diceSize: 4,
  //     damageBonus: 1,
  //     rear: {
  //       diceThrown: 2,
  //       diceSize: 4,
  //       damageBonus: creatureService.getStrengthModifier(wildTiger.data),
  //     },
  //   })
  // );
  // wildTiger.addWeapon(createJaws({ diceThrown: 1, diceSize: 10 }));
  // wildTiger.validate();

  /**
   * Hellcat
   */
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
    },
  });
  hellcat.setAdditionalData({
    movement: { value: 15 },
    removeItems: ["BDHELCAT", "RINGDEMN", "IPSION"],
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
  hellcat.addWeapon(
    createPaws({
      diceThrown: 1,
      diceSize: 4,
      damageBonus: 1,
      rear: {
        diceThrown: 1,
        diceSize: 6,
        damageBonus: creatureService.getStrengthModifier(hellcat.data),
      },
    })
  );
  hellcat.addWeapon(createJaws({ diceThrown: 2, diceSize: 6 }));
  hellcat.validate();

  /**
   * Displacer Beast
   */
  const displacer = creatureFactory.create({
    monster: MonsterEnum.DisplacerBeast,
    family: MonsterFamilyEnum.Cat,
    name: "monster.cat.name.displacerBeast",
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
  displacer.setAdditionalData({
    movement: { value: 15 },
    removeItems: ["CATJAGSU"],
  });
  displacer.addWeapon(
    createPaws({
      diceThrown: 1,
      diceSize: 3,
      rear: {
        diceThrown: 1,
        diceSize: 4,
        damageBonus: creatureService.getStrengthModifier(displacer.data),
      },
    })
  );
  displacer.addWeapon(createJaws({ diceThrown: 1, diceSize: 6 }));
  displacer.setAdjustments([{ files: ["CATJAGSU"], summon: true }]);
  displacer.validate();

  return [jaguar, leopard, lion, mountainLion, hellcat, displacer];
};
