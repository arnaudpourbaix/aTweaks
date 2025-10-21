import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.BlinkDog;
// Script
const script = bafFile(id);
// Spells
const blink = file(1, id);
// Items
const mainWeapon = file(1, id);

export const DOG_BLINK: RawCreature = {
  name: "Blink Dog",
  tpaFile: "lib/pnp-monster/dog/blink",
  bafFile: `lib/pnp-monster/dog/${script}`,
  tracking: true,
  combatWalk: true,
  data: {
    level1: 4,
    strength: 12,
    dexterity: 17,
    constitution: 15,
    intelligence: 9,
    wisdom: 13,
    charisma: 11,
    movement: 12,
    ac: 8, // -3 with dex bonus
    apr: 1,
    xpv: 270,
    alignment: "NEUTRAL",
    morale: 12,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "DOG",
    class: "DOG_WILD",
    gender: "MALE",
    size: "Medium",
  },
  additionalData: { removeItems: ["P1-6"], removeScripts: ["PSPIDER"] },
  abilities: [
    {
      name: "Blink",
      target: { name: "FarthestEnemies", random: true },
      spell: {
        resource: blink,
        type: "force",
      },
      actionsAfter: [{ name: "AttackOneRound", params: ["LastSeenBy"] }],
    },
  ],
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 6,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  spells: [
    {
      name: "Blink",
      file: blink,
      memorizedCount: 1,
      icon: SPELLS.DimensionDoor,
      infiniteUse: 1,
      stringRef: TraStringReferenceEnum.Blink,
      description: [
        "",
        "Blink to target location and get a +2 THAC0 bonus for 1 round.",
      ],
      headers: [
        {
          type: "Melee",
          range: 30,
          effects: [
            { opcode: "Teleport", type: "Default", target: "Self" },
            {
              opcode: "Thac0Bonus",
              timing: "InstantLimited",
              duration: 6,
              type: "Increment",
              probability1: 75,
              value: 2,
              target: "Self",
            },
          ],
        },
      ],
    },
  ],
  files: ["DOGBLINK"],
};
