import { GLOBAL_CONFIG } from "../config/generate";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster-id";

// Creature Id
const id = MonsterEnum.StoneGolem;
// Script
const script = bafFile(id);
// Spells
const slow = "spwi312";
// Items
const mainWeapon = file(1, id);

export const GOLEM_STONE: RawCreature = {
  name: "Stone Golem",
  bafFile: `lib/pnp-monster/golem/${script}`,
  tpaFile: "lib/pnp-monster/golem/stone",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 14,
    bonusHp: 0,
    strength: 22,
    dexterity: 9,
    constitution: 20,
    intelligence: 3,
    wisdom: 11,
    charisma: 1,
    movement: 6,
    ac: 5,
    apr: 1,
    xpv: 8000,
    alignment: "NEUTRAL",
    morale: 20,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "GOLEM",
    class: "GOLEM_STONE",
    gender: "NIETHER",
    size: "Large",
    resistMagic: 100,
  },
  additionalData: {
    immunities: ["construct"],
    removeScripts: ["GOLSTO01", "DW1MELMO", "BDSUM00"],
    removeItems: ["GOLSTO", "GOLSTONE"],
    memorizedSpells: [{ file: slow, memorizedCount: 1 }],
  },
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 3,
      diceSize: 8,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  abilities: [
    {
      name: "Slow",
      target: { name: "NearestEnemies", limit: 5 },
      range: 10,
      triggers: [
        {
          name: "StateCheck",
          params: [GLOBAL_CONFIG.tokens.target, "STATE_SLOWED"],
          negation: true,
        },
        { name: "HaveSpellRES", params: [slow] },
      ],
      timer: { name: "Slow", value: 12 },
      actions: [{ name: "ReallyForceSpellRES", params: [slow, "Myself"] }],
    },
  ],
  files: ["BDGOLSTO", "BDMENGO", "NTGOLSTO", "TOMEGOL3", "WISTOGOL"],
};
