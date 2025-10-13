import {
  DEFAULT_SPELL_PROBABILITY,
  PRESET_NAMES,
} from "../../config/ability-presets";
import {
  ATWEAKS_CREATURES,
  GARGANTUAN_CREATURES,
  INCORPOREAL_CREATURES,
} from "../../config/creatures";
import { ATWEAKS_SPELLS, SPELLS } from "../../config/spell-names";
import {
  BafExistingStringReference,
  TraStringReferenceEnum,
} from "../../config/stringRef";
import { RawCreatureAbility } from "../../src/model/raw/ability";
import { RawCreature } from "../../src/model/raw/creature";
import { IdsEffect, RawBaseEffect } from "../../src/model/raw/effect";
import {
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../../src/model/raw/spell-protection";
import { createTraitItem } from "../../src/services/creature-helper";
import { FactoryService } from "../../src/services/factory.service";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";
import {
  abilityDryadDireCharm,
  abilitySpeakWithPlants,
  dryadWildernessAbilities,
} from "./dryad";

const factory = FactoryService.instance;

// Creature Id
const id = MonsterEnum.Hamadryad;
// Items
const traits = file(1, id);
// Script
const script = bafFile(id);

const entangleCommonEffect: RawBaseEffect = {
  timing: "InstantLimited",
  duration: 6,
  dispelResistance: "DispelNotBypassResistance",
  saveTypes: ["Spell"],
};
const animalFriendshipCommonEffect: RawBaseEffect = {
  timing: "InstantLimited",
  duration: 120,
  dispelResistance: "DispelNotBypassResistance",
  saveTypes: ["Spell"],
};
export const abilityAnimalFriendship: RawCreatureAbility = {
  name: "Animal Friendship",
  target: [
    {
      name: "Animals",
    },
  ],
  spell: {
    resource: ATWEAKS_SPELLS.AnimalFriendship,
    type: "force",
    probability: DEFAULT_SPELL_PROBABILITY,
  },
  disableInterrupt: true,
};

const globals = {
  SummonDryads: "SummonDryads",
  VaelasaHostile: "VaelasaHostile",
  CloakwoodHamadryad: "rr#hamat",
};

const name = "Hamadryad";

export const FEY_HAMADRYAD: RawCreature = {
  name,
  bafFile: `lib/pnp-monster/fey/${script}`,
  tpaFile: "lib/pnp-monster/fey/hamadryad",
  tracking: true,
  combatWalk: true,
  dialog: ["VAELASA"],
  attack: {
    melee: false,
    ranged: false,
  },
  data: {
    level1: 4,
    strength: 10,
    dexterity: 18,
    constitution: 12,
    intelligence: 14,
    wisdom: 14,
    charisma: 18,
    movement: 15,
    ac: 7,
    apr: 1,
    xpv: 1400,
    alignment: "NEUTRAL",
    morale: 12,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "HUMANOID",
    race: "FAIRY",
    class: "FAIRY_DRYAD",
    gender: "FEMALE",
    size: "Medium",
  },
  additionalData: {
    immunities: ["fey"],
    proficiencies: [{ type: "PROFICIENCYDAGGER", value: 2 }],
    removeItems: ["ANTIWEB"],
    removeScripts: ["HAMA", "DW1MELGE", "BDHAMADC"],
    memorizedSpells: [
      { file: ATWEAKS_SPELLS.DryadCharmPerson, memorizedCount: 3 },
      { file: ATWEAKS_SPELLS.SpeakWithPlants, memorizedCount: 1 },
      { file: ATWEAKS_SPELLS.DimensionDoorInfinite, memorizedCount: 1 },
    ],
    deleteEffectOpcodes: ["CastingTimeModifier", "ProtectionFromSpell"],
  },
  projectiles: [
    {
      file: ATWEAKS_SPELLS.HamadryadEntangle,
      copyFromFile: "ENTANG2",
      description: "Hamadryad Entangle",
      areaEffectInfo: {
        areaProjectileFlags: ["AffectOnlyEnemies"],
      },
    },
  ],
  effectFiles: [
    {
      file: ATWEAKS_SPELLS.HamadryadEntangle,
      opcode: "ProtectionFromSpell",
      resource: ATWEAKS_SPELLS.HamadryadEntangle,
      timing: "InstantPermanentUntilDeath",
    },
  ],
  spells: [
    {
      name: "Entangle",
      file: ATWEAKS_SPELLS.HamadryadEntangle,
      stringRef: TraStringReferenceEnum.Entangle,
      description: [
        "Hamadryad can cast Entangle as the priest spell, but it won't affect its allies since her affinity with nature.",
      ],
      memorizedCount: 1,
      icon: SPELLS.Entangle,
      castingSound: "CAS_P08",
      spellType: "Innate",
      castingAnimation: "Alteration",
      primaryType: "Transmuter",
      secondaryType: "Disabling",
      spellLevel: 1,
      infiniteUse: 1,
      headers: [
        {
          type: "Melee",
          projectile: ATWEAKS_SPELLS.HamadryadEntangle,
          location: "Ability",
          target: "AnyPointWithinRange",
          range: 30,
          speed: 1,
          effects: [
            ...[...GARGANTUAN_CREATURES, ...INCORPOREAL_CREATURES].map(
              (c) =>
                <IdsEffect>{
                  opcode: "UseEFFFile",
                  idsFile: c[0],
                  idsEntry: c[1],
                  timing: "InstantLimited",
                  duration: 6,
                  resource: ATWEAKS_SPELLS.HamadryadEntangle,
                }
            ),
            {
              opcode: "MovementRateBonus",
              type: "SetPercentOf",
              value: 50,
              ...entangleCommonEffect,
              saveTypes: undefined,
            },
            {
              opcode: "MovementRateBonus",
              type: "Set",
              value: 0,
              ...entangleCommonEffect,
            },
            {
              opcode: "Thac0Bonus",
              type: "Increment",
              value: -2,
              ...entangleCommonEffect,
            },
            {
              opcode: "ArmorClassBonus",
              bonusTo: "AllWeapons",
              value: -2,
              ...entangleCommonEffect,
            },
            {
              opcode: "PlaySound",
              resource: "CRE_P01",
              ...entangleCommonEffect,
              duration: 1,
            },
            {
              opcode: "PlaySound",
              resource: "EFF_M22A",
              ...entangleCommonEffect,
              timing: "DelayPermanent",
            },
            {
              opcode: "EntangleOverlay",
              ...entangleCommonEffect,
            },
            {
              opcode: "DisplayPortraitIcon",
              icon: "Entangled",
              ...entangleCommonEffect,
            },
          ],
        },
      ],
    },
    {
      name: "Animal Friendship",
      file: ATWEAKS_SPELLS.AnimalFriendship,
      stringRef: TraStringReferenceEnum.AnimalFriendship,
      description: [
        "Animal friendship",
        "The caster can use this spell to attract up to 2 Hit Dice of animal(s) per experience level he possesses (save vs spell to negate).",
      ],
      memorizedCount: 1,
      icon: SPELLS.CharmPersonOrAnimal,
      flags: ["CastableWhenSilenced"],
      castingSound: "CORAN03",
      spellType: "Innate",
      primaryType: "Enchanter",
      secondaryType: "Disabling",
      spellLevel: 1,
      infiniteUse: 1,
      headers: [
        {
          type: "Melee",
          location: "Ability",
          target: "LivingActor",
          range: 30,
          speed: 1,
          effects: [
            {
              opcode: "ProtectionFromResourceAndMessage",
              type: {
                stat: SpellProtectionStat.General,
                relation: SpellProtectionRelation.NotEqual,
              },
              value: "ANIMAL",
              resource: ATWEAKS_SPELLS.AnimalFriendship,
              ...animalFriendshipCommonEffect,
            },
            {
              opcode: "CharmCreature",
              charmType: "NeutralCharm",
              generalType: "ANIMAL",
              ...animalFriendshipCommonEffect,
            },
            {
              opcode: "CharacterColorPulse",
              color: { red: 120, green: 90, blue: 30 },
              location: "ArmorGreyBeltAmulet",
              cycleSpeed: 25,
              timing: "InstantPermanentUntilDeath",
              ...animalFriendshipCommonEffect,
              duration: 1,
            },
            {
              opcode: "PlayVisualEffect",
              playWhere: "OverTargetAttached",
              resource: "SPNWCHRM",
              ...animalFriendshipCommonEffect,
              duration: 3,
            },
          ],
        },
      ],
    },
    {
      name: "Detect Snares And Pits",
      file: ATWEAKS_SPELLS.DetectSnaresAndPits,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.DetectSnaresAndPits,
      description: [
        "Detect snares and pits",
        "When cast, all traps—concealed normally or magically—of magical or mechanical nature become apparent for 16 rounds.",
      ],
      castingSound: "CAS_P04",
      flags: ["OutdoorsOnly"],
      spellType: "Innate",
      castingAnimation: "Divination",
      primaryType: "Diviner",
      secondaryType: "NonCombat",
      icon: SPELLS.FindTraps,
      infiniteUse: 1,
      headers: [
        {
          type: "Melee",
          location: "Ability",
          target: "Caster",
          speed: 1,
          projectile: "INAREANS",
          effects: [
            { opcode: "FindTraps", duration: 96, target: "Self" },
            {
              opcode: "DisplayPortraitIcon",
              icon: "DetectingTrapsIllusions",
              duration: 96,
              target: "Self",
            },
            {
              opcode: "LightingEffects",
              effect: "DivinationWater",
              lightingTarget: "SpellTarget",
              timing: "InstantPermanentUntilDeath",
              target: "Self",
            },
            {
              opcode: "CharacterColorPulse",
              color: { red: 70, green: 32, blue: 73 },
              location: "ArmorGreyBeltAmulet",
              cycleSpeed: 20,
              duration: 2,
            },
          ],
        },
      ],
    },
    // TODO: Quench Fire
    // You extinguish all fires in a 30-foot cube centered on a point you choose within range. Any nonmagical fire is put out automatically, as are magical flames created by a spell of 3rd level or lower.
    // For each spell of 4th level or higher which is creating flame within this area,  make an ability check using your spellcasting ability.
    // On a successful check, the spell that created the fire ends. Fire created by a magical item is also doused, and the item becomes unable to produce fire for 1d4 hours.
  ],
  items: [
    createTraitItem({
      file: traits,
      name,
      immunities: ["entangle"],
      effects: [
        {
          opcode: "MagicResistanceModifier",
          value: 75,
          type: "Set",
        },
      ],
    }),
  ],
  additionalCode: [
    {
      location: "trackTargets",
      triggers: [
        { name: "HaveSpellRES", params: [ATWEAKS_SPELLS.DryadCharmPerson] },
      ],
    },
  ],
  customCode: [
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
            factory.global(globals.SummonDryads, 1, "AR1200"),
          ],
          responses: factory.response([
            factory.setGlobal(globals.SummonDryads, 2, "AR1200"),
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
            factory.global(globals.VaelasaHostile, 0, "GLOBAL"),
          ],
          responses: factory.response([
            factory.setGlobal(globals.VaelasaHostile, 1, "GLOBAL"),
            { name: "Enemy" },
          ]),
        },
        {
          triggers: [
            factory.global("rr#chama", 1, "MYAREA"),
            factory.global(globals.CloakwoodHamadryad, 0),
            { name: "See", params: ["PC"] },
          ],
          responses: factory.response([
            factory.setGlobal(globals.CloakwoodHamadryad, 1),
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
  abilities: [
    {
      preset: PRESET_NAMES.DimensionDoorOffscreen,
      spell: {
        resource: ATWEAKS_SPELLS.DimensionDoorInfinite,
        type: "force",
      },
      disableInterrupt: true,
    },
    abilitySpeakWithPlants,
    {
      preset: SPELLS.Entangle,
      spell: {
        resource: ATWEAKS_SPELLS.HamadryadEntangle,
        type: "force",
      },
      disableInterrupt: true,
      timer: {
        name: "entangle",
        value: 18,
      },
    },
    abilityDryadDireCharm,
    abilityAnimalFriendship,
    {
      name: "Detect Snares And Pits",
      spell: {
        resource: ATWEAKS_SPELLS.DetectSnaresAndPits,
        type: "force",
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      disableInterrupt: true,
    },
  ],
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
  adjustments: [
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
  ],
};
