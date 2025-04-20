import { GLOBAL_CONFIG } from "../config/generate";
import { SPELLS } from "../config/spell";
import { StringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.OgreMage;
// Script
const script = bafFile(id);
// Spells
const coneOfCold = file(1, id);
const gaseousForm = file(2, id);
// Items
const mainWeapon = file(1, id);
export const OGRE_MAGE: RawCreature = {
  name: "Ogre Mage",
  bafFile: `lib/pnp-monster/ogre/${script}`,
  tpaFile: "lib/pnp-monster/ogre/mage",
  tracking: true,
  combatWalk: true,
  usePotions: true,
  data: {
    level1: 5,
    bonusHp: 2,
    strength: 18,
    exceptionalStrength: 100,
    dexterity: 10,
    constitution: 17,
    intelligence: 16,
    wisdom: 14,
    charisma: 17,
    movement: 15,
    ac: 4,
    apr: 1,
    xpv: 650,
    alignment: "LAWFUL_EVIL",
    morale: 14,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "OGRE",
    class: "OGRE_MAGE",
    gender: "MALE",
    size: "Large",
  },
  additionalData: {
    proficiencies: [{ type: "PROFICIENCYKATANA", value: 2 }],
    removeItems: ["REGHP1", "BDOGRE03"],
    immunities: ["hover"],
    memorizedSpells: [
      { file: SPELLS.Invisibility, memorizedCount: 1 },
      { file: SPELLS.Darkness15Radius, memorizedCount: 1 },
      { file: SPELLS.CharmPerson, memorizedCount: 1 },
      { file: SPELLS.Sleep, memorizedCount: 1 },
    ],
    effects: [
      {
        opcode: "Regeneration",
        type: "OneHPperAmountSeconds",
        amount: 6,
      },
    ],
  },
  attack: {
    targetPriorities: [
      {
        // The ogres fight more wisely when led by a half-ogre that concentrates assaults on characters it recognizes as spellcasters and teaming up against skilled fighters.
        targets: ["PCSpellcasters", "PCsPreferringStrong"],
      },
    ],
  },
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      flags: ["TwoHanded"],
      animation: "Katana",
      category: "Halberds",
      proficiency: "PROFICIENCYKATANA",
      animationSwing: { backhand: 50, overhand: 50, thrust: 0 },
      range: 2,
      diceThrown: 1,
      diceSize: 12,
      damageType: "Slashing",
      speed: 5,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  projectiles: [
    {
      file: coneOfCold,
      copyFromFile: "CONECOLD",
      description: "Ogre-Mage Cone of Cold",
      areaOfEffect: 620,
      triggerRadius: 620,
    },
  ],
  spells: [
    {
      name: "Cone of Cold",
      file: coneOfCold,
      stringRef: StringReferenceEnum.ConeOfCold,
      memorizedCount: 1,
      type: "Melee",
      projectile: coneOfCold,
      castingSound: "CAS_M06",
      flags: ["Hostile", "BreakSanctuary"],
      spellType: "Wizard",
      castingAnimation: "Invocation",
      primaryType: "Invoker",
      secondaryType: "OffensiveDamage",
      spellLevel: 5,
      location: "Spell",
      //target: "AnyPointWithinRange",
      target: "LivingActor",
      range: 10,
      speed: 1,
      effects: [
        // {opcode:"ProtectionFromResourceAndMessage",
        //   resource: coneOfCold
        // }
        {
          opcode: "Damage",
          type: "Cold",
          amount: 0,
          diceSize: 8,
          diceThrown: 8,
          saveTypes: ["Spell", "BypassMirrorImage"],
          saveBonus: -4,
          flags: ["SaveForHalf"],
        },
        {
          opcode: "PauseTarget",
          duration: 1,
        },
      ],
    },
  ],
  abilities: [
    {
      name: "Cone of Cold",
      target: { name: "NearestEnemies", random: true },
      isTargetSpell: true,
      triggers: [{ name: "Range", params: [GLOBAL_CONFIG.tokens.target, 10] }],
      actions: [
        //{ name:"SpellRES", params: [coneOfCold, "LastSeenBy"]}
        { name: "SpellNoDecRES", params: [coneOfCold, "LastSeenBy"] },
      ],
    },
  ],
  files: [
    "BDOGRE03",
    "BDWAVE16",
    "BPOGMA01",
    "OGREMA",
    "OGREMA02",
    "OGREMA03",
    "OGREMASU",
    "OGREMA_A",
    "OGREMA_B",
    "OGREMA_C",
    "OGREMA_D",
    "OGREMBA",
    "OGRMBA",
    "UBOGMA01",
    "UBOGMA02",
    "NTFOREOG",
    "BDOGRE05", // Ogre Shaman
    "BDMURS", // Murs
    "BDMURS2", // Murs
    "DROTH", // Droth
    "DWSST2", //
    "KAHRK", // Kahrk
    "KROTAN", // Krotan
    "NTKROTAN", // Krotan
    "WIGENTLE", // The Gentleman
    "WIOGMA01", // Yondak Master of Portals
  ],
};
