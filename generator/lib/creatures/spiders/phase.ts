import { PRESET_NAMES } from "../../config/ability-presets";
import { MonsterItemIconEnum } from "../../config/item";
import { ATWEAKS_SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { createDimensionDoor } from "../../spells/dimension_door";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.PhaseSpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
// Spells
const phase = file(1, id);

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
    //thac0: 15,
    strength: 15,
    dexterity: 15,
    constitution: 12,
    intelligence: 7,
    wisdom: 10,
    charisma: 6,
    movement: 15,
    ac: 7,
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
    immunities: ["vermin", "spider"],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 6,
      bonusToHit: 4, // always attack from behind
      damageType: "Piercing",
      speed: 1,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "PoisonTypeEffects",
          poisonType: "F",
          saveBonus: -2,
        },
      ],
    },
  ],
  spells: [
    createDimensionDoor({
      file: phase,
      memorizedCount: 1,
      spellLevel: 1,
      spellType: "Innate",
      infiniteUse: 1,
      effects: [
        { opcode: "Thac0Bonus", type: "Increment", value: 4, duration: 6 },
      ],
    }),
  ],
  abilities: [
    // They phase in, attack, and phase out, all in a single round.
    // This gives them a -3 modifier on initiative rolls; if a phase spider wins initiative by more than 4, it attacks and phases out before its opponent has a chance to strike back.
    // Then too, a phase spider usually phases into existence behind its chosen victim, so they get a +4 modifier for attacking from behind.
    // Phase spiders flee to the Ethereal plane when outmatched
    {
      name: "Phase in, attack, and phase out",
      target: { name: "FarthestEnemies" },
      spell: {
        resource: phase,
        type: "force",
        remove: true,
      },
      disableInterrupt: true,
      actionsAfter: [{ name: "AttackOneRound", params: ["LastSeenBy"] }],
    },
    // {
    //   preset: PRESET_NAMES.DimensionDoorOffscreen,
    //   spell: {
    //     type: "force",
    //   },
    //   disableInterrupt: true,
    // },
  ],
  files: [
    "SPIDPH", // Phase Spider
    "SPIDPHSU", // Phase Spider
    "SPIDPHAS", // Astral Phase Spider
    //
    "C#LCCENS", // Ghostly Spirit
    "L#ULCSP", // Ssimkh, the Ghost-Feeding Spider
    "SMSPID02", // Vortex Spider
  ],
  adjustments: [
    { files: ["SPIDPHSU"], summon: true },
    {
      files: ["SPIDPHAS"],
      data: {
        level1: 12,
        xpv: 4000,
      },
      additionalData: {},
    },
  ],
};
