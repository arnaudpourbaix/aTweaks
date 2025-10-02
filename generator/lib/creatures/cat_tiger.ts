import { MonsterItemIconEnum } from "../config/item";
import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.Tiger;
// Items
const mainWeapon = file(1, id);
const offhandWeapon = file(2, id);
// Spells
const rearClawsAttack = file(1, id);

export const CAT_TIGER: RawCreature = {
  name: "Tiger",
  tpaFile: "lib/pnp-monster/cat/tiger",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 5,
    bonusHp: 2,
    strength: 17,
    dexterity: 15,
    constitution: 14,
    intelligence: 4,
    wisdom: 12,
    charisma: 8,
    movement: 12,
    ac: 5,
    apr: 3,
    xpv: 650,
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
  additionalData: { removeItems: ["CATLIO"] },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Claws,
      icon: MonsterItemIconEnum.Wolf,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 4,
      damageBonus: 1,
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
      diceThrown: 2,
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
      description: ["Rake with its rear claws doing 2D4 points damage each."],
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
              diceThrown: 2,
              diceSize: 4,
            },
            {
              opcode: "Damage",
              damageMode: "Normal",
              type: "Slashing",
              amount: 0,
              diceThrown: 2,
              diceSize: 4,
            },
          ],
        },
      ],
    },
  ],
  files: [],
};
