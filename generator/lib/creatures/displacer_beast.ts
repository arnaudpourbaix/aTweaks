import { MonsterItemIconEnum } from "../config/item";
import { TraStringReferenceEnum } from "../config/stringRef";
import { JEWEL_SLOTS } from "../src/model/constants";
import { RawCreature } from "../src/model/raw/creature";
import { file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.DisplacerBeast;
// Items
const mainWeapon = file(1, id);
const ring = file(2, id);

export const DISPLACER_BEAST: RawCreature = {
  name: "Displacer Beast",
  tpaFile: "lib/pnp-monster/cat/displacer",
  tracking: true,
  combatWalk: true,
  data: {
    level1: 6,
    strength: 18,
    dexterity: 15,
    constitution: 16,
    intelligence: 4,
    wisdom: 12,
    charisma: 8,
    movement: 15,
    ac: 4,
    apr: 2,
    xpv: 975,
    alignment: "LAWFUL_EVIL",
    morale: 14,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "CAT",
    class: "CAT",
    gender: "NIETHER",
    size: "Large",
    saveDeath: 7,
    saveWand: 9,
    savePolymorph: 8,
    saveBreath: 8,
    saveSpell: 10,
  },
  additionalData: {
    removeItems: ["BDDISPBE"],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Tentacles,
      icon: MonsterItemIconEnum.Jelly,
      equippedSlot: "WEAPON1",
      type: "Melee",
      range: 5,
      diceThrown: 2,
      diceSize: 4,
      damageType: "PiercingOrCrushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
    {
      file: ring,
      stringRef: "Displacer Beast traits",
      description: [
        "Its main advantage in combat is its magical power of displacement, which allows it to appear to be some 3 feet from their actual location.",
        "Anyone attacking a displacer beast does so at -2 on his attack roll. In addition, the beasts save as 12th-level fighters; adding +2 to their die rolls.",
      ],
      effects: [
        {
          opcode: "ArmorClassBonus",
          bonusTo: "AllWeapons",
          value: 2,
          dispelResistance: "NotDispelBypassResistance",
          global: true,
        },
        {
          opcode: "Blur",
          dispelResistance: "NotDispelBypassResistance",
          global: true,
        },
        {
          opcode: "MirrorImageEffect",
          amount: 1,
          dispelResistance: "NotDispelBypassResistance",
          global: true,
        },
        {
          opcode: "CastSpellOnCondition",
          condition: "AttackedBy([ANYONE])",
          conditionTarget: "Myself",
          resource: "BDDISPLC",
          dispelResistance: "NotDispelBypassResistance",
          global: true,
        },
      ],
      equippedSlot: JEWEL_SLOTS,
      category: "Rings",
      icon: "IRING01",
    },
  ],
  files: ["BDDISPBE", "BDDISPBP"],
  adjustments: [
    {
      files: ["BDDISPBP"],
      data: {
        level1: 9,
        xpv: 1200,
        strength: 19,
        constitution: 19,
        ac: 2,
        saveDeath: 7,
        saveWand: 9,
        savePolymorph: 8,
        saveBreath: 8,
        saveSpell: 10,
      },
    },
  ],
};
