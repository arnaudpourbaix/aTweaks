import { RawCreature } from "../src/model/raw/creature";

export const OGRE_OGRILLON: RawCreature = {
  name: "Ogrillon",
  bafFile: "lib/pnp-monster/ogre/ja#m28",
  tpaFile: "lib/pnp-monster/ogre/ogrillon",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 2,
    bonusHp: 4,
    strength: 17,
    dexterity: 10,
    constitution: 14,
    intelligence: 6,
    wisdom: 9,
    charisma: 10,
    movement: 12,
    ac: 6,
    apr: 2,
    xpv: 175,
    alignment: "CHAOTIC_EVIL",
    morale: 10,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "OGRE",
    class: "OGRE_OGRILLON",
    gender: "MALE",
    size: "Medium",
  },
  additionalData: { 
    removeItems: ["P2-8"] 
  },
  items: [
    {
      file: "ja#m29w1",
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 6,
      damageBonus: 1,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  files: [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]
};
