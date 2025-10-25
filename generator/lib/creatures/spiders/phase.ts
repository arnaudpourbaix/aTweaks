import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.PhaseSpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = getFilename(1, id);
const trait = getFilename(2, id);

const name = "Phase Spider";
export const SPIDER_PHASE: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/phase",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  data: {
    level1: 5,
    bonusHp: 5,
    strength: 15,
    dexterity: 15,
    constitution: 12,
    intelligence: 7,
    wisdom: 10,
    charisma: 6,
    movement: 6, // 6, Web 15
    ac: 8, // -1 with dex bonus
    apr: 1,
    xpv: 1400,
    alignment: "NEUTRAL",
    morale: 15,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_PHASE",
    gender: "NIETHER",
    size: "Huge",
  },
  additionalData: {
    removeItems: ["SPIDPH1", "ANTIWEB", "SPIDPHSU"],
    removeScripts: [
      "DW1MELMO",
      "DW#GPSHM",
      "PSPIDER",
      "BPSIGHT",
      "BPASIGHT",
      "DVMELEE",
      "SPIDPHSU",
    ],
    immunities: ["spider"],
  },
  items: [
    {
      // They phase in, attack, and phase out, all in a single round.
      // This gives them a -3 modifier on initiative rolls; if a phase spider wins initiative by more than 4, it attacks and phases out before its opponent has a chance to strike back.
      // Then too, a phase spider usually phases into existence behind its chosen victim, so they get a +4 modifier for attacking from behind.
      // Phase spiders flee to the Ethereal plane when outmatched
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 6,
      damageType: "Piercing",
      speed: 1,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "PoisonTypeEffects",
          poisonType: "F",
          saveBonus: -2,
        },
        {
          opcode: "DisplayString",
          stringRef: TraStringReferenceEnum.PhaseOut,
          target: "Self",
          timing: "DelayPermanent",
          duration: 2,
        },
        {
          opcode: "Invisibility",
          type: "Normal",
          target: "Self",
          timing: "DelayPermanent",
          duration: 2,
        },
      ],
    },
    createTraitItem({
      file: trait,
      name,
      description: [
        "Phase spider only phases in material plane when attacking",
      ],
      effects: [
        {
          opcode: "Invisibility",
          type: "Normal",
        },
      ],
    }),
  ],
  files: [
    "SPIDPH", // Phase Spider
    "SPIDPHSU", // Phase Spider
    "SPIDPHAS", // Astral Phase Spider
  ],
  adjustments: [
    { files: ["SPIDPHSU"], summon: true },
    {
      files: ["SPIDPHAS"],
      data: {
        level1: 12,
        xpv: 4000,
      },
    },
  ],
};
