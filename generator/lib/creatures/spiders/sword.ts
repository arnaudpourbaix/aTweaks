import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreatureAbility } from "../../src/model/raw/ability";
import { RawCreature } from "../../src/model/raw/creature";
import { DamageEffect, RawEffect } from "../../src/model/raw/effect";
import { RawItem } from "../../src/model/raw/item";
import { RawSpell } from "../../src/model/raw/spell";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.SwordSpider;
// Script
const script = bafFile(id);
// Items
const legWeapon = file(1, id);
const impaleWeapon = file(2, id);
const jawWeapon = file(4, id);
// special lightning sword spider
const lightningLegWeapon = file(5, id);
const lightningImpaleWeapon = file(6, id);
// Spells
const leap = file(1, id);
const lightningLeap = file(2, id);

const createLegWeapon = (
  file: string,
  impale: boolean,
  lightning: boolean
): RawItem => {
  const effects: RawEffect[] = [];
  if (impale) {
    effects.push(
      {
        opcode: "DisplayString",
        stringRef: TraStringReferenceEnum.ImpalingAttack,
      },
      // ...new Array(4).fill(<DamageEffect>{
      //   opcode: "Damage",
      //   type: "Piercing",
      //   diceThrown: 1,
      //   diceSize: 12,
      //   amount: 1, // strength bonus
      // }),
      {
        opcode: "Thac0Bonus",
        type: "Increment",
        value: -4,
        timing: "InstantLimited",
        duration: 12,
      }
    );
  }
  if (lightning) {
    effects.push({
      opcode: "Damage",
      type: "Electricity",
      amount: impale ? 8 : 2,
    });
  }
  return {
    file,
    stringRef: impale
      ? TraStringReferenceEnum.ImpalingAttack
      : TraStringReferenceEnum.Legs,
    icon: MonsterItemIconEnum.Wolf,
    equippedSlot: impale ? undefined : "WEAPON1",
    type: "Melee",
    diceThrown: impale ? 4 : 1,
    diceSize: 12,
    damageType: "Piercing",
    speed: 1,
    abilityFlags: ["AddStrengthBonus"],
    effects,
  };
};

const createLeapSpell = (
  file: string,
  memorizedCount: number,
  weaponFile: string
): RawSpell => {
  return {
    name: "Leap",
    file,
    memorizedCount,
    icon: SPELLS.Haste,
    infiniteUse: 1,
    stringRef: TraStringReferenceEnum.Leap,
    description: [
      "",
      "Leaps horizontally as far as 30 feet.",
      "Gains Impaling Attack ability for one round.",
    ],
    headers: [
      {
        type: "Melee",
        range: 30,
        effects: [
          {
            opcode: "WingBuffet",
            target: "Self",
            speed: 150,
            direction: "TowardsTargetPoint",
            duration: 2,
          },
          {
            opcode: "CreateWeapon",
            amount: 1,
            resource: weaponFile,
            target: "Self",
            timing: "InstantLimited",
            duration: 6,
          },
          {
            opcode: "Stun",
            duration: 1,
          },
        ],
      },
    ],
  };
};

const createLeapAbility = (resource: string): RawCreatureAbility => {
  return {
    name: "Leap Attack",
    target: { name: "FarthestEnemies", random: true },
    minRange: 5,
    range: 30,
    spell: {
      resource,
      type: "force",
      isAttack: true,
    },
    disableInterrupt: true,
    actionsAfter: [{ name: "AttackOneRound", params: ["LastSeenBy"] }],
  };
};

const name = "Sword Spider";
export const SPIDER_SWORD: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/sword",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  attack: {
    //TODO:
    dualWielding: true,
    defaultWeaponSlot: "SLOT_WEAPON",
    maxRange: 5,
  },
  data: {
    level1: 5,
    bonusHp: 5,
    thac0: 15,
    strength: 16,
    dexterity: 18,
    constitution: 14,
    intelligence: 9,
    wisdom: 14,
    charisma: 4,
    movement: 6, // 6, Web 8
    ac: 7, // -4 with dex bonus
    apr: 2,
    xpv: 2000,
    alignment: "CHAOTIC_EVIL",
    morale: 13,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_SWORD",
    gender: "NIETHER",
    size: "Huge",
  },
  additionalData: {
    removeItems: ["SPIDSW1", "ANTIWEB", "SPIDSWSU", "WISPIDSW"],
    removeScripts: ["DW1MELMO", "DW#GPSHM", "DW#SPIDS", "BPSIGHT", "BPASIGHT"],
    immunities: ["spider"],
  },
  items: [
    createLegWeapon(legWeapon, false, false),
    createLegWeapon(impaleWeapon, true, false),
    createLegWeapon(lightningLegWeapon, false, true),
    createLegWeapon(lightningImpaleWeapon, true, true),
    {
      file: jawWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "SHIELD",
      type: "Melee",
      diceThrown: 2,
      diceSize: 4,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  spells: [
    createLeapSpell(leap, 1, impaleWeapon),
    createLeapSpell(lightningLeap, 0, lightningImpaleWeapon),
  ],
  abilities: [createLeapAbility(leap), createLeapAbility(lightningLeap)],
  files: [
    "BDHELP03", // Sword Spider
    "BDSPID7L", // Seven-Legged Spider
    "BPSPID03", // Sword Spider
    "PLYSPID", // Sword Spider
    "SPIDSW", // Sword Spider
    "SPIDSW01", // Sword Spider
    "SPIDSWSU", // Sword Spider
    "BPSPID01", // Spider
    "GV#SPID", // Spider
    "WISPID01", // Spider
    "WISPID02", // Spider
    "WISPID03", // Lightning Sword Spider (+2 electricity damage with leg)
  ],
  adjustments: [
    { files: ["BDHELP03", "SPIDSWSU"], summon: true },
    { files: ["PLYSPID"], noScript: true },
    {
      files: ["WISPID03"],
      additionalData: {
        removeMemorizedSpells: true,
        itemSlots: [{ file: lightningLegWeapon, slot: "WEAPON1" }],
        memorizedSpells: [{ file: lightningLeap, memorizedCount: 1 }],
      },
    },
  ],
};
