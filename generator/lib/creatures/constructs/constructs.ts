import { SPELLS } from "../../config/spell-names";
import creatureFactory from "../../src/factories/creature.factory";
import {
  AbilityDamageTypeEnum,
  ColorEnum,
  EffectColorLocationEnum,
  EffectDamageTypeEnum,
  EffectTargetEnum,
  EffectTimingEnum,
  ItemAbilityFlagEnum,
  ItemAbilityTypeEnum,
  ItemAnimationEnum,
  ItemCategoryEnum,
  ItemFlagEnum,
  ProficiencyTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";
import { CreatureFamily } from "../../src/model/creature/family";

enum Ids {
  Helmet,
  Armor,
  FlamingSword,
  Longsword,
  HelmedHorror,
  BattleHorror,
}

export class ConstructFamily extends CreatureFamily {
  constructor() {
    super(MonsterFamilyEnum.Construct);
    this.createFlamingSword();
    this.createLongsword();
    this.createArmor();
    this.createHelmet();
    this.addCreature(this.helmedHorror());
    this.addCreature(this.battleHorror());
    this.addCreature(this.doomSayer());
    this.addCreature(this.doomGuard());
  }

  /**
   * Helmed Horror
   */
  private helmedHorror() {
    const helmedHorror = creatureFactory.create({
      monster: MonsterEnum.HelmedHorror,
      family: MonsterFamilyEnum.Construct,
      name: "monster.construct.name.helmedHorror",
      id: Ids.HelmedHorror,
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
    helmedHorror.addExistingItem(this.item(Ids.FlamingSword));
    helmedHorror.addExistingItem(this.item(Ids.Armor));
    helmedHorror.addExistingItem(this.item(Ids.Helmet));
    helmedHorror.setBehavior({
      restHeal: true,
    });
    return helmedHorror;
  }

  /**
   * Battle Horror
   */
  private battleHorror() {
    const battleHorror = creatureFactory.createFrom({
      name: "monster.construct.name.battleHorror",
      monster: MonsterEnum.BattleHorror,
      id: Ids.BattleHorror,
      from: this.creature(Ids.HelmedHorror),
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
    return battleHorror;
  }

  /**
   * Doom Sayer
   */
  private doomSayer() {
    const doomSayer = creatureFactory.createFrom({
      name: "monster.construct.name.doomSayer",
      monster: MonsterEnum.DoomSayer,
      from: this.creature(Ids.BattleHorror),
      files: ["DOOMSA"],
    });
    doomSayer.setAdditionalData({
      movement: { value: 12 },
      immunities: ["incorporeal"],
    });
    doomSayer.setBehavior({ dialog: ["DOOMSAYER"] });
    return doomSayer;
  }

  /**
   * Doom Guard
   */
  private doomGuard() {
    const doomGuard = creatureFactory.create({
      monster: MonsterEnum.DoomGuard,
      family: MonsterFamilyEnum.Construct,
      name: "monster.construct.name.doomGuard",
      files: ["DOOMGU", "DOOMDUR"],
      data: {
        level1: 5,
        strength: 20,
        dexterity: 10,
        constitution: 9,
        intelligence: 7,
        wisdom: 11,
        charisma: 1,
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
      },
    });
    doomGuard.setAdditionalData({
      movement: { value: 12 },
      immunities: ["construct"],
      removeItems: ["HELM13", "PLAT07", "SW1H11", "RING95"],
      proficiencies: [
        { type: ProficiencyTypeEnum.PROFICIENCYLONGSWORD, value: 2 },
      ],
    });
    doomGuard.addTrait({
      immunities: ["mindSpells", "fireResistance", "coldResistance"],
    });
    doomGuard.addExistingItem(this.item(Ids.Longsword));
    doomGuard.addExistingItem(this.item(Ids.Armor));
    doomGuard.addExistingItem(this.item(Ids.Helmet));
    doomGuard.setBehavior({
      restHeal: true,
    });
    doomGuard.setAdjustments([
      {
        files: ["DOOMDUR"],
        data: { level1: 8 },
        additionalData: {
          proficiencies: [
            { type: ProficiencyTypeEnum.PROFICIENCYLONGSWORD, value: 3 },
          ],
        },
      },
    ]);
    return doomGuard;
  }

  createArmor() {
    this.addItem({
      id: Ids.Armor,
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
    });
  }

  createHelmet() {
    this.addItem({
      id: Ids.Helmet,
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
    });
  }

  createFlamingSword() {
    this.addWeapon({
      weapon: {
        stringRef: "monster.construct.weapon.flamingSword",
        id: Ids.FlamingSword,
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
      },
    });
  }

  createLongsword() {
    this.addWeapon({
      weapon: {
        stringRef: "monster.construct.weapon.longSword",
        id: Ids.Longsword,
        equippedSlot: ["WEAPON1"],
        flags: [ItemFlagEnum.Magical],
        animation: ItemAnimationEnum.LongSword,
        icon: "ISW1H04",
        category: ItemCategoryEnum.LargeSwords,
        proficiency: ProficiencyTypeEnum.PROFICIENCYLONGSWORD,
        enchantment: 1,
        header: {
          type: ItemAbilityTypeEnum.Melee,
          animationSwing: { backhand: 50, overhand: 50, thrust: 0 },
          range: 1,
          diceThrown: 1,
          diceSize: 8,
          damageType: AbilityDamageTypeEnum.Slashing,
          speed: 5,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
        },
        effects: [
          {
            opcode: EffectTypeEnum.SetColor,
            color: ColorEnum.Silver,
            location: EffectColorLocationEnum.WeaponBlueHeadBladeMinor,
            target: EffectTargetEnum.Self,
            timing: EffectTimingEnum.InstantWhileEquipped,
          },
          {
            opcode: EffectTypeEnum.SetColor,
            color: ColorEnum.Rhubarb,
            location: EffectColorLocationEnum.WeaponRedGripStaffMinor,
            target: EffectTargetEnum.Self,
            timing: EffectTimingEnum.InstantWhileEquipped,
          },
          {
            opcode: EffectTypeEnum.SetColor,
            color: ColorEnum.DarkSilver,
            location: EffectColorLocationEnum.WeaponGreyHeadBladeStaffMajor,
            target: EffectTargetEnum.Self,
            timing: EffectTimingEnum.InstantWhileEquipped,
          },
        ],
      },
    });
  }
}

export const createConstructs = () => new ConstructFamily();
