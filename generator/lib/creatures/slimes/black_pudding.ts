import { ATWEAKS_CREATURES } from "../../config/creatures";
import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { createCreatureSplit } from "../../spells/slime_split";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.BlackPudding;
// Spells
const split = file(1, id);
// Items
const mainWeapon = file(1, id);
export const puddingTraits = file(2, id);
// Script
const script = bafFile(id);

const name = "Black Pudding";

export const SLIME_BLACK_PUDDING: RawCreature = {
  name,
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/black_pudding",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 10,
    thac0: 11,
    strength: 16,
    dexterity: 5,
    constitution: 16,
    intelligence: 1,
    wisdom: 6,
    charisma: 1,
    movement: 6,
    ac: 6,
    apr: 1,
    xpv: 2000,
    alignment: "NEUTRAL",
    morale: 12,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "GREY_OOZE",
    animation: "BLACK_PUDDING",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: {
    removeEffects: true,
    removeItems: ["HELMNOAN", "RING95", "BDPUDDBL"],
    removeScripts: ["DW1RANMO", "BDPUDDBL"],
    immunities: ["ooze"],
    scriptLocation: "General",
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Pseudopod,
      icon: MonsterItemIconEnum.Jelly,
      speed: 4,
      range: 5,
      equippedSlot: "WEAPON1",
      type: "Melee",
      animationSwing: { backhand: 100, overhand: 0, thrust: 0 },
      projectile: "ACIDBLMU",
      effects: [
        {
          opcode: "Damage",
          type: "Acid",
          diceThrown: 3,
          diceSize: 8,
        },
        // TODO: In addition, nonmagical armor worn by the target is partly dissolved and takes a permanent and cumulative −1 penalty to the AC it offers.
        // The armor is destroyed if the penalty reduces its AC to 10.
      ],
    },
    createTraitItem({
      file: puddingTraits,
      name: "Pudding",
      description: [
        "Immune to acid, cold, and poison.",
        "Lightning bolts and blows from weapons divide them into smaller puddings, each able to attack exactly as the original pudding.",
      ],
      // 5e: Damage Immunities: Lightning, Slashing
      immunities: ["acid", "cold", "poison"],
      effects: [
        {
          opcode: "ElectricityResistanceModifier",
          value: 90,
          type: "Set",
        },
      ],
    }),
  ],
  spells: [
    createCreatureSplit({
      file: split,
      description: [
        "Lightning bolts and blows from weapons divide them into smaller puddings, each able to attack exactly as the original pudding.",
        "Because puddings do not use all of their mouth openings (which cover their exposed surfaces), the smallest pudding does the same damage as the largest.",
      ],
      resource: ATWEAKS_CREATURES.SplitBlackPudding,
      visualEffect: "BDGOOYAA",
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
        remove: true,
      },
      triggers: [
        {
          name: "Or",
          triggers: [
            { name: "HitBy", params: ["ANYONE", "ELECTRICITY"] },
            { name: "HitBy", params: ["ANYONE", "SLASHING"] },
            { name: "HitBy", params: ["ANYONE", "PIERCING"] },
            { name: "HitBy", params: ["ANYONE", "CRUSHING"] },
            { name: "HitBy", params: ["ANYONE", "MISSILE"] },
          ],
        },
      ],
    },
  ],
  files: [
    "BDPUDDBL", // Black Pudding
    ATWEAKS_CREATURES.SplitBlackPudding,
  ],
  newFiles: [
    { files: [ATWEAKS_CREATURES.SplitBlackPudding], copyFrom: "BDPUDDBL" },
  ],
  adjustments: [
    {
      files: [ATWEAKS_CREATURES.SplitBlackPudding],
      data: {
        hp: 50, // a little less than half hp since it splits after taking some damage
        xpv: 1000,
      },
      additionalData: {
        removeMemorizedSpells: true,
      },
    },
  ],
};
