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
const id = MonsterEnum.GrayOoze;
// Spells
// Items
const mainWeapon = file(1, id);
// Script
const script = bafFile(id);

export const SLIME_GRAY_OOZE: RawCreature = {
  name: "Gray Ooze",
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/gray_ooze",
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
    level1: 3,
    bonusHp: 3,
    thac0: 17,
    strength: 12,
    dexterity: 1,
    constitution: 21,
    intelligence: 1,
    wisdom: 1,
    charisma: 1,
    movement: 1,
    ac: 8,
    apr: 1,
    resistMagic: 0,
    xpv: 270,
    alignment: "NEUTRAL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "GREY_OOZE",
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
    // immunity to cold and fire
    immunities: ["ooze"],
  },
  items: [
    {
      // 2-16
      // The gray ooze strikes like a snake, and can corrode metal at an alarming rate (chain mail in one round, plate mail in two, and magical armor in one round per each plus to Armor Class).
      // Spells have no effect on this monster, nor do fire- or cold-based attacks. Lightning and blows from weapons cause full damage. Note that weapons striking a gray ooze may corrode and break.
      //
      // Acid (Ex): A gray ooze secretes a digestive acid that quickly dissolves organic material and metal, but not stone. Any melee hit or constrict attack deals acid damage. Armor or clothing dissolves and becomes useless immediately unless it succeeds on a DC 16 Reflex save. A metal or wooden weapon that strikes a gray ooze also dissolves immediately unless it succeeds on a DC 16 Reflex save. The save DCs are Constitution-based.
      // The ooze’s acidic touch deals 16 points of damage per round to wooden or metal objects, but the ooze must remain in contact with the object for 1 full round to deal this damage.
      // Constrict (Ex): A gray ooze deals automatic slam and acid damage with a successful grapple check. The opponent’s clothing and armor take a –4 penalty on Reflex saves against the acid.
      // Improved Grab (Ex): To use this ability, a gray ooze must hit with its slam attack. It can then attempt to start a grapple as a free action without provoking an attack of opportunity. If it wins the grapple check, it establishes a hold and can constrict.
      // Transparent (Ex): A gray ooze is hard to identify, even under ideal conditions, and it takes a DC 15 Spot check to notice one. Creatures who fail to notice a gray ooze and walk into it are automatically hit with a melee attack for slam and acid damage.
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
    "AC#FPSLT", // Slithering Tracker
    "BPJLGR01", // Gray Ooze
    "JELLGR", // Gray Ooze
  ],
  adjustments: [],
};
