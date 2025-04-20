import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.Hellcat;
// Items
const mainWeapon = file(1, id);
const offhandWeapon = file(2, id);
const ring = file(3, id);

export const HELLCAT: RawCreature = {
  name: "Hellcat",
  tpaFile: "lib/pnp-monster/cat/hellcat",
  tracking: true,
  combatWalk: true,
  attack: { dualWielding: true },
  data: {
    level1: 7,
    bonusHp: 2,
    strength: 21,
    dexterity: 21,
    constitution: 19,
    intelligence: 10,
    wisdom: 14,
    charisma: 10,
    movement: 15,
    ac: 6,
    apr: 3,
    xpv: 5000,
    alignment: "LAWFUL_EVIL",
    morale: 13,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "DEMONIC",
    class: "CAT",
    gender: "NIETHER",
    size: "Large",
    resistMagic: 20,
  },
  additionalData: {
    removeItems: ["BDHELCAT", "RINGDEMN", "IPSION"],
    deleteEffectOpcodes: ["Blur", "ProtectionFromBackstab"],
  },
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 4,
      damageType: "Slashing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "DisplayString",
          stringRef: TraStringReferenceEnum.RearClawsAttack,
          probability1: 10,
        },
        {
          opcode: "Damage",
          damageMode: "Normal",
          type: "Slashing",
          amount: 1,
          diceThrown: 1,
          diceSize: 6,
          probability1: 10,
        },
        {
          opcode: "Damage",
          damageMode: "Normal",
          type: "Slashing",
          amount: 1,
          diceThrown: 1,
          diceSize: 6,
          probability1: 10,
        },
      ],
    },
    {
      file: offhandWeapon,
      equippedSlot: "SHIELD",
      type: "Melee",
      diceThrown: 2,
      diceSize: 6,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
    {
      file: ring,
      immunities: ["mindSpells", "normalWeapons", "extraplanar"],
      effects: [
        {
          opcode: "Invisibility",
          type: "Improved",
          global: true,
        },
      ],
      equippedSlot: "RRING",
      category: "Rings",
      icon: "IRING01",
    },
  ],
  files: ["BDHELCAT"],
};
