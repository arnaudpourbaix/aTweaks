import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { RawEffect } from "../../src/model/raw/effect";
import { RawItem } from "../../src/model/raw/item";
import { RawSpell } from "../../src/model/raw/spell";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.SwordSpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
const impaleWeapon = file(2, id);
const strongerImpaleWeapon = file(3, id);
const offhandWeapon = file(4, id);
// Spells
const leap = file(1, id);
const impaleSpell = file(2, id);
const strongerImpaleSpell = file(3, id);

const baseWeapon: RawItem = {
  file: mainWeapon,
  stringRef: TraStringReferenceEnum.Legs,
  icon: MonsterItemIconEnum.Wolf,
  equippedSlot: "WEAPON1",
  type: "Melee",
  diceThrown: 1,
  diceSize: 12,
  damageType: "Piercing",
  speed: 3,
  abilityFlags: ["AddStrengthBonus"],
};

const createImpaleSpell = (
  file: string,
  legCount: number,
  effect: RawEffect
): RawSpell => ({
  name: "Impaling Attack",
  file,
  icon: SPELLS.OffensiveSpin,
  stringRef: TraStringReferenceEnum.ImpalingAttack,
  description: [
    "",
    "Lands legs forward, impaling target. Only one attack roll is made and if the attack is successful, the victim is struck by 4 legs.",
    "If the spider's leap is greater than 20 feet, each leg receives a +1 bonus to damage.",
    "Any upward attack against the leaping spider receives a -4 to the attack roll, due to the impaling blades which protect the spider.",
  ],
  headers: [
    {
      type: "Melee",
      range: 30,
      effects: [
        ...new Array(legCount).fill(effect),
        {
          opcode: "Thac0Bonus",
          type: "Increment",
          value: -4,
          timing: "InstantLimited",
          duration: 12,
        },
      ],
    },
  ],
});

const name = "Sword Spider";
export const SPIDER_SWORD: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/sword",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  attack: {
    dualWielding: true,
    defaultWeaponSlot: "SLOT_WEAPON",
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
    movement: 8,
    ac: 3,
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
    immunities: ["vermin", "spider"],
  },
  items: [
    baseWeapon,
    {
      ...baseWeapon,
      file: impaleWeapon,
      stringRef: TraStringReferenceEnum.ImpalingAttack,
      equippedSlot: "WEAPON2",
      diceThrown: 0,
      diceSize: 0,
      effects: [
        {
          opcode: "CastSpell",
          type: "CastInstantlyAtCasterLevel",
          resource: impaleSpell,
        },
      ],
    },
    {
      ...baseWeapon,
      file: strongerImpaleWeapon,
      stringRef: TraStringReferenceEnum.ImpalingAttack,
      equippedSlot: "WEAPON3",
      diceThrown: 0,
      diceSize: 0,
      effects: [
        {
          opcode: "CastSpell",
          type: "CastInstantlyAtCasterLevel",
          resource: strongerImpaleSpell,
        },
      ],
    },
    {
      file: offhandWeapon,
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
    {
      name: "Leap",
      file: leap,
      memorizedCount: 1,
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
              opcode: "Stun",
              duration: 1,
            },
          ],
        },
      ],
    },
    createImpaleSpell(impaleWeapon, 4, {
      opcode: "Damage",
      type: "Piercing",
      diceSize: 1,
      diceThrown: 12,
    }),
    createImpaleSpell(strongerImpaleSpell, 4, {
      opcode: "Damage",
      type: "Piercing",
      diceSize: 1,
      diceThrown: 12,
      amount: 1,
    }),
  ],
  abilities: [
    {
      name: "Leap (from more than 20 feet range)",
      target: { name: "FarthestEnemies" },
      minRange: 20,
      range: 30,
      spell: {
        resource: leap,
        type: "force",
        remove: true,
      },
      disableInterrupt: true,
      actionsAfter: [
        { name: "SelectWeaponAbility", params: ["SLOT_WEAPON2", 0] },
        { name: "AttackOneRound", params: ["LastSeenBy"] },
        { name: "SelectWeaponAbility", params: ["SLOT_WEAPON", 0] },
      ],
    },
    {
      name: "Leap (from less than 20 feet range)",
      target: { name: "FarthestEnemies" },
      minRange: 5,
      range: 20,
      spell: {
        resource: leap,
        type: "force",
        remove: true,
      },
      disableInterrupt: true,
      actionsAfter: [
        { name: "SelectWeaponAbility", params: ["SLOT_WEAPON1", 0] },
        { name: "AttackOneRound", params: ["LastSeenBy"] },
        { name: "SelectWeaponAbility", params: ["SLOT_WEAPON", 0] },
      ],
    },
  ],
  files: [
    "BDHELP03", // Sword Spider
    "BDSPID7L", // Seven-Legged Spider
    "BPSPID03", // Sword Spider
    "PLYSPID", // Sword Spider
    "SPIDSW", // Sword Spider
    "SPIDSW01", // Sword Spider
    "SPIDSWSU", // Sword Spider
    "WISPID03", // Lightning Sword Spider (+2 electricity damage with leg)
  ],
  adjustments: [
    { files: ["BDHELP03", "SPIDSWSU"], summon: true },
    { files: ["PLYSPID"], noScript: true },
    { files: ["WISPID03"] },
  ],
};
