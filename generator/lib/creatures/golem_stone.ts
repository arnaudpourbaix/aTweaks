import { GLOBAL_CONFIG } from "../config/generate";
import { StringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";

export const GOLEM_STONE: RawCreature = {
  name: "Stone Golem",
  bafFile: "lib/pnp-monster/golem/ja#m25",
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
    removeScripts: [""],
    removeItems: [""],
  },
  items: [
    {
      file: "ja#m25w1",
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 3,
      diceSize: 8,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  spells: [
    {
      name: "Slow",
      file: "ja#1m25",
      memorizedCount: 1,
      type: "Melee",
      stringRef: StringReferenceEnum.Slow,
      effects: [
        {
          opcode: "RemoveSpellTypeProtections",
          maximumLevel: 9,
          type: "K1#SLOW",
          timing: "InstantLimited",
          duration: 18,
        },
        {
          opcode: "Slow",
          timing: "InstantLimited",
          duration: 18,
        },
        {
          opcode: "DisplayPortraitIcon",
          icon: "Haste",
          timing: "InstantLimited",
          duration: 18,
        },
        {
          opcode: "LightingEffects",
          effect: "AlterationAir",
          lightingTarget: "SpellTarget",
          timing: "InstantPermanentUntilDeath",
        },
        {
          opcode: "CreatureRGBColorFade",
          color: {
            red: 60,
            green: 60,
            blue: 120,
          },
          fadeSpeed: 25,
          timing: "InstantPermanentUntilDeath",
        },
        {
          opcode: "DisplayString",
          stringRef: "14023",
          timing: "InstantPermanentUntilDeath",
        },
        {
          opcode: "PlaySound",
          timing: "InstantPermanentUntilDeath",
          resource: "EFF_M28",
        },
        {
          opcode: "PlaySound",
          timing: "DelayPermanent",
          duration: 18,
          resource: "EFF_M29",
        },
      ],
    },
  ],
  abilities: [
    {
      name: "Golem Slow",
      target: { name: "NearestEnemies", limit: 3 },
      range: 10,
      triggers: [
      {
        name: "StateCheck",
        params: [GLOBAL_CONFIG.tokens.target, "STATE_SLOWED"],
        negation: true
      },
        { name: "HaveSpellRES", params: ["ja#1m25"] },
      ],
      timer: { name: "Slow", value: 12 },
      actions: [
        { name: "ReallyForceSpellRES", params: ["ja#1m25", "Myself"] },
      ],
    },
  ],
  files: ["","","","","","",""],
};
