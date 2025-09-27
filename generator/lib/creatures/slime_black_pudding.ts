import { GLOBAL_CONFIG } from "../config/generate";
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

const effects = EffectService.instance;
const utils = UtilsService.instance;
// Creature Id
const id = MonsterEnum.BlackPudding;
// Spells
// Items
const mainWeapon = file(1, id);
// Script
const script = bafFile(id);

export const SLIME_BLACK_PUDDING: RawCreature = {
  name: "Black Pudding",
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/black_pudding",
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
    level1: 10,
    hp: 100,
    thac0: 11,
    strength: 17,
    dexterity: 1,
    constitution: 22,
    intelligence: 1,
    wisdom: 1,
    charisma: 1,
    movement: 4,
    ac: 6,
    apr: 1,
    resistMagic: 10,
    xpv: 4000,
    alignment: "NEUTRAL",
    morale: 14,
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
    immunities: ["ooze"],
  },
  items: [
    {
      // A black pudding attacks by grabbing and squeezing their prey.
      // Acid (Ex): The creature secretes a digestive acid that dissolves organic material and metal quickly, but does not affect stone. Any melee hit or constrict attack deals acid damage, and the opponent’s armor and clothing dissolve and become useless immediately unless they succeed on DC 21 Reflex saves. A metal or wooden weapon that strikes a black pudding also dissolves immediately unless it succeeds on a DC 21 Reflex save. The save DCs are Constitution-based.
      // The pudding’s acidic touch deals 21 points of damage per round to wooden or metal objects, but the ooze must remain in contact with the object for 1 full round to deal this damage.
      // Constrict (Ex): A black pudding deals automatic slam and acid damage with a successful grapple check. The opponent’s clothing and armor take a –4 penalty on Reflex saves against the acid.
      // Improved Grab (Ex): To use this ability, a black pudding must hit with its slam attack. It can then attempt to start a grapple as a free action without provoking an attack of opportunity. If it wins the grapple check, it establishes a hold and can constrict.
      // Split (Ex): Slashing and piercing weapons deal no damage to a black pudding. Instead the creature splits into two identical puddings, each with half of the original’s current hit points (round down). A pudding with 10 hit points or less cannot be further split and dies if reduced to 0 hit points.
      file: mainWeapon, // 3-24 or 2d6+4 plus 2d6 acid
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
  abilities: [],
  files: [
    "BDPUDDBL", // Black Pudding
  ],
};
