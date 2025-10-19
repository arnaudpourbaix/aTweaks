import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.DisplacerBeast;
// Items
const mainWeapon = file(1, id);
const traits = file(2, id);

const name = "Displacer Beast";

export const DISPLACER_BEAST: RawCreature = {
  name,
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
    ac: 5, // -1 with dex bonus
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
    createTraitItem({
      file: traits,
      name,
      immunities: ["magic", "fire", "cold"],
      effects: [
        {
          opcode: "ArmorClassBonus",
          bonusTo: "AllWeapons",
          value: 2,
          dispelResistance: "NotDispelBypassResistance",
        },
        {
          opcode: "Blur",
          dispelResistance: "NotDispelBypassResistance",
        },
        {
          opcode: "MirrorImageEffect",
          amount: 1,
          dispelResistance: "NotDispelBypassResistance",
        },
        {
          opcode: "CastSpellOnCondition",
          condition: "AttackedBy([ANYONE])",
          conditionTarget: "Myself",
          resource: "BDDISPLC",
          dispelResistance: "NotDispelBypassResistance",
        },
      ],
    }),
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
