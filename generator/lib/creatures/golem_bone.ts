import { GLOBAL_CONFIG } from "../config/generate";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.BoneGolem;
// Script
const script = bafFile(id);
// Spells
const hideousLaugh = "spin890";
// Items
const mainWeapon = file(1, id);

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
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 3,
      diceSize: 8,
      damageType: "Slashing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  abilities: [
    {
      name: "Hideous laugh",
      target: { name: "NearestEnemies", limit: 6 },
      range: 30,
      triggers: [
        {
          name: "StateCheck",
          params: [GLOBAL_CONFIG.tokens.target, "STATE_PANIC"],
          negation: true,
        },
        { name: "HaveSpellRES", params: [hideousLaugh] },
      ],
      timer: { name: "Fear", value: 18 },
      actions: [{ name: "ForceSpellRES", params: [hideousLaugh, "Myself"] }],
    },
  ],
  files: ["NTGOLBON"],
};
