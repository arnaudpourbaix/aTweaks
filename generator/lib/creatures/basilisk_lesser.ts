import { GLOBAL_CONFIG } from "../config/generate";
import { MonsterItemIconEnum } from "../config/item";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { RawSaveType } from "../src/model/raw/enum";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.LesserBasilisk;
// Script
const script = bafFile(id);
// Spells
export const petrification2e = file(1, id);
export const petrification5e = file(2, id);
const petrification5eTechnical = file(3, id);
// Items
const mainWeapon = file(1, id);
// Projectiles
export const basiliskGazeProjectile = file(1, id);

const petrificationSave: { saveTypes: RawSaveType[]; saveBonus: number } = {
  saveTypes: ["PetrifyPolymorph"],
  saveBonus: -4,
};

export const BASILISK_LESSER: RawCreature = {
  name: "Lesser Basilisk",
  bafFile: `lib/pnp-monster/basilisk/${script}`,
  tpaFile: "lib/pnp-monster/basilisk/lesser",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 6,
    bonusHp: 1,
    strength: 16,
    dexterity: 8,
    constitution: 15,
    intelligence: 2,
    wisdom: 8,
    charisma: 7,
    movement: 6,
    ac: 4,
    apr: 1,
    xpv: 1400,
    alignment: "NEUTRAL",
    morale: 12,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "BASILISK",
    class: "BASILISK",
    gender: "NIETHER",
    size: "Medium",
  },
  additionalData: {
    removeItems: ["BASILL1", "BASILL2"],
    removeScripts: ["LBASILSK"],
  },
  abilities: [
    {
      name: "Petrification (2e)",
      target: {
        name: "NearestEnemies",
        random: true,
      },
      spell: {
        resource: petrification2e,
        type: "force",
      },
    },
    // {
    //   name: "Petrification (5e)",
    //   target: {
    //     name: "NearestEnemies",
    //     random: true,
    //     triggers: [
    //       {
    //         name: "HaveSpellRES",
    //         params: [petrification5e],
    //       },
    //       {
    //         name: "CheckStatGT",
    //         params: [GLOBAL_CONFIG.tokens.target, 0, "HELD"],
    //         negation: true,
    //       },
    //       {
    //         name: "StateCheck",
    //         params: [GLOBAL_CONFIG.tokens.target, "STATE_SLOWED"],
    //         negation: true,
    //       },
    //     ],
    //   },
    //   actions: [
    //     { name: "ForceSpellRES", params: [petrification5e, "LastSeenBy"] },
    //   ],
    // },
  ],
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      icon: MonsterItemIconEnum.Wolf,
      type: "Melee",
      diceThrown: 1,
      diceSize: 10,
      damageType: "Slashing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  projectiles: [
    {
      file: basiliskGazeProjectile,
      copyFromFile: "gaze",
      description: "Basilisk petrifying gaze",
      type: "AreaOfEffect",
      areaEffectInfo: {
        areaProjectileFlags: ["AffectOnlyEnemies", "Coneshaped"],
        triggerRadius: 255,
        areaOfEffect: 255,
        coneWidth: 60,
        fragmentAnimation: "NULL_ANIMATION",
        explosionEffect: "NONE",
      },
    },
  ],
  spells: [
    {
      name: "Petrification (2e)",
      file: petrification2e,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.PetrifyingGaze,
      description: [
        "Any creature, that can see and within 30 feet of the basilisk, must save vs petrify at -4. On a failed save, the creature is petrified until freed by the greater restoration spell or other magic.",
      ],
      secondaryType: "Disabling",
      headers: [
        {
          type: "Ranged",
          projectile: basiliskGazeProjectile,
          range: 30,
          effects: [
            {
              opcode: "Petrification",
              ...petrificationSave,
            },
            {
              opcode: "DisplayString",
              stringRef: TraStringReferenceEnum.Petrified,
              ...petrificationSave,
            },
            {
              opcode: "PlaySound",
              resource: "MISC_06B",
              ...petrificationSave,
            },
            {
              opcode: "PlayVisualEffect",
              playWhere: "OverTargetUnattached",
              resource: "SPFLESHS.VVC",
              ...petrificationSave,
            },
            {
              opcode: "CreatureRGBColorFade",
              color: { blue: 120, red: 120, green: 120 },
              fadeSpeed: 25,
              ...petrificationSave,
            },
          ],
        },
      ],
    },
    {
      name: "Petrification (5e)",
      file: petrification5e,
      //memorizedCount: 1,
      stringRef: TraStringReferenceEnum.PetrifyingGaze,
      description: [
        "Any creature, that can see and within 30 feet of the basilisk, must save vs petrify at -4.",
        "On a failed save, the creature magically begins to turn to stone and is restrained.",
        "It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified until freed by the greater restoration spell or other magic.",
      ],
      secondaryType: "Disabling",
      headers: [
        {
          type: "Ranged",
          projectile: basiliskGazeProjectile,
          range: 30,
          effects: [
            {
              opcode: "DisplayString",
              stringRef: TraStringReferenceEnum.TurningToStone,
              ...petrificationSave,
            },
            {
              opcode: "RestrainedEffects",
              duration: 12,
              ...petrificationSave,
            },
            {
              opcode: "CastSpell",
              timing: "DelayLimited",
              duration: 12,
              type: "CastInstantlyAtCasterLevel",
              resource: petrification5eTechnical,
              ...petrificationSave,
            },
            {
              opcode: "ProtectionFromSpell",
              timing: "DelayLimited",
              duration: 12,
              resource: petrification5e,
              ...petrificationSave,
            },
          ],
        },
      ],
    },
    {
      name: "Petrification (5e, technical)",
      stringRef: TraStringReferenceEnum.PetrifyingGaze,
      file: petrification5eTechnical,
      secondaryType: "Disabling",
      headers: [
        {
          type: "Ranged",
          effects: [
            {
              opcode: "Petrification",
              timing: "InstantPermanent",
              ...petrificationSave,
            },
            {
              opcode: "DisplayString",
              stringRef: TraStringReferenceEnum.Petrified,
              timing: "InstantPermanent",
              ...petrificationSave,
            },
            {
              opcode: "PlaySound",
              resource: "MISC_06B",
              timing: "InstantPermanent",
              ...petrificationSave,
            },
            {
              opcode: "PlayVisualEffect",
              playWhere: "OverTargetUnattached",
              resource: "SPFLESHS.VVC",
              timing: "InstantPermanent",
              ...petrificationSave,
            },
            {
              opcode: "CreatureRGBColorFade",
              color: { blue: 120, red: 120, green: 120 },
              fadeSpeed: 25,
              timing: "InstantPermanent",
              ...petrificationSave,
            },
          ],
        },
      ],
    },
  ],
  files: ["BASILL", "BASILLSU", "BPBASL01"],
  adjustments: [{ files: ["BASILLSU"], summon: true }],
};
