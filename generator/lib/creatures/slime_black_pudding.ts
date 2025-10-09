import { ATWEAKS_SPELLS } from "../config/spell-names";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.BlackPudding;
// Spells
// Items
const mainWeapon = file(1, id);
// Script
const script = bafFile(id);

export const SLIME_BLACK_PUDDING: RawCreature = {
  name: "Black Pudding",
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/black_pudding",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 10,
    hp: 100,
    thac0: 11,
    strength: 16,
    dexterity: 5,
    constitution: 16,
    intelligence: 1,
    wisdom: 6,
    charisma: 1,
    movement: 4,
    ac: 6,
    apr: 1,
    // 5e: Damage Immunities Acid, Cold, Lightning, Slashing
    xpv: 4000,
    alignment: "NEUTRAL",
    morale: 14,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "GREY_OOZE",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: {
    removeItems: ["HELMNOAN", "RING95", "BDPUDDBL"],
    removeScripts: ["SHOUT", "DW1RANMO"],
    immunities: ["ooze"],
  },
  items: [
    {
      // Pseudopod. Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage plus 18 (4d8) acid damage.
      // In addition, nonmagical armor worn by the target is partly dissolved and takes a permanent and cumulative −1 penalty to the AC it offers. The armor is destroyed if the penalty reduces its AC to 10.
      file: mainWeapon, // 3-24 or 2d6+4 plus 2d6 acid
      equippedSlot: "WEAPON1",
      icon: "IGHOUL",
      type: "Melee",
      diceSize: 3,
      diceThrown: 1,
      damageType: "Crushing",
      effects: [
        {
          opcode: "CastSpell",
          type: "CastInstantlyAtCasterLevel",
          castingLevel: 1,
          timing: "InstantPermanentUntilDeath",
          dispelResistance: "NaturalNonMagical",
          resource: ATWEAKS_SPELLS.TouchOfTranquility,
        },
      ],
    },
  ],
  abilities: [],
  files: [
    "BDPUDDBL", // Black Pudding
  ],
};
