import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.StoneGolem;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
const traits = file(2, id);

const name = "Stone Golem";

export const GOLEM_STONE: RawCreature = {
  name,
  bafFile: `lib/pnp-monster/golem/${script}`,
  tpaFile: "lib/pnp-monster/golem/stone",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 14,
    bonusHp: 0,
    strength: 22,
    dexterity: 9,
    constitution: 20,
    intelligence: 3,
    wisdom: 11,
    charisma: 1,
    movement: 6,
    ac: 5,
    apr: 1,
    xpv: 8000,
    alignment: "NEUTRAL",
    morale: 20,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "GOLEM",
    class: "GOLEM_STONE",
    gender: "NIETHER",
    size: "Large",
    resistMagic: 100,
  },
  additionalData: {
    immunities: ["construct"],
    removeScripts: ["GOLSTO01", "DW1MELMO", "BDSUM00"],
    removeItems: ["GOLSTO", "GOLSTONE"],
    memorizedSpells: [{ file: SPELLS.Slow, memorizedCount: 1 }],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.LethalFists,
      icon: MonsterItemIconEnum.Golem,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 3,
      diceSize: 8,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
    createTraitItem({
      file: traits,
      name,
      immunities: ["magic"],
    }),
  ],
  abilities: [
    {
      preset: SPELLS.Slow,
      spell: {
        type: "reallyForce",
        selfTarget: true,
      },
      requireVocal: false,
      range: 10,
      timer: { name: "Slow", value: 12 },
    },
  ],
  files: ["BDGOLSTO", "BDMENGO", "NTGOLSTO", "TOMEGOL3", "WISTOGOL"],
};
