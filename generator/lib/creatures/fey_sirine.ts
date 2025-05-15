import {
  DEFAULT_SPELL_PROBABILITY,
  PRESET_NAMES,
} from "../config/ability-presets";
import { ATWEAKS_SPELLS, SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { FactoryService } from "../src/services/factory.service";
import { bafFile } from "../src/services/misc.func";
import { StringRefUtils } from "../src/services/string-ref.utils";
import { abilityDryadDireCharm, abilitySpeakWithPlants } from "./fey_dryad";
import { MonsterEnum } from "./monster.enum";

const factory = FactoryService.instance;
// Creature Id
const id = MonsterEnum.Sirine;
// Script
const script = bafFile(id);

const charmDuration = 180;

export const FEY_SIRINE: RawCreature = {
  name: "Sirine",
  bafFile: `lib/pnp-monster/fey/${script}`,
  tpaFile: "lib/pnp-monster/fey/sirine",
  tracking: true,
  combatWalk: true,
  dialog: [],
  attack: {
    melee: false,
    ranged: false,
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
    movement: 12, //TODO: move it elsewhere
    ac: 3,
    apr: 1,
    resistMagic: 20,
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
    proficiencies: [{ type: "PROFICIENCYDAGGER", value: 2 }],
    removeItems: ["ANTIWEB"],
    removeScripts: [
      "SHOUT",
      "DW#GPSHT",
      // "J#SIRIN1",
      "SIRSPELL",
      "DW1RANMO",
    ],
    scriptLocation: "Race",
    memorizedSpells: [{ file: SPELLS.ImprovedInvisibility, memorizedCount: 1 }],
    immunities: ["entangle"],
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
  spells: [
    {
      name: "CharmingSong",
      file: ATWEAKS_SPELLS.CharmingSong,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.CharmingSong,
      castingSound: "SIRIN05",
      flags: ["IgnoreDead"],
      spellType: "Innate",
      spellLevel: 1,
      castingAnimation: "Enchantment",
      primaryType: "Enchanter",
      secondaryType: "Disabling",
      icon: SPELLS.DireCharm,
      headers: [
        {
          type: "Melee",
          location: "Ability",
          target: "Caster",
          projectile: "SPARGONP",
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
      name: "CharmingSongTechnical",
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
          effects: [
            {
              opcode: "CharmCreature",
              generalType: "HUMANOID",
              charmType: "NeutralDireCharm",
              timing: "InstantLimited",
              duration: charmDuration,
              dispelResistance: "DispelNotBypassResistance",
              saveTypes: ["Spell"],
            },
            {
              opcode: "DisplayString",
              stringRef: StringRefUtils.getStringId("Dire charmed"),
              timing: "InstantPermanentUntilDeath",
              dispelResistance: "DispelNotBypassResistance",
              saveTypes: ["Spell"],
            },
            {
              opcode: "CharacterColorPulse",
              color: { red: 255, green: 144, blue: 147 },
              location: "ArmorGreyBeltAmulet",
              cycleSpeed: 30,
              timing: "InstantLimited",
              duration: 1,
              dispelResistance: "DispelNotBypassResistance",
              saveTypes: ["Spell"],
            },
            {
              opcode: "PlayVisualEffect",
              playWhere: "OverTargetAttached",
              resource: "SPNWCHRM",
              timing: "InstantLimited",
              duration: 3,
              dispelResistance: "DispelNotBypassResistance",
              saveTypes: ["Spell"],
            },
            {
              opcode: "PlaySound",
              resource: "EFF_E07",
              timing: "DelayLimited",
              duration: charmDuration,
              dispelResistance: "DispelNotBypassResistance",
              saveTypes: ["Spell"],
            },
          ],
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
      statements: [],
    },
  ],
  abilities: [
    {
      preset: SPELLS.ImprovedInvisibility,
    },
    {
      preset: SPELLS.DireCharm,
      spell: {
        resource: ATWEAKS_SPELLS.CharmingSong,
        id: undefined,
        type: "force",
      },
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
  adjustments: [],
};
