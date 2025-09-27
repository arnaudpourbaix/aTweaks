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
import { FactoryService } from "../src/services/factory.service";
import { ATWEAKS_CREATURES } from "../config/creatures";

const effects = EffectService.instance;
const utils = UtilsService.instance;
const factory = FactoryService.instance;
// Creature Id
const id = MonsterEnum.MustardJelly;
// Items
const mainWeapon = file(1, id);
// Spells
const toxicVapors = file(1, id);
const split = file(2, id);
// Projectile
const toxicVaporsProjectile = file(1, id);
// Script
const script = bafFile(id);

export const SLIME_MUSTARD_JELLY: RawCreature = {
  name: "Mustard Jelly",
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/mustard_jelly",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  dialog: [],
  canPolymorph: true,
  autoGenerate: {
    savingThrows: false,
  },
  data: {
    level1: 7,
    hp: 49,
    // bonusHp: 14,
    thac0: 13,
    strength: 15,
    dexterity: 10,
    constitution: 21,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    // movement: 9,
    movement: 18,
    ac: 4,
    apr: 1,
    resistMagic: 10,
    resistElectricity: 100,
    resistCold: 50,
    xpv: 4000,
    alignment: "NEUTRAL",
    morale: 14,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "MUSTARD_JELLY",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: {
    removeItems: ["IMMUNE1", "RING95", "JELLMU1", "DW#JELMU"],
    removeScripts: ["BPSIGHT", "BPASIGHT", "DW1RANMO"],
    immunities: ["ooze"],
  },
  items: [
    // Mustard jelly is translucent, and very hard to see until it attacks. The only clue to its presence is a faint odor, similar to blooming mustard plants.
    {
      file: mainWeapon,
      name: "Pseudopod",
      equippedSlot: "WEAPON1",
      icon: "IJELLY",
      type: "Melee",
      range: 5,
      diceSize: 4,
      diceThrown: 5,
      damageType: "Crushing",
      animationSwing: { backhand: 100, overhand: 0, thrust: 0 },
      projectile: "ACIDBLMU",
      // 5e: +5 to hit, reach 5 ft, 3d6+2 bludgeoning damage and 3d6 acid damage.
    },
  ],
  projectiles: [
    {
      file: toxicVaporsProjectile,
      copyFromFile: "dvstink",
      description: "Mustard jelly Toxic Vapors",
      particleColor: "Green",
      areaEffectInfo: {
        areaProjectileFlags: ["AffectOnlyEnemies"],
        explosionDelay: 12,
        triggerCount: 6,
        triggerRadius: 180,
        areaOfEffect: 180,
      },
    },
  ],
  spells: [
    {
      // 5e: Poison Aura. At the start of each of the jelly’s turns, each creature within 10 feet of it takes 3d6 poison damage. A creature that touches the jelly or hits it with a melee attack while within 5 feet of it takes 3d6 poison damage.
      name: "Toxic vapors",
      file: toxicVapors,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.ToxicVapors,
      icon: SPELLS.Slow,
      infiniteUse: true,
      description: [
        "Unleash a vapor over a 10-foot radius.",
        "Those near the jelly must roll a saving throw vs. poison each round.",
        "Those who fail the saving throw become lethargic and move at half-normal speed, due to the effects of the vapor.",
        "The toxic effects last for two rounds and they are cumulative.",
      ],
      secondaryType: "Disabling",
      headers: [
        {
          type: "Ranged",
          target: "Caster",
          projectile: toxicVaporsProjectile,
          range: 10,
          effects: [
            {
              opcode: "Slow",
              timing: "InstantLimited",
              duration: 12,
              dispelResistance: "NaturalNonMagical",
              saveTypes: ["ParalyzePoisonDeath"],
            },
            {
              opcode: "LightingEffects",
              effect: "AlterationWater",
              lightingTarget: "SpellTarget",
              timing: "InstantPermanentUntilDeath",
              dispelResistance: "NaturalNonMagical",
              saveTypes: ["ParalyzePoisonDeath"],
            },
            {
              opcode: "PlaySound",
              resource: "EFF_M29",
              timing: "InstantPermanentUntilDeath",
              dispelResistance: "NaturalNonMagical",
              saveTypes: ["ParalyzePoisonDeath"],
            },
            {
              opcode: "ProtectionFromSpell",
              resource: toxicVapors,
              timing: "InstantLimited",
              duration: 6,
              dispelResistance: "NaturalNonMagical",
            },
          ],
        },
      ],
    },
    {
      name: "Split",
      file: split,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.Split,
      icon: SPELLS.Chant,
      description: [
        "This large creature can divide itself at will into two smaller, faster halves (movement rate 18).",
        "Each is capable of attacking, but has only half the hit points the creature had before dividing.",
      ],
      headers: [
        {
          type: "Magical",
          target: "Caster",
          effects: [
            {
              opcode: "PlayVisualEffect",
              playWhere: "OverTargetAttached",
              resource: "TRGOOYAA",
              timing: "InstantPermanentUntilDeath",
            },
            {
              opcode: "SummonCreature",
              mode: "MatchTarget3",
              timing: "InstantPermanentUntilDeath",
              resource: ATWEAKS_CREATURES.SplitMustardJelly,
            },
            {
              opcode: "SummonCreature",
              mode: "MatchTarget3",
              timing: "InstantPermanentUntilDeath",
              resource: ATWEAKS_CREATURES.SplitMustardJelly,
            },
            {
              opcode: "RemoveCreature",
              timing: "InstantPermanentUntilDeath",
            },
            // {
            //   opcode: "LightingEffects",
            //   effect: "AlterationWater",
            //   lightingTarget: "SpellTarget",
            //   timing: "InstantPermanentUntilDeath",
            // },
          ],
        },
      ],
    },
  ],
  abilities: [
    {
      name: "Toxic Vapors",
      target: {
        name: "NearestEnemies",
        limit: 3,
      },
      spell: {
        resource: toxicVapors,
        type: "force",
        probability: 100,
        selfTarget: true,
      },
      range: 10,
      timer: { name: "ToxicVapors", value: 6 },
    },
  ],
  // customCode: [
  //   {
  //     location: "init",
  //     type: "insertAfter",
  //     statements: [
  //       {
  //         comment:
  //           "This large creature can divide itself at will into two smaller, faster halves (movement rate 18). Each is capable of attacking, but has only half the hit points the creature had before dividing.",
  //         triggers: [
  //           factory.global("split", 0),
  //           { name: "Exists", params: ["LastSummonerOf"], negation: true },
  //         ],
  //         responses: [
  //           {
  //             weight: 100,
  //             actions: [
  //               {
  //                 name: "CreateCreatureObjectEffect",
  //                 params: ["JELLMU", "TRGOOYAA", "Myself"],
  //               },
  //               factory.setGlobal("split", 1),
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ],
  files: [
    // "AC#FPWP2", // White Blob
    // "AC#FPWPU", // White Blob
    // "SCHLUM", // Schlumpsha the Sewer King TODO: it is a mustard ?
    "BDJELLMU", // Mustard Jelly
    "BPJLMU01", // Mustard Jelly
    "JELLMU", // Mustard Jelly
    "JELLMUL", // Mustard Jelly
    "JELLMUSU", // Mustard Jelly
    "JELLYMU", // Mustard Jelly
    "PLYJELL1", // Mustard Jelly
    ATWEAKS_CREATURES.SplitMustardJelly,
  ],
  adjustments: [
    { files: ["JELLMUSU"], summon: true },
    { files: ["PLYJELL1"], noScript: true },
    {
      files: [ATWEAKS_CREATURES.SplitMustardJelly],
      data: {
        hp: 49,
        xpv: 2000,
        // movement: 18,
      },
      additionalData: {
        removeMemorizedSpells: true,
        // memorizedSpells: [{ file: toxicVapors, memorizedCount: 1 }],
      },
    },
  ],
};
