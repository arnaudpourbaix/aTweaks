import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.SlitheringTracker;
// Items
const mainWeapon = file(1, id);
// Script
const script = bafFile(id);

const name = "Slithering Tracker";

export const SLIME_SLITHERING_TRACKER: RawCreature = {
  name,
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/slithering_tracker",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 5,
    thac0: 15,
    strength: 14,
    dexterity: 8,
    constitution: 18,
    intelligence: 9,
    wisdom: 7,
    charisma: 2,
    movement: 12,
    ac: 5,
    apr: 1,
    xpv: 975,
    alignment: "NEUTRAL",
    morale: 15,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "GREY_OOZE",
    gender: "NIETHER",
    size: "Small",
  },
  additionalData: {
    removeItems: ["RING95", "AC#FPSL2", "AC#FPSLT"],
    removeScripts: ["DW1RANMO"],
    immunities: ["ooze"],
  },
  items: [
    {
      // 5e:
      // Pseudopod. Melee Weapon Attack: reach 5 ft. Hit: 1d6 bludgeoning damage plus 4d6 acid damage, and the target must save vs death or be held for 1 turn.
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Pseudopod,
      icon: MonsterItemIconEnum.Jelly,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 6,
      damageType: "Crushing",
      speed: 4,
      range: 5,
      effects: [
        {
          opcode: "Damage",
          type: "Acid",
          diceThrown: 4,
          diceSize: 6,
        },
        {
          opcode: "ParalyzeEffects",
          lightningEffect: "MushroomGray",
          saveTypes: ["ParalyzePoisonDeath"],
          duration: 60,
        },
      ],
    },
  ],
  files: [
    "AC#FPSLT", // Slithering Tracker
  ],
};
