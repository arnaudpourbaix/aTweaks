import { ATWEAKS_CREATURES } from "../../config/creatures";
import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { createCreatureSplit } from "../../spells/slime_split";
import { JEWEL_SLOTS } from "../../src/model/constants";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";
import { puddingTraits } from "./black_pudding";

// Creature Id
const id = MonsterEnum.WhitePudding;
// Spells
const split = getFilename(1, id);
// Items
const mainWeapon = getFilename(1, id);
// Script
const script = bafFile(id);

const name = "White Pudding";

export const SLIME_WHITE_PUDDING: RawCreature = {
  name,
  stringRef: TraStringReferenceEnum.WhitePudding,
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/white_pudding",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 9,
    thac0: 11,
    strength: 16,
    dexterity: 5,
    constitution: 16,
    intelligence: 1,
    wisdom: 6,
    charisma: 1,
    movement: 9,
    ac: 8,
    apr: 1,
    xpv: 1400,
    alignment: "NEUTRAL",
    morale: 12,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "GREY_OOZE",
    animation: "GRAY_OOZE",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: {
    removeEffects: true,
    removeItems: ["IMMUNE1", "RING95", "AC#FPWPU"],
    removeScripts: ["DW1RANMO"],
    immunities: ["ooze"],
    itemSlots: [{ file: puddingTraits, slot: JEWEL_SLOTS }],
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
          diceThrown: 7,
          diceSize: 4,
        },
      ],
    },
  ],
  spells: [
    createCreatureSplit({
      file: split,
      description: "common.spell.slimeSplit.puddingDescription",
      resource: ATWEAKS_CREATURES.SplitWhitePudding,
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
    "AC#FPWP2", // White Blob
    "AC#FPWPU", // White Blob
    ATWEAKS_CREATURES.SplitWhitePudding,
  ],
  newFiles: [
    { files: [ATWEAKS_CREATURES.SplitWhitePudding], copyFrom: "AC#FPWPU" },
  ],
  adjustments: [
    {
      files: [ATWEAKS_CREATURES.SplitWhitePudding],
      data: {
        hp: 45, // a little less than half hp since it splits after taking some damage
        xpv: 700,
      },
      additionalData: {
        removeMemorizedSpells: true,
      },
    },
  ],
};
