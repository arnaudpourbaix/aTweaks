import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.OchreJelly;
// Items
const mainWeapon = getFilename(1, id);
const traits = getFilename(2, id);
// Script
const script = bafFile(id);

const name = "Ochre Jelly";

export const SLIME_OCHRE_JELLY: RawCreature = {
  name,
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/ochre_jelly",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 6,
    thac0: 15,
    strength: 15,
    dexterity: 6,
    constitution: 14,
    intelligence: 1,
    wisdom: 6,
    charisma: 1,
    movement: 3,
    ac: 8,
    apr: 1,
    xpv: 270,
    alignment: "NEUTRAL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "OCRE_JELLY",
    gender: "NIETHER",
    size: "Medium",
  },
  additionalData: {
    removeItems: ["RING95", "JELLOC1", "DW#JELOC"],
    removeScripts: ["BPSIGHT", "BPASIGHT", "BDENSHTV", "BDNONIN", "DW1RANMO"],
    immunities: ["ooze"],
  },
  items: [
    {
      // Split. When a jelly that is Medium or larger is subjected to lightning or slashing damage, it splits into two new jellies if it has at least 10 hit points.
      // Each new jelly has hit points equal to half the original jelly's, rounded down. New jellies are one size smaller than the original jelly.
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Pseudopod,
      icon: MonsterItemIconEnum.Jelly,
      equippedSlot: "WEAPON1",
      type: "Melee",
      speed: 4,
      range: 5,
      // 2e: The ochre jelly attacks by attempting to envelop its prey. Its secretions dissolve flesh, inflicting 3-12 (d10+2) points of damage per round of exposure.
      // 5e: reach 5 ft, 2d6+2 bludgeoning damage plus 1d6 acid damage
      effects: [
        {
          opcode: "Damage",
          type: "Acid",
          diceSize: 10,
          diceThrown: 1,
          amount: 2,
        },
      ],
      animationSwing: { backhand: 100, overhand: 0, thrust: 0 },
      projectile: "ACIDBLMU",
    },
    createTraitItem({
      file: traits,
      name,
      immunities: ["lightning"],
      // 5e: Damage Resistances: Acid. Damage Immunities: Slashing
    }),
  ],
  files: [
    "BDJELLOC", // Ochre Jelly
    "BDSHJELL", // Ochre Jelly
    "BPJLOC01", // Ochre Jelly
    "JELLOC", // Ochre Jelly
    "JELLYCO", // Ochre Jelly
  ],
};
