import { MonsterItemIconEnum } from "../config/item";
import { SPELLS } from "../config/spell-names";
import effectFactory from "../src/factories/effect.factory";
import { Creature } from "../src/model/creature/creature";
import { CreatureFamily } from "../src/model/creature/family";
import { ItemSlot } from "../src/model/creature/item";
import { ImmunityName } from "../src/model/final/immunity";
import {
  BaseEffect,
  DamageEffect,
  Effect,
} from "../src/model/spell-item/effect";
import {
  AbilityDamageTypeEnum,
  EffectCastSpellTypeEnum,
  EffectDamageTypeEnum,
  EffectIDSFileEnum,
  EffectModifierTypeEnum,
  EffectStatisticModifierEnum,
  EffectTargetEnum,
  EffectTimingEnum,
  InvisibilityTypeEnum,
  ItemAbilityFlagEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  PnPPoisonType,
  PortraitIconEnum,
  SaveTypeEnum,
  WingBuffetDirectionEnum,
} from "../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../src/model/spell-item/effect.type";
import {
  SpellProtection,
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../src/model/spell-item/spell-protection";
import creatureService from "../src/services/creature.service";
import poisonService from "../src/services/effects/poison.service";
import { TranslationKey } from "../translations/i18n";
import { MonsterEnum, MonsterFamilyEnum } from "./monster";

enum Ids {
  InvisibleWebTangle,
  Leg,
  LeapAttack,
  LeapImpalingAttack,
  LightningLeg,
  LightningLeapImpalingAttack,
  PhaseOut,
  WebTangle,
}

class Undead extends Creature {
  createJaws(p: {
    diceThrown: number;
    diceSize: number;
    effects?: Effect[];
    immunities?: ImmunityName[];
    poisonType?: PnPPoisonType;
    saveBonus?: number;
    slot?: ItemSlot;
  }) {
    return this.addWeapon({
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
      castSpell: p.poisonType
        ? poisonService.getSpell({
            poisonType: p.poisonType,
            saveBonus: p.saveBonus,
          })
        : undefined,
    });
  }

  createLegWeapon(p: {
    id: number;
    impale?: boolean;
    lightning?: boolean;
    equipped?: boolean;
  }) {
    const effects: Effect[] = [];
    if (p.impale) {
      effects.push(
        {
          opcode: EffectTypeEnum.DisplayString,
          stringRef: "monster.spider.ability.impale.name",
        },
        {
          opcode: EffectTypeEnum.Thac0Bonus,
          type: EffectModifierTypeEnum.Increment,
          value: -4,
          timing: EffectTimingEnum.InstantLimited,
          duration: 12,
        }
      );
    }
    if (p.lightning) {
      effects.push({
        opcode: EffectTypeEnum.Damage,
        type: EffectDamageTypeEnum.Electricity,
        amount: p.impale ? 8 : 2,
      });
    }
    return this.addItem({
      id: p.id,
      stringRef: p.impale
        ? "monster.spider.ability.impale.name"
        : "monster.spider.weapon.leg",
      icon: MonsterItemIconEnum.Wolf,
      equippedSlot: p.equipped ? ["SHIELD"] : undefined,
      header: {
        type: ItemAbilityTypeEnum.Melee,
        diceThrown: p.impale ? 4 : 1,
        diceSize: 12,
        damageType: AbilityDamageTypeEnum.Piercing,
        speed: 1,
        abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
        effects,
      },
    });
  }

  /**
   * Single Target Web
   */
  createWeb({
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
      memorizedCount: 1,
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

class UndeadFamily extends CreatureFamily<Undead> {
  constructor() {
    super(MonsterFamilyEnum.Undead);
    this.addCreature(this.banshee());
    // this.addCreature(this.deathKnight());
    // this.addCreature(this.ghast());
    // this.addCreature(this.ghoul());
    // this.addCreature(this.ghoulLord());
    // this.addCreature(this.mummy());
    // this.addCreature(this.greaterMummy());
    // this.addCreature(this.shadow());
    // this.addCreature(this.skeleton());
    // this.addCreature(this.skeletonWarrior());
    // this.addCreature(this.spectre());
    // this.addCreature(this.wight());
    // this.addCreature(this.wraith());
    // this.addCreature(this.zombie());
    // this.addCreature(this.zombieJuju());
    // this.addCreature(this.zombieSea());
  }

  createCreature(id: MonsterEnum): Undead {
    return new Undead(id);
  }

  /**
   * Banshee
   */
  private banshee() {
    const banshee = this.create({
      monster: MonsterEnum.Banshee,
      name: "monster.undead.name.banshee",
      files: [
        "BDSPIDGA", // Gargantuan Spider
      ],
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
    banshee.createWeb({
      id: Ids.WebTangle,
      duration: 18,
      // saveBonus: -2,
      description: "monster.spider.ability.webTangle.standardDesc",
    });
    banshee.setAdditionalData({
      movement: { value: 9 }, // Web 12
      immunities: ["spider"],
      removeItems: ["BDSPIDGA", "ANTIWEB"],
      removeScripts: ["BDSPIDGA"],
    });
    banshee.createJaws({
      diceThrown: 2,
      diceSize: 6,
      poisonType: "Q",
      saveBonus: -2,
    });
    banshee.setAttack({
      targetPriorities: [{ status: ["HeldAndNotPoisoned"] }],
    });
    banshee.setBehavior({
      abilities: [this.ability(Ids.WebTangle)],
    });
    return banshee;
  }

  /**
   * Death Knight
   */
  private deathKnight() {
    const knight = this.create({
      monster: MonsterEnum.DeathKnight,
      name: "monster.undead.name.deathKnight",
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
    knight.createWeb({
      id: Ids.InvisibleWebTangle,
      duration: 18,
      saveBonus: -2,
      description: "monster.spider.ability.webTangle.ghostwalkDesc",
      invisible: true,
    });
    knight.setAdditionalData({
      movement: { value: 15 },
      immunities: ["spider"],
      removeItems: ["SPIDPH1", "ANTIWEB", "GHOST2"],
      removeScripts: ["C#LCCENS", "PSPIDER", "L#ULCSP"],
    });
    knight.addTrait({ immunities: ["seeInvisible"] });
    knight.createJaws({
      diceThrown: 3,
      diceSize: 10,
      slot: "WEAPON1",
      immunities: ["incorporeal", "ghostVisual1"],
    });
    knight.createJaws({
      diceThrown: 3,
      diceSize: 10,
      slot: "WEAPON2",
      poisonType: "E",
      saveBonus: -2,
    });
    knight.setAttack({
      targetPriorities: [{ status: ["HeldAndNotPoisoned"] }],
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
    knight.setBehavior({
      dialog: ["C#LCCENS"],
      abilities: [this.ability(Ids.InvisibleWebTangle)],
    });
    return knight;
  }

  /**
   * Ghast
   */
  private ghast() {
    const ghast = this.create({
      monster: MonsterEnum.Ghast,
      name: "monster.undead.name.ghast",
      files: [
        "BDHELP01", // Giant Spider
        "BDSPIDGI", // Giant Spider
        "BDWISTAK", // Wistak
        "BPSPID02", // Giant Spider
        "PLYSPID2", // Giant Spider
        "RSSPIDGI", // Giant Spider
        "SPIDGI", // Giant Spider
        "SPIDGISU", // Giant Spider
        "SPIDFGSU", // Kitthix
      ],
      data: {
        level1: 4,
        bonusHp: 4,
        thac0: 15,
        strength: 14,
        dexterity: 16,
        constitution: 12,
        intelligence: 7,
        wisdom: 11,
        charisma: 4,
        ac: 4,
        apr: 1,
        xpv: 650,
        alignment: "CHAOTIC_EVIL",
        morale: 13,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_GIANT",
        gender: "NIETHER",
        size: "Large",
      },
    });
    ghast.setAdditionalData({
      movement: { value: 3 }, // Web 12
      immunities: ["spider"],
      removeItems: ["BDSPIDGI", "SPIDG1", "ANTIWEB", "PLYSPID"],
      removeScripts: ["DW#SPIDG", "SPIDFGSU"],
    });
    ghast.createJaws({
      diceThrown: 1,
      diceSize: 8,
      poisonType: "F",
    });
    ghast.setAdjustments([
      { files: ["SPIDGISU", "BDHELP01", "SPIDFGSU"], summon: true },
      { files: ["PLYSPID2"], additionalData: { scriptLocation: "None" } },
    ]);
    return ghast;
  }

  /**
   * Ghoul
   */
  private ghoul() {
    const ghoul = this.create({
      monster: MonsterEnum.Ghoul,
      name: "monster.undead.name.ghoul",
      files: [
        "BDSPIDER", // Small Spider
        "SPIDSM01", // Small Spider
      ],
      data: {
        level1: 1,
        bonusHp: 1,
        strength: 2,
        dexterity: 14,
        constitution: 8,
        intelligence: 1,
        wisdom: 10,
        charisma: 2,
        ac: 8,
        apr: 1,
        thac0: 20,
        xpv: 65,
        alignment: "NEUTRAL_EVIL",
        morale: 10,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_HUGE",
        gender: "NIETHER",
        size: "Tiny",
      },
    });
    ghoul.setAdditionalData({
      movement: { value: 6 }, // web 15
      immunities: ["spider"],
      removeItems: ["SPIDHU1", "ANTIWEB"],
      removeScripts: ["DW#SPIDG"],
      memorizedSpells: [{ file: SPELLS.DetectInvisibility, memorizedCount: 1 }],
    });
    ghoul.createJaws({
      diceThrown: 1,
      diceSize: 1,
      poisonType: "R",
      saveBonus: 2,
    });
    ghoul.addTrait({ immunities: ["crushingDamageResistance"] });
    ghoul.setBehavior({
      abilities: [
        {
          preset: SPELLS.DetectInvisibility,
          spell: {
            type: "force",
            probability: 30,
          },
          timer: { name: "detectInvisibility", value: 18 },
          requireVocal: false,
        },
      ],
    });
    ghoul.setAdjustments([
      { files: ["BDSPIDER"], additionalData: { scriptLocation: "None" } },
    ]);
    return ghoul;
  }

  /**
   * Ghoul Lord
   */
  private ghoulLord() {
    const lord = this.create({
      monster: MonsterEnum.GhoulLord,
      name: "monster.undead.name.ghoulLord",
      files: [
        "BDSPIDHU", // Huge Spider
        "SPIDHU", // Huge Spider
        "SPIDLAND", // Huge Spider
      ],
      data: {
        level1: 2,
        bonusHp: 2,
        thac0: 19,
        strength: 14,
        dexterity: 16,
        constitution: 12,
        intelligence: 7,
        wisdom: 11,
        charisma: 4,
        ac: 6,
        apr: 1,
        xpv: 270,
        alignment: "NEUTRAL",
        morale: 8,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_HUGE",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    lord.setAdditionalData({
      movement: { value: 18 },
      immunities: ["spider"],
      removeItems: ["BDSPIDHU", "SPIDHU1", "ANTIWEB", "D5SMSPID"],
      removeScripts: ["DW#SPIDS"],
    });
    lord.createJaws({
      diceThrown: 1,
      diceSize: 6,
      poisonType: "A",
      saveBonus: 1,
    });
    return lord;
  }

  /**
   * Mummy
   */
  private mummy() {
    const hunting = this.create({
      monster: MonsterEnum.Mummy,
      name: "monster.undead.name.mummy",
      files: [
        "D5SMSPID", // Beetle Swarm (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 3,
        thac0: 17,
        strength: 14,
        dexterity: 16,
        constitution: 12,
        intelligence: 10,
        wisdom: 11,
        charisma: 4,
        ac: 4,
        apr: 1,
        xpv: 650,
        alignment: "NEUTRAL",
        morale: 13,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_GIANT",
        gender: "NIETHER",
        size: "Large",
      },
    });
    hunting.setAdditionalData({
      movement: { value: 8 },
      immunities: [
        "spider",
        "seeInvisible", // their vision gives them the natural ability of true seeing
      ],
      removeItems: ["D5SMSPID", "ANTIWEB"],
    });
    hunting.createJaws({
      diceThrown: 1,
      diceSize: 3,
      poisonType: "A",
      saveBonus: 2,
    });
    hunting.setBehavior({ abilities: [this.ability(Ids.LeapAttack)] });
    hunting.setAdjustments([{ files: ["D5SMSPID"], summon: true }]);
    return hunting;
  }

  /**
   * Greater Mummy
   */
  private greaterMummy() {
    const greater = this.create({
      monster: MonsterEnum.GreaterMummy,
      name: "monster.undead.name.greaterMummy",
      files: [
        "SPIDPH", // Phase Spider
        "SPIDPHSU", // Phase Spider
        "SPIDPHAS", // Astral Phase Spider
      ],
      data: {
        level1: 5,
        bonusHp: 5,
        strength: 15,
        dexterity: 15,
        constitution: 12,
        intelligence: 7,
        wisdom: 10,
        charisma: 6,
        ac: 7,
        apr: 1,
        xpv: 1400,
        alignment: "NEUTRAL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_PHASE",
        gender: "NIETHER",
        size: "Huge",
      },
    });
    greater.setAdditionalData({
      movement: { value: 6 }, // Web 15
      immunities: ["spider"],
      removeItems: ["SPIDPH1", "ANTIWEB", "SPIDPHSU"],
      removeScripts: ["PSPIDER", "SPIDPHSU"],
    });
    greater.addTrait({
      effects: [
        {
          opcode: EffectTypeEnum.Invisibility,
          type: InvisibilityTypeEnum.Normal,
        },
      ],
    });
    // They phase in, attack, and phase out, all in a single round.
    // This gives them a -3 modifier on initiative rolls; if a phase spider wins initiative by more than 4, it attacks and phases out before its opponent has a chance to strike back.
    // Then too, a phase spider usually phases into existence behind its chosen victim, so they get a +4 modifier for attacking from behind.
    // Phase spiders flee to the Ethereal plane when outmatched
    greater.createJaws({
      diceThrown: 1,
      diceSize: 6,
      poisonType: "F",
      saveBonus: -2,
      effects: [
        {
          opcode: EffectTypeEnum.CastSpell,
          type: EffectCastSpellTypeEnum.CastInstantlyAtCasterLevel,
          target: EffectTargetEnum.Self,
          timing: EffectTimingEnum.DelayPermanent,
          duration: 2,
          resource: this.spell(Ids.PhaseOut).file,
        },
      ],
    });
    greater.setBehavior({
      abilities: [this.ability(Ids.PhaseOut)],
    });
    greater.setAdjustments([
      { files: ["SPIDPHSU"], summon: true },
      {
        files: ["SPIDPHAS"],
        data: {
          level1: 12,
          xpv: 4000,
        },
      },
    ]);
    return greater;
  }

  /**
   * Shadow
   */
  private shadow() {
    const shadow = this.create({
      monster: MonsterEnum.Shadow,
      name: "monster.undead.name.shadow",
      files: [
        "BDHELP03", // Sword Spider
        "BDSPID7L", // Seven-Legged Spider
        "BPSPID03", // Sword Spider
        "PLYSPID", // Sword Spider
        "SPIDSW", // Sword Spider
        "SPIDSW01", // Sword Spider
        "SPIDSWSU", // Sword Spider
        "BPSPID01", // Spider
        "GV#SPID", // Spider
        "WISPID01", // Spider
        "WISPID02", // Spider
        "WISPID03", // Lightning Sword Spider (+2 electricity damage with leg)
      ],
      data: {
        level1: 5,
        bonusHp: 5,
        thac0: 15,
        strength: 16,
        dexterity: 18,
        constitution: 14,
        intelligence: 9,
        wisdom: 14,
        charisma: 4,
        ac: 3,
        apr: 2,
        xpv: 2000,
        alignment: "CHAOTIC_EVIL",
        morale: 13,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_SWORD",
        gender: "NIETHER",
        size: "Huge",
      },
    });
    shadow.createJaws({
      diceThrown: 2,
      diceSize: 4,
    });
    shadow.setAdditionalData({
      movement: { value: 6 }, // Web 8
      immunities: ["spider"],
      removeItems: ["SPIDSW1", "ANTIWEB", "SPIDSWSU", "WISPIDSW"],
      removeScripts: ["DW#SPIDS"],
    });
    shadow.setBehavior({
      abilities: [
        this.ability(Ids.LeapImpalingAttack),
        this.ability(Ids.LightningLeapImpalingAttack),
      ],
    });
    shadow.setAdjustments([
      { files: ["BDHELP03", "SPIDSWSU"], summon: true },
      { files: ["PLYSPID"], additionalData: { scriptLocation: "None" } },
      {
        files: ["WISPID03"],
        additionalData: {
          removeMemorizedSpells: true,
          equippedItems: [
            { file: this.item(Ids.LightningLeg).file, slot: "SHIELD" },
          ],
          memorizedSpells: [
            {
              file: this.spell(Ids.LightningLeapImpalingAttack).file,
              memorizedCount: 1,
            },
          ],
        },
      },
    ]);
    return shadow;
  }

  /**
   * Skeleton
   */
  private skeleton() {
    const skeleton = this.create({
      monster: MonsterEnum.Skeleton,
      name: "monster.undead.name.skeleton",
      files: [
        "SMSPID02", // Vortex Spider
      ],
      data: {
        level1: 7,
        bonusHp: 4,
        strength: 15,
        dexterity: 15,
        constitution: 12,
        intelligence: 7,
        wisdom: 10,
        charisma: 6,
        ac: 4,
        apr: 1,
        xpv: 2700,
        alignment: "CHAOTIC_EVIL",
        morale: 10,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_PHASE",
        gender: "NIETHER",
        size: "Large",
      },
    });
    skeleton.setAdditionalData({
      movement: { value: 15 }, // Normal: 9, Web: 15
      immunities: ["spider"],
      removeItems: ["BDSPIDGI", "SPIDG1", "ANTIWEB", "PLYSPID"],
      removeScripts: ["DW#SPIDG", "SPIDVO01"],
      memorizedSpells: [{ file: SPELLS.VortexWeb, memorizedCount: 1 }],
    });
    skeleton.addTrait({
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    skeleton.createJaws({
      diceThrown: 2,
      diceSize: 4,
      poisonType: "F",
      saveBonus: -2,
    });
    skeleton.setBehavior({
      abilities: [
        {
          preset: SPELLS.Slow,
          spell: {
            resource: SPELLS.VortexWeb,
            type: "force",
          },
          timer: { name: "VortexWeb", value: 30 },
        },
      ],
    });
    return skeleton;
  }

  /**
   * Skeleton Warrior
   */
  private skeletonWarrior() {
    const warrior = this.create({
      monster: MonsterEnum.SkeletonWarrior,
      name: "monster.undead.name.skeletonWarrior",
      files: [
        "C#Q04009", // Wraith Spider
        "SPIDWR", // Wraith Spider
        "SPIDWR01", // Wraith Spider
        "TTSPID", // Wraith Spider
        // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    warrior.setAdditionalData({
      movement: { value: 12 },
      immunities: ["spider", "undead"],
      removeItems: ["IMMUNE1", "RING95", "ANTIWEB", "SPIDWR1"],
      removeScripts: ["DW#SPIDG"],
    });
    warrior.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    warrior.createJaws({
      diceThrown: 0,
      diceSize: 0,
      effects: [
        {
          opcode: EffectTypeEnum.Damage,
          type: EffectDamageTypeEnum.Cold,
          diceThrown: 1,
          diceSize: 4,
          amount: creatureService.getStrengthDamageBonus(warrior.data),
        },
        ...effectFactory.levelDrain({ levels: 1 }),
      ],
      poisonType: "S",
    });
    warrior.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return warrior;
  }

  /**
   * Spectre
   */
  private spectre() {
    const wraith = this.create({
      monster: MonsterEnum.Spectre,
      name: "monster.undead.name.spectre",
      files: [
        "C#Q04009", // Wraith Spider
        "SPIDWR", // Wraith Spider
        "SPIDWR01", // Wraith Spider
        "TTSPID", // Wraith Spider
        // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    wraith.setAdditionalData({
      movement: { value: 12 },
      immunities: ["spider", "undead"],
      removeItems: ["IMMUNE1", "RING95", "ANTIWEB", "SPIDWR1"],
      removeScripts: ["DW#SPIDG"],
    });
    wraith.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    wraith.createJaws({
      diceThrown: 0,
      diceSize: 0,
      effects: [
        {
          opcode: EffectTypeEnum.Damage,
          type: EffectDamageTypeEnum.Cold,
          diceThrown: 1,
          diceSize: 4,
          amount: creatureService.getStrengthDamageBonus(wraith.data),
        },
        ...effectFactory.levelDrain({ levels: 1 }),
      ],
      poisonType: "S",
    });
    wraith.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return wraith;
  }

  /**
   * Wight
   */
  private wight() {
    const wight = this.create({
      monster: MonsterEnum.Wight,
      name: "monster.undead.name.wight",
      files: [
        "C#Q04009", // Wraith Spider
        "SPIDWR", // Wraith Spider
        "SPIDWR01", // Wraith Spider
        "TTSPID", // Wraith Spider
        // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    wight.setAdditionalData({
      movement: { value: 12 },
      immunities: ["spider", "undead"],
      removeItems: ["IMMUNE1", "RING95", "ANTIWEB", "SPIDWR1"],
      removeScripts: ["DW#SPIDG"],
    });
    wight.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    wight.createJaws({
      diceThrown: 0,
      diceSize: 0,
      effects: [
        {
          opcode: EffectTypeEnum.Damage,
          type: EffectDamageTypeEnum.Cold,
          diceThrown: 1,
          diceSize: 4,
          amount: creatureService.getStrengthDamageBonus(wight.data),
        },
        ...effectFactory.levelDrain({ levels: 1 }),
      ],
      poisonType: "S",
    });
    wight.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return wight;
  }

  /**
   * Wraith
   */
  private wraith() {
    const wraith = this.create({
      monster: MonsterEnum.Wraith,
      name: "monster.undead.name.wraith",
      files: [
        "C#Q04009", // Wraith Spider
        "SPIDWR", // Wraith Spider
        "SPIDWR01", // Wraith Spider
        "TTSPID", // Wraith Spider
        // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    wraith.setAdditionalData({
      movement: { value: 12 },
      immunities: ["spider", "undead"],
      removeItems: ["IMMUNE1", "RING95", "ANTIWEB", "SPIDWR1"],
      removeScripts: ["DW#SPIDG"],
    });
    wraith.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    wraith.createJaws({
      diceThrown: 0,
      diceSize: 0,
      effects: [
        {
          opcode: EffectTypeEnum.Damage,
          type: EffectDamageTypeEnum.Cold,
          diceThrown: 1,
          diceSize: 4,
          amount: creatureService.getStrengthDamageBonus(wraith.data),
        },
        ...effectFactory.levelDrain({ levels: 1 }),
      ],
      poisonType: "S",
    });
    wraith.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return wraith;
  }

  /**
   * Zombie
   */
  private zombie() {
    const zombie = this.create({
      monster: MonsterEnum.Zombie,
      name: "monster.undead.name.zombie",
      files: [
        "C#Q04009", // Wraith Spider
        "SPIDWR", // Wraith Spider
        "SPIDWR01", // Wraith Spider
        "TTSPID", // Wraith Spider
        // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    zombie.setAdditionalData({
      movement: { value: 12 },
      immunities: ["spider", "undead"],
      removeItems: ["IMMUNE1", "RING95", "ANTIWEB", "SPIDWR1"],
      removeScripts: ["DW#SPIDG"],
    });
    zombie.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    zombie.createJaws({
      diceThrown: 0,
      diceSize: 0,
      effects: [
        {
          opcode: EffectTypeEnum.Damage,
          type: EffectDamageTypeEnum.Cold,
          diceThrown: 1,
          diceSize: 4,
          amount: creatureService.getStrengthDamageBonus(zombie.data),
        },
        ...effectFactory.levelDrain({ levels: 1 }),
      ],
      poisonType: "S",
    });
    zombie.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return zombie;
  }

  /**
   * Zombie juju
   */
  private zombieJuju() {
    const wraith = this.create({
      monster: MonsterEnum.ZombieJuju,
      name: "monster.undead.name.zombieJuju",
      files: [
        "C#Q04009", // Wraith Spider
        "SPIDWR", // Wraith Spider
        "SPIDWR01", // Wraith Spider
        "TTSPID", // Wraith Spider
        // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    wraith.setAdditionalData({
      movement: { value: 12 },
      immunities: ["spider", "undead"],
      removeItems: ["IMMUNE1", "RING95", "ANTIWEB", "SPIDWR1"],
      removeScripts: ["DW#SPIDG"],
    });
    wraith.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    wraith.createJaws({
      diceThrown: 0,
      diceSize: 0,
      effects: [
        {
          opcode: EffectTypeEnum.Damage,
          type: EffectDamageTypeEnum.Cold,
          diceThrown: 1,
          diceSize: 4,
          amount: creatureService.getStrengthDamageBonus(wraith.data),
        },
        ...effectFactory.levelDrain({ levels: 1 }),
      ],
      poisonType: "S",
    });
    wraith.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return wraith;
  }

  /**
   * Zombie Sea
   */
  private zombieSea() {
    const wraith = this.create({
      monster: MonsterEnum.ZombieSea,
      name: "monster.undead.name.zombieSea",
      files: [
        "C#Q04009", // Wraith Spider
        "SPIDWR", // Wraith Spider
        "SPIDWR01", // Wraith Spider
        "TTSPID", // Wraith Spider
        // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
        // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
      ],
      data: {
        level1: 3,
        bonusHp: 2,
        strength: 17,
        dexterity: 15,
        constitution: 9,
        intelligence: 10,
        wisdom: 10,
        charisma: 1,
        ac: 5,
        apr: 1,
        xpv: 1400,
        alignment: "LAWFUL_EVIL",
        morale: 15,
        general: "MONSTER",
        race: "SPIDER",
        class: "SPIDER_WRAITH",
        gender: "NIETHER",
        size: "Medium",
      },
    });
    wraith.setAdditionalData({
      movement: { value: 12 },
      immunities: ["spider", "undead"],
      removeItems: ["IMMUNE1", "RING95", "ANTIWEB", "SPIDWR1"],
      removeScripts: ["DW#SPIDG"],
    });
    wraith.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    wraith.createJaws({
      diceThrown: 0,
      diceSize: 0,
      effects: [
        {
          opcode: EffectTypeEnum.Damage,
          type: EffectDamageTypeEnum.Cold,
          diceThrown: 1,
          diceSize: 4,
          amount: creatureService.getStrengthDamageBonus(wraith.data),
        },
        ...effectFactory.levelDrain({ levels: 1 }),
      ],
      poisonType: "S",
    });
    wraith.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return wraith;
  }
}

export const createUndeads = () => new UndeadFamily();
