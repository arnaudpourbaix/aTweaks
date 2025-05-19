import { PRESET_NAMES } from "../config/ability-presets";
import { GLOBAL_CONFIG } from "../config/generate";
import { ATWEAKS_SPELLS, SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { createDimensionDoor } from "../spells/dimension_door";
import { RawCreature } from "../src/model/raw/creature";
import { RawBaseEffect, StringRefEffect } from "../src/model/raw/effect";
import { RawSaveType } from "../src/model/raw/enum";
import { EffectService } from "../src/services/effect.service";
import { FactoryService } from "../src/services/factory.service";
import { bafFile } from "../src/services/misc.func";
import { StringRefUtils } from "../src/services/string-ref.utils";
import { abilityAnimalFriendship } from "./fey_hamadryad";
import { MonsterEnum } from "./monster.enum";

const effects = EffectService.instance;

// Creature Id
const id = MonsterEnum.Nymph;
// Script
const script = bafFile(id);

const blindingBeautyEffect: RawBaseEffect = {
  timing: "InstantLimited",
  duration: 7200,
  dispelResistance: "DispelBypassResistance",
  saveTypes: ["Spell"],
};

export const FEY_NYMPH: RawCreature = {
  name: "Nymph",
  bafFile: `lib/pnp-monster/fey/${script}`,
  tpaFile: "lib/pnp-monster/fey/nymph",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  dialog: [],
  attack: {
    melee: false,
    ranged: false,
  },
  data: {
    level1: 7, // 3hd but can employ druidical priest spells at 7th ability level
    hp: 24,
    thac0: 17,
    saveDeath: 10,
    saveWand: 14,
    savePolymorph: 13,
    saveBreath: 16,
    saveSpell: 15,
    strength: 10,
    dexterity: 17,
    constitution: 12,
    intelligence: 16,
    wisdom: 12,
    charisma: 19,
    movement: 12,
    ac: 9,
    apr: 0,
    resistMagic: 50,
    xpv: 1400,
    alignment: "NEUTRAL_GOOD",
    morale: 7,
    moraleBreak: 2,
    moraleRecovery: 15,
    general: "HUMANOID",
    race: "FAIRY",
    class: "DRUID", // FAIRY_NYMPH
    gender: "FEMALE",
    size: "Medium",
  },
  additionalData: {
    removeItems: ["DAGG01", "B1-6"],
    removeScripts: ["BDENSHTV", "BDNYMP01", "NYMPH"],
    memorizedSpells: [
      { file: SPELLS.CureLightWounds, memorizedCount: 2 },
      { file: SPELLS.Bless, memorizedCount: 1 },
      { file: SPELLS.Entangle, memorizedCount: 1 },
      { file: SPELLS.Barkskin, memorizedCount: 1 },
      { file: SPELLS.CharmPersonOrAnimal, memorizedCount: 1 },
      { file: SPELLS.CallLightning, memorizedCount: 1 },
      { file: SPELLS.SummonInsects, memorizedCount: 1 },
      { file: SPELLS.CallWoodlandBeeings, memorizedCount: 1 },
      { file: ATWEAKS_SPELLS.AnimalFriendship, memorizedCount: 1 },
    ],
    deleteEffectOpcodes: ["ProtectionFromSpell"],
  },
  effectFiles: [
    {
      file: ATWEAKS_SPELLS.BlindingBeauty,
      opcode: "CastSpell",
      type: "CastInstantlyAtCasterLevel",
      resource: ATWEAKS_SPELLS.BlindingBeautyTechnical,
      timing: "InstantPermanentUntilDeath",
    },
  ],
  projectiles: [
    {
      file: ATWEAKS_SPELLS.BlindingBeauty,
      copyFromFile: "BIGNAREA",
      description: "Nymph Blinding Beauty",
      speed: 60,
      projectileInfo: {
        lightSpotIntensity: 128,
        lightSpotWidth: 15,
        lightSpotHeight: 11,
      },
      areaEffectInfo: {
        triggerRadius: 470,
        areaOfEffect: 470,
      },
    },
  ],
  spells: [
    {
      name: "Blinding Beauty",
      memorizedCount: 1,
      file: ATWEAKS_SPELLS.BlindingBeauty,
      stringRef: TraStringReferenceEnum.BlindingBeauty,
      spellType: "Innate",
      icon: SPELLS.BlindingBeauty,
      infiniteUse: true,
      headers: [
        {
          type: "Melee",
          location: "Ability",
          target: "Caster",
          projectile: ATWEAKS_SPELLS.BlindingBeauty,
          effects: [
            {
              opcode: "PlayVisualEffect",
              target: "Self",
              playWhere: "OverTargetAttached",
              timing: "InstantLimited",
              dispelResistance: "NaturalNonMagical",
              duration: 2,
              resource: "ICCLKFR2",
            },
            {
              opcode: "UseEFFFile",
              idsFile: "GENERAL",
              idsEntry: "HUMANOID",
              timing: "InstantPermanentUntilDeath",
              dispelResistance: "NaturalNonMagical",
              resource: ATWEAKS_SPELLS.BlindingBeauty,
            },
          ],
        },
      ],
    },
    {
      name: "Blinding Beauty (technical)",
      file: ATWEAKS_SPELLS.BlindingBeautyTechnical,
      stringRef: TraStringReferenceEnum.BlindingBeauty,
      spellType: "Innate",
      icon: SPELLS.BlindingBeauty,
      headers: [
        {
          type: "Melee",
          location: "Ability",
          target: "Caster",
          effects: [
            ...effects.getBlindnessEffects({
              duration: blindingBeautyEffect.duration as number,
              dispelResistance: blindingBeautyEffect.dispelResistance,
              saveType: (blindingBeautyEffect.saveTypes as RawSaveType[])[0],
            }),
            {
              opcode: "PlaySound",
              resource: "EFF_P71B",
              ...blindingBeautyEffect,
              timing: "InstantPermanentUntilDeath",
            },
            {
              opcode: "PlayVisualEffect",
              playWhere: "OverTargetAttached",
              resource: "SPH1HI01",
              ...blindingBeautyEffect,
              duration: 3,
            },
            {
              opcode: "ProtectionFromSpell",
              resource: ATWEAKS_SPELLS.BlindingBeautyTechnical,
              ...blindingBeautyEffect,
            },
          ],
        },
      ],
    },
    createDimensionDoor({
      file: ATWEAKS_SPELLS.DimensionDoorPriest,
      memorizedCount: 1,
      spellLevel: 4,
      spellType: "Priest",
    }),
  ],
  additionalCode: [
    {
      location: "trackTargets",
      triggers: [
        {
          name: "Or",
          triggers: [
            { name: "HaveSpellRES", params: [SPELLS.CallLightning] },
            { name: "HaveSpellRES", params: [SPELLS.CharmPersonOrAnimal] },
            { name: "HaveSpellRES", params: [SPELLS.SummonInsects] },
          ],
        },
      ],
    },
  ],
  customCode: [
    {
      location: "init",
      type: "insertBefore",
      statements: [],
    },
  ],
  abilities: [
    {
      target: {
        name: "NearestEnemies",
        triggers: [
          {
            name: "General",
            params: [GLOBAL_CONFIG.tokens.target, "HUMANOID"],
          },
        ],
      },
      spell: {
        resource: ATWEAKS_SPELLS.BlindingBeauty,
        type: "reallyForce",
        selfTarget: true,
        excludeStateChecks: ["STATE_BLIND"],
      },
      noRoundTimer: true,
      timer: {
        name: "BlindingBeauty",
        value: 6,
      },
    },
    {
      preset: PRESET_NAMES.DimensionDoorOffscreen,
      spell: {
        resource: ATWEAKS_SPELLS.DimensionDoorPriest,
        type: "force",
      },
    },
    {
      preset: SPELLS.CallWoodlandBeeings,
      spell: {
        type: "force",
        remove: true,
      },
    },
    {
      preset: SPELLS.Bless,
      spell: {
        type: "force",
        remove: true,
      },
    },
    {
      preset: SPELLS.Barkskin,
      spell: {
        type: "force",
        remove: true,
      },
    },
    {
      preset: SPELLS.CallLightning,
      spell: {
        type: "force",
        remove: true,
      },
    },
    {
      preset: SPELLS.SummonInsects,
      spell: {
        type: "force",
        remove: true,
      },
    },
    {
      preset: SPELLS.Entangle,
      spell: {
        type: "force",
        remove: true,
      },
    },
    {
      preset: SPELLS.CharmPersonOrAnimal,
      spell: {
        type: "force",
        remove: true,
      },
    },
    abilityAnimalFriendship,
    {
      preset: SPELLS.CureLightWounds,
      spell: {
        type: "force",
        remove: true,
      },
    },
  ],
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
  adjustments: [
    {
      files: ["NYMPHSU", "NYMPHSUM", "DW#NYMSU"],
      summon: true,
    },
    {
      files: ["BDNYMP02"],
      data: { alignment: "NEUTRAL_EVIL" },
    },
  ],
};
