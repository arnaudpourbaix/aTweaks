import {
  DEFAULT_SPELL_PROBABILITY,
  PRESET_NAMES,
} from "../../config/ability-presets";
import {
  ATWEAKS_CREATURES,
  GARGANTUAN_CREATURES,
  INCORPOREAL_CREATURES,
} from "../../config/creatures";
import { ITEMS } from "../../config/item";
import { ATWEAKS_SPELLS, SPELLS } from "../../config/spell-names";
import { BafExistingStringReference } from "../../config/stringRef";
import { createDimensionDoor } from "../../spells/dimension_door";
import actionFactory from "../../src/factories/action.factory";
import CreatureFactory from "../../src/factories/creature.factory";
import effectFactory from "../../src/factories/effect.factory";
import responseFactory from "../../src/factories/response.factory";
import triggerFactory from "../../src/factories/trigger.factory";
import {
  AdditionalCode,
  ConditionalStatement,
} from "../../src/model/script/script";
import { BaseEffect, IdsEffect } from "../../src/model/spell-item/effect";
import {
  CharmTypeEnum,
  EffectBonusToEnum,
  EffectColorLocationEnum,
  EffectDispelResistanceEnum,
  EffectModifierTypeEnum,
  EffectStatisticModifierEnum,
  EffectTargetEnum,
  EffectTimingEnum,
  EffectVisualEffectLocationEnum,
  ItemAbilityCastingAnimationEnum,
  ItemAbilityLocationEnum,
  ItemAbilityPrimaryTypeEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  LightingEffectEnum,
  LightingEffectTargetEnum,
  PortraitIconEnum,
  ProficiencyTypeEnum,
  SaveTypeEnum,
  SpellFlagEnum,
  SpellTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import { AreaProjectileEnum } from "../../src/model/spell-item/projectile";
import {
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../../src/model/spell-item/spell-protection";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

export const createFeys = () => {
  /**
   * Dryad
   */
  const dryad = CreatureFactory.create({
    monster: MonsterEnum.Dryad,
    family: MonsterFamilyEnum.Fey,
    name: "monster.fey.name.dryad",
    files: [
      "DRYAD", // Dryad of the Cloudpeaks
      ATWEAKS_CREATURES.DryadSummon,
      "DRY01", // Dryad (unused?)
      "DRYAD01", // Dryad (unused?)
      "DRYAD02", // Dryad (unused?)
      "DRYAD03", // Dryad (unused?)
      "IDRYAD01", // Ulene (one of Irenicus captive Dryads)
      "IDRYAD02", // Cania (one of Irenicus captive Dryads)
      "IDRYAD03", // Elyme (one of Irenicus captive Dryads)
      "dr01mod", // Dryad (PofQuestPack)
      "drmod", // Dryad (PofQuestPack)
      "RE_DRYAD", // Dryad (PofQuestPack)
      "H_KATREC", // Katreda
      "L#APEST", // Y'Uula
      "NTARCHAN", // Archandra
      "NTASSAIA", // Assaia
      "NTESSILA", // Essila
      "NTLUCRET", // Lucretia
      "NTMILEA", // Milea
      "NTPAULIA", // Paulia
      "NTTAMAEL", // Tamael
    ],
    newFiles: [
      {
        files: [ATWEAKS_CREATURES.DryadSummon],
        copyFrom: ATWEAKS_CREATURES.DryadSummon,
        stringRef: "monster.fey.name.dryad",
      },
    ],
    data: {
      level1: 2,
      strength: 10,
      dexterity: 12,
      constitution: 11,
      intelligence: 14,
      wisdom: 15,
      charisma: 18,
      ac: 9,
      apr: 1,
      xpv: 975,
      alignment: "NEUTRAL",
      morale: 12,
      general: "HUMANOID",
      race: "FAIRY",
      class: "FAIRY_DRYAD",
      gender: "FEMALE",
      size: "Medium",
    },
  });
  dryad.setAdditionalData({
    movement: { value: 12 },
    immunities: ["fey"],
    proficiencies: [{ type: ProficiencyTypeEnum.PROFICIENCYDAGGER, value: 2 }],
    removeScripts: ["DRYAD"],
  });
  dryad.addTrait({ immunities: ["magicResistance"] });
  const dimensionDoor = dryad.addSpell(
    {
      ...createDimensionDoor({
        memorizedCount: 1,
        spellLevel: 1,
        spellType: SpellTypeEnum.Innate,
        renew: 1,
      }),
      ability: {
        preset: PRESET_NAMES.DimensionDoorOffscreen,
        spell: {
          type: "force",
        },
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.DimensionDoorInfinite
  );
  const charm = dryad.addSpell(
    {
      name: "monster.fey.ability.dryadDireCharm",
      memorizedCount: 3,
      icon: SPELLS.DireCharm,
      castingSound: "CAS_M05",
      flags: [SpellFlagEnum.BreakSanctuary],
      spellType: SpellTypeEnum.Innate,
      castingAnimation: ItemAbilityCastingAnimationEnum.Enchantment,
      primaryType: ItemAbilityPrimaryTypeEnum.Enchanter,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      spellLevel: 1,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          projectile: "SPARKLGO",
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.LivingActor,
          range: 30,
          speed: 1,
          effects: effectFactory.charm({
            charmType: CharmTypeEnum.NeutralDireCharm,
            duration: 180,
            dispelResistance:
              EffectDispelResistanceEnum.DispelNotBypassResistance,
            saveType: SaveTypeEnum.Spell,
            saveBonus: -3,
          }),
        },
      ],
      ability: {
        preset: SPELLS.DireCharm,
        spell: {
          type: "force",
          remove: true,
        },
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.DryadCharmPerson
  );
  const speakWithPlants = dryad.addSpell(
    {
      name: "monster.fey.ability.speakWithPlants.name",
      description: "monster.fey.ability.speakWithPlants.description",
      memorizedCount: 1,
      icon: "RR#FSPKP",
      castingSound: "CAS_P02",
      spellType: SpellTypeEnum.Innate,
      castingAnimation: ItemAbilityCastingAnimationEnum.Alteration,
      primaryType: ItemAbilityPrimaryTypeEnum.Transmuter,
      secondaryType: ItemAbilitySecondaryTypeEnum.NonCombat,
      spellLevel: 1,
      options: { renew: 1 },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.Caster,
          icon: "RR#FSPKP",
          range: 30,
          speed: 1,
          effects: [
            {
              opcode: EffectTypeEnum.CreateItemInSlot,
              slot: "SLOT_AMULET",
              resource: ITEMS.EntangleImmunity,
              timing: EffectTimingEnum.InstantLimited,
              duration: 60,
              dispelResistance:
                EffectDispelResistanceEnum.DispelBypassResistance,
            },
            {
              opcode: EffectTypeEnum.CharacterColorPulse,
              color: { red: 72, green: 243, blue: 102 },
              location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
              cycleSpeed: 30,
              timing: EffectTimingEnum.InstantLimited,
              duration: 1,
              dispelResistance:
                EffectDispelResistanceEnum.DispelBypassResistance,
            },
            {
              opcode: EffectTypeEnum.PlayVisualEffect,
              playWhere: EffectVisualEffectLocationEnum.OverTargetAttached,
              resource: "SPRMCURS",
              timing: EffectTimingEnum.InstantLimited,
              duration: 2,
              dispelResistance:
                EffectDispelResistanceEnum.DispelBypassResistance,
            },
          ],
        },
      ],
      ability: {
        spell: {
          type: "force",
        },
        disableInterrupt: true,
        triggers: [{ name: "CheckStatGT", params: ["Myself", 0, "ENTANGLE"] }],
        timer: { name: "speakWithPlants", value: 60 },
      },
    },
    ATWEAKS_SPELLS.SpeakWithPlants
  );
  const globals = {
    Wilderness: "ja#wilderness",
    MinscCharmed: "MinscCharmed",
    HelpDryads: "HelpDryads",
    SummonDryads: "SummonDryads",
    VaelasaHostile: "VaelasaHostile",
    CloakwoodHamadryad: "rr#hamat",
  };
  const dryadWildernessAbilities: ConditionalStatement[] = [
    {
      comment: "Can use dimension door and detect traps",
      triggers: [
        triggerFactory.global(globals.Wilderness, 0),
        { name: "AreaType", params: ["OUTDOOR"] },
        { name: "AreaType", params: ["CITY"], negation: true },
        { name: "AreaType", params: ["DUNGEON"], negation: true },
      ],
      responses: responseFactory.response([
        actionFactory.setGlobal(globals.Wilderness, 1),
      ]),
    },
    {
      triggers: [
        triggerFactory.global(globals.Wilderness, 0),
        {
          name: "Or",
          triggers: [
            {
              name: "HaveSpellRES",
              params: [ATWEAKS_SPELLS.DimensionDoorInfinite],
            },
            {
              name: "HaveSpellRES",
              params: [ATWEAKS_SPELLS.DetectSnaresAndPits],
            },
          ],
        },
      ],
      responses: responseFactory.response([
        {
          name: "RemoveSpellRES",
          params: [ATWEAKS_SPELLS.DimensionDoorInfinite],
        },
        {
          name: "RemoveSpellRES",
          params: [ATWEAKS_SPELLS.DetectSnaresAndPits],
        },
        actionFactory.setGlobal(globals.Wilderness, 2),
      ]),
    },
  ];
  const irenicusCode: ConditionalStatement[] = [
    {
      comment: "Irenicus' Dungeon specific code",
      triggers: [
        {
          name: "Name",
          params: ["Ulene", "Myself"],
        },
        {
          name: "AreaCheck",
          params: ["AR0602"], // Irenicus' Dungeon, first level
        },
        triggerFactory.global(globals.MinscCharmed, 1, "AR0602"),
        triggerFactory.global(globals.HelpDryads, 0, "GLOBAL"),
        { name: "See", params: ["Minsc"], negation: true },
        { name: "Range", params: ["Minsc", 4], negation: true },
      ],
      responses: responseFactory.response([
        {
          name: "ActionOverride",
          params: ["Minsc", "JumpToPoint([4069.1222])"],
        },
      ]),
    },
    {
      triggers: [
        {
          name: "Name",
          params: ["Ulene", "Myself"],
        },
        {
          name: "AreaCheck",
          params: ["AR0602"], // Irenicus' Dungeon, first level
        },
        triggerFactory.global(globals.MinscCharmed, 1, "AR0602"),
        triggerFactory.global(globals.HelpDryads, 0, "GLOBAL"),
        { name: "See", params: ["Minsc"] },
        { name: "Range", params: ["Minsc", 4], negation: true },
      ],
      responses: responseFactory.response([
        {
          name: "ActionOverride",
          params: ["Minsc", `MoveToObject("Ulene")`],
        },
      ]),
    },
  ];
  const dryadAdditionalCode: AdditionalCode = {
    location: "trackTargets",
    triggers: [
      { name: "HaveSpellRES", params: [ATWEAKS_SPELLS.DryadCharmPerson] },
    ],
    actions: [],
  };
  dryad.setAttack({ melee: false });
  dryad.setBehavior({
    dialog: ["CDryad", "Ulene", "L#APEST"],
    abilities: [
      dimensionDoor.ability!,
      speakWithPlants.ability!,
      charm.ability!,
    ],
    additionalCodes: [dryadAdditionalCode],
    customCodes: [
      {
        location: "init",
        type: "insertBefore",
        statements: [...dryadWildernessAbilities, ...irenicusCode],
      },
    ],
  });
  dryad.setAdjustments([
    {
      files: [ATWEAKS_CREATURES.DryadSummon],
      summon: true,
    },
    {
      files: ["DRYAD", "L#APEST"],
      data: { class: "INNOCENT" },
    },
  ]);
  dryad.validate();

  /**
   * Hamadryad
   */
  const hamadryad = CreatureFactory.create({
    monster: MonsterEnum.Hamadryad,
    family: MonsterFamilyEnum.Fey,
    name: "monster.fey.name.hamadryad",
    files: [
      "DRYADHA",
      ATWEAKS_CREATURES.HamadryadSummon,
      "VAELASA", // Vaelasa (Fairy Queen in Windsper Hills)
      "WQXHAMA", // The White Queen
      "WIDRYAD1", // Dryad of Peldvale
      "WIDRYAD2", // Dryad of Peldvale
      "BDHAMADC", // Corrupted Hamadryad
      "BDHAMADR", // Hamadryad
    ],
    newFiles: [
      {
        files: [ATWEAKS_CREATURES.HamadryadSummon],
        copyFrom: ATWEAKS_CREATURES.HamadryadSummon,
        stringRef: "monster.fey.name.hamadryad",
      },
    ],
    data: {
      level1: 4,
      strength: 10,
      dexterity: 18,
      constitution: 12,
      intelligence: 14,
      wisdom: 14,
      charisma: 18,
      ac: 6,
      apr: 1,
      xpv: 1400,
      alignment: "NEUTRAL",
      morale: 12,
      general: "HUMANOID",
      race: "FAIRY",
      class: "FAIRY_DRYAD",
      gender: "FEMALE",
      size: "Medium",
    },
  });
  hamadryad.setAdditionalData({
    movement: { value: 15 },
    immunities: ["fey"],
    proficiencies: [{ type: ProficiencyTypeEnum.PROFICIENCYDAGGER, value: 2 }],
    removeItems: ["ANTIWEB"],
    removeScripts: ["HAMA", "BDHAMADC"],
    memorizedSpells: [
      { file: ATWEAKS_SPELLS.DryadCharmPerson, memorizedCount: 3 },
      { file: ATWEAKS_SPELLS.SpeakWithPlants, memorizedCount: 1 },
      { file: ATWEAKS_SPELLS.DimensionDoorInfinite, memorizedCount: 1 },
    ],
    deleteEffectOpcodes: [
      EffectTypeEnum.CastingTimeModifier,
      EffectTypeEnum.ProtectionFromSpell,
    ],
  });
  hamadryad.addTrait({
    immunities: ["entangle"],
    effects: [
      {
        opcode: EffectTypeEnum.MagicResistanceModifier,
        value: 75,
        type: EffectStatisticModifierEnum.Set,
      },
    ],
  });
  const entangleCommonEffect: BaseEffect = {
    timing: EffectTimingEnum.InstantLimited,
    duration: 6,
    dispelResistance: EffectDispelResistanceEnum.DispelNotBypassResistance,
    saveTypes: [SaveTypeEnum.Spell],
  };
  const entangle = hamadryad.addSpell(
    {
      name: "monster.fey.ability.entangle.name",
      description: "monster.fey.ability.entangle.description",
      memorizedCount: 1,
      icon: SPELLS.Entangle,
      castingSound: "CAS_P08",
      spellType: SpellTypeEnum.Innate,
      castingAnimation: ItemAbilityCastingAnimationEnum.Alteration,
      primaryType: ItemAbilityPrimaryTypeEnum.Transmuter,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      spellLevel: 1,
      options: {
        renew: 3,
      },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          projectile: {
            copyFromFile: "ENTANG2",
            name: "Hamadryad Entangle",
            areaEffectInfo: {
              areaProjectileFlags: [AreaProjectileEnum.AffectOnlyEnemies],
            },
          },
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          range: 30,
          speed: 1,
          effects: [
            ...[...GARGANTUAN_CREATURES, ...INCORPOREAL_CREATURES].map(
              (c) =>
                <IdsEffect>{
                  opcode: EffectTypeEnum.UseEFFFile,
                  idsFile: c[0],
                  idsEntry: c[1],
                  timing: EffectTimingEnum.InstantLimited,
                  duration: 6,
                }
            ),
            {
              opcode: EffectTypeEnum.MovementRateBonus,
              type: EffectModifierTypeEnum.SetPercentOf,
              value: 50,
              ...entangleCommonEffect,
              saveTypes: undefined,
            },
            {
              opcode: EffectTypeEnum.MovementRateBonus,
              type: EffectModifierTypeEnum.Set,
              value: 0,
              ...entangleCommonEffect,
            },
            {
              opcode: EffectTypeEnum.Thac0Bonus,
              type: EffectModifierTypeEnum.Increment,
              value: -2,
              ...entangleCommonEffect,
            },
            {
              opcode: EffectTypeEnum.ArmorClassBonus,
              bonusTo: EffectBonusToEnum.AllWeapons,
              value: -2,
              ...entangleCommonEffect,
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "CRE_P01",
              ...entangleCommonEffect,
              duration: 1,
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "EFF_M22A",
              ...entangleCommonEffect,
              timing: EffectTimingEnum.DelayPermanent,
            },
            {
              opcode: EffectTypeEnum.EntangleOverlay,
              ...entangleCommonEffect,
            },
            {
              opcode: EffectTypeEnum.DisplayPortraitIcon,
              icon: PortraitIconEnum.Entangled,
              ...entangleCommonEffect,
            },
          ],
        },
      ],
      ability: {
        preset: SPELLS.Entangle,
        spell: {
          type: "force",
        },
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.HamadryadEntangle
  );
  const animalFriendshipCommonEffect: BaseEffect = {
    timing: EffectTimingEnum.InstantLimited,
    duration: 120,
    dispelResistance: EffectDispelResistanceEnum.DispelNotBypassResistance,
    saveTypes: [SaveTypeEnum.Spell],
  };
  const animalFriendship = hamadryad.addSpell(
    {
      name: "monster.fey.ability.animalFriendship.name",
      description: "monster.fey.ability.animalFriendship.description",
      memorizedCount: 1,
      icon: SPELLS.CharmPersonOrAnimal,
      flags: [SpellFlagEnum.CastableWhenSilenced],
      castingSound: "CORAN03",
      spellType: SpellTypeEnum.Innate,
      primaryType: ItemAbilityPrimaryTypeEnum.Enchanter,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      spellLevel: 1,
      options: {
        renew: 1,
      },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.LivingActor,
          range: 30,
          speed: 1,
          effects: [
            {
              opcode: EffectTypeEnum.ProtectionFromResourceAndMessage,
              type: {
                stat: SpellProtectionStat.General,
                relation: SpellProtectionRelation.NotEqual,
              },
              value: "ANIMAL",
              resource: ATWEAKS_SPELLS.AnimalFriendship,
              ...animalFriendshipCommonEffect,
            },
            {
              opcode: EffectTypeEnum.CharmCreature,
              charmType: CharmTypeEnum.NeutralCharm,
              generalType: "ANIMAL",
              ...animalFriendshipCommonEffect,
            },
            {
              opcode: EffectTypeEnum.CharacterColorPulse,
              color: { red: 120, green: 90, blue: 30 },
              location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
              cycleSpeed: 25,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              ...animalFriendshipCommonEffect,
              duration: 1,
            },
            {
              opcode: EffectTypeEnum.PlayVisualEffect,
              playWhere: EffectVisualEffectLocationEnum.OverTargetAttached,
              resource: "SPNWCHRM",
              ...animalFriendshipCommonEffect,
              duration: 3,
            },
          ],
        },
      ],
      ability: {
        spell: {
          type: "force",
          probability: DEFAULT_SPELL_PROBABILITY,
        },
        targets: [
          {
            name: "Animals",
          },
        ],
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.AnimalFriendship
  );
  const detectTraps = hamadryad.addSpell(
    {
      memorizedCount: 1,
      name: "monster.fey.ability.detectTraps.name",
      description: "monster.fey.ability.detectTraps.description",
      castingSound: "CAS_P04",
      flags: [SpellFlagEnum.OutdoorsOnly],
      spellType: SpellTypeEnum.Innate,
      castingAnimation: ItemAbilityCastingAnimationEnum.Divination,
      primaryType: ItemAbilityPrimaryTypeEnum.Diviner,
      secondaryType: ItemAbilitySecondaryTypeEnum.NonCombat,
      icon: SPELLS.FindTraps,
      options: {
        renew: 16,
      },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.Caster,
          speed: 1,
          projectile: "INAREANS",
          effects: [
            {
              opcode: EffectTypeEnum.FindTraps,
              duration: 96,
              target: EffectTargetEnum.Self,
            },
            {
              opcode: EffectTypeEnum.DisplayPortraitIcon,
              icon: PortraitIconEnum.DetectingTrapsIllusions,
              duration: 96,
              target: EffectTargetEnum.Self,
            },
            {
              opcode: EffectTypeEnum.LightingEffects,
              effect: LightingEffectEnum.DivinationWater,
              lightingTarget: LightingEffectTargetEnum.SpellTarget,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              target: EffectTargetEnum.Self,
            },
            {
              opcode: EffectTypeEnum.CharacterColorPulse,
              color: { red: 70, green: 32, blue: 73 },
              location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
              cycleSpeed: 20,
              duration: 2,
            },
          ],
        },
      ],
      ability: {
        spell: {
          resource: ATWEAKS_SPELLS.DetectSnaresAndPits,
          type: "force",
          probability: DEFAULT_SPELL_PROBABILITY,
        },
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.DetectSnaresAndPits
  );
  // TODO: Quench Fire
  // You extinguish all fires in a 30-foot cube centered on a point you choose within range. Any nonmagical fire is put out automatically, as are magical flames created by a spell of 3rd level or lower.
  // For each spell of 4th level or higher which is creating flame within this area,  make an ability check using your spellcasting ability.
  // On a successful check, the spell that created the fire ends. Fire created by a magical item is also doused, and the item becomes unable to produce fire for 1d4 hours.
  hamadryad.setAttack({ melee: false });
  hamadryad.setBehavior({
    dialog: ["VAELASA"],
    abilities: [
      dimensionDoor.ability!,
      speakWithPlants.ability!,
      entangle.ability!,
      charm.ability!,
      animalFriendship.ability!,
      detectTraps.ability!,
    ],
    additionalCodes: [dryadAdditionalCode],
    customCodes: [
      {
        location: "init",
        type: "insertBefore",
        statements: [
          ...dryadWildernessAbilities,
          {
            comment: "Vaelasa, the Fairy Queen",
            triggers: [
              {
                name: "Name",
                params: ["VAELASA", "Myself"],
              },
              {
                name: "AreaCheck",
                params: ["AR1200"], // Windsper Hills
              },
              triggerFactory.global(globals.SummonDryads, 1, "AR1200"),
            ],
            responses: responseFactory.response([
              actionFactory.setGlobal(globals.SummonDryads, 2, "AR1200"),
              {
                name: "StartCutSceneMode",
              },
              {
                name: "StartCutScene",
                params: ["Cut23a"],
              },
            ]),
          },
          {
            triggers: [
              {
                name: "Name",
                params: ["VAELASA", "Myself"],
              },
              {
                name: "AreaCheck",
                params: ["AR0602"], // Irenicus' Dungeon, first level
              },
              { name: "AttackedBy", params: ["GOODCUTOFF", "DEFAULT"] },
              triggerFactory.global(globals.VaelasaHostile, 0, "GLOBAL"),
            ],
            responses: responseFactory.response([
              actionFactory.setGlobal(globals.VaelasaHostile, 1, "GLOBAL"),
              { name: "Enemy" },
            ]),
          },
          {
            triggers: [
              triggerFactory.global("rr#chama", 1, "MYAREA"),
              triggerFactory.global(globals.CloakwoodHamadryad, 0),
              { name: "See", params: ["PC"] },
            ],
            responses: responseFactory.response([
              actionFactory.setGlobal(globals.CloakwoodHamadryad, 1),
              { name: "FaceObject", params: ["PC"] },
              {
                name: "DisplayStringHead",
                params: ["Myself", BafExistingStringReference.LeaveMyWood],
              },
            ]),
          },
        ],
      },
    ],
  });
  hamadryad.setAdjustments([
    {
      files: [ATWEAKS_CREATURES.HamadryadSummon],
      summon: true,
    },
    {
      files: ["WIDRYAD1", "WIDRYAD2"],
      data: { level1: 8 },
    },
    {
      files: ["BDHAMADC"],
      data: { alignment: "NEUTRAL_EVIL" },
    },
  ]);
  hamadryad.validate();

  /**
   * Nymph
   */
  const nymph = CreatureFactory.create({
    monster: MonsterEnum.Nymph,
    family: MonsterFamilyEnum.Fey,
    name: "monster.fey.name.nymph",
    files: [
      "BDNYMP01",
      "HGNYMPH", // Nymph
      "BDNYMP02", // Corrupted Nymph
      "NYMPHSU", // default summoned Nymph
      "NYMPHSUM", // summoned Nymph
      "DW#NYMSU", // SCSII summoned Nymph
      "ABELA", // Abela the Nymph
      "WQXNYM", // White Queen
    ],
    data: {
      level1: 4,
      strength: 10,
      dexterity: 18,
      constitution: 12,
      intelligence: 14,
      wisdom: 14,
      charisma: 18,
      ac: 6,
      apr: 1,
      xpv: 1400,
      alignment: "NEUTRAL",
      morale: 12,
      general: "HUMANOID",
      race: "FAIRY",
      class: "FAIRY_DRYAD",
      gender: "FEMALE",
      size: "Medium",
    },
  });
  nymph.setAdditionalData({
    movement: { value: 15 },
    immunities: ["fey"],
    proficiencies: [{ type: ProficiencyTypeEnum.PROFICIENCYDAGGER, value: 2 }],
    removeItems: ["ANTIWEB"],
    removeScripts: ["HAMA", "BDHAMADC"],
    memorizedSpells: [
      { file: ATWEAKS_SPELLS.DryadCharmPerson, memorizedCount: 3 },
      { file: ATWEAKS_SPELLS.SpeakWithPlants, memorizedCount: 1 },
      { file: ATWEAKS_SPELLS.DimensionDoorInfinite, memorizedCount: 1 },
    ],
    deleteEffectOpcodes: [
      EffectTypeEnum.CastingTimeModifier,
      EffectTypeEnum.ProtectionFromSpell,
    ],
  });
  nymph.addTrait({
    immunities: ["entangle"],
    effects: [
      {
        opcode: EffectTypeEnum.MagicResistanceModifier,
        value: 75,
        type: EffectStatisticModifierEnum.Set,
      },
    ],
  });
  const entangle = nymph.addSpell(
    {
      name: "monster.fey.ability.entangle.name",
      description: "monster.fey.ability.entangle.description",
      memorizedCount: 1,
      icon: SPELLS.Entangle,
      castingSound: "CAS_P08",
      spellType: SpellTypeEnum.Innate,
      castingAnimation: ItemAbilityCastingAnimationEnum.Alteration,
      primaryType: ItemAbilityPrimaryTypeEnum.Transmuter,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      spellLevel: 1,
      options: {
        renew: 3,
      },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          projectile: {
            copyFromFile: "ENTANG2",
            name: "Hamadryad Entangle",
            areaEffectInfo: {
              areaProjectileFlags: [AreaProjectileEnum.AffectOnlyEnemies],
            },
          },
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          range: 30,
          speed: 1,
          effects: [
            ...[...GARGANTUAN_CREATURES, ...INCORPOREAL_CREATURES].map(
              (c) =>
                <IdsEffect>{
                  opcode: EffectTypeEnum.UseEFFFile,
                  idsFile: c[0],
                  idsEntry: c[1],
                  timing: EffectTimingEnum.InstantLimited,
                  duration: 6,
                }
            ),
            {
              opcode: EffectTypeEnum.MovementRateBonus,
              type: EffectModifierTypeEnum.SetPercentOf,
              value: 50,
              ...entangleCommonEffect,
              saveTypes: undefined,
            },
            {
              opcode: EffectTypeEnum.MovementRateBonus,
              type: EffectModifierTypeEnum.Set,
              value: 0,
              ...entangleCommonEffect,
            },
            {
              opcode: EffectTypeEnum.Thac0Bonus,
              type: EffectModifierTypeEnum.Increment,
              value: -2,
              ...entangleCommonEffect,
            },
            {
              opcode: EffectTypeEnum.ArmorClassBonus,
              bonusTo: EffectBonusToEnum.AllWeapons,
              value: -2,
              ...entangleCommonEffect,
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "CRE_P01",
              ...entangleCommonEffect,
              duration: 1,
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "EFF_M22A",
              ...entangleCommonEffect,
              timing: EffectTimingEnum.DelayPermanent,
            },
            {
              opcode: EffectTypeEnum.EntangleOverlay,
              ...entangleCommonEffect,
            },
            {
              opcode: EffectTypeEnum.DisplayPortraitIcon,
              icon: PortraitIconEnum.Entangled,
              ...entangleCommonEffect,
            },
          ],
        },
      ],
      ability: {
        preset: SPELLS.Entangle,
        spell: {
          type: "force",
        },
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.HamadryadEntangle
  );
  const animalFriendship = nymph.addSpell(
    {
      name: "monster.fey.ability.animalFriendship.name",
      description: "monster.fey.ability.animalFriendship.description",
      memorizedCount: 1,
      icon: SPELLS.CharmPersonOrAnimal,
      flags: [SpellFlagEnum.CastableWhenSilenced],
      castingSound: "CORAN03",
      spellType: SpellTypeEnum.Innate,
      primaryType: ItemAbilityPrimaryTypeEnum.Enchanter,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      spellLevel: 1,
      options: {
        renew: 1,
      },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.LivingActor,
          range: 30,
          speed: 1,
          effects: [
            {
              opcode: EffectTypeEnum.ProtectionFromResourceAndMessage,
              type: {
                stat: SpellProtectionStat.General,
                relation: SpellProtectionRelation.NotEqual,
              },
              value: "ANIMAL",
              resource: ATWEAKS_SPELLS.AnimalFriendship,
              ...animalFriendshipCommonEffect,
            },
            {
              opcode: EffectTypeEnum.CharmCreature,
              charmType: CharmTypeEnum.NeutralCharm,
              generalType: "ANIMAL",
              ...animalFriendshipCommonEffect,
            },
            {
              opcode: EffectTypeEnum.CharacterColorPulse,
              color: { red: 120, green: 90, blue: 30 },
              location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
              cycleSpeed: 25,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              ...animalFriendshipCommonEffect,
              duration: 1,
            },
            {
              opcode: EffectTypeEnum.PlayVisualEffect,
              playWhere: EffectVisualEffectLocationEnum.OverTargetAttached,
              resource: "SPNWCHRM",
              ...animalFriendshipCommonEffect,
              duration: 3,
            },
          ],
        },
      ],
      ability: {
        spell: {
          type: "force",
          probability: DEFAULT_SPELL_PROBABILITY,
        },
        targets: [
          {
            name: "Animals",
          },
        ],
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.AnimalFriendship
  );
  const detectTraps = nymph.addSpell(
    {
      memorizedCount: 1,
      name: "monster.fey.ability.detectTraps.name",
      description: "monster.fey.ability.detectTraps.description",
      castingSound: "CAS_P04",
      flags: [SpellFlagEnum.OutdoorsOnly],
      spellType: SpellTypeEnum.Innate,
      castingAnimation: ItemAbilityCastingAnimationEnum.Divination,
      primaryType: ItemAbilityPrimaryTypeEnum.Diviner,
      secondaryType: ItemAbilitySecondaryTypeEnum.NonCombat,
      icon: SPELLS.FindTraps,
      options: {
        renew: 16,
      },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.Caster,
          speed: 1,
          projectile: "INAREANS",
          effects: [
            {
              opcode: EffectTypeEnum.FindTraps,
              duration: 96,
              target: EffectTargetEnum.Self,
            },
            {
              opcode: EffectTypeEnum.DisplayPortraitIcon,
              icon: PortraitIconEnum.DetectingTrapsIllusions,
              duration: 96,
              target: EffectTargetEnum.Self,
            },
            {
              opcode: EffectTypeEnum.LightingEffects,
              effect: LightingEffectEnum.DivinationWater,
              lightingTarget: LightingEffectTargetEnum.SpellTarget,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              target: EffectTargetEnum.Self,
            },
            {
              opcode: EffectTypeEnum.CharacterColorPulse,
              color: { red: 70, green: 32, blue: 73 },
              location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
              cycleSpeed: 20,
              duration: 2,
            },
          ],
        },
      ],
      ability: {
        spell: {
          resource: ATWEAKS_SPELLS.DetectSnaresAndPits,
          type: "force",
          probability: DEFAULT_SPELL_PROBABILITY,
        },
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.DetectSnaresAndPits
  );
  // TODO: Quench Fire
  // You extinguish all fires in a 30-foot cube centered on a point you choose within range. Any nonmagical fire is put out automatically, as are magical flames created by a spell of 3rd level or lower.
  // For each spell of 4th level or higher which is creating flame within this area,  make an ability check using your spellcasting ability.
  // On a successful check, the spell that created the fire ends. Fire created by a magical item is also doused, and the item becomes unable to produce fire for 1d4 hours.
  nymph.setAttack({ melee: false });
  nymph.setBehavior({
    dialog: ["VAELASA"],
    abilities: [
      dimensionDoor.ability!,
      speakWithPlants.ability!,
      entangle.ability!,
      charm.ability!,
      animalFriendship.ability!,
      detectTraps.ability!,
    ],
    additionalCodes: [dryadAdditionalCode],
    customCodes: [
      {
        location: "init",
        type: "insertBefore",
        statements: [
          ...dryadWildernessAbilities,
          {
            comment: "Vaelasa, the Fairy Queen",
            triggers: [
              {
                name: "Name",
                params: ["VAELASA", "Myself"],
              },
              {
                name: "AreaCheck",
                params: ["AR1200"], // Windsper Hills
              },
              triggerFactory.global(globals.SummonDryads, 1, "AR1200"),
            ],
            responses: responseFactory.response([
              actionFactory.setGlobal(globals.SummonDryads, 2, "AR1200"),
              {
                name: "StartCutSceneMode",
              },
              {
                name: "StartCutScene",
                params: ["Cut23a"],
              },
            ]),
          },
          {
            triggers: [
              {
                name: "Name",
                params: ["VAELASA", "Myself"],
              },
              {
                name: "AreaCheck",
                params: ["AR0602"], // Irenicus' Dungeon, first level
              },
              { name: "AttackedBy", params: ["GOODCUTOFF", "DEFAULT"] },
              triggerFactory.global(globals.VaelasaHostile, 0, "GLOBAL"),
            ],
            responses: responseFactory.response([
              actionFactory.setGlobal(globals.VaelasaHostile, 1, "GLOBAL"),
              { name: "Enemy" },
            ]),
          },
          {
            triggers: [
              triggerFactory.global("rr#chama", 1, "MYAREA"),
              triggerFactory.global(globals.CloakwoodHamadryad, 0),
              { name: "See", params: ["PC"] },
            ],
            responses: responseFactory.response([
              actionFactory.setGlobal(globals.CloakwoodHamadryad, 1),
              { name: "FaceObject", params: ["PC"] },
              {
                name: "DisplayStringHead",
                params: ["Myself", BafExistingStringReference.LeaveMyWood],
              },
            ]),
          },
        ],
      },
    ],
  });
  nymph.setAdjustments([
    {
      files: [ATWEAKS_CREATURES.HamadryadSummon],
      summon: true,
    },
    {
      files: ["WIDRYAD1", "WIDRYAD2"],
      data: { level1: 8 },
    },
    {
      files: ["BDHAMADC"],
      data: { alignment: "NEUTRAL_EVIL" },
    },
  ]);
  nymph.validate();

  return [dryad, hamadryad];
};

function fn() {}
