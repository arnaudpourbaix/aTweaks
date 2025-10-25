import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";
import { petrification2e, petrificationAbility } from "./lesser";

// Creature Id
const id = MonsterEnum.GreaterBasilisk;
// Script
const script = bafFile(id);
// Spells
const foulBreath = getFilename(1, id);
// Items
const mainWeapon = getFilename(1, id);
const offhandWeapon = getFilename(2, id);
// Projectiles
const foulBreathProjectile = getFilename(1, id);

export const BASILISK_GREATER: RawCreature = {
  name: "Greater Basilisk",
  bafFile: `lib/pnp-monster/basilisk/${script}`,
  tpaFile: "lib/pnp-monster/basilisk/greater",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 10,
    strength: 20,
    dexterity: 8,
    constitution: 19,
    intelligence: 7,
    wisdom: 12,
    charisma: 11,
    movement: 6,
    ac: 2,
    apr: 3,
    xpv: 7000,
    alignment: "NEUTRAL",
    morale: 16,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "BASILISK",
    class: "BASILISK_GREATER",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: {
    removeScripts: ["GBASILSK"],
    removeItems: ["BASILG1", "BASILG2", "BASILG3"],
    memorizedSpells: [{ file: petrification2e, memorizedCount: 1 }],
  },
  abilities: [petrificationAbility],
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Claws,
      icon: MonsterItemIconEnum.Wolf,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 6,
      damageType: "Slashing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "PoisonTypeEffects",
          poisonType: "K",
          saveBonus: 4,
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
      diceSize: 8,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "CastSpell",
          type: "CastInstantlyAtCasterLevel",
          resource: foulBreath,
        },
      ],
    },
  ],
  projectiles: [
    {
      file: foulBreathProjectile,
      copyFromFile: "dvstink",
      description: "Basilisk foul breath",
      particleColor: "Green",
      areaEffectInfo: {
        areaProjectileFlags: ["AffectOnlyEnemies"],
        explosionDelay: 12,
        triggerCount: 6,
        triggerRadius: 64,
        areaOfEffect: 64,
      },
    },
  ],
  spells: [
    {
      name: "Foul breath",
      file: foulBreath,
      stringRef: TraStringReferenceEnum.FoulBreath,
      description: [
        "All creatures within 5 feet must roll successful saving throws vs. poison (with a +2 bonus) or die (check each round of exposure).",
      ],
      secondaryType: "OffensiveDamage",
      headers: [
        {
          type: "Ranged",
          projectile: foulBreathProjectile,
          range: 5,
          target: "AnyPointWithinRange",
          effects: [
            {
              opcode: "Slay",
              idsFile: "EA",
              idsEntry: "ANYONE",
              timing: "InstantPermanentUntilDeath",
              saveTypes: ["ParalyzePoisonDeath"],
              saveBonus: 2,
            },
            {
              opcode: "PlaySound",
              resource: "EFF_P88",
              timing: "InstantPermanentUntilDeath",
              saveTypes: ["ParalyzePoisonDeath"],
              saveBonus: 2,
            },
            {
              opcode: "PlayVisualEffect",
              playWhere: "OverTargetUnattached",
              resource: "SPFINGER",
              timing: "InstantPermanentUntilDeath",
              saveTypes: ["ParalyzePoisonDeath"],
              saveBonus: 2,
            },
          ],
        },
      ],
    },
  ],
  files: [
    "AC#BASGR",
    "BASILG",
    "BASILGSU",
    "BASILMUT",
    "BASILNAD",
    "BD302BAS",
    "BPBASG01",
  ],
  adjustments: [{ files: ["BASILGSU"], summon: true }],
};
