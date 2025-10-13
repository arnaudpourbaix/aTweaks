import { GLOBAL_CONFIG } from "../../config/generate";
import { MonsterItemIconEnum } from "../../config/item";
import { ATWEAKS_SPELLS, SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { JEWEL_SLOTS } from "../../src/model/constants";
import { RawCreature } from "../../src/model/raw/creature";
import { RawBaseEffect } from "../../src/model/raw/effect";
import {
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../../src/model/raw/spell-protection";
import { createTraitItem } from "../../src/services/creature-helper";
import { EffectService } from "../../src/services/effect.service";
import { bafFile, convertMovement, file } from "../../src/services/misc.func";
import { StringRefUtils } from "../../src/services/string-ref.utils";
import { UtilsService } from "../../src/services/utils.service";
import { MonsterEnum } from "../monster.enum";

const effects = EffectService.instance;
const utils = UtilsService.instance;

// Creature Id
const id = MonsterEnum.Sirine;
// Spells
const improvedInvisibility = file(1, id);
const polymorphSelf = file(2, id);
// Items
const mainWeapon = file(1, id);
const movementBoots = file(2, id);
const traits = file(3, id);
// Script
const script = bafFile(id);

const tranquilityBaseEffect: RawBaseEffect = {
  timing: "InstantLimited",
  duration: 300,
  saveTypes: ["ParalyzePoisonDeath"],
};

const name = "Sirine";

export const FEY_SIRINE: RawCreature = {
  name,
  bafFile: `lib/pnp-monster/fey/${script}`,
  tpaFile: "lib/pnp-monster/fey/sirine",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  dialog: ["MEIALA", "NTSILUA", "SIL", "LARRIA"],
  canPolymorph: true,
  autoGenerate: {
    savingThrows: false,
  },
  attack: {
    ranged: true,
  },
  data: {
    level1: 11, // 5 HD but level 11 caster
    hp: 40,
    thac0: 15,
    saveDeath: 9,
    saveWand: 7,
    savePolymorph: 9,
    saveBreath: 11,
    saveSpell: 8,
    strength: 10,
    dexterity: 18,
    constitution: 11,
    intelligence: 13,
    wisdom: 16,
    charisma: 17,
    ac: 3,
    apr: 1,
    xpv: 3000,
    alignment: "NEUTRAL",
    morale: 12,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "HUMANOID",
    race: "FAIRY",
    class: "FAIRY_SIRINE",
    gender: "FEMALE",
    size: "Medium",
  },
  additionalData: {
    immunities: ["fey", "cloudSpells"],
    proficiencies: [{ type: "PROFICIENCYDAGGER", value: 2 }],
    removeItems: ["COMPB05", "BOW01", "BOW05", "SIRINE1", "AROW01", "AROW05"],
    removeScripts: [
      "SHOUT",
      "INITDLG",
      "DW#GPSHT",
      "DW#MG84",
      // "J#SIRIN1",
      "SIRSPELL",
      "DW1RANMO",
      "DW1RANGE",
      "SIL",
    ],
    itemSlots: [
      { file: "BOW05", slot: "WEAPON2", undroppable: false },
      {
        file: "AROW10",
        quantity: 10,
        slot: "QUIVER1",
        undroppable: false,
        unstealable: true,
      },
      {
        file: "AROW01",
        quantity: 40,
        slot: "QUIVER2",
        undroppable: false,
        unstealable: true,
      },
      {
        file: "AROW01",
        quantity: 40,
        slot: "QUIVER3",
        undroppable: false,
        unstealable: true,
      },
    ],
    scriptLocation: "Race",
  },
  effectFiles: [
    {
      file: ATWEAKS_SPELLS.CharmingSong,
      opcode: "CastSpell",
      type: "CastInstantlyAtCasterLevel",
      resource: ATWEAKS_SPELLS.CharmingSongTechnical,
      timing: "InstantPermanentUntilDeath",
      dispelResistance: "NaturalNonMagical",
    },
  ],
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.LethalFists,
      icon: MonsterItemIconEnum.Fist,
      equippedSlot: "WEAPON1",
      type: "Melee",
      speed: 2,
      diceSize: 3,
      diceThrown: 1,
      damageType: "Crushing",
      effects: [
        {
          opcode: "CastSpell",
          type: "CastInstantlyAtCasterLevel",
          castingLevel: 1,
          timing: "InstantPermanentUntilDeath",
          dispelResistance: "NaturalNonMagical",
          resource: ATWEAKS_SPELLS.TouchOfTranquility,
        },
      ],
    },
    {
      file: movementBoots,
      equippedSlot: "BOOTS",
      effects: [
        {
          opcode: "MovementRateBonus2",
          type: "Set",
          value: convertMovement(12),
          global: true,
        },
      ],
    },
    createTraitItem({
      file: traits,
      name,
      immunities: ["cloudSpells"],
      effects: [
        {
          opcode: "MagicResistanceModifier",
          value: 20,
          type: "Set",
        },
      ],
    }),
  ],
  projectiles: [
    {
      file: ATWEAKS_SPELLS.CharmingSong,
      copyFromFile: "SPARGONP",
      description: "Sirine Charming Song",
      speed: 40,
      projectileInfo: {
        bamProjectileFlags: ["EnableBrightenFlags", "HighLevelBrighten"],
      },
      areaEffectInfo: {
        triggerRadius: 470,
        areaOfEffect: 470,
      },
    },
  ],
  spells: [
    {
      name: "Charming Song",
      file: ATWEAKS_SPELLS.CharmingSong,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.CharmingSong,
      description: [
        "Charming Song",
        "The charm ability is used through the sirine's song, and all people within 30 feet are subject to it, even if they are hostile or attacking.",
        "Each victim can save vs spell to negate or be charmed for 3 turns.",
      ],
      castingSound: "SIRIN05",
      flags: ["IgnoreDead"],
      spellType: "Innate",
      spellLevel: 1,
      castingAnimation: "Enchantment",
      primaryType: "Enchanter",
      secondaryType: "Disabling",
      icon: SPELLS.DireCharm,
      effects: [
        {
          opcode: "ForceVisible",
          target: "Self",
          timing: "InstantPermanentUntilDeath",
          global: true,
        },
      ],
      headers: [
        {
          type: "Melee",
          location: "Ability",
          target: "Caster",
          projectile: ATWEAKS_SPELLS.CharmingSong,
          effects: [
            {
              opcode: "UseEFFFile",
              idsFile: "GENERAL",
              idsEntry: "HUMANOID",
              resource: ATWEAKS_SPELLS.CharmingSong,
              dispelResistance: "NaturalNonMagical",
            },
          ],
        },
      ],
    },
    {
      name: "Charming Song Technical",
      file: ATWEAKS_SPELLS.CharmingSongTechnical,
      stringRef: StringRefUtils.getStringId("Dire Charm"),
      icon: SPELLS.DireCharm,
      castingSound: "SIRIN05",
      flags: ["BreakSanctuary"],
      spellType: "Innate",
      castingAnimation: "Enchantment",
      primaryType: "Enchanter",
      secondaryType: "Disabling",
      spellLevel: 1,
      headers: [
        {
          type: "Melee",
          location: "Ability",
          target: "LivingActor",
          range: 30,
          speed: 1,
          racialSleepCharmResistance: true,
          effects: effects.getCharmEffects({
            charmType: "NeutralDireCharm",
            duration: 180,
            dispelResistance: "DispelNotBypassResistance",
            saveType: "Spell",
          }),
        },
      ],
    },
    {
      name: "Fog Cloud",
      file: ATWEAKS_SPELLS.FogCloud,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.FogCloud,
      description: [
        "Fog Cloud",
        "As a fog bank, this spell creates a fog of any size and shape up to a maximum 20-foot cube per caster level. The fog obscures all sight, normal and infravision, beyond 2 feet.",
        "Victims are blinded for one round, no save.",
      ],
      castingSound: "CAS_M08",
      spellType: "Innate",
      castingAnimation: "Alteration",
      primaryType: "Transmuter",
      secondaryType: "Battleground",
      icon: "SPWI204",
      headers: [
        {
          type: "Ranged",
          location: "Ability",
          target: "AnyPointWithinRange",
          projectile: "CLOUD",
          effects: effects.getBlindnessEffects({
            duration: 7,
            dispelResistance: "DispelNotBypassResistance",
          }),
        },
      ],
    },
    {
      name: "Touch of Tranquility",
      file: ATWEAKS_SPELLS.TouchOfTranquility,
      stringRef: TraStringReferenceEnum.TouchOfTranquility,
      description: [
        "If the sirine touches an opponent, the victim must make a saving throw vs. poison; those failing to save are reduced to an Intelligence of 2.",
      ],
      castingSound: "EFF_P11",
      flags: ["Hostile", "IgnoreDead"],
      spellType: "Innate",
      castingAnimation: "Alteration",
      primaryType: "Transmuter",
      secondaryType: "Battleground",
      icon: SPELLS.Feeblemind,
      headers: [
        {
          type: "Melee",
          location: "Ability",
          target: "LivingActor",
          effects: [
            {
              opcode: "ProtectionFromResourceAndMessage",
              type: {
                stat: SpellProtectionStat.Splstate,
                relation: SpellProtectionRelation.Equal,
              },
              value: "CHAOTIC_COMMANDS",
              timing: "InstantLimited",
              dispelResistance: "NaturalNonMagical",
              duration: 1,
              resource: ATWEAKS_SPELLS.TouchOfTranquility,
            },
            {
              opcode: "Feeblemindedness",
              ...tranquilityBaseEffect,
            },
            {
              opcode: "DisplayPortraitIcon",
              icon: "Feebleminded",
              ...tranquilityBaseEffect,
            },
            {
              opcode: "PlayVisualEffect",
              playWhere: "OverTargetAttached",
              ...tranquilityBaseEffect,
              duration: 2,
              resource: "SPMINDAT",
            },
            {
              opcode: "CharacterColorPulse",
              color: { red: 109, green: 73, blue: 0 },
              location: "ArmorGreyBeltAmulet",
              cycleSpeed: 20,
              ...tranquilityBaseEffect,
              duration: 1,
            },
            {
              opcode: "DisplayString",
              stringRef: StringRefUtils.getStringId("Feebleminded"),
              ...tranquilityBaseEffect,
              timing: "InstantPermanentUntilDeath",
            },
            {
              opcode: "ProtectionFromSpell",
              resource: ATWEAKS_SPELLS.TouchOfTranquility,
              ...tranquilityBaseEffect,
            },
          ],
        },
      ],
    },
    {
      name: "Improved Invisibility",
      file: improvedInvisibility,
      memorizedCount: 1,
      copyFrom: SPELLS.ImprovedInvisibility,
      changes: {
        spellType: "Innate",
        castingTime: 1,
      },
    },
    {
      // TODO: script for this one !
      name: "Polymorph Self",
      file: polymorphSelf,
      memorizedCount: 1,
      copyFrom: SPELLS.PolymorphSelf,
      changes: {
        spellType: "Innate",
        castingTime: 1,
      },
    },
  ],
  additionalCode: [],
  customCode: [
    // IF
    // 	!GlobalTimerNotExpired("RR#Gas","LOCALS")
    // 	HasItem("rr#pjell",Myself) // Mustard Jelly form
    // 	!StateCheck(Myself,STATE_REALLY_DEAD) // prevents contingencies and other ReallyForceSpell() stuff from popping up on dead creatures
    // THEN
    // 	RESPONSE #100
    // 		SetGlobalTimer("RR#Gas","LOCALS",6)
    //         ForceSpellRES("rr#ftvap",Myself) // Toxic Vapors
    // END
    {
      location: "attack",
      type: "insertBefore",
      statements: [
        {
          comment: "Don't break invisibility when charm is available",
          triggers: [
            {
              name: "StateCheck",
              params: ["Myself", "STATE_INVISIBLE"],
            },
            {
              name: "HaveSpellRES",
              params: [ATWEAKS_SPELLS.CharmingSong],
            },
          ],
          responses: [
            {
              weight: 100,
              actions: [{ name: "NoAction" }],
            },
          ],
        },
      ],
    },
  ],
  abilities: [
    {
      preset: SPELLS.ImprovedInvisibility,
      spell: {
        resource: improvedInvisibility,
        type: "force",
        remove: true,
      },
      disableInterrupt: true,
    },
    {
      preset: SPELLS.DireCharm,
      spell: {
        resource: ATWEAKS_SPELLS.CharmingSong,
        type: "force",
        remove: true,
      },
      disableInterrupt: true,
    },
    {
      name: "Touch of Tranquility (The touch is automatic for charmed individuals)",
      target: {
        name: "NearestAllies",
        includeStatus: ["Able"],
        triggers: [
          {
            name: "StateCheck",
            params: [GLOBAL_CONFIG.tokens.target, "STATE_CHARMED"],
          },
          {
            name: "See",
            params: ["NearestEnemyOf"],
            negation: true,
          },
        ],
      },
      spell: {
        resource: ATWEAKS_SPELLS.TouchOfTranquility,
        type: "force",
      },
      noRoundTimer: true,
      timer: {
        name: "Touch",
        value: 6,
      },
      actionsBefore: [
        { name: "EquipMostDamagingMelee" },
        {
          name: "MoveToObjectNoInterrupt",
          params: [GLOBAL_CONFIG.tokens.target],
        },
      ],
      disableInterrupt: true,
    },
    {
      name: "Fog Cloud",
      target: {
        name: "NearestEnemies",
      },
      spell: {
        resource: ATWEAKS_SPELLS.FogCloud,
        excludeStateChecks: ["STATE_BLIND"],
        type: "force",
        remove: true,
      },
      requireVocal: true,
      disableInterrupt: true,
    },
  ],
  files: [
    "ISLSIR", // Sirine Queen
    "J#SIRIN1", // Sirine
    "J#SIRIN2", // Sirine
    "MEIALA", // Meiala the Sirine
    "NTSILUA", // Sirine
    "NTSIRIN2", // Sirine
    "NTSIRIN4", // Sirine
    "NTSIRINE", // Krestian's friend
    "SIL", // Sil
    "SIRINE", // Sirine
    "SIRINE02", // Sirine
    "SIRINE_A", // Sirine
    "SIRINE_B", // Sirine
    "LARRIA", // Larriaz
    "L#NDC1", // Southern Edge
    "QSEROMOD", // Sirine (PofQuestPack)
  ],
  adjustments: [
    { files: ["SIL"], data: { level1: 7 } },
    { files: ["ISLSIR"], data: { level1: 11 } },
    { files: ["MEIALA"], data: { level1: 11 } },
  ],
};
