import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.Leopard;
// Items
const mainWeapon = getFilename(1, id);
const offhandWeapon = getFilename(2, id);
// Spells
const rearClawsAttack = getFilename(1, id);

export const CAT_LEOPARD: RawCreature = {
  name: "Leopard",
  tpaFile: "lib/pnp-monster/cat/leopard",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 3,
    bonusHp: 2,
    strength: 16,
    dexterity: 19,
    constitution: 15,
    intelligence: 4,
    wisdom: 12,
    charisma: 6,
    movement: 15,
    ac: 10, // -4 with dex bonus
    apr: 3,
    xpv: 270,
    alignment: "NEUTRAL",
    morale: 9,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "ANIMAL",
    race: "CAT",
    class: "CAT",
    gender: "NIETHER",
    size: "Medium",
  },
  additionalData: { removeItems: ["CATJAGSU"] },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Claws,
      icon: MonsterItemIconEnum.Wolf,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 3,
      damageType: "Slashing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "CastSpell",
          resource: rearClawsAttack,
          type: "CastInstantlyAtCasterLevel",
          probability1: 20,
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
      diceSize: 6,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  spells: [
    {
      name: "Rear claws attack",
      file: rearClawsAttack,
      stringRef: TraStringReferenceEnum.RearClawsAttack,
      description: ["Rake with its rear claws doing 1D4 points damage each."],
      secondaryType: "OffensiveDamage",
      headers: [
        {
          type: "Melee",
          range: 5,
          effects: [
            {
              opcode: "Damage",
              damageMode: "Normal",
              type: "Slashing",
              amount: 0,
              diceThrown: 1,
              diceSize: 4,
            },
            {
              opcode: "Damage",
              damageMode: "Normal",
              type: "Slashing",
              amount: 0,
              diceThrown: 1,
              diceSize: 4,
            },
          ],
        },
      ],
    },
  ],
  files: ["CATJAGSU"],
  adjustments: [{ files: ["CATJAGSU"], summon: true }],
};
