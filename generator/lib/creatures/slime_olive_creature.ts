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
const id = MonsterEnum.OliveSlimeCreature;
// Spells
// Items
const mainWeapon = file(1, id);
// Script
const script = bafFile(id);

export const SLIME_OLIVE_CREATURE: RawCreature = {
  name: "Olive Slime Creature",
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/olive_slime_creature",
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
    level1: 7,
    bonusHp: 14,
    thac0: 13,
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 10,
    wisdom: 0,
    charisma: 0,
    ac: 4,
    apr: 2,
    resistMagic: 10,
    xpv: 4000,
    alignment: "NEUTRAL",
    morale: 14,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "MUSTARD_JELLY",
    gender: "NIETHER",
    size: "Large",
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
    immunities: ["ooze"],
  },
  items: [
    {
      // Olive slime is harmed only by acid, freezing cold, fire, or by a cure disease spell.
      // Spells that affect plants will work on olive slime, although entangle will have no practical effect.
      //
      // Olive slime zombies are harmed by acid, freezing cold, fire and magic missile spells.
      // Spells that affect plants will also affect them, although the effects of entangle are minimal at best.
      // No other attacks, by weapons, lightning, or spells that affect the mind will kill a slime creature.
      // An olive slime zombie, however, can suffer only as much physical damage as it has hit points, before its skeleton collapses and it becomes nothing more than a puddle of olive slime.
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
    "AC#FPOX1", // Obliviax
  ],
  adjustments: [],
};
