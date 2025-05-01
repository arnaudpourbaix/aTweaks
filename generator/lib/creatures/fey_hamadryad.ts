import { PRESET_NAMES, SPELLS } from "../config/spell";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { FactoryService } from "../src/services/factory.service";
import { bafFile, file } from "../src/services/misc.func";
import { StringRefUtils } from "../src/services/string-ref.utils";
import {
  abilityDryadDireCharm,
  abilitySpeakWithPlants,
  dryadCharm,
  dryadOakTreeDimensionDoor,
} from "./fey_dryad";
import { MonsterEnum } from "./monster.enum";

const factory = FactoryService.instance;

// Creature Id
const id = MonsterEnum.Hamadryad;
// Script
const script = bafFile(id);
// Spells
const charm = file(1, id);
const speakWithPlants = file(2, id);

const globals = {
  trees: "ja#trees",
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
    removeItems: [],
    removeScripts: ["HAMA", "DW1MELGE"],
    memorizedSpells: [
      { file: dryadCharm, memorizedCount: 3 },
      { file: speakWithPlants, memorizedCount: 1 },
      { file: SPELLS.DimensionDoor, memorizedCount: 1 },
    ],
  },
  spells: [],
  additionalCode: [
    {
      location: "trackTargets",
      triggers: [{ name: "HaveSpellRES", params: [charm] }],
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
