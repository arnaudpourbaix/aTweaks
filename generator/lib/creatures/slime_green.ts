import { truncate } from "fs";
import { ATWEAKS_SPELLS, SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { RawBaseEffect } from "../src/model/raw/effect";
import {
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../src/model/raw/spell-protection";
import { EffectService } from "../src/services/effect.service";
import { bafFile, convertMovement, file } from "../src/services/misc.func";
import { StringRefUtils } from "../src/services/string-ref.utils";
import { UtilsService } from "../src/services/utils.service";
import { MonsterEnum } from "./monster.enum";
import { GLOBAL_CONFIG } from "../config/generate";

const effects = EffectService.instance;
const utils = UtilsService.instance;
// Creature Id
const id = MonsterEnum.GreenSlime;
// Spells
// Items
const mainWeapon = file(1, id);
// Script
const script = bafFile(id);

export const SLIME_GREEN: RawCreature = {
  name: "Green Slime",
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/green_slime",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  dialog: [],
  canPolymorph: true,
  autoGenerate: {
    savingThrows: false,
  },
  attack: {
    ranged: true,
  },
  data: {
    level1: 2,
    thac0: 19,
    strength: 4,
    dexterity: 12,
    constitution: 8,
    intelligence: 1,
    wisdom: 12,
    charisma: 2,
    movement: 0,
    ac: 9,
    apr: 1,
    resistMagic: 0,
    xpv: 65,
    alignment: "NEUTRAL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "GREEN_SLIME",
    gender: "NIETHER",
    size: "Small",
  },
  additionalData: {
    removeItems: [],
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
    // Damage Vulnerabilities cold
    // Damage Immunities acid, poison, psychic
    immunities: ["ooze"],
  },
  items: [
    {
      //
      // This slime cannot attack but is sensitive to vibrations and often drops from the ceiling onto a passing victim.
      // Green slime attaches itself to living flesh and in 1-4 melee rounds turns the creature into green slime (no resurrection possible).
      // Green slime eats through one inch of wood in an hour, but can dissolve metal quickly, going through plate armor in three melee rounds.
      // The horrid growth can be scraped off quickly, cut away, frozen, or burned. A cure disease spell kills green slime, but other attacks, including weapons and spells, have no effect.
      //
      // Pseudopod. Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) acid damage.
      file: mainWeapon,
      equippedSlot: "WEAPON1",
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
  files: [
    "C#Q01003", // Eltolth
    "C#Q01005", // Alanna
    "SCHLUM", // Schlumpsha the Sewer King
    "JELLGRSU", // Green Slime
    "JELLYGR", // Green Slime
    "JELLYGR2", // Green Slime
    "X#JELLY", // Green Slime
    "X#SLIME", // Green Slime
  ],
  adjustments: [
    { files: ["C#Q01003", "C#Q01005"] },
    { files: ["SCHLUM"], data: { level1: 6 } },
    { files: ["JELLGRSU"], summon: true },
  ],
};
