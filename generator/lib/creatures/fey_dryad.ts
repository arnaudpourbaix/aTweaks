import { SPELLS } from "../config/spell";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { StringRefUtils } from "../src/services/string-ref.utils";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.Dryad;
// Script
const script = bafFile(id);
// Spells
const charm = file(1, id);
const speakWithPlants = file(2, id);
const dimensionDoor = file(3, id);

const charmDuration = 180;
const speakWithPlantsDuration = 60;

export const FEY_DRYAD: RawCreature = {
  name: "Dryad",
  bafFile: `lib/pnp-monster/fey/${script}`,
  tpaFile: "lib/pnp-monster/fey/dryad",
  tracking: true,
  combatWalk: true,
  usePotions: true,
  attack: {
    melee: false,
    ranged: false,
  },
  data: {
    level1: 2,
    strength: 10,
    dexterity: 12,
    constitution: 11,
    intelligence: 14,
    wisdom: 15,
    charisma: 18,
    movement: 12,
    ac: 9,
    apr: 1,
    resistMagic: 50,
    xpv: 975,
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
    removeItems: [],
    removeScripts: ["DRYAD", "DW1MELGE"],
    memorizedSpells: [],
  },
  effectFiles: [
    {
      file: charm,
      opcode: "ProtectionFromSpell",
      resource: charm,
      timing: "InstantLimited",
    },
  ],
  spells: [
    {
      name: "Dire Charm",
      file: charm,
      stringRef: `${StringRefUtils.getStringId("Dire Charm")}`,
      memorizedCount: 3,
      type: "Melee",
      projectile: "SPARKLGO",
      icon: SPELLS.DireCharm,
      castingSound: "CAS_M05",
      flags: ["BreakSanctuary"],
      spellType: "Innate",
      castingAnimation: "Enchantment",
      primaryType: "Enchanter",
      secondaryType: "Disabling",
      spellLevel: 1,
      location: "Ability",
      target: "LivingActor",
      range: 30,
      speed: 1,
      effects: [
        {
          opcode: "UseEFFFile",
          idsFile: "RACE",
          idsEntry: "ELF",
          probability1: 90,
          timing: "InstantLimited",
          duration: 1,
          resource: charm,
        },
        {
          opcode: "UseEFFFile",
          idsFile: "RACE",
          idsEntry: "HALF_ELF",
          probability1: 30,
          timing: "InstantLimited",
          duration: 1,
          resource: charm,
        },
        {
          opcode: "CharmCreature",
          generalType: "HUMANOID",
          charmType: "NeutralDireCharm",
          timing: "InstantLimited",
          duration: charmDuration,
          dispelResistance: "DispelNotBypassResistance",
          saveTypes: ["Spell"],
          saveBonus: -3,
        },
        {
          opcode: "DisplayString",
          stringRef: `${StringRefUtils.getStringId("Dire charmed")}`,
          timing: "InstantPermanentUntilDeath",
          dispelResistance: "DispelNotBypassResistance",
          saveTypes: ["Spell"],
          saveBonus: -3,
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
          saveBonus: -3,
        },
        {
          opcode: "PlayVisualEffect",
          playWhere: "OverTargetAttached",
          resource: "SPNWCHRM",
          timing: "InstantLimited",
          duration: 3,
          dispelResistance: "DispelNotBypassResistance",
          saveTypes: ["Spell"],
          saveBonus: -3,
        },
        {
          opcode: "PlaySound",
          resource: "EFF_E07",
          timing: "DelayLimited",
          duration: charmDuration,
          dispelResistance: "DispelNotBypassResistance",
          saveTypes: ["Spell"],
          saveBonus: -3,
        },
      ],
    },
    {
      name: "Speak With Plants",
      file: speakWithPlants,
      stringRef: TraStringReferenceEnum.SpeakWithPlants,
      memorizedCount: 3,
      type: "Melee",
      projectile: "SPARGRPA",
      icon: "RR#FSPKP",
      castingSound: "CAS_P02",
      spellType: "Innate",
      castingAnimation: "Alteration",
      primaryType: "Transmuter",
      secondaryType: "NonCombat",
      spellLevel: 1,
      location: "Ability",
      target: "Caster",
      range: 30,
      speed: 1,
      effects: [
        {
          opcode: "ProtectionFromOpcode",
          type: "EntangleOverlay",
          timing: "InstantLimited",
          duration: speakWithPlantsDuration,
          dispelResistance: "DispelBypassResistance",
        },
        {
          opcode: "PreventPortraitIcon",
          icon: "Entangled",
          timing: "InstantLimited",
          duration: speakWithPlantsDuration,
          dispelResistance: "DispelBypassResistance",
        },
        {
          opcode: "CharacterColorPulse",
          color: { red: 72, green: 243, blue: 102 },
          location: "ArmorGreyBeltAmulet",
          cycleSpeed: 30,
          timing: "InstantLimited",
          duration: 1,
          dispelResistance: "DispelBypassResistance",
        },
        {
          opcode: "PlayVisualEffect",
          playWhere: "OverTargetAttached",
          resource: "SPRMCURS",
          timing: "InstantLimited",
          duration: 2,
          dispelResistance: "DispelBypassResistance",
        },
      ],
    },
  ],
  abilities: [
    {
      preset: SPELLS.DireCharm,
      spell: {
        resource: charm,
        id: undefined,
      },
    },
    {
      spell: {
        resource: speakWithPlants,
        type: "force",
        selfTarget: true,
      },
      timer: { name: "speakWithPlants", value: 60 },
    },
  ],
  files: [
    "DRYAD", // Dryad of the Cloudpeaks
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
  ],
  adjustments: [
    {
      files: ["DRYAD"],
      data: { class: "INNOCENT" },
    },
  ],
};
