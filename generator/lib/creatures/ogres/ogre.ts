import { SPELL_STATES } from "../../config/ability-presets";
import { ITEMS, MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import { createConeOfCold } from "../../spells/cone_of_cold";
import creatureFactory from "../../src/factories/creature.factory";
import effectFactory from "../../src/factories/effect.factory";
import { CreatureFamily } from "../../src/model/creature/family";
import {
  AbilityDamageTypeEnum,
  AnimationChangeTypeEnum,
  AttackModifierTypeEnum,
  DisableButtonEnum,
  DisableSpellcastingTypeEnum,
  EffectStatisticModifierEnum,
  EffectTargetEnum,
  EffectTimingEnum,
  EffectVisualEffectLocationEnum,
  ItemAbilityCastingAnimationEnum,
  ItemAbilityFlagEnum,
  ItemAbilityLocationEnum,
  ItemAbilityPrimaryTypeEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  ItemAnimationEnum,
  ItemCategoryEnum,
  ItemFlagEnum,
  PortraitIconEnum,
  ProficiencyTypeEnum,
  RegenerationTypeEnum,
  SpellTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import { AreaProjectileEnum } from "../../src/model/spell-item/projectile";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

enum Ids {
  Fly,
  GaseousForm,
  Naginata,
  Ogre,
  OgreLeader,
  Ogrillon,
  ConeOfCold,
}

export class OgreFamily extends CreatureFamily {
  constructor() {
    super(MonsterFamilyEnum.Ogre);
    this.createConeOfCold();
    this.createFly();
    this.createGaseousForm();
    this.createFists(Ids.Ogre, 1, 10);
    this.createFists(Ids.OgreLeader, 2, 6);
    this.createFists(Ids.Ogrillon, 1, 6);
    this.createNaginata();
    this.addCreature(this.ogre());
    this.addCreature(this.ogrillon());
    this.addCreature(this.halfOgre());
    this.addCreature(this.ogreMage());
    // this.addCreature(this.berserker());
    // this.addCreature(this.shaman());
  }

  /**
   * Ogre
   */
  private ogre() {
    const ogre = creatureFactory.create({
      monster: MonsterEnum.Ogre,
      family: MonsterFamilyEnum.Ogre,
      name: "monster.ogre.name.ogre",
      files: [
        "AC#FP2O1",
        "AC#FP2O2",
        "BDOGRE01",
        "BDOGRE1D",
        "BDOGREF",
        "BDOGREM",
        "BPOGRE01",
        "BSOGRED",
        "OGRE",
        "OGRE02",
        "OGRE03",
        "OGRE04",
        "OGRE05",
        "OGRECO",
        "OGRED",
        "OGRES",
        "OGRESU",
        "OGREUNSH",
        "OGRE_A",
        "OGRE_B",
        "OGRE_C",
        "OGRE_D",
        "OGRE_E",
        "PLYOGRE",
        "WIOGRE01",
        "X3HOGRE",
        "X3HOGRE2",
        "X3HOGRED",
        "BDSOGR1",
        "BDSOGR2",
        "AC#FP2OT", // Thrall
        "AC#FPOG4", // Bagut
        "AC#WRIM1", // Wrimbog
        "ACQ13002", // Ugh
        //"BDCCOGR1", // Ogre Crusader (doesn't seem to be used because no script)
        "GORF", // Gorf
        "HACK", // Hack
        "LARZE", // Larze
        "NTOGREDA", // Daddy
        "NTWELT", // Welt
        "WELT", // Welt
        "OOPAH", // The Amazing Oopah
        "OOPAH2", // The Amazing Oopah
        "SEWERF4", // Ogre Leader
      ],
      data: {
        level1: 4,
        bonusHp: 1,
        strength: 18,
        dexterity: 8,
        constitution: 16,
        intelligence: 8,
        wisdom: 7,
        charisma: 7,
        ac: 5,
        apr: 1,
        xpv: 270,
        alignment: "CHAOTIC_EVIL",
        morale: 12,
        general: "GIANTHUMANOID",
        race: "OGRE",
        class: "OGRE",
        size: "Large",
      },
    });
    ogre.setAdditionalData({
      movement: { value: 9 },
      immunities: ["giant"],
      proficiencies: [
        { type: ProficiencyTypeEnum.PROFICIENCYTWOHANDEDSWORD, value: 2 },
      ],
      removeItems: ["OGRE1", "B1-2", "B3-12", "B2-16", "BLUN07", "SHLD03"],
      removeScripts: ["OGRE"],
    });
    ogre.addExistingItem(this.item(Ids.Ogre));
    ogre.setBehavior({
      restHeal: true,
      usePotions: true,
    });
    ogre.setAttack({
      targetPriorities: [
        {
          // The ogres fight more wisely when led by a half-ogre that concentrates assaults on characters it recognizes as spellcasters and teaming up against skilled fighters.
          targets: ["PCSpellcasters", "PCsPreferringStrong"],
        },
      ],
    });
    ogre.setAdjustments([
      { files: ["OGRESU"], summon: true },
      {
        files: ["X3HOGRE", "X3HOGRE2", "X3HOGRED"],
        additionalData: { scriptLocation: "None" },
      },
      { files: ["OOPAH", "WELT"], data: { class: "INNOCENT" } },
      { files: ["OOPAH", "OOPAH2"], data: { level1: 5 } },
      {
        // leader is a 7 Hit Dice monster with Armor Class 3, Strenth 18/50, XP 650
        // He inflicts 2d6+3 points of damage per attack.
        files: ["SEWERF4", "BDOGREM", "NTOGREDA"],
        data: {
          level1: 7,
          ac: 3,
          exceptionalStrength: 50,
          xpv: 650,
        },
        additionalData: {
          equippedItems: [
            { file: this.item(Ids.OgreLeader).file, slot: "WEAPON1" },
          ],
        },
      },
      {
        // chieftain is a 7+4 Hit Dice monster with Armor Class 2, Strenth 18/100, XP 975
        // He inflicts 2d6+6 points of damage per attack.
        files: [
          "AC#WRIM1",
          "AC#FP2O2",
          "BDSOGR1",
          "BDSOGR2",
          "ACQ13002",
          "GORF",
          "HACK",
          "LARZE",
        ],
        data: {
          level1: 7,
          bonusHp: 4,
          ac: 2,
          exceptionalStrength: 100,
          xpv: 975,
        },
        additionalData: {
          equippedItems: [
            { file: this.item(Ids.OgreLeader).file, slot: "WEAPON1" },
          ],
        },
      },
      {
        files: ["NTOGREDA"],
        data: {
          class: "FIGHTER",
        },
        additionalData: {
          proficiencies: [
            { type: ProficiencyTypeEnum.PROFICIENCYTWOHANDEDSWORD, value: 4 },
          ],
        },
      },
      {
        // will have morning star +1
        files: ["AC#FP2OT", "BDSOGR1", "BDSOGR2"],
        noWeapon: true,
        additionalData: {
          equippedItems: [{ file: "BLUN07", slot: "WEAPON1" }],
          proficiencies: [
            { type: ProficiencyTypeEnum.PROFICIENCYFLAILMORNINGSTAR, value: 2 },
          ],
        },
      },
      {
        files: ["BDSOGR1", "BDSOGR2"],
        data: { class: "FIGHTER" },
        additionalData: {
          proficiencies: [
            { type: ProficiencyTypeEnum.PROFICIENCYFLAILMORNINGSTAR, value: 4 },
          ],
        },
      },
      {
        files: ["GORF", "AC#WRIM1", "HACK", "LARZE"],
        data: {
          level1: 9,
          strength: 19,
          exceptionalStrength: 0,
          morale: 18,
          class: "FIGHTER",
          xpv: 2000,
        },
        additionalData: {
          proficiencies: [
            { type: ProficiencyTypeEnum.PROFICIENCYTWOHANDEDSWORD, value: 5 },
            { type: ProficiencyTypeEnum.PROFICIENCYLONGSWORD, value: 5 },
          ],
        },
      },
      {
        files: ["AC#WRIM1"],
        data: { level1: 10 },
      },
      {
        files: ["HACK"],
        data: { level1: 11 },
      },
      {
        files: ["LARZE"],
        data: { level1: 13 },
      },
    ]);
    return ogre;
  }

  /**
   * Ogrillon
   */
  private ogrillon() {
    const ogrillon = creatureFactory.create({
      monster: MonsterEnum.Ogrillon,
      family: MonsterFamilyEnum.Ogre,
      name: "monster.ogre.name.ogrillon",
      files: [
        "BDKORDEO",
        "GNARL",
        "HAIRTO",
        "OGREGR",
        "OGREGR1",
        "OGREGR2",
        "OGREGR3",
        "OGREGR4",
        "OGREGR_A",
        "OGREGR_B",
        "OGREGR_C",
        "OGREGR_D",
        "OGRELESU",
        "OGREMIRI",
        "SEWERF1",
      ],
      data: {
        level1: 2,
        bonusHp: 4,
        strength: 17,
        dexterity: 9,
        constitution: 14,
        intelligence: 6,
        wisdom: 7,
        charisma: 7,
        ac: 6,
        apr: 2,
        xpv: 175,
        alignment: "CHAOTIC_EVIL",
        morale: 10,
        general: "GIANTHUMANOID",
        race: "OGRE",
        class: "OGRE_OGRILLON",
        size: "Medium",
      },
    });
    ogrillon.setAdditionalData({
      movement: { value: 12 },
      immunities: ["giant"],
      removeItems: ["B1-8", "SW1H01"],
      removeScripts: ["OGRILLON"],
    });
    ogrillon.addExistingItem(this.item(Ids.Ogrillon));
    ogrillon.setBehavior({
      restHeal: true,
      usePotions: true,
    });
    ogrillon.setAttack({
      targetPriorities: [
        {
          targets: ["PCsFighters", "PCsPreferringStrong"],
        },
      ],
    });
    ogrillon.setAdjustments([
      { files: ["OGRELESU"], summon: true, data: { level1: 3 } },
      {
        // veteran with 5+3 Hit Dice
        files: ["GNARL", "HAIRTO"],
        data: {
          level1: 5,
          bonusHp: 3,
          strength: 18,
          exceptionalStrength: 95,
          constitution: 15,
          xpv: 420,
        },
      },
    ]);
    return ogrillon;
  }

  /**
   * Half-Ogre
   */
  private halfOgre() {
    const halfOgre = creatureFactory.create({
      monster: MonsterEnum.HalfOgre,
      family: MonsterFamilyEnum.Ogre,
      name: "monster.ogre.name.halfOgre",
      files: [
        "OGREBJOR",
        "OGREHA",
        "OGREHA1",
        "OGREHA2",
        "OGREHA3",
        "OGREHA4",
        "OGREHA5",
        "OGREHA_A",
        "OGREHA_B",
        "OGREHA_C",
        "OGREHA_D",
        "OGREHA_E",
        "BDOGRE04", // Half-Ogre Veteran
        "ARGHAI", // Arghain
        "L#CHIEN", // Eglarh
        "TAZOK", // Tazok (bandit camp)
        "TAZOK2", // Tazok (finale fight)
        "X#CHOP", // Chop The Lady Ogre
        "X#CRU11", // Cru The Lady Ogre
      ],
      data: {
        level1: 2,
        bonusHp: 6,
        strength: 17,
        dexterity: 10,
        constitution: 14,
        intelligence: 9,
        wisdom: 9,
        charisma: 10,
        ac: 5,
        apr: 1,
        xpv: 175,
        alignment: "CHAOTIC_EVIL",
        morale: 12,
        general: "GIANTHUMANOID",
        race: "OGRE",
        class: "OGRE_HALFOGRE",
        size: "Large",
      },
    });
    halfOgre.setAdditionalData({
      movement: { value: 12 },
      immunities: ["giant"],
      proficiencies: [
        { type: ProficiencyTypeEnum.PROFICIENCYBASTARDSWORD, value: 2 },
        { type: ProficiencyTypeEnum.PROFICIENCYTWOHANDEDSWORD, value: 2 },
      ],
      removeScripts: ["HALFOGRE"],
    });
    halfOgre.setBehavior({
      restHeal: true,
      usePotions: true,
    });
    halfOgre.setAttack({
      targetPriorities: [
        {
          // The ogres fight more wisely when led by a half-ogre that concentrates assaults on characters it recognizes as spellcasters and teaming up against skilled fighters.
          targets: ["PCSpellcasters", "PCsPreferringStrong"],
        },
      ],
    });
    halfOgre.setAdjustments([
      {
        // Veteran with 5+3 Hit Dice.
        files: ["BDOGRE04", "ARGHAI", "X#CHOP", "X#CRU11"],
        data: {
          level1: 5,
          bonusHp: 3,
          strength: 18,
          ac: 3,
          xpv: 520,
        },
      },
      {
        files: ["ARGHAI"],
        data: {
          exceptionalStrength: 100,
        },
      },
      {
        files: ["BDOGRE04"],
        data: {
          exceptionalStrength: 83,
        },
      },
      {
        files: ["X#CHOP", "X#CRU11"],
        data: {
          strength: 19,
        },
      },
      {
        // Level 9 fighter
        files: ["TAZOK", "TAZOK2", "L#CHIEN"],
        data: {
          level1: 9,
          strength: 18,
          ac: 10,
          class: "FIGHTER",
          morale: 20,
          xpv: 4000,
        },
      },
      {
        // Tazok, level 9 berserker
        files: ["TAZOK", "TAZOK2"],
        data: {
          kit: "BERSERKER",
        },
        additionalData: {
          proficiencies: [
            { type: ProficiencyTypeEnum.PROFICIENCYTWOHANDEDSWORD, value: 5 },
          ],
          memorizedSpells: [{ file: SPELLS.BerserkerRage, memorizedCount: 1 }],
        },
      },
      {
        // Tazok, level 11 berserker
        files: ["TAZOK2"],
        data: {
          level1: 11,
        },
        additionalData: {
          immunities: ["fireResistance"],
        },
      },
      {
        // Eglarh, level 9 fighter
        files: ["L#CHIEN"],
        additionalData: {
          immunities: ["fireResistance", "coldResistance", "missileDamage"],
          proficiencies: [
            { type: ProficiencyTypeEnum.PROFICIENCYLONGSWORD, value: 5 },
          ],
        },
      },
    ]);
    return halfOgre;
  }

  /**
   * Ogre-Mage
   */
  private ogreMage() {
    const ogreMage = creatureFactory.create({
      monster: MonsterEnum.OgreMage,
      family: MonsterFamilyEnum.Ogre,
      name: "monster.ogre.name.ogreMage",
      files: [
        "BDOGRE03",
        "BDWAVE16",
        "BPOGMA01",
        "OGREMA",
        "OGREMA02",
        "OGREMA03",
        "OGREMASU",
        "OGREMA_A",
        "OGREMA_B",
        "OGREMA_C",
        "OGREMA_D",
        "OGREMBA",
        "OGRMBA",
        "UBOGMA01",
        "UBOGMA02",
        "NTFOREOG",
        "BDMURS", // Murs
        "BDMURS2", // Murs
        "DROTH", // Droth
        "KAHRK", // Kahrk
        "KROTAN", // Krotan
        "NTKROTAN", // Krotan
        "WIGENTLE", // The Gentleman
        "WIOGMA01", // Yondak Master of Portals
      ],
      data: {
        level1: 5,
        level2: 5,
        bonusHp: 2,
        strength: 18,
        exceptionalStrength: 100,
        dexterity: 10,
        constitution: 17,
        intelligence: 16,
        wisdom: 14,
        charisma: 17,
        ac: 4,
        apr: 1,
        xpv: 650,
        alignment: "LAWFUL_EVIL",
        morale: 14,
        general: "GIANTHUMANOID",
        race: "OGRE",
        class: "OGRE_MAGE",
        kit: "TRUECLASS",
        gender: "MALE",
        size: "Large",
      },
    });
    ogreMage.logging = true;
    ogreMage.setAdditionalData({
      movement: { value: 9, itemFile: this.item(Ids.Naginata).file },
      immunities: ["giant"],
      proficiencies: [
        { type: ProficiencyTypeEnum.PROFICIENCYHALBERD, value: 2 },
      ],
      removeItems: [
        "REGHP1",
        "BDOGRE03",
        "HELMNOAN",
        "SW1H43",
        "SW1H01",
        "SW1H20",
        "COMPS01",
        "COMPS02",
        "OGREMASU",
        "BLUN15",
      ],
      removeScripts: ["BDOGRE03", "OGREMASU"],
      memorizedSpells: [
        { file: SPELLS.Invisibility, memorizedCount: 1 },
        { file: SPELLS.Darkness15Radius, memorizedCount: 1 },
        { file: SPELLS.CharmPerson, memorizedCount: 1 },
        { file: SPELLS.Sleep, memorizedCount: 1 },
        { file: this.spell(Ids.ConeOfCold).file, memorizedCount: 1 },
        { file: this.spell(Ids.Fly).file, memorizedCount: 1 },
        { file: this.spell(Ids.GaseousForm).file, memorizedCount: 1 },
      ],
    });
    ogreMage.addTrait({
      effects: [
        {
          opcode: EffectTypeEnum.Regeneration,
          type: RegenerationTypeEnum.OneHPperAmountSeconds,
          amount: 6,
        },
      ],
    });
    ogreMage.addExistingItem(this.item(Ids.Naginata));
    ogreMage.setBehavior({
      restHeal: true,
      usePotions: true,
      abilities: [
        {
          preset: SPELLS.Invisibility,
          spell: {
            type: "noDec",
          },
          timer: {
            name: "invisible",
            value: 12,
          },
        },
        this.ability(Ids.Fly),
        {
          preset: SPELLS.Domination,
        },
        {
          preset: SPELLS.DireCharm,
        },
        {
          preset: SPELLS.CharmPerson,
        },
        {
          preset: SPELLS.PowerWordSleep,
        },
        {
          preset: SPELLS.Sleep,
        },
        this.ability(Ids.ConeOfCold),
        {
          preset: SPELLS.Darkness15Radius,
          spell: {
            type: "noDec",
          },
          timer: { name: "darkness", value: 60 },
        },
      ],
    });
    ogreMage.setAttack({
      targetPriorities: [
        {
          // The ogres fight more wisely when led by a half-ogre that concentrates assaults on characters it recognizes as spellcasters and teaming up against skilled fighters.
          targets: ["PCSpellcasters", "PCsPreferringStrong"],
        },
      ],
    });
    ogreMage.setAdjustments([
      {
        files: ["OGREMASU"],
        summon: true,
      },
      {
        files: ["BDWAVE16", "WIOGMA01", "WIGENTLE", "DROTH"],
        data: { level1: 7, level2: 7, xpv: 1400, class: "FIGHTER_MAGE" },
        additionalData: {
          scriptLocation: "General",
          proficiencies: [
            { type: ProficiencyTypeEnum.PROFICIENCYHALBERD, value: 4 },
          ],
          memorizedSpells: [
            { file: SPELLS.DireCharm, memorizedCount: 1 },
            { file: SPELLS.PowerWordSleep, memorizedCount: 2 },
            { file: SPELLS.CharmPerson, memorizedCount: 1 },
            { file: SPELLS.Sleep, memorizedCount: 1 },
          ],
        },
      },
      {
        files: ["BDMURS", "BDMURS2"],
        data: { level1: 9, level2: 9, xpv: 2000, class: "FIGHTER_MAGE" },
        additionalData: {
          proficiencies: [
            { type: ProficiencyTypeEnum.PROFICIENCYHALBERD, value: 5 },
          ],
          memorizedSpells: [
            { file: this.spell(Ids.ConeOfCold).file, memorizedCount: 1 },
            { file: SPELLS.DireCharm, memorizedCount: 2 },
            { file: SPELLS.PowerWordSleep, memorizedCount: 2 },
            { file: SPELLS.CharmPerson, memorizedCount: 2 },
            { file: SPELLS.Sleep, memorizedCount: 2 },
          ],
        },
      },
      {
        files: ["KROTAN", "NTKROTAN", "KAHRK"],
        data: {
          level1: 12,
          level2: 12,
          strength: 19,
          class: "FIGHTER_MAGE",
          xpv: 3500,
        },
        additionalData: {
          proficiencies: [
            { type: ProficiencyTypeEnum.PROFICIENCYHALBERD, value: 5 },
          ],
          memorizedSpells: [
            { file: SPELLS.Domination, memorizedCount: 1 },
            { file: this.spell(Ids.ConeOfCold).file, memorizedCount: 2 },
            { file: SPELLS.DireCharm, memorizedCount: 4 },
            { file: SPELLS.PowerWordSleep, memorizedCount: 4 },
            { file: SPELLS.CharmPerson, memorizedCount: 3 },
            { file: SPELLS.Sleep, memorizedCount: 3 },
          ],
        },
      },
      {
        files: ["KAHRK"],
        noWeapon: true,
        additionalData: {
          proficiencies: [
            { type: ProficiencyTypeEnum.PROFICIENCYKATANA, value: 5 },
          ],
        },
      },
      {
        files: ["KROTAN", "NTKROTAN"],
        data: { level1: 15, level2: 15, class: "FIGHTER_MAGE", xpv: 4000 },
      },
    ]);
    return ogreMage;
  }

  /**
   * Ogre Berserker
   */
  private berserker() {
    const berserker = creatureFactory.create({
      monster: MonsterEnum.OgreBerserker,
      family: MonsterFamilyEnum.Ogre,
      name: "monster.ogre.name.ogre",
      files: [],
      data: {
        level1: 4,
        bonusHp: 1,
        strength: 18,
        dexterity: 8,
        constitution: 16,
        intelligence: 8,
        wisdom: 7,
        charisma: 7,
        ac: 5,
        apr: 1,
        xpv: 270,
        alignment: "CHAOTIC_EVIL",
        morale: 12,
        general: "GIANTHUMANOID",
        race: "OGRE",
        class: "OGRE",
        size: "Large",
      },
    });
    berserker.setAdditionalData({
      movement: { value: 9 },
      immunities: ["giant"],
      proficiencies: [
        { type: ProficiencyTypeEnum.PROFICIENCYTWOHANDEDSWORD, value: 2 },
      ],
      removeItems: ["OGRE1", "B1-2", "B3-12", "B2-16", "BLUN07", "SHLD03"],
      removeScripts: ["OGRE"],
    });
    berserker.addExistingItem(this.item(Ids.Ogre));
    berserker.setBehavior({
      restHeal: true,
      usePotions: true,
    });
    berserker.setAttack({
      targetPriorities: [
        {
          // The ogres fight more wisely when led by a half-ogre that concentrates assaults on characters it recognizes as spellcasters and teaming up against skilled fighters.
          targets: ["PCSpellcasters", "PCsPreferringStrong"],
        },
      ],
    });
    berserker.setAdjustments([
      //
    ]);
    return berserker;
  }

  /**
   * Ogre Shaman
   */
  private shaman() {
    const shaman = creatureFactory.create({
      monster: MonsterEnum.OgreShaman,
      family: MonsterFamilyEnum.Ogre,
      name: "monster.ogre.name.ogre",
      files: [],
      data: {
        level1: 4,
        bonusHp: 1,
        strength: 18,
        dexterity: 8,
        constitution: 16,
        intelligence: 8,
        wisdom: 7,
        charisma: 7,
        ac: 5,
        apr: 1,
        xpv: 270,
        alignment: "CHAOTIC_EVIL",
        morale: 12,
        general: "GIANTHUMANOID",
        race: "OGRE",
        class: "OGRE",
        size: "Large",
      },
    });
    shaman.setAdditionalData({
      movement: { value: 9 },
      immunities: ["giant"],
      proficiencies: [
        { type: ProficiencyTypeEnum.PROFICIENCYTWOHANDEDSWORD, value: 2 },
      ],
      removeItems: ["OGRE1", "B1-2", "B3-12", "B2-16", "BLUN07", "SHLD03"],
      removeScripts: ["OGRE"],
    });
    shaman.addExistingItem(this.item(Ids.Ogre));
    shaman.setBehavior({
      restHeal: true,
      usePotions: true,
    });
    shaman.setAttack({
      targetPriorities: [
        {
          // The ogres fight more wisely when led by a half-ogre that concentrates assaults on characters it recognizes as spellcasters and teaming up against skilled fighters.
          targets: ["PCSpellcasters", "PCsPreferringStrong"],
        },
      ],
    });
    shaman.setAdjustments([
      //
    ]);
    return shaman;
  }

  /**
   * Ogre Fists
   */
  createFists(id: number, diceThrown: number, diceSize: number) {
    return this.addWeapon({
      weapon: {
        id,
        stringRef: "monster.ogre.weapon.fists",
        icon: MonsterItemIconEnum.Fist,
        equippedSlot: ["WEAPON1"],
        header: {
          type: ItemAbilityTypeEnum.Melee,
          diceThrown,
          diceSize,
          damageType: AbilityDamageTypeEnum.Crushing,
          speed: 3,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
        },
      },
    });
  }

  /**
   * Naginata
   */
  createNaginata() {
    return this.addWeapon({
      weapon: {
        id: Ids.Naginata,
        stringRef: "monster.ogre.weapon.naginata.name",
        description: "monster.ogre.weapon.naginata.description",
        equippedSlot: ["WEAPON1"],
        flags: [ItemFlagEnum.Displayable, ItemFlagEnum.TwoHanded],
        animation: ItemAnimationEnum.LongSword,
        category: ItemCategoryEnum.Halberds,
        icon: "ISW1H44",
        proficiency: ProficiencyTypeEnum.PROFICIENCYHALBERD,
        header: {
          type: ItemAbilityTypeEnum.Melee,
          animationSwing: { backhand: 50, overhand: 50, thrust: 0 },
          range: 2,
          diceThrown: 1,
          diceSize: 12,
          damageType: AbilityDamageTypeEnum.Slashing,
          speed: 8,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
        },
      },
    });
  }

  /**
   * Cone of cold
   */
  private createConeOfCold() {
    return this.addSpell(
      createConeOfCold({
        id: Ids.ConeOfCold,
        description: "monster.ogre.ability.coneOfCold",
        damage: {
          diceThrown: 8,
          diceSize: 8,
          amount: 0,
        },
        projectile: {
          copyFromFile: "CONECOLD",
          name: "Ogre-Mage Cone of Cold",
          areaEffectInfo: {
            areaProjectileFlags: [AreaProjectileEnum.Coneshaped], // FIXME: "AffectOnlyEnemies" to prevent them for killing their allies ?
            areaOfEffect: 620,
            triggerRadius: 620,
            coneWidth: 60,
          },
        },
      })
    );
  }

  /**
   * Fly
   */
  private createFly() {
    const flyDuration = 72;
    return this.addSpell({
      id: Ids.Fly,
      name: "monster.ogre.fly.name",
      description: "monster.ogre.fly.description",
      icon: SPELLS.Haste,
      castingSound: "CAS_M08",
      spellType: SpellTypeEnum.Wizard,
      castingAnimation: ItemAbilityCastingAnimationEnum.Alteration,
      primaryType: ItemAbilityPrimaryTypeEnum.Transmuter,
      secondaryType: ItemAbilitySecondaryTypeEnum.NonCombat,
      spellLevel: 3,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Spell,
          target: ItemAbilityTargetEnum.Caster,
          speed: 3,
          effects: [
            {
              ...effectFactory.naturalMovementSpeed(18),
              timing: EffectTimingEnum.InstantLimited,
              duration: flyDuration,
            },
            {
              opcode: EffectTypeEnum.CreateItemInSlot,
              slot: "SLOT_BOOTS",
              resource: ITEMS.Hover,
              timing: EffectTimingEnum.InstantLimited,
              duration: flyDuration,
            },
            {
              opcode: EffectTypeEnum.SetExtendedSpellState,
              state: SPELL_STATES.flying,
              timing: EffectTimingEnum.InstantLimited,
              duration: flyDuration,
            },
            {
              opcode: EffectTypeEnum.DisplayPortraitIcon,
              icon: PortraitIconEnum.Haste,
              timing: EffectTimingEnum.InstantLimited,
              duration: flyDuration,
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "EFF_M28",
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "EFF_M29",
              timing: EffectTimingEnum.DelayPermanent,
              duration: flyDuration,
            },
          ],
        },
      ],
      ability: {
        spell: {
          type: "noDec",
          excludeSpellStates: [SPELL_STATES.flying],
          probability: 90,
          selfTarget: true,
        },
        triggers: [
          { name: "Detect", params: ["NearestEnemyOf"] },
          { name: "StateCheck", params: ["Myself", "STATE_INVISIBLE"] },
        ],
      },
    });
  }

  /**
   * Gaseous Form
   */
  private createGaseousForm() {
    const gaseousFormDuration = 12;
    this.createItemGaseousForm();
    return this.addSpell({
      name: "monster.ogre.gaseousForm.name",
      description: "monster.ogre.gaseousForm.description",
      id: Ids.GaseousForm,
      icon: SPELLS.PolymorphSelf,
      castingSound: "CAS_M08",
      spellType: SpellTypeEnum.Wizard,
      castingAnimation: ItemAbilityCastingAnimationEnum.Alteration,
      primaryType: ItemAbilityPrimaryTypeEnum.Transmuter,
      secondaryType: ItemAbilitySecondaryTypeEnum.NonCombat,
      spellLevel: 4,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Spell,
          target: ItemAbilityTargetEnum.Caster,
          speed: 4,
          effects: [
            {
              opcode: EffectTypeEnum.CreateWeapon,
              amount: 1,
              resource: this.item(Ids.GaseousForm).file,
              target: EffectTargetEnum.Self,
              timing: EffectTimingEnum.InstantLimited,
              duration: gaseousFormDuration,
            },
            {
              opcode: EffectTypeEnum.PlayVisualEffect,
              target: EffectTargetEnum.Self,
              playWhere: EffectVisualEffectLocationEnum.OverTargetUnattached,
              resource: "SPDISPM3",
              timing: EffectTimingEnum.InstantLimited,
              duration: 3,
            },
            {
              opcode: EffectTypeEnum.PlayVisualEffect,
              target: EffectTargetEnum.Self,
              playWhere: EffectVisualEffectLocationEnum.OverTargetUnattached,
              resource: "SPDISPM3",
              timing: EffectTimingEnum.DelayPermanent,
              duration: gaseousFormDuration,
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "MSTCHNG",
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "MSTCHNG",
              timing: EffectTimingEnum.DelayPermanent,
              duration: gaseousFormDuration,
            },
          ],
        },
      ],
      ability: {
        spell: {
          probability: 80,
        },
        triggers: [
          { name: "Detect", params: ["NearestEnemyOf"] },
          {
            name: "HaveSpellRES",
            params: [this.spell(Ids.ConeOfCold).file],
            negation: true,
          },
          { name: "HaveSpellRES", params: [SPELLS.Sleep], negation: true },
          {
            name: "HaveSpellRES",
            params: [SPELLS.CharmPerson],
            negation: true,
          },
          { name: "HPPercentLT", params: ["Myself", 25] },
        ],
      },
    });
  }
  private createItemGaseousForm() {
    this.addItem({
      id: Ids.GaseousForm,
      stringRef: "monster.ogre.gaseousForm.name",
      description: "monster.ogre.gaseousForm.description",
      immunities: ["poison", "cold", "magicDamage", "physicalDamage"],
      flags: [ItemFlagEnum.Displayable],
      header: {
        type: ItemAbilityTypeEnum.Melee,
      },
      effects: [
        {
          opcode: EffectTypeEnum.DisplayPortraitIcon,
          icon: PortraitIconEnum.Invulnerable,
        },
        {
          opcode: EffectTypeEnum.FireResistanceModifier,
          value: 100,
          type: EffectStatisticModifierEnum.Set,
        },
        { opcode: EffectTypeEnum.NoCollisionDetection, passWalls: true },
        { opcode: EffectTypeEnum.ModifyCollisionBehavior },
        {
          ...effectFactory.naturalMovementSpeed(3),
        },
        {
          opcode: EffectTypeEnum.ModifyAttacksPerRound,
          type: AttackModifierTypeEnum.Final,
          value: 0,
        },
        {
          opcode: EffectTypeEnum.DisableSpellcasting,
          type: DisableSpellcastingTypeEnum.Wizard,
        },
        {
          opcode: EffectTypeEnum.DisableButton,
          button: DisableButtonEnum.SpellSelect,
        },
        {
          opcode: EffectTypeEnum.AnimationChange,
          animationId: "BLOB_MIST_CREATURE",
          animationType: AnimationChangeTypeEnum.TemporaryChange,
        },
        {
          opcode: EffectTypeEnum.SetExtendedSpellState,
          state: SPELL_STATES.gaseousForm,
        },
      ],
    });
  }
}

export const createOgres = () => new OgreFamily();
