import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import creatureFactory from "../../src/factories/creature.factory";
import { BaseEffect } from "../../src/model/spell-item/effect";
import {
  AbilityDamageTypeEnum,
  EffectColorLocationEnum,
  EffectDispelResistanceEnum,
  EffectModifierTypeEnum,
  EffectTargetEnum,
  EffectTeleportTypeEnum,
  EffectTimingEnum,
  ItemAbilityFlagEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTypeEnum,
  TranslucencyTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import { PartialWeapon } from "../../src/model/spell-item/spell-item";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

const createJaws = (payload: {
  diceSize: number;
  diceThrown: number;
}): {
  weapon: PartialWeapon;
} => ({
  weapon: {
    stringRef: "monster.cat.weapon.jaws",
    icon: MonsterItemIconEnum.Jaws,
    equippedSlot: ["WEAPON1"],
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

export const createDogs = () => {
  /**
   * Wild dog
   */
  const wild = creatureFactory.create({
    monster: MonsterEnum.WildDog,
    family: MonsterFamilyEnum.Dog,
    name: "monster.dog.name.wild",
    files: [
      "BDBDOG",
      "BDDEADOG",
      "DOGWI",
      "DOGWISU",
      "BDCRUDOG",
      "BDDOG",
      "DW#RNDWI",
      "BDDOGW01", // Little Wanderer
    ],
    data: {
      level1: 1,
      bonusHp: 1,
      strength: 12,
      dexterity: 17,
      constitution: 15,
      intelligence: 4,
      wisdom: 13,
      charisma: 11,
      ac: 7,
      thac0: 19,
      apr: 1,
      xpv: 35,
      alignment: "NEUTRAL",
      morale: 6,
      general: "MONSTER",
      race: "DOG",
      class: "DOG_WILD",
      gender: "MALE",
      size: "Small",
    },
  });
  wild.setAdditionalData({
    movement: { value: 15 },
    removeItems: ["P1-4"],
    scriptLocation: "Default",
  });
  wild.addWeapon(createJaws({ diceThrown: 1, diceSize: 4 }));
  wild.setBehavior({ dialog: ["BDDOGW01"] });
  wild.setAdjustments([
    { files: ["DOGWISU"], summon: true },
    { files: ["BDDOG"], data: { class: "INNOCENT" } },
    { files: ["BDDEADOG"], additionalData: { scriptLocation: "None" } },
  ]);
  wild.validate();

  /**
   * War dog
   */
  const war = creatureFactory.create({
    monster: MonsterEnum.WarDog,
    family: MonsterFamilyEnum.Dog,
    name: "monster.dog.name.war",
    files: [
      "BDPRISD1",
      "BDPRISD2",
      "DOGWA",
      "DOGWASU",
      "DW#RNDWA",
      "UBNIMDOG",
      "NTPOOCH", // Pooch
    ],
    data: {
      level1: 2,
      bonusHp: 2,
      strength: 12,
      dexterity: 17,
      constitution: 15,
      intelligence: 4,
      wisdom: 13,
      charisma: 11,
      ac: 6,
      apr: 1,
      xpv: 65,
      alignment: "NEUTRAL",
      morale: 9,
      general: "MONSTER",
      race: "DOG",
      class: "DOG_WAR",
      gender: "MALE",
      size: "Medium",
    },
  });
  war.setAdditionalData({
    movement: { value: 12 },
    removeItems: ["P2-8"],
    scriptLocation: "Default",
  });
  war.addWeapon(createJaws({ diceThrown: 2, diceSize: 4 }));
  war.setAdjustments([
    { files: ["DOGWASU"], summon: true },
    { files: ["UBNIMDOG"], additionalData: { scriptLocation: "None" } },
  ]);
  war.validate();

  /**
   * Blink dog
   */
  const blinkDog = creatureFactory.create({
    monster: MonsterEnum.BlinkDog,
    family: MonsterFamilyEnum.Dog,
    name: "monster.dog.name.blink",
    files: ["DOGBLINK"],
    data: {
      level1: 4,
      strength: 12,
      dexterity: 17,
      constitution: 15,
      intelligence: 9,
      wisdom: 13,
      charisma: 11,
      ac: 5,
      apr: 1,
      xpv: 270,
      alignment: "NEUTRAL",
      morale: 12,
      general: "MONSTER",
      race: "DOG",
      class: "DOG_WILD",
      gender: "MALE",
      size: "Medium",
    },
  });
  blinkDog.setAdditionalData({
    movement: { value: 12 },
    removeItems: ["P1-6"],
    removeScripts: ["PSPIDER"],
    scriptLocation: "Default",
  });
  blinkDog.addWeapon(createJaws({ diceThrown: 1, diceSize: 6 }));
  const blink = blinkDog.addSpell({
    memorizedCount: 1,
    icon: SPELLS.DimensionDoor,
    options: {
      renew: 1,
    },
    name: "monster.dog.ability.blink",
    headers: [
      {
        type: ItemAbilityTypeEnum.Melee,
        range: 30,
        effects: [
          {
            opcode: EffectTypeEnum.Teleport,
            type: EffectTeleportTypeEnum.Default,
            target: EffectTargetEnum.Self,
          },
          {
            opcode: EffectTypeEnum.Thac0Bonus,
            timing: EffectTimingEnum.InstantLimited,
            duration: 6,
            type: EffectModifierTypeEnum.Increment,
            probability1: 75,
            value: 2,
            target: EffectTargetEnum.Self,
          },
        ],
      },
    ],
    ability: {
      targets: [{ name: "FarthestEnemies", random: true }],
      spell: {
        type: "force",
      },
      actionsAfter: [{ name: "AttackOneRound", params: ["LastSeenBy"] }],
    },
  });
  blinkDog.setBehavior({ abilities: [blink.ability!] });
  blinkDog.validate();

  /**
   * Spectral Hound
   */
  const spectralHound = creatureFactory.create({
    monster: MonsterEnum.SpectralHound,
    family: MonsterFamilyEnum.Dog,
    name: "monster.dog.name.spectralHound",
    files: [
      "BDSHA01C", // Hound Spirit
      "DOGWAWP", // Astral Hound
    ],
    data: {
      level1: 5,
      bonusHp: 0,
      strength: 17,
      dexterity: 15,
      constitution: 14,
      intelligence: 4,
      wisdom: 14,
      charisma: 12,
      ac: -1,
      apr: 1,
      xpv: 975,
      alignment: "CHAOTIC_EVIL",
      morale: 19,
      general: "MONSTER",
      race: "DOG",
      class: "DOG_WAR",
      gender: "MALE",
      size: "Medium",
    },
  });
  spectralHound.setAdditionalData({
    movement: { value: 15 },
    removeItems: ["FIGRING3", "IPSION", "BDSPIRIM", "DOGWAWP", "BDSHA01C"],
    removeScripts: ["WARDOG"],
    scriptLocation: "Default",
  });
  const shiftEffect: BaseEffect = {
    timing: EffectTimingEnum.InstantLimited,
    dispelResistance: EffectDispelResistanceEnum.DispelNotBypassResistance,
    duration: 36,
  };
  spectralHound.addWeapon({
    ...createJaws({ diceThrown: 2, diceSize: 6 }),
    castSpell: {
      spell: {
        name: "monster.dog.ability.astralPlaneShift",
        secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
        headers: [
          {
            type: ItemAbilityTypeEnum.Melee,
            range: 5,
            effects: [
              // roll a saving throw vs. spell. If the saving throw fails, the victim begins to fade, slowly assuming the same translucent appearance as the spectral hound itself.
              // The entire process takes 24 hours. After 12 hours, a fading character cannot hear or speak to any unfaded characters from the victim's point of view, it is the rest of the world that is becoming translucent, not himself or herself).
              // The character's equipment – weapons, armor, spell components, and the like – is unaffected and drops away.
              // Because of their inability to handle objects, faded creatures cannot eat or drink.
              // Mental and energy-based attacks work normally when used against a faded character, but the character is immune to physical attacks.
              // After 12 more hours, the character fades completely from sight and slips into the Astral Plane.
              // Once on the Astral Plane, the victim can handle objects (but isn't likely to find any lying about, waiting to be picked up) and can seek any normal means to exit the plane and return to the Prime Material.
              {
                opcode: EffectTypeEnum.Slow,
                ...shiftEffect,
              },
              {
                opcode: EffectTypeEnum.Translucency,
                amount: 99,
                type: TranslucencyTypeEnum.DrawInstantly,
                ...shiftEffect,
              },
              {
                opcode: EffectTypeEnum.SetColorGlowPulse,
                color: { red: 125, green: 125, blue: 125 },
                location: EffectColorLocationEnum.CharacterColor,
                cycleSpeed: 30,
                ...shiftEffect,
              },
              {
                opcode: EffectTypeEnum.CreatureRGBColorFade,
                color: { red: 90, green: 30, blue: 90 },
                fadeSpeed: 25,
                ...shiftEffect,
              },
            ],
          },
        ],
      },
    },
  });
  spectralHound.setAdjustments([{ files: ["BDSHA01C"], summon: true }]);
  spectralHound.validate();

  return [wild, war, blinkDog, spectralHound];
};
