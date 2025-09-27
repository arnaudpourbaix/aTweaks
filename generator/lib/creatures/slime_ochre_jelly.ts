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
const id = MonsterEnum.OchreJelly;
// Spells
// Items
const mainWeapon = file(1, id);
// Script
const script = bafFile(id);

export const SLIME_OCHRE_JELLY: RawCreature = {
  name: "Ochre Jelly",
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/ochre_jelly",
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
    level1: 6,
    thac0: 15,
    strength: 15,
    dexterity: 6,
    constitution: 14,
    intelligence: 1,
    wisdom: 6,
    charisma: 1,
    movement: 3,
    ac: 8,
    apr: 1,
    resistElectricity: 100,
    // Damage Resistances acid
    // Damage Immunities lightning, slashing
    xpv: 270,
    alignment: "NEUTRAL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "OCRE_JELLY",
    gender: "NIETHER",
    size: "Medium",
  },
  additionalData: {
    removeItems: ["RING95", "JELLOC1", "DW#JELOC"],
    removeScripts: ["BPSIGHT", "BPASIGHT", "BDENSHTV", "BDNONIN", "DW1RANMO"],
    immunities: ["ooze"],
  },
  items: [
    {
      // Split. When a jelly that is Medium or larger is subjected to lightning or slashing damage, it splits into two new jellies if it has at least 10 hit points.
      // Each new jelly has hit points equal to half the original jelly's, rounded down. New jellies are one size smaller than the original jelly.
      file: mainWeapon,
      name: "Pseudopod",
      equippedSlot: "WEAPON1",
      icon: "IJELLY",
      type: "Melee",
      range: 5,
      diceSize: 10,
      diceThrown: 1,
      damageBonus: 2,
      damageType: "Crushing",
      // 2e: The ochre jelly attacks by attempting to envelop its prey. Its secretions dissolve flesh, inflicting 3-12 (d10+2) points of damage per round of exposure.
      // 5e: reach 5 ft, 2d6+2 bludgeoning damage plus 1d6 acid damage
      animationSwing: { backhand: 100, overhand: 0, thrust: 0 },
      projectile: "ACIDBLMU",
    },
  ],
  files: [
    "BDJELLOC", // Ochre Jelly
    "BDSHJELL", // Ochre Jelly
    "BPJLOC01", // Ochre Jelly
    "JELLOC", // Ochre Jelly
    "JELLYCO", // Ochre Jelly
  ],
  adjustments: [],
};
