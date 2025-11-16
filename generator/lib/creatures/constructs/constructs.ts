import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import creatureFactory from "../../src/factories/creature.factory";
import {
  AbilityDamageTypeEnum,
  CastSpellOnConditionTargetEnum,
  ColorEnum,
  EffectBonusToEnum,
  EffectColorLocationEnum,
  EffectDamageTypeEnum,
  EffectDispelResistanceEnum,
  EffectStatisticModifierEnum,
  EffectTargetEnum,
  EffectTimingEnum,
  InvisibilityTypeEnum,
  ItemAbilityFlagEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTypeEnum,
  ItemAnimationEnum,
  ItemCategoryEnum,
  ItemFlagEnum,
  ProficiencyTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import {
  PartialItem,
  PartialWeapon,
  WeaponCastSpell,
} from "../../src/model/spell-item/spell-item";
import creatureService from "../../src/services/creature.service";
import { hunterCustomCode } from "../common";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

const flamingSword: PartialWeapon = {
  stringRef: "monster.construct.weapon.flamingSword",
  equippedSlot: ["WEAPON1"],
  enchantment: 1,
  flags: [ItemFlagEnum.TwoHanded, ItemFlagEnum.Magical],
  animation: ItemAnimationEnum.TwoHandedSword,
  category: ItemCategoryEnum.Greatswords,
  proficiency: ProficiencyTypeEnum.PROFICIENCYTWOHANDEDSWORD,
  header: {
    type: ItemAbilityTypeEnum.Melee,
    icon: "IFLAMS01",
    animationSwing: { backhand: 40, overhand: 40, thrust: 20 },
    range: 2,
    diceThrown: 2,
    diceSize: 6,
    damageType: AbilityDamageTypeEnum.Slashing,
    speed: 10,
    abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
    effects: [
      {
        opcode: EffectTypeEnum.Damage,
        diceSize: 6,
        diceThrown: 1,
        type: EffectDamageTypeEnum.Fire,
      },
    ],
  },
  effects: [
    {
      opcode: EffectTypeEnum.SetColor,
      color: ColorEnum.ShinyGold,
      location: EffectColorLocationEnum.WeaponBlueHeadBladeMinor,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantWhileEquipped,
    },
    {
      opcode: EffectTypeEnum.SetColor,
      color: ColorEnum.ShinyGold,
      location: EffectColorLocationEnum.WeaponRedGripStaffMinor,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantWhileEquipped,
    },
    {
      opcode: EffectTypeEnum.SetColor,
      color: ColorEnum.LightCarnationPink,
      location: EffectColorLocationEnum.WeaponGreyHeadBladeStaffMajor,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantWhileEquipped,
    },
    {
      opcode: EffectTypeEnum.SetColorGlowSolid,
      color: { red: 64, green: 0, blue: 0 },
      location: EffectColorLocationEnum.WeaponGreyHeadBladeStaffMajor,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantWhileEquipped,
      duration: 3,
    },
    {
      opcode: EffectTypeEnum.SetColorGlowSolid,
      color: { red: 64, green: 0, blue: 0 },
      location: EffectColorLocationEnum.WeaponBlueHeadBladeMinor,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantWhileEquipped,
      duration: 3,
    },
    {
      opcode: EffectTypeEnum.SetColorGlowSolid,
      color: { red: 0, green: 0, blue: 0 },
      location: EffectColorLocationEnum.WeaponRedGripStaffMinor,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantWhileEquipped,
      duration: 3,
    },
  ],
};

const armor: PartialItem = {
  stringRef: "monster.construct.item.plateMail",
  equippedSlot: ["ARMOR"],
  animation: ItemAnimationEnum.PlateMail,
  icon: "IPLAT01",
  category: ItemCategoryEnum.ArmorSlot,
  effects: [
    {
      opcode: EffectTypeEnum.SetColor,
      color: ColorEnum.LeafGreen,
      location: EffectColorLocationEnum.ArmorBlueArmorTrimming,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantWhileEquipped,
    },
    {
      opcode: EffectTypeEnum.SetColor,
      color: ColorEnum.RedTintedBlack,
      location: EffectColorLocationEnum.ArmorRedStrapLeather,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantWhileEquipped,
    },
    {
      opcode: EffectTypeEnum.SetColor,
      color: ColorEnum.DarkPoopyBrown,
      location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantWhileEquipped,
    },
  ],
};

const helmet: PartialItem = {
  stringRef: "monster.construct.item.helmet",
  equippedSlot: ["HELMET"],
  animation: ItemAnimationEnum.HelmetFeatherSideburns,
  category: ItemCategoryEnum.Headgear,
  icon: "ihelm10",
  effects: [
    {
      opcode: EffectTypeEnum.SetColor,
      color: ColorEnum.Silver,
      location: EffectColorLocationEnum.HelmetBlueExterior,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantWhileEquipped,
    },
    {
      opcode: EffectTypeEnum.SetColor,
      color: ColorEnum.Silver,
      location: EffectColorLocationEnum.HelmetRedFace,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantWhileEquipped,
    },
    {
      opcode: EffectTypeEnum.SetColor,
      color: ColorEnum.Silver,
      location: EffectColorLocationEnum.HelmetGreyWings,
      target: EffectTargetEnum.Self,
      timing: EffectTimingEnum.InstantWhileEquipped,
    },
  ],
};

export const createConstructs = () => {
  /**
   * Helmed Horror
   */
  const helmedHorror = creatureFactory.create({
    monster: MonsterEnum.HelmedHorror,
    family: MonsterFamilyEnum.Construct,
    name: "monster.construct.name.helmedHorror",
    files: ["HELMHO", "GLOWTEST"],
    data: {
      level1: 4,
      bonusHp: 10,
      strength: 18,
      dexterity: 13,
      constitution: 9,
      intelligence: 14,
      wisdom: 10,
      charisma: 10,
      ac: 2,
      apr: 1,
      xpv: 2000,
      alignment: "NEUTRAL",
      morale: 20,
      general: "MONSTER",
      race: "GOLEM",
      class: "FIGHTER",
      gender: "NIETHER",
      size: "Medium",
      animation: "FIGHTER_MALE_HUMAN",
      hairColor: 63,
      armorColor: 63,
      skinColor: 63,
      majorColor: 63,
      metalColor: 63,
      minorColor: 63,
      leatherColor: 63,
    },
  });
  helmedHorror.setAdditionalData({
    movement: { value: 12 },
    immunities: ["construct"],
    removeItems: [
      "HELM08",
      "SHLD18",
      "RING95",
      "BLUN08",
      "FBLADE",
      "PLAT07",
      "HELM13",
    ],
    proficiencies: [
      { type: ProficiencyTypeEnum.PROFICIENCYTWOHANDEDSWORD, value: 2 },
    ],
  });
  helmedHorror.addTrait({
    immunities: [
      "seeInvisible",
      "fireballSpell",
      "lightningBoltSpell",
      "flameArrowSpell",
      "magicMissile",
      "hover",
    ],
  });
  helmedHorror.addWeapon({ weapon: flamingSword });
  helmedHorror.addItem(armor);
  helmedHorror.addItem(helmet);
  helmedHorror.setBehavior({
    restHeal: true,
  });
  helmedHorror.validate();

  /**
   * Battle Horror
   */
  const battleHorror = creatureFactory.createFrom({
    name: "monster.construct.name.battleHorror",
    from: helmedHorror,
    files: ["BATTHO", "dw#davho"],
  });
  battleHorror.setData({
    level1: 8,
    level2: 3,
    bonusHp: 11,
    strength: 20,
    class: "FIGHTER_MAGE",
    alignment: "LAWFUL_EVIL",
    xpv: 4000,
  });
  battleHorror.setAdditionalData({
    movement: { value: 12 },
    memorizedSpells: [
      { file: SPELLS.MagicMissiles, memorizedCount: 1 },
      { file: SPELLS.DimensionDoor, memorizedCount: 1 },
    ],
  });
  battleHorror.setBehavior({
    abilities: [
      {
        preset: SPELLS.MagicMissiles,
        spell: {
          type: "noDec",
        },
        triggers: [
          { name: "Range", params: ["NearestEnemyOf", 10], negation: true },
        ],
        requireVocal: false,
        timer: { name: "MagicMissiles", value: 18 },
      },
    ],
    customCodes: [
      {
        location: "trackTargets",
        type: "insertBefore",
        abilities: [
          {
            preset: SPELLS.DimensionDoor,
            range: 180,
            requireVocal: false,
          },
        ],
      },
    ],
  });
  battleHorror.validate();

  /**
   * Domm Guard
   */
  const doomGuard = creatureFactory.create({
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
  doomGuard.setAdditionalData({
    movement: { value: 12 },
    removeItems: ["CATLIO"],
  });
  //   doomGuard.validate();

  /**
   * Dwarven Doom Guard
   */
  const dwarvenDoomGuard = creatureFactory.create({
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
  dwarvenDoomGuard.setAdditionalData({
    movement: { value: 12 },
    removeItems: ["P1-6"],
    removeScripts: [],
  });
  //   dwarvenDoomGuard.validate();

  /**
   * Doom Sayer
   */
  const doomSayer = creatureFactory.create({
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
  doomSayer.setAdditionalData({
    movement: { value: 15 },
    removeItems: ["BDHELCAT", "RINGDEMN", "IPSION"],
    removeScripts: ["BDHELCAT"],
    deleteEffectOpcodes: [
      EffectTypeEnum.Blur,
      EffectTypeEnum.ProtectionFromBackstab,
    ],
  });
  doomSayer.addTrait({
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
  //   doomSayer.validate();
  // doomGuard, dwarvenDoomGuard, doomSayer
  return [helmedHorror, battleHorror];
};
