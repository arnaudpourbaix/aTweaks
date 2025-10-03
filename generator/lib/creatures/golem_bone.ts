import { MonsterItemIconEnum } from "../config/item";
import { SPELLS } from "../config/spell-names";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { RawBaseEffect } from "../src/model/raw/effect";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.BoneGolem;
// Script
const script = bafFile(id);
// Spells
const hideousLaugh = file(1, id);
// Items
const mainWeapon = file(1, id);

const laughEffect: RawBaseEffect = {
  timing: "InstantLimited",
  duration: 42,
  saveTypes: ["Spell"],
};

export const GOLEM_BONE: RawCreature = {
  name: "Bone Golem",
  bafFile: `lib/pnp-monster/golem/${script}`,
  tpaFile: "lib/pnp-monster/golem/bone",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 14,
    bonusHp: 0,
    strength: 17,
    dexterity: 13,
    constitution: 16,
    intelligence: 3,
    wisdom: 8,
    charisma: 1,
    movement: 12,
    ac: 0,
    apr: 1,
    xpv: 18000,
    alignment: "NEUTRAL",
    morale: 20,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "GOLEM",
    class: "GOLEM_STONE",
    gender: "NIETHER",
    size: "Medium",
    resistMagic: 100,
  },
  additionalData: {
    immunities: ["construct", "skeletal"],
    removeScripts: ["dw1melmo"],
    removeItems: ["S3-8M3", "GOLCLA", "IMMUNE2", "HELMNOAN"],
    memorizedSpells: [{ file: hideousLaugh, memorizedCount: 1 }],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.LethalFists,
      icon: MonsterItemIconEnum.Golem,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 3,
      diceSize: 8,
      damageType: "Slashing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  spells: [
    {
      name: "Hideous Laugh",
      file: hideousLaugh,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.HideousLaugh,
      icon: SPELLS.CloakOfFear,
      description: [
        "The bone golem may throw back its head and issue a hideous laugh that causes all those who hear it to make fear and horror checks.",
        "Those who fail either check are paralyzed and cannot move for 2-12 rounds.",
        "Those who fail both checks are instantly stricken dead with fear.",
      ],
      secondaryType: "Disabling",
      headers: [
        {
          type: "Ranged",
          target: "AnyPointWithinRange",
          projectile: "INAREANP",
          range: 30,
          effects: [
            {
              opcode: "Panic",
              ...laughEffect,
            },
            {
              opcode: "DisplayPortraitIcon",
              timing: "InstantLimited",
              icon: "Panic",
              ...laughEffect,
            },
            {
              opcode: "PlaySound",
              timing: "InstantPermanentUntilDeath",
              resource: "EFF_M07",
              ...laughEffect,
            },
            {
              opcode: "PlaySound",
              timing: "DelayPermanent",
              resource: "EFF_E07",
              ...laughEffect,
            },
          ],
        },
      ],
    },
  ],
  abilities: [
    {
      name: "Hideous laugh",
      target: { name: "NearestEnemies", limit: 6 },
      spell: {
        resource: hideousLaugh,
        type: "force",
        excludeStateChecks: ["STATE_PANIC"],
        selfTarget: true,
      },
      timer: { name: "Fear", value: 18 },
    },
  ],
  files: ["NTGOLBON"],
};
