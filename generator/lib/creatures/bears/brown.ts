import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.BrownBear;
// Script
const script = bafFile(id);
// Items
const mainWeapon = getFilename(1, id);
const offhandWeapon = getFilename(2, id);
// Spells
const hug = getFilename(1, id);

export const BEAR_BROWN: RawCreature = {
  name: "Brown Bear",
  bafFile: `lib/pnp-monster/bear/${script}`,
  tpaFile: "lib/pnp-monster/bear/brown",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 5,
    bonusHp: 5,
    specialBonusHp: 8,
    strength: 19,
    dexterity: 10,
    constitution: 16,
    intelligence: 4,
    wisdom: 13,
    charisma: 7,
    movement: 12,
    ac: 6,
    apr: 3,
    xpv: 420,
    alignment: "NEUTRAL",
    morale: 9,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "ANIMAL",
    race: "BEAR",
    class: "BEAR_BROWN",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: { removeItems: ["B1-8"], removeScripts: ["CBEAR", "BEAR"] },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Claws,
      icon: MonsterItemIconEnum.Wolf,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 6,
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
      diceSize: 8,
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
  files: [
    "BDBEARBN",
    "BDBEARBR",
    "BDGRIZHU",
    // "BDSHA06A", //TODO: Summon bear spirit
    "BEARBR",
    "BEARBRSU",
    "PLYBEAR1",
  ],
  adjustments: [{ files: ["BEARBRSU"], summon: true }],
};
