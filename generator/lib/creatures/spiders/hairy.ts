import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { RawBaseEffect } from "../../src/model/raw/effect";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.HairySpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
// Spells
const poison = file(1, id);

const baseEffect: RawBaseEffect = {
  timing: "InstantLimited",
  duration: 30,
};

const name = "Hairy Spider";
export const SPIDER_HAIRY: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/hairy",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  data: {
    level1: 1,
    bonusHp: 1,
    thac0: 20,
    strength: 2,
    dexterity: 14,
    constitution: 8,
    intelligence: 1,
    wisdom: 10,
    charisma: 2,
    movement: 6, // 6, web 15
    ac: 8,
    apr: 1,
    xpv: 65,
    alignment: "NEUTRAL_EVIL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_HUGE",
    gender: "NIETHER",
    size: "Tiny",
  },
  additionalData: {
    removeItems: ["SPIDHU1", "ANTIWEB"],
    removeScripts: [
      "BDENSHTV",
      "BDNONIN",
      "DW1MELMO",
      "DW#GPSHM",
      "DW#SPIDG",
      "BPSIGHT",
      "BPASIGHT",
      "DVMELEE",
    ],
    memorizedSpells: [{ file: SPELLS.DetectInvisibility, memorizedCount: 1 }],
    immunities: ["spider"],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      speed: 2,
      effects: [
        {
          opcode: "Damage",
          type: "Piercing",
          amount: 1,
        },
        {
          opcode: "CastSpell",
          type: "CastInstantlyAtCasterLevel",
          resource: poison,
          saveTypes: ["ParalyzePoisonDeath"],
          saveBonus: 2,
        },
      ],
    },
  ],
  spells: [
    {
      file: poison,
      name: "Hairy Spider Poison",
      stringRef: TraStringReferenceEnum.HairySpiderPoison,
      description: [
        "If the saving throw fails, the victim's AC and attack rolls are penalized by 1, and Dexterity is penalized by -3 with respect to Dexterity checks.",
        "These effects begin one round after the bite and last for 5 rounds.",
      ],
      secondaryType: "Disabling",
      headers: [
        {
          type: "Melee",
          range: 5,
          effects: [
            {
              opcode: "ArmorClassBonus",
              bonusTo: "AllWeapons",
              value: -1,
              ...baseEffect,
            },
            {
              opcode: "Thac0Bonus",
              type: "Increment",
              value: -1,
              ...baseEffect,
            },
            {
              opcode: "DexterityBonus",
              type: "Increment",
              value: -3,
              ...baseEffect,
            },
            {
              opcode: "DisplayPortraitIcon",
              icon: "AbilityScoreDrained",
              timing: "InstantLimited",
              ...baseEffect,
            },
            {
              opcode: "ProtectionFromSpell",
              resource: poison,
              ...baseEffect,
            },
          ],
        },
      ],
    },
  ],
  abilities: [
    {
      preset: SPELLS.DetectInvisibility,
      spell: {
        type: "force",
        probability: 30,
      },
      requireVocal: false,
    },
  ],
  files: [
    "BDSPIDER", // Small Spider
    "SPIDSM01", // Small Spider
  ],
  adjustments: [{ files: ["BDSPIDER"], noScript: true }],
};
