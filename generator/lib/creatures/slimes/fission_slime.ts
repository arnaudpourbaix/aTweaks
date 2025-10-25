import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { JEWEL_SLOTS } from "../../src/model/constants";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";
import {
  mustardJellyTraits,
  toxicVapors,
  toxicVaporsAbility,
} from "./mustard_jelly";

// Creature Id
const id = MonsterEnum.FissionSlime;
// Items
const mainWeapon = getFilename(1, id);
// Script
const script = bafFile(id);

const name = "Fission Slime";

export const SLIME_FISSION: RawCreature = {
  name,
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/fission_slime",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 12,
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
    xpv: 5000,
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
    removeItems: ["IMMUNE1", "RING95", "JELLMU2", "DW#JELM2"],
    removeScripts: ["BPSIGHT", "BPASIGHT", "DW1RANMO"],
    immunities: ["ooze"],
    itemSlots: [{ file: mustardJellyTraits, slot: JEWEL_SLOTS }],
    memorizedSpells: [{ file: toxicVapors, memorizedCount: 1 }],
    scriptLocation: "Race",
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Pseudopod,
      icon: MonsterItemIconEnum.Jelly,
      equippedSlot: "WEAPON1",
      type: "Melee",
      speed: 4,
      range: 5,
      diceThrown: 3,
      diceSize: 6,
      damageType: "Crushing",
      animationSwing: { backhand: 100, overhand: 0, thrust: 0 },
      projectile: "ACIDBLMU",
      effects: [
        {
          opcode: "Damage",
          type: "Acid",
          diceThrown: 3,
          diceSize: 6,
        },
      ],
    },
  ],
  // no split ability since it is handled by existing scripts
  // fission slime is not an official monster, so no rule to follow
  abilities: [toxicVaporsAbility],
  files: ["JELLSPA", "BPSLFS01", "BPSLFS02"],
};
