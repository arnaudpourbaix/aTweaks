import { MonsterItemIconEnum } from "../config/item";
import { SPELLS } from "../config/spell-names";
import { CommonProjectileFiles } from "../spells/projectiles";
import effectFactory from "../src/factories/effect.factory";
import { Creature } from "../src/model/creature/creature";
import { CreatureFamily } from "../src/model/creature/family";
import { ItemSlot } from "../src/model/creature/item";
import { Effect } from "../src/model/spell-item/effect";
import {
  AbilityDamageTypeEnum,
  EffectDamageTypeEnum,
  EffectIDSFileEnum,
  EffectStatisticModifierEnum,
  EffectTimingEnum,
  InvisibilityTypeEnum,
  ItemAbilityCastingAnimationEnum,
  ItemAbilityFlagEnum,
  ItemAbilityLocationEnum,
  ItemAbilityPrimaryTypeEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  LightingEffectEnum,
  LightingEffectTargetEnum,
  SaveTypeEnum,
  SpellExclusionFlagEnum,
  SpellFlagEnum,
  SpellTypeEnum,
} from "../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../src/model/spell-item/effect.type";
import { ProjectileBehaviorEnum } from "../src/model/spell-item/projectile";
import { MonsterEnum, MonsterFamilyEnum } from "./monster";

enum Ids {
  DeathWail,
  FearAura,
  WallOfIce,
}

class Undead extends Creature {
  createTouch(p: {
    diceThrown: number;
    diceSize: number;
    effects?: Effect[];
    slot?: ItemSlot;
  }) {
    return this.addWeapon({
      weapon: {
        stringRef: "monster.undead.weapon.touch",
        icon: MonsterItemIconEnum.Fist,
        equippedSlot: [p.slot ?? "WEAPON1"],
        header: {
          type: ItemAbilityTypeEnum.Melee,
          diceThrown: p.diceThrown,
          diceSize: p.diceSize,
          damageType: AbilityDamageTypeEnum.Crushing,
          speed: 3,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
          effects: p.effects,
        },
      },
    });
  }

  createClaws(diceThrown: number, diceSize: number, effects?: Effect[]) {
    return this.addWeapon({
      weapon: {
        stringRef: "monster.undead.weapon.claws",
        icon: MonsterItemIconEnum.Wolf,
        equippedSlot: ["WEAPON1"],
        header: {
          type: ItemAbilityTypeEnum.Melee,
          diceThrown,
          diceSize,
          damageType: AbilityDamageTypeEnum.Slashing,
          speed: 5,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
          effects,
        },
      },
    });
  }

  createJaws(diceThrown: number, diceSize: number, effects?: Effect[]) {
    return this.addWeapon({
      weapon: {
        stringRef: "monster.undead.weapon.jaws",
        icon: MonsterItemIconEnum.Jaws,
        equippedSlot: ["SHIELD"],
        header: {
          type: ItemAbilityTypeEnum.Melee,
          diceThrown: diceThrown,
          diceSize: diceSize,
          damageType: AbilityDamageTypeEnum.Piercing,
          speed: 3,
          abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
          effects,
        },
      },
    });
  }

  /**
   * Fear Aura
   */
  createFearAura() {
    return this.addSpell({
      name: "monster.undead.ability.fearAura.name",
      description: "monster.undead.ability.fearAura.description",
      id: Ids.FearAura,
      memorizedCount: 1,
      icon: SPELLS.CloakOfFear,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      options: { renew: 1 },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          speed: 1,
          projectile: CommonProjectileFiles.AreaOfSightNonParty,
          range: 30,
          effects: effectFactory.fear({
            duration: 60,
            saveType: SaveTypeEnum.Spell,
          }),
        },
      ],
      ability: {
        preset: SPELLS.CloakOfFear,
        spell: {
          type: "force",
          remove: true,
        },
      },
    });
  }

  /**
   * Death wail
   */
  createDeathWail() {
    return this.addSpell({
      name: "monster.undead.ability.deathWail.name",
      description: "monster.undead.ability.deathWail.description",
      id: Ids.DeathWail,
      memorizedCount: 1,
      icon: SPELLS.WailOfTheBanshee,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          speed: 1,
          projectile: CommonProjectileFiles.AreaOfSightNonParty,
          range: 30,
          effects: [
            {
              opcode: EffectTypeEnum.Slay,
              idsFile: EffectIDSFileEnum.EA,
              idsEntry: "ANYONE",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.Spell],
            },
            {
              opcode: EffectTypeEnum.LightingEffects,
              effect: LightingEffectEnum.HitFingerOfDeath,
              lightingTarget: LightingEffectTargetEnum.SpellTarget,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.Spell],
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "CAS_M07",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.Spell],
            },
          ],
        },
      ],
      ability: {
        preset: SPELLS.WailOfTheBanshee,
        spell: {
          type: "force",
          remove: true,
        },
      },
    });
  }

  /**
   * Wall of Ice
   */
  createWallOfIce() {
    return this.addSpell({
      name: "monster.undead.ability.iceWall.name",
      description: "monster.undead.ability.iceWall.description",
      id: Ids.WallOfIce,
      memorizedCount: 1,
      icon: "RR#ICEW",
      primaryType: ItemAbilityPrimaryTypeEnum.Invoker,
      secondaryType: ItemAbilitySecondaryTypeEnum.OffensiveDamage,
      castingSound: "CAS_M06",
      castingAnimation: ItemAbilityCastingAnimationEnum.Invocation,
      exclusionFlags: [SpellExclusionFlagEnum.Enchanter],
      flags: [SpellFlagEnum.Hostile],
      spellType: SpellTypeEnum.Wizard,
      spellLevel: 4,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Spell,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          speed: 4,
          projectile: {
            name: "Wall of Ice",
            copyFromFile: "ICESTORM",
            speed: 20,
            behaviorFlags: [ProjectileBehaviorEnum.UseHeight],
            impactSound: "EFF_M34",
            areaEffectInfo: {
              areaOfEffect: 341,
              triggerCount: 1,
              explosionDelay: 10,
            },
          },
          range: 40,
          effects: [
            {
              opcode: EffectTypeEnum.Damage,
              type: EffectDamageTypeEnum.Cold,
              diceThrown: 2,
              diceSize: 10,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.BypassMirrorImage],
            },
            {
              opcode: EffectTypeEnum.Damage,
              type: EffectDamageTypeEnum.Crushing,
              diceThrown: 1,
              diceSize: 10,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              saveTypes: [SaveTypeEnum.BypassMirrorImage],
            },
          ],
        },
        //TODO: level 24 header with 6d10 cold and 3d10 crushing, who is using this one??
      ],
      ability: {
        preset: SPELLS.IceStorm,
        spell: {
          type: "noDec",
        },
      },
    });
  }
}

class UndeadFamily extends CreatureFamily<Undead> {
  constructor() {
    super(MonsterFamilyEnum.Undead);
    this.addCreature(this.banshee());
    // this.addCreature(this.deathKnight());
    this.addCreature(this.ghoul());
    // this.addCreature(this.ghast());
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
        "BD302BAN", // Banshee
        "banshe01", //ToB Banshee
        "firmon01", //Unused critter from Firkraag's
        "dsbanshe", //DSotSC
        "f_wailin", //Drizzt Saga
      ],
      data: {
        level1: { pnpValue: 7, value: 17, type: "turn" }, // to approximate their "turned as special undead" from PnP
        strength: 9,
        dexterity: 14,
        constitution: 10,
        intelligence: 16,
        wisdom: 11,
        charisma: 17,
        ac: 0,
        apr: 1,
        xpv: 4000,
        alignment: "CHAOTIC_EVIL",
        morale: 13,
        general: "UNDEAD",
        race: "WRAITH",
        class: "SPECTRE",
        gender: "NIETHER",
        size: "Medium",
        movement: 15,
        immunities: ["undead"],
        items: {
          remove: ["IMMUNE1", "B1-8M2", "IMMCHS"],
        },
        script: {
          remove: ["BDBANSH"],
        },
      },
    });
    banshee.createFearAura();
    banshee.createDeathWail();
    banshee.addTrait({
      immunities: [
        "nonMagicalWeapons",
        "magicResistance",
        "incorporeal",
        "cold",
        "lightning",
      ],
    });
    banshee.createTouch({
      diceThrown: 1,
      diceSize: 8,
    });
    banshee.setBehavior({
      restHeal: true,
      abilities: [this.ability(Ids.DeathWail), this.ability(Ids.FearAura)],
    });
    return banshee;
  }
  /**
   * Death Knight
   */
  private deathKnight() {
    //TODO:
    const knight = this.create({
      monster: MonsterEnum.DeathKnight,
      name: "monster.undead.name.deathKnight",
      files: [
        "C02DEMKN", // Demon Knight
        "DEATHK", // Demon Knight
        "gooddeat", // Durlag's Tower DK mirror fiend
        "DEATHK1", // Demon Knight
        "DECK615", // Demon Knight
        "DVDEATHK", // Death Knight
        "NTDEATH1", // Demonknight
        "NTDEATHK", // Demonknight
        "deathkni", // Plain Death Knight used in ToB
        "deck615", // DoMT hitman
        "uddeath", // Undeadark Death Knights
        "uddeath2", // Underdark Death Knight leader
        "cmskel03", // Dark Horizons
        "cmskel04", // Dark Horizons
        "YSDWFGR2", // Fishing For Trouble
        "YSDWFGRD", // Fishing For Trouble
        "YSDWFKNT", // Fishing For Trouble
        "F_DEATHK", // Drizzt Saga
        "F_DEATHL", // Drizzt Saga
        "NTDEATH1", // NTotSC
        "NTGGOTHA", // NTotSC
      ],
      data: {
        level1: 9,
        strength: 18,
        exceptionalStrength: 100,
        dexterity: 11,
        constitution: 11,
        intelligence: 18,
        wisdom: 16,
        charisma: 10,
        ac: 0,
        apr: 1,
        xpv: 6000,
        alignment: "CHAOTIC_EVIL",
        morale: 17,
        general: "UNDEAD",
        race: "SKELETON",
        class: "DEATHKNIGHT",
        gender: "NIETHER",
        size: "Medium",
        movement: 12,
        immunities: ["undead", "skeletal", "turnUndead"],
        items: {
          remove: ["HELM15", "SHLD06", "RINGDEMN"],
        },
        spells: {
          memorized: [
            { file: SPELLS.DetectInvisibility, memorizedCount: 1 },
            { file: SPELLS.DispelMagic, memorizedCount: 2 },
            { file: SPELLS.PowerWordBlind, memorizedCount: 1 },
            { file: SPELLS.PowerWordKill, memorizedCount: 1 },
            { file: SPELLS.PowerWordStun, memorizedCount: 1 },
            // Symbol of Pain: rr#spain.spl
          ],
        },
      },
    });
    knight.createWallOfIce();
    knight.addTrait({
      immunities: ["turnUndead"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 75,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    knight.setBehavior({
      restHeal: true,
      abilities: [
        { preset: SPELLS.DetectInvisibility, spell: { type: "noDec" } },
        this.ability(Ids.WallOfIce),
      ],
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
        "BDGHAST", // Ghast
        "BDGHASTG", // Greater Ghast
        "BDJUNIA2", // Junia
        "BDYMORI", // Wight
        "BPGHAS01", // Ghast
        "BPGHGR01", // Greater Ghoul
        "BSGHAST1", // Ghast
        "GHAST", // Ghast
        "GHASTD", // Ghast
        "GHASTF01", // Fell Ghast
        "GHASTS", // Ghast
        "GHOULLOR", // Greater Ghoul
        "GRAEL", // Grael
        "L#BHACO", // Ixjan, The Collector
        "L#LIGWI", // Infesting Light
        "L#ORMWIL", // Mountain Light
        "SEWERF3", // Sewerfolk
        "MALKAL", // Mal-Kalen
      ],
      data: {
        level1: 4,
        strength: 16,
        dexterity: 17,
        constitution: 10,
        intelligence: 12,
        wisdom: 10,
        charisma: 6,
        ac: 4,
        apr: 3,
        xpv: 650,
        alignment: "CHAOTIC_EVIL",
        morale: 14,
        general: "UNDEAD",
        race: "GHOUL",
        class: "GHOUL_GHAST",
        gender: "NIETHER",
        size: "Medium",
        movement: 15,
        immunities: ["undead"],
        items: {
          remove: ["ring95", "ghoul1", "ringkora"],
        },
        script: {
          remove: ["ghoul"],
        },
        effects: {
          remove: [EffectTypeEnum.ProtectionFromBackstab],
        },
      },
    });
    const paralyze = effectFactory.paralyze({ duration: 42 });
    ghast.createClaws(1, 4, paralyze);
    ghast.createJaws(1, 8, paralyze);
    ghast.setBehavior({
      restHeal: true,
    });
    ghast.setAdjustments([
      // { files: ["GHOULSU"], summon: true },
      // { files: ["KORAX", "MALKAL"], data: { level1: 4 } },
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
        "AC#FPGHL", // Ghoul
        "GHOUL", // Ghoul
        "GHOULSU", // Ghoul
        "WAGHOUL", // Ghoul
        "KORAX", // Korax the Ghoul
        "BHGHOUL1",
        "ghoul01",
        "GTCIT1",
        "GTCIT2",
        "bodakmd", // BP
        "ghuldmod", // PofQuestPack
        "MH#GLGHO", // Made in heaven Q&E
        "lacedo01", // Lacedon
        "sahlace", // Lacedon
        "JA#SUTY1", // Mod added Lacedon
        "JA#SUTY3", // Mod added Lacedon
      ],
      data: {
        level1: 2,
        strength: 13,
        dexterity: 15,
        constitution: 10,
        intelligence: 7,
        wisdom: 10,
        charisma: 6,
        ac: 6,
        apr: 3,
        xpv: 175,
        alignment: "CHAOTIC_EVIL",
        morale: 12,
        general: "UNDEAD",
        race: "GHOUL",
        class: "GHOUL",
        gender: "NIETHER",
        size: "Medium",
        movement: 9,
        immunities: ["undead"],
        items: {
          remove: ["ring95", "ghoul1", "ringkora"],
        },
        script: {
          remove: ["ghoul"],
        },
        effects: {
          remove: [EffectTypeEnum.ProtectionFromBackstab],
        },
      },
    });
    const paralyze = effectFactory.paralyze({ duration: 30 });
    ghoul.createClaws(1, 3, paralyze);
    ghoul.createJaws(1, 6, paralyze);
    ghoul.setBehavior({
      restHeal: true,
    });
    ghoul.setAdjustments([
      { files: ["GHOULSU"], summon: true },
      { files: ["KORAX"], data: { level1: 4 } },
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
        movement: 12,
      },
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
        movement: 12,
      },
    });
    hunting.setBehavior({ abilities: [this.ability(Ids.FearAura)] });
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
        movement: 12,
      },
    });
    greater.addTrait({
      effects: [
        {
          opcode: EffectTypeEnum.Invisibility,
          type: InvisibilityTypeEnum.Normal,
        },
      ],
    });
    greater.setBehavior({
      abilities: [this.ability(Ids.FearAura)],
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
        movement: 12,
      },
    });
    shadow.createTouch({
      diceThrown: 2,
      diceSize: 4,
    });
    shadow.setBehavior({
      abilities: [this.ability(Ids.FearAura)],
    });
    shadow.setAdjustments([]);
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
        movement: 12,
      },
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
        movement: 12,
      },
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
    warrior.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return warrior;
  }
  /**
   * Spectre
   */
  private spectre() {
    const spectre = this.create({
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
        movement: 12,
      },
    });
    spectre.addTrait({
      immunities: ["cold", "nonSilverNonMagicalWeapons"],
      effects: [
        {
          opcode: EffectTypeEnum.MagicResistanceModifier,
          value: 15,
          type: EffectStatisticModifierEnum.Set,
        },
      ],
    });
    spectre.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return spectre;
  }
  /**
   * Wight
   */
  private wight() {
    const wight = this.create({
      monster: MonsterEnum.Wight,
      name: "monster.undead.name.wight",
      files: [
        "BDJUNIA2", // Junia
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
        movement: 12,
      },
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
        "AC#FPWRA", // Wraith
        "BDWRAI01", // Wraith
        "BDWRAI02", // Wraith
        "BDWRAIT1", // Wraith
        "BPWRAI01", // Wraith
        "DVWRAITH", // Why did you not speak before now?
        "NTBPWATC", // Catacomb Warder
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
        movement: 12,
      },
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
        movement: 12,
      },
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
        movement: 12,
      },
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
        movement: 12,
      },
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
    wraith.setBehavior({
      dialog: ["C#Q04009", "ttspid"],
    });
    return wraith;
  }
}

export const createUndeads = () => new UndeadFamily();
