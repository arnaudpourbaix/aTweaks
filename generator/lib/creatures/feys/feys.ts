import { PRESET_NAMES } from "../../config/ability-presets";
import { ATWEAKS_CREATURES } from "../../config/creatures";
import { ITEMS } from "../../config/item";
import { ATWEAKS_SPELLS, SPELLS } from "../../config/spell-names";
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
import {
  CharmTypeEnum,
  EffectColorLocationEnum,
  EffectDispelResistanceEnum,
  EffectTimingEnum,
  EffectVisualEffectLocationEnum,
  ItemAbilityCastingAnimationEnum,
  ItemAbilityLocationEnum,
  ItemAbilityPrimaryTypeEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  ProficiencyTypeEnum,
  SaveTypeEnum,
  SpellFlagEnum,
  SpellTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

export const createFeys = () => {
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
      // description: [
      //   "Dryads have the ability to throw a powerful charm person spell.",
      //   "This spell is so powerful that targets of the spell suffer a -3 penalty to their saving throws.",
      // ],
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
      name: "monster.fey.ability.speakWithPlants",
      // description: [
      //   "Speak with plants",
      //   "The caster can question plants as to whether or not creatures have passed through them, cause thickets to part to enable easy passage, require vines to entangle pursuers, and command similar services.",
      //   "Immunity to entangle spell for 10 rounds.",
      // ],
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

  // newFiles: [{ files: [ATWEAKS_CREATURES.HamadryadSummon], copyFrom: "DRYAD" }],

  return [dryad];
};
