import {
  ATWEAKS_CREATURES,
  VAPOR_IMMUNE_CREATURES,
} from "../../config/creatures";
import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { createCreatureSplit } from "../../spells/slime_split";
import { RawCreatureAbility } from "../../src/model/raw/ability";
import { RawCreature } from "../../src/model/raw/creature";
import { IdsEffect, RawBaseEffect } from "../../src/model/raw/effect";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.MustardJelly;
// Items
const mainWeapon = getFilename(1, id);
export const mustardJellyTraits = getFilename(2, id);
// Spells
export const toxicVapors = getFilename(1, id);
const split = getFilename(2, id);
// Projectile
const toxicVaporsProjectile = getFilename(1, id);
// Script
const script = bafFile(id);

export const toxicVaporsAbility: RawCreatureAbility = {
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
};

const vaporBaseEffect: RawBaseEffect = {
  timing: "InstantLimited",
  dispelResistance: "NaturalNonMagical",
  duration: 12,
  saveTypes: ["ParalyzePoisonDeath"],
};

const name = "Mustard Jelly";

export const SLIME_MUSTARD_JELLY: RawCreature = {
  name,
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/mustard_jelly",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 7,
    bonusHp: 14,
    strength: 15,
    dexterity: 10,
    constitution: 21,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    movement: 9,
    ac: 4,
    apr: 1,
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
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Pseudopod,
      icon: MonsterItemIconEnum.Jelly,
      // 5e: +5 to hit, reach 5 ft, 3d6+2 bludgeoning damage and 3d6 acid damage.
      equippedSlot: "WEAPON1",
      type: "Melee",
      speed: 4,
      range: 5,
      diceThrown: 2,
      diceSize: 4,
      damageType: "Crushing",
      animationSwing: { backhand: 100, overhand: 0, thrust: 0 },
      projectile: "ACIDBLMU",
      effects: [
        {
          opcode: "Damage",
          type: "Acid",
          diceThrown: 3,
          diceSize: 4,
        },
      ],
    },
    createTraitItem({
      file: mustardJellyTraits,
      name,
      immunities: [
        "lightning",
        "normalWeapons",
        "magicMissile",
        "coldResistance",
      ],
      // 5e: Immunity to magic damage
      effects: [
        {
          opcode: "MagicResistanceModifier",
          value: 10,
          type: "Set",
        },
      ],
    }),
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
  effectFiles: [
    {
      file: toxicVapors,
      opcode: "ProtectionFromSpell",
      resource: toxicVapors,
      timing: "InstantPermanentUntilDeath",
    },
  ],
  spells: [
    {
      // 5e: Poison Aura. At the start of each of the jelly’s turns, each creature within 10 feet of it takes 3d6 poison damage. A creature that touches the jelly or hits it with a melee attack while within 5 feet of it takes 3d6 poison damage.
      name: "Toxic vapors",
      file: toxicVapors,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.ToxicVapors,
      icon: SPELLS.StinkingCloud,
      infiniteUse: 1,
      description: [
        "Unleash a toxic vapor over a 10-foot radius.",
        "Those near the jelly must roll a saving throw vs. poison each round.",
        "Those who fail the saving throw become lethargic.",
        "Lethargic characters are unable to attack or cast spells, but can still move at half-normal speed.",
        "The toxic effects last for two rounds.",
      ],
      secondaryType: "Disabling",
      headers: [
        {
          type: "Ranged",
          target: "Caster",
          projectile: toxicVaporsProjectile,
          range: 10,
          effects: [
            ...[...VAPOR_IMMUNE_CREATURES].map(
              (c) =>
                <IdsEffect>{
                  opcode: "UseEFFFile",
                  idsFile: c[0],
                  idsEntry: c[1],
                  timing: "InstantPermanentUntilDeath",
                  resource: toxicVapors,
                }
            ),
            {
              opcode: "ModifyAttacksPerRound",
              type: "Set",
              value: 0,
              ...vaporBaseEffect,
            },
            {
              opcode: "CastingFailure",
              type: "Wizard",
              amount: 100,
              ...vaporBaseEffect,
            },
            {
              opcode: "CastingFailure",
              type: "Priest",
              amount: 100,
              ...vaporBaseEffect,
            },
            {
              opcode: "MovementRateBonus",
              type: "SetPercentOf",
              value: 50,
              ...vaporBaseEffect,
            },
            {
              opcode: "DisplayPortraitIcon",
              icon: "Nauseated",
              ...vaporBaseEffect,
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
    createCreatureSplit({
      file: split,
      description: [
        "This large creature can divide itself at will into two smaller, faster halves (movement rate 18).",
        "Each is capable of attacking, but has only half the hit points the creature had before dividing.",
      ],
      resource: ATWEAKS_CREATURES.SplitMustardJelly,
      visualEffect: "TRGOOYAA",
    }),
  ],
  abilities: [
    {
      name: "Split",
      spell: {
        resource: split,
        type: "force",
        probability: 100,
        selfTarget: true,
      },
    },
    toxicVaporsAbility,
  ],
  files: [
    "BDJELLMU", // Mustard Jelly
    "BPJLMU01", // Mustard Jelly
    "JELLMU", // Mustard Jelly
    "JELLMUL", // Mustard Jelly
    "JELLMUSU", // Mustard Jelly
    "JELLYMU", // Mustard Jelly
    "PLYJELL1", // Mustard Jelly
    ATWEAKS_CREATURES.SplitMustardJelly,
  ],
  newFiles: [
    { files: [ATWEAKS_CREATURES.SplitMustardJelly], copyFrom: "JELLMU" },
  ],
  adjustments: [
    { files: ["JELLMUSU"], summon: true },
    { files: ["PLYJELL1"], noScript: true },
    {
      files: [ATWEAKS_CREATURES.SplitMustardJelly],
      data: {
        hp: 56,
        xpv: 2000,
        movement: 18,
      },
      additionalData: {
        removeMemorizedSpells: true,
        memorizedSpells: [{ file: toxicVapors, memorizedCount: 1 }],
      },
    },
  ],
};
