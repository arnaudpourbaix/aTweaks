import { ATWEAKS_SPELLS, SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { EffectService } from "../src/services/effect.service";
import { bafFile, file } from "../src/services/misc.func";
import { StringRefUtils } from "../src/services/string-ref.utils";
import { MonsterEnum } from "./monster.enum";

const effects = EffectService.instance;

// Creature Id
const id = MonsterEnum.Sirine;
// Items
const mainWeapon = file(1, id);
// Script
const script = bafFile(id);

export const FEY_SIRINE: RawCreature = {
  name: "Sirine",
  bafFile: `lib/pnp-monster/fey/${script}`,
  tpaFile: "lib/pnp-monster/fey/sirine",
  tracking: true,
  combatWalk: true,
  dialog: ["MEIALA", "NTSILUA"],
  attack: {
    melee: false,
    ranged: false,
  },
  autoGenerate: {
    savingThrows: false,
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
    removeItems: ["COMPB05", "BOW01", "BOW05", "SIRINE1", "AROW01", "AROW05"],
    removeScripts: [
      "SHOUT",
      "INITDLG",
      "DW#GPSHT",
      // "J#SIRIN1",
      "SIRSPELL",
      "DW1RANMO",
      "DW1RANGE",
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
  items: [
    {
      file: mainWeapon,
      icon: "IGHOUL",
      type: "Melee",
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
        // type: "force",
      },
    },
    {
      name: "Fog Cloud",
      target: {
        name: "NearestEnemies",
      },
      spell: {
        resource: ATWEAKS_SPELLS.FogCloud,
        excludeStateChecks: ["STATE_BLIND"],
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
  adjustments: [
    { files: ["SIL"], data: { level1: 7 } },
    { files: ["ISLSIR"], data: { level1: 11 } },
    { files: ["MEIALA"], data: { level1: 11 } },
  ],
};
