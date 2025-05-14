import {
  DEFAULT_SPELL_PROBABILITY,
  PRESET_NAMES,
} from "../config/ability-presets";
import { ATWEAKS_SPELLS, SPELLS } from "../config/spell-names";
import { RawCreature } from "../src/model/raw/creature";
import { FactoryService } from "../src/services/factory.service";
import { bafFile } from "../src/services/misc.func";
import { abilityDryadDireCharm, abilitySpeakWithPlants } from "./fey_dryad";
import { MonsterEnum } from "./monster.enum";

const factory = FactoryService.instance;
// Creature Id
const id = MonsterEnum.Sirine;
// Script
const script = bafFile(id);

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
    level1: 11, // 4-7
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
    movement: 12,
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
    //class: "FAIRY_SIRINE",
    class: "MAGE",
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
      { file: ATWEAKS_SPELLS.DimensionDoorInfinite, memorizedCount: 1 },
    ],
    immunities: ["entangle"],
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
  spells: [],
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
      preset: PRESET_NAMES.DimensionDoorOffscreen,
      spell: {
        resource: ATWEAKS_SPELLS.DimensionDoorInfinite,
        id: undefined,
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
    {
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
    },
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
