import { ATWEAKS_CREATURES } from "../../config/creatures";
import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import creatureFactory from "../../src/factories/creature.factory";
import effectFactory from "../../src/factories/effect.factory";
import { Creature } from "../../src/model/creature/creature";
import { CreatureFamily } from "../../src/model/creature/family";
import { ItemSlot } from "../../src/model/creature/item";
import { ImmunityName } from "../../src/model/final/immunity";
import {
  BaseEffect,
  DamageEffect,
  Effect,
} from "../../src/model/spell-item/effect";
import {
  AbilityDamageTypeEnum,
  EffectColorLocationEnum,
  EffectDamageTypeEnum,
  EffectIDSFileEnum,
  EffectStatisticModifierEnum,
  EffectTimingEnum,
  InvisibilityTypeEnum,
  ItemAbilityFlagEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTypeEnum,
  LightingEffectEnum,
  LightingEffectTargetEnum,
  PortraitIconEnum,
  SaveTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import {
  SpellProtection,
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../../src/model/spell-item/spell-protection";
import poisonService from "../../src/services/effects/poison.service";
import { TranslationKey } from "../../translations/i18n";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

enum Ids {
  WebTangle,
  InvisibleWebTangle,
}

class SpiderFamily extends CreatureFamily {
  constructor() {
    super(MonsterFamilyEnum.Spider);
    this.addCreature(this.gargantuan());
    this.addCreature(this.ghostwalk());
    this.addCreature(this.giant());
    // this.addCreature(this.hairy());
    // this.addCreature(this.huge());
    // this.addCreature(this.hunting());
    // this.addCreature(this.phase());
    // this.addCreature(this.sword());
    // this.addCreature(this.vortex());
    // this.addCreature(this.wraith());
  }

  /**
   * Gargantuan
   */
  private gargantuan() {
    const gargantuan = creatureFactory.create({
      monster: MonsterEnum.GargantuanSpider,
      family: MonsterFamilyEnum.Spider,
      name: "monster.spider.name.gargantuan",
      files: [
        "BDSPIDGA", // Gargantuan Spider
      ],
      logging: true,
      data: {
        level1: 8,
        bonusHp: 8,
        thac0: 11,
        strength: 18,
        dexterity: 15,
        constitution: 17,
        intelligence: 7,
        wisdom: 11,
        charisma: 4,
        ac: 4,
        apr: 1,
        xpv: 3000,
        alignment: "CHAOTIC_EVIL",
        morale: 14,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_GIANT",
        gender: "NIETHER",
        size: "Gargantuan",
      },
    });
    this.createWeb({
      id: Ids.WebTangle,
      duration: 18,
      // saveBonus: -2,
      description: "monster.spider.ability.webTangle.standardDesc",
    });
    gargantuan.setAdditionalData({
      movement: { value: 9 }, // Web 12
      immunities: ["spider"],
      removeItems: ["BDSPIDGA", "ANTIWEB"],
      removeScripts: ["BDSPIDGA"],
      memorizedSpells: [
        { file: this.spell(Ids.WebTangle).file, memorizedCount: 1 },
      ],
    });
    const poison: BaseEffect = {
      saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
      saveBonus: -2,
    };
    this.createJaws({
      creature: gargantuan,
      diceThrown: 2,
      diceSize: 6,
      effects: [
        {
          opcode: EffectTypeEnum.Sleep,
          wakeOnDamage: false,
          duration: 300,
          ...poison,
        },
        {
          opcode: EffectTypeEnum.LightingEffects,
          lightingTarget: LightingEffectTargetEnum.SpellTarget,
          effect: LightingEffectEnum.InvocationEarth,
          ...poison,
        },
        {
          opcode: EffectTypeEnum.CharacterColorPulse,
          color: { red: 119, green: 0, blue: 0 },
          location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
          cycleSpeed: 20,
          ...poison,
        },
      ],
    });
    gargantuan.setBehavior({
      abilities: [this.ability(Ids.WebTangle)],
    });
    return gargantuan;
  }

  /**
   * Ghostwalk
   */
  private ghostwalk() {
    const ghostwalk = creatureFactory.create({
      monster: MonsterEnum.GhostwalkSpider,
      family: MonsterFamilyEnum.Spider,
      name: "monster.spider.name.ghostwalk",
      logging: true,
      files: [
        "C#LCCENS", // Ghostly Spirit
        "L#ULCSP", // Ssimkh, the Ghost-Feeding Spider
      ],
      data: {
        level1: 14,
        strength: 15,
        dexterity: 20,
        constitution: 17,
        intelligence: 9,
        wisdom: 14,
        charisma: 8,
        ac: 6,
        apr: 2,
        xpv: 5000,
        alignment: "CHAOTIC_EVIL",
        morale: 13,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Large",
      },
    });
    this.createWeb({
      id: Ids.InvisibleWebTangle,
      duration: 18,
      saveBonus: -2,
      description: "monster.spider.ability.webTangle.ghostwalkDesc",
      invisible: true,
    });
    ghostwalk.setAdditionalData({
      movement: { value: 15 },
      immunities: ["spider"],
      removeItems: ["SPIDPH1", "ANTIWEB", "GHOST2"],
      removeScripts: ["C#LCCENS", "PSPIDER", "L#ULCSP"],
      memorizedSpells: [
        { file: this.spell(Ids.InvisibleWebTangle).file, memorizedCount: 1 },
      ],
    });
    ghostwalk.addTrait({ immunities: ["seeInvisible"] });
    this.createJaws({
      creature: ghostwalk,
      diceThrown: 3,
      diceSize: 10,
      slot: "WEAPON1",
      effects: [
        { opcode: EffectTypeEnum.NoCollisionDetection, passWalls: true },
        { opcode: EffectTypeEnum.ModifyCollisionBehavior },
      ],
      immunities: [
        "acidResistance",
        "coldResistance",
        "fireResistance",
        "lightningResistance",
        "normalWeapons",
        "hold",
        "stun",
        "petrification",
        "ghostVisual1",
      ],
    });
    this.createJaws({
      creature: ghostwalk,
      diceThrown: 3,
      diceSize: 10,
      slot: "WEAPON2",
      effects: poisonService.getEffects({ poisonType: "E", saveBonus: -2 }),
    });
    ghostwalk.setAttack({
      selectWeapons: [
        {
          slot: "WEAPON1",
          triggers: [
            {
              name: "Range",
              params: ["LastSeenBy", 5],
              negation: true,
            },
          ],
        },
        {
          slot: "WEAPON2",
          triggers: [
            {
              name: "Range",
              params: ["LastSeenBy", 5],
            },
          ],
        },
      ],
    });
    ghostwalk.setBehavior({
      dialog: ["C#LCCENS"],
      abilities: [this.ability(Ids.InvisibleWebTangle)],
    });
    return ghostwalk;
  }

  /**
   * Giant
   */
  private giant() {
    const giant = creatureFactory.create({
      monster: MonsterEnum.GiantSpider,
      family: MonsterFamilyEnum.Spider,
      name: "monster.spider.name.giant",
      logging: true,
      files: [
        "BDJELLMU", // Mustard Jelly
        "BPJLMU01", // Mustard Jelly
        "JELLMU", // Mustard Jelly
        "JELLMUL", // Mustard Jelly
        "JELLMUSU", // Mustard Jelly
        "JELLYMU", // Mustard Jelly
        "PLYJELL1", // Mustard Jelly
        ATWEAKS_CREATURES.SplitMustardJelly,
      ],
      data: {
        level1: 7,
        bonusHp: 14,
        strength: 15,
        dexterity: 10,
        constitution: 21,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        ac: 4,
        apr: 1,
        xpv: 4000,
        alignment: "NEUTRAL",
        morale: 14,
        general: "MONSTER",
        race: "SLIME",
        class: "MUSTARD_JELLY",
        gender: "NIETHER",
        size: "Large",
      },
    });
    giant.setAdditionalData({
      movement: { value: 9 },
      immunities: ["ooze"],
      removeItems: ["IMMUNE1", "RING95", "JELLMU1", "DW#JELMU"],
      memorizedSpells: [],
    });
    giant.addTrait({
      immunities: [
        "lightning",
        "normalWeapons",
        "magicMissile",
        "coldResistance",
      ],
      // 5e: Immunity to magic damage
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 10,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    this.createJaws({
      creature: giant,
      diceThrown: 1,
      diceSize: 2,
      effects: poisonService.getEffects({ poisonType: "E", saveBonus: -2 }),
    });
    giant.setBehavior({
      abilities: [],
    });
    return giant;
  }

  /**
   * Hairy
   */
  private hairy() {
    const hairy = creatureFactory.create({
      monster: MonsterEnum.HairySpider,
      family: MonsterFamilyEnum.Spider,
      name: "monster.spider.name.hairy",
      logging: true,
      files: ["JELLSPA", "BPSLFS01", "BPSLFS02"],
      data: {
        level1: 12,
        bonusHp: 14,
        strength: 15,
        dexterity: 10,
        constitution: 21,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        ac: 4,
        apr: 1,
        xpv: 5000,
        alignment: "NEUTRAL",
        morale: 14,
        general: "MONSTER",
        race: "SLIME",
        class: "MUSTARD_JELLY",
        gender: "NIETHER",
        size: "Large",
      },
    });
    hairy.setAdditionalData({
      movement: { value: 9 },
      immunities: ["ooze"],
      removeEffects: true,
      removeItems: ["IMMUNE1", "RING95", "JELLMU2", "DW#JELM2"],
      scriptLocation: "Race",
      memorizedSpells: [],
    });
    hairy.addTrait({
      immunities: [
        "lightning",
        "normalWeapons",
        "magicMissile",
        "coldResistance",
      ],
      // 5e: Immunity to magic damage
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 10,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    this.createJaws({
      creature: hairy,
      diceThrown: 1,
      diceSize: 2,
      effects: poisonService.getEffects({ poisonType: "E", saveBonus: -2 }),
    });
    hairy.setBehavior({
      abilities: [],
    });
    return hairy;
  }

  /**
   * Huge
   */
  private huge() {
    const gray = creatureFactory.create({
      monster: MonsterEnum.HugeSpider,
      family: MonsterFamilyEnum.Spider,
      name: "monster.spider.name.huge",
      logging: true,
      files: [
        "BPJLGR01", // Gray Ooze
        "JELLGR", // Gray Ooze
      ],
      data: {
        level1: 3,
        bonusHp: 3,
        thac0: 17,
        strength: 12,
        dexterity: 6,
        constitution: 16,
        intelligence: 1,
        wisdom: 6,
        charisma: 2,
        ac: 8,
        apr: 1,
        xpv: 270,
        alignment: "NEUTRAL",
        morale: 10,
        general: "MONSTER",
        race: "SLIME",
        class: "GREY_OOZE",
        gender: "NIETHER",
        size: "Large",
      },
    });
    gray.setAdditionalData({
      movement: { value: 1 },
      immunities: ["ooze"],
      removeItems: ["RING95", "OOZEGR1", "DW#OOZEG"],
    });
    // 5e:
    // Acid (Ex): A gray ooze secretes a digestive acid that quickly dissolves organic material and metal, but not stone. Any melee hit or constrict attack deals acid damage. Armor or clothing dissolves and becomes useless immediately unless it succeeds on a DC 16 Reflex save. A metal or wooden weapon that strikes a gray ooze also dissolves immediately unless it succeeds on a DC 16 Reflex save. The save DCs are Constitution-based.
    // The ooze’s acidic touch deals 16 points of damage per round to wooden or metal objects, but the ooze must remain in contact with the object for 1 full round to deal this damage.
    // Constrict (Ex): A gray ooze deals automatic slam and acid damage with a successful grapple check. The opponent’s clothing and armor take a –4 penalty on Reflex saves against the acid.
    // Improved Grab (Ex): To use this ability, a gray ooze must hit with its slam attack. It can then attempt to start a grapple as a free action without provoking an attack of opportunity. If it wins the grapple check, it establishes a hold and can constrict.
    gray.addTrait({
      // Spells have no effect on this monster, nor do fire- or cold-based attacks. Lightning and blows from weapons cause full damage.
      // Note that weapons striking a gray ooze may corrode and break.
      immunities: ["magic", "fire", "cold"],
    });
    this.createJaws({
      creature: gray,
      diceThrown: 1,
      diceSize: 2,
      effects: poisonService.getEffects({ poisonType: "E", saveBonus: -2 }),
    });
    gray.setBehavior({});
    return gray;
  }

  /**
   * Hunting
   */
  private hunting() {
    const hunting = creatureFactory.create({
      monster: MonsterEnum.HuntingSpider,
      family: MonsterFamilyEnum.Spider,
      name: "monster.spider.name.hunting",
      logging: true,
      files: [
        "JELLGRSU", // Green Slime
        "JELLYGR", // Green Slime
        "JELLYGR2", // Green Slime
        "X#JELLY", // Green Slime
        "X#SLIME", // Green Slime
      ],
      data: {
        level1: 2,
        thac0: 19,
        strength: 4,
        dexterity: 12,
        constitution: 8,
        intelligence: 1,
        wisdom: 3,
        charisma: 1,
        ac: 9,
        apr: 1,
        xpv: 65,
        alignment: "NEUTRAL",
        morale: 10,
        general: "MONSTER",
        race: "SLIME",
        class: "GREEN_SLIME",
        gender: "NIETHER",
        size: "Small",
      },
    });
    hunting.setAdditionalData({
      movement: { value: 0 },
      immunities: ["ooze"],
      removeItems: ["RING95", "JELLGR1", "JELLGRSU"],
    });
    hunting.addTrait({
      // The horrid growth can be scraped off quickly, cut away, frozen, or burned.
      // A cure disease spell kills green slime, but other attacks, including weapons and spells, have no effect.
      immunities: ["magic", "physicalDamage"],
    });
    // Green slime attaches itself to living flesh and in 1-4 melee rounds turns the creature into green slime (no resurrection possible).
    // 5e: Pseudopod. Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) acid damage.
    this.createJaws({
      creature: hunting,
      diceThrown: 1,
      diceSize: 2,
      effects: poisonService.getEffects({ poisonType: "E", saveBonus: -2 }),
    });
    hunting.setBehavior({});
    hunting.setAdjustments([
      {
        files: ["JELLGRSU"],
        summon: true,
        additionalData: { scriptLocation: "None" },
      },
      {
        files: ["X#JELLY", "X#SLIME"],
        additionalData: { scriptLocation: "None" },
      },
    ]);
    return hunting;
  }

  /**
   * Phase
   */
  private phase() {
    const phase = creatureFactory.create({
      monster: MonsterEnum.PhaseSpider,
      family: MonsterFamilyEnum.Spider,
      name: "monster.spider.name.phase",
      logging: true,
      files: [
        "BDJELLOC", // Ochre Jelly
        "BDSHJELL", // Ochre Jelly
        "BPJLOC01", // Ochre Jelly
        "JELLOC", // Ochre Jelly
        "JELLYCO", // Ochre Jelly
      ],
      data: {
        level1: 6,
        thac0: 15,
        strength: 15,
        dexterity: 6,
        constitution: 14,
        intelligence: 1,
        wisdom: 6,
        charisma: 1,
        ac: 8,
        apr: 1,
        xpv: 270,
        alignment: "NEUTRAL",
        morale: 10,
        general: "MONSTER",
        race: "SLIME",
        class: "OCRE_JELLY",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    phase.setAdditionalData({
      movement: { value: 3 },
      immunities: ["ooze"],
      removeItems: ["RING95", "JELLOC1", "DW#JELOC"],
    });
    phase.addTrait({
      immunities: ["lightning"],
      // 5e: Damage Resistances: Acid. Damage Immunities: Slashing
    });
    this.createJaws({
      creature: phase,
      diceThrown: 1,
      diceSize: 2,
      effects: poisonService.getEffects({ poisonType: "E", saveBonus: -2 }),
    });
    phase.setBehavior({});
    return phase;
  }

  /**
   * Sword
   */
  private sword() {
    const sword = creatureFactory.create({
      monster: MonsterEnum.SwordSpider,
      family: MonsterFamilyEnum.Spider,
      name: "monster.spider.name.sword",
      logging: true,
      files: [
        "SCHLUM", // Schlumpsha the Sewer King. Note: is an olive slime, was a former mage that appears to have transformed itself into a slime.
      ],
      data: {
        level1: 12,
        bonusHp: 2,
        strength: 15,
        dexterity: 10,
        constitution: 21,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        ac: 9,
        apr: 1,
        xpv: 2500,
        alignment: "NEUTRAL",
        morale: 9,
        general: "MONSTER",
        race: "SLIME",
        class: "OLIVE_SLIME",
        gender: "NIETHER",
        animation: "SLIME_OLIVE",
        size: "Large",
      },
    });
    sword.setAdditionalData({
      movement: { value: 6 },
      immunities: ["ooze"],
      removeItems: ["SCHLUM1", "DW#SCHLU", "RING95", "IMMUNE1"],
      removeScripts: ["SCHLUM"],
    });
    sword.addTrait({
      // Olive slime zombies are harmed by acid, freezing cold, fire and magic missile spells.
      // Spells that affect plants will also affect them, although the effects of entangle are minimal at best.
      // No other attacks, by weapons, lightning, or spells that affect the mind will kill a slime creature.
      immunities: ["lightning", "entangle", "normalWeapons"],
    });
    this.createJaws({
      creature: sword,
      diceThrown: 1,
      diceSize: 2,
      effects: poisonService.getEffects({ poisonType: "E", saveBonus: -2 }),
    });
    sword.setBehavior({
      dialog: ["SCHLUMPSA"],
    });
    return sword;
  }

  /**
   * Vortex
   */
  private vortex() {
    const vortex = creatureFactory.create({
      monster: MonsterEnum.VortexSpider,
      family: MonsterFamilyEnum.Spider,
      name: "monster.spider.name.vortex",
      logging: true,
      files: [
        "AC#FPSLT", // Slithering Tracker
      ],
      data: {
        level1: 5,
        thac0: 15,
        strength: 14,
        dexterity: 8,
        constitution: 18,
        intelligence: 9,
        wisdom: 7,
        charisma: 2,
        ac: 5,
        apr: 1,
        xpv: 975,
        alignment: "NEUTRAL",
        morale: 15,
        general: "MONSTER",
        race: "SLIME",
        class: "GREY_OOZE",
        gender: "NIETHER",
        size: "Small",
      },
    });
    vortex.setAdditionalData({
      movement: { value: 12 },
      immunities: ["ooze"],
      removeItems: ["RING95", "AC#FPSL2", "AC#FPSLT"],
    });
    vortex.addTrait({
      // Olive slime zombies are harmed by acid, freezing cold, fire and magic missile spells.
      // Spells that affect plants will also affect them, although the effects of entangle are minimal at best.
      // No other attacks, by weapons, lightning, or spells that affect the mind will kill a slime creature.
      immunities: ["lightning", "entangle", "normalWeapons"],
    });
    this.createJaws({
      creature: vortex,
      diceThrown: 1,
      diceSize: 2,
      effects: poisonService.getEffects({ poisonType: "E", saveBonus: -2 }),
    });
    vortex.setBehavior({});
    return vortex;
  }

  /**
   * Wraith
   */
  private wraith() {
    const wraith = creatureFactory.create({
      monster: MonsterEnum.WraithSpider,
      family: MonsterFamilyEnum.Spider,
      name: "monster.spider.name.wraith",
      logging: true,
      files: [
        "AC#FPSLT", // Slithering Tracker
      ],
      data: {
        level1: 5,
        thac0: 15,
        strength: 14,
        dexterity: 8,
        constitution: 18,
        intelligence: 9,
        wisdom: 7,
        charisma: 2,
        ac: 5,
        apr: 1,
        xpv: 975,
        alignment: "NEUTRAL",
        morale: 15,
        general: "MONSTER",
        race: "SLIME",
        class: "GREY_OOZE",
        gender: "NIETHER",
        size: "Small",
      },
    });
    wraith.setAdditionalData({
      movement: { value: 12 },
      immunities: ["ooze"],
      removeItems: ["RING95", "AC#FPSL2", "AC#FPSLT"],
    });
    wraith.addTrait({
      // Olive slime zombies are harmed by acid, freezing cold, fire and magic missile spells.
      // Spells that affect plants will also affect them, although the effects of entangle are minimal at best.
      // No other attacks, by weapons, lightning, or spells that affect the mind will kill a slime creature.
      immunities: ["lightning", "entangle", "normalWeapons"],
    });
    this.createJaws({
      creature: wraith,
      diceThrown: 1,
      diceSize: 2,
      effects: poisonService.getEffects({ poisonType: "E", saveBonus: -2 }),
    });
    wraith.setBehavior({});
    return wraith;
  }

  createJaws(p: {
    creature: Creature;
    diceThrown: number;
    diceSize: number;
    effects?: Effect[];
    immunities?: ImmunityName[];
    slot?: ItemSlot;
  }) {
    return p.creature.addWeapon({
      weapon: {
        stringRef: "monster.spider.weapon.jaws",
        icon: MonsterItemIconEnum.Jaws,
        equippedSlot: [p.slot ?? "WEAPON1"],
        immunities: p.immunities,
        header: {
          type: ItemAbilityTypeEnum.Melee,
          diceThrown: p.diceThrown,
          diceSize: p.diceSize,
          damageType: AbilityDamageTypeEnum.Piercing,
          speed: 2,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
          effects: p.effects,
        },
      },
    });
  }

  /**
   * Single Target Web
   */
  private createWeb({
    id,
    name,
    description,
    duration,
    saveBonus,
    damageEffect,
    invisible,
  }: {
    id: number;
    name?: TranslationKey;
    description: TranslationKey;
    duration: number;
    saveBonus?: number;
    damageEffect?: DamageEffect;
    invisible?: boolean;
  }) {
    const saves: BaseEffect = {
      saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
      saveBonus: saveBonus ?? 0,
    };
    const effects: Effect[] = [
      {
        opcode: EffectTypeEnum.Web,
        timing: EffectTimingEnum.InstantLimited,
        duration,
        ...saves,
      },
      {
        opcode: EffectTypeEnum.Paralyze,
        timing: EffectTimingEnum.InstantLimited,
        idsFile: EffectIDSFileEnum.EA,
        idsEntry: "ANYONE",
        duration,
        ...saves,
      },
      {
        opcode: EffectTypeEnum.DisplayPortraitIcon,
        icon: PortraitIconEnum.Webbed,
        timing: EffectTimingEnum.InstantLimited,
        duration,
        ...saves,
      },
      {
        opcode: EffectTypeEnum.PlaySound,
        resource: "EFF_P27",
        ...saves,
      },
    ];
    const protections: {
      type: SpellProtection;
      values: (string | number)[];
    }[] = [
      {
        type: {
          stat: SpellProtectionStat.CircleSize,
          relation: SpellProtectionRelation.Greater,
          value: 3,
        },
        values: [0],
      },
      {
        type: {
          stat: SpellProtectionStat.Splstate,
          relation: SpellProtectionRelation.Equal,
        },
        values: ["BLUE_FIRESHIELD", "RED_FIRESHIELD", "FREE_ACTION"],
      },
      {
        type: {
          stat: SpellProtectionStat.Race,
          relation: SpellProtectionRelation.Equal,
        },
        values: ["WRAITH", "MIST", "SHADOW", "ELEMENTAL", "SLIME"],
      },
    ];
    for (const protection of protections) {
      for (const value of protection.values) {
        effects.unshift({
          opcode: EffectTypeEnum.ProtectionFromResourceAndMessage,
          type: protection.type,
          value,
          timing: EffectTimingEnum.InstantLimited,
          duration: 1,
        });
      }
    }
    if (damageEffect) {
      effects.push(
        ...effectFactory.damageOverTime(1, { ...damageEffect, ...saves })
      );
    }
    if (invisible) {
      effects.push({
        opcode: EffectTypeEnum.Invisibility,
        type: InvisibilityTypeEnum.Normal,
        duration,
        ...saves,
      });
    }
    return this.addSpell({
      id,
      name: name ?? "monster.spider.ability.webTangle.name",
      description,
      icon: SPELLS.Web,
      options: { renew: 2 },
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      headers: [
        {
          type: ItemAbilityTypeEnum.Ranged,
          range: 5,
          projectile: "WEB1P",
          effects,
        },
      ],
      ability: {
        preset: SPELLS.Web,
        spell: {
          // It can shoot web strands up to 2 feet to bind a foe.
          // Either attack treats the spider's opponent as AC 10 and prevents the spider from making a melee attack that round.
          type: "force",
          isAttack: true,
          probability: 70,
        },
        range: 6, // to fix issue with very close range since melee attack is 3 feet
        requireVocal: false,
      },
    });
  }
}

export const createSpiders = () => new SpiderFamily();
