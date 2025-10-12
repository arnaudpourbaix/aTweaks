import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.CaveBear;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
const offhandWeapon = file(2, id);
// Spells
const hug = file(1, id);

export const BEAR_CAVE: RawCreature = {
  name: "Cave Bear",
  bafFile: `lib/pnp-monster/bear/${script}`,
  tpaFile: "lib/pnp-monster/bear/cave",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 6,
    bonusHp: 6,
    specialBonusHp: 8,
    strength: 20,
    dexterity: 10,
    constitution: 16,
    intelligence: 4,
    wisdom: 13,
    charisma: 7,
    movement: 12,
    ac: 6,
    apr: 3,
    xpv: 650,
    alignment: "NEUTRAL",
    morale: 9,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "ANIMAL",
    race: "BEAR",
    class: "BEAR_CAVE",
    gender: "NIETHER",
    size: "Huge",
  },
  additionalData: {
    removeItems: ["B1-10", "BEARCASU"],
    removeScripts: ["CBEAR", "BEAR"],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Claws,
      icon: MonsterItemIconEnum.Wolf,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 8,
      damageType: "Slashing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "CastSpell",
          resource: hug,
          type: "CastInstantlyAtCasterLevel",
          probability1: 10,
        },
      ],
    },
    {
      file: offhandWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "SHIELD",
      type: "Melee",
      diceThrown: 1,
      diceSize: 12,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  spells: [
    {
      name: "Hug",
      file: hug,
      stringRef: TraStringReferenceEnum.Hug,
      description: ["Hug target for 2d6 points of additional crushing damage."],
      secondaryType: "OffensiveDamage",
      headers: [
        {
          type: "Melee",
          range: 5,
          effects: [
            {
              opcode: "Damage",
              damageMode: "Normal",
              type: "Crushing",
              amount: 0,
              diceThrown: 2,
              diceSize: 6,
            },
          ],
        },
      ],
    },
  ],
  files: ["BD328OSO", "BDBEARCA", "BEARCA", "BEARCASU", "CAVENE", "URSA"],
  adjustments: [
    { files: ["BEARCASU"], summon: true },
    { files: ["BD328OSO"], data: { level1: 8, xpv: 900 } },
    {
      files: ["BDBEARCA"],
      additionalData: {
        removeMemorizedSpells: false,
        scriptLocation: "General",
      },
    },
  ],
};
