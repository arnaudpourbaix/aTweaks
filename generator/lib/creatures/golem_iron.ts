import { GLOBAL_CONFIG } from "../config/generate";
import { MonsterItemIconEnum } from "../config/item";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.IronGolem;
// Script
const script = bafFile(id);
// Spells
const cloudOfPoisonousGas = file(1, id);
// Items
const mainWeapon = file(1, id);

export const GOLEM_IRON: RawCreature = {
  name: "Iron Golem",
  bafFile: `lib/pnp-monster/golem/${script}`,
  tpaFile: "lib/pnp-monster/golem/iron",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 18,
    strength: 24,
    dexterity: 9,
    constitution: 20,
    intelligence: 3,
    wisdom: 11,
    charisma: 1,
    movement: 6,
    ac: 3,
    apr: 1,
    xpv: 13000,
    alignment: "NEUTRAL",
    morale: 20,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "GOLEM",
    class: "GOLEM_IRON",
    gender: "NIETHER",
    size: "Large",
    resistMagic: 100,
    resistFire: 125,
  },
  additionalData: {
    immunities: ["construct"],
    // removeScripts: [""],
    // removeItems: [""],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.LethalFists,
      icon: MonsterItemIconEnum.Golem,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 4,
      diceSize: 10,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  abilities: [
    {
      // Once every 7 rounds, beginning either the first or second round of combat, the iron golem breathes out a cloud of poisonous gas.
      // It does this automatically, with no regard to the effects it might have.
      // The gas cloud fills a 10-foot cube directly in front of it, which dissipates by the following round, assuming there is somewhere for the gas to go.
      name: "Cloud of poisonous gas",
      target: { name: "NearestEnemies", limit: 3 },
      range: 10,
      spell: {
        resource: cloudOfPoisonousGas,
        type: "reallyForce",
        selfTarget: true,
      },
      timer: { name: "Gas", value: 12 },
    },
  ],
  files: [],
};
