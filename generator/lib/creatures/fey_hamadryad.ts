import {
  GARGANTUAN_CREATURES,
  INCORPOREAL_CREATURES,
} from "../config/creatures";
import { ATWEAKS_SPELLS, PRESET_NAMES, SPELLS } from "../config/spell";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { IdsEffect, RawBaseEffect } from "../src/model/raw/effect";
import { FactoryService } from "../src/services/factory.service";
import { bafFile, file } from "../src/services/misc.func";
import {
  abilityDryadDireCharm,
  abilitySpeakWithPlants,
  dryadOakTreeDimensionDoor,
} from "./fey_dryad";
import { MonsterEnum } from "./monster.enum";

const factory = FactoryService.instance;

// Creature Id
const id = MonsterEnum.Hamadryad;
// Script
const script = bafFile(id);

const entangleCommonEffect: RawBaseEffect = {
  timing: "InstantLimited",
  duration: 6,
  dispelResistance: "DispelNotBypassResistance",
  saveTypes: ["Spell"],
};

export const FEY_HAMADRYAD: RawCreature = {
  name: "Hamadryad",
  bafFile: `lib/pnp-monster/fey/${script}`,
  tpaFile: "lib/pnp-monster/fey/hamadryad",
  tracking: true,
  combatWalk: true,
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
    resistMagic: 75,
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
    proficiencies: [{ type: "PROFICIENCYDAGGER", value: 2 }],
    removeItems: ["ANTIWEB"],
    removeScripts: ["HAMA", "DW1MELGE"],
    memorizedSpells: [
      { file: ATWEAKS_SPELLS.DryadCharmPerson, memorizedCount: 3 },
      { file: ATWEAKS_SPELLS.SpeakWithPlants, memorizedCount: 1 },
      { file: ATWEAKS_SPELLS.DimensionDoor, memorizedCount: 1 },
    ],
  },
  projectiles: [
    {
      file: ATWEAKS_SPELLS.HamadryadEntangle,
      copyFromFile: "ENTANG2",
      description: "Hamadryad Entangle",
      areaProjectileFlags: ["AffectOnlyEnemies"],
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
      memorizedCount: 1,
      type: "Melee",
      projectile: ATWEAKS_SPELLS.HamadryadEntangle,
      icon: SPELLS.Entangle,
      castingSound: "CAS_P08",
      spellType: "Innate",
      castingAnimation: "Alteration",
      primaryType: "Transmuter",
      secondaryType: "Disabling",
      spellLevel: 1,
      location: "Ability",
      target: "AnyPointWithinRange",
      range: 30,
      speed: 1,
      infiniteUse: true,
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
    {
      name: "Animal Friendship",
      file: ATWEAKS_SPELLS.HamadryadAnimalFriendship,
      stringRef: TraStringReferenceEnum.Entangle,
      memorizedCount: 1,
      type: "Melee",
      projectile: ATWEAKS_SPELLS.HamadryadEntangle,
      icon: SPELLS.Entangle,
      castingSound: "CAS_P08",
      spellType: "Innate",
      castingAnimation: "Alteration",
      primaryType: "Transmuter",
      secondaryType: "Disabling",
      spellLevel: 1,
      location: "Ability",
      target: "AnyPointWithinRange",
      range: 30,
      speed: 1,
      infiniteUse: true,
      effects: [
        // The caster can use this spell to attract up to 2 Hit Dice of animal(s) per experience level he possesses
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
      statements: [...dryadOakTreeDimensionDoor],
    },
  ],
  abilities: [
    {
      preset: PRESET_NAMES.DimensionDoorOffscreen,
      spell: {
        type: "force",
      },
    },
    abilitySpeakWithPlants,
    {
      preset: SPELLS.Entangle,
      spell: {
        resource: ATWEAKS_SPELLS.HamadryadEntangle,
        id: undefined,
        type: "force",
      },
      timer: {
        name: "entangle",
        value: 30,
      },
    },
    abilityDryadDireCharm,
  ],
  files: [
    "DRYADHA", // Hamadryad
    //"HAMASU",    // Spell Revisions summoned Hamadryad (do not touch unless reviewing spell Call Woodland Beings)
    "VAELASA", // Vaelasa (Fairy Queen in Windsper Hills)
    "WQXHAMA", // The White Queen
  ],
  adjustments: [],
};
