import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.GargantuanSpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);

const name = "Gargantuan Spider";
export const SPIDER_GARGANTUAN: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/gargantuan",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  data: {
    level1: 8,
    bonusHp: 8,
    thac0: 11,
    strength: 18,
    dexterity: 15,
    constitution: 17,
    intelligence: 7,
    wisdom: 11,
    charisma: 4,
    movement: 9, // 9, Web 12
    ac: 5, // -1 with dex bonus
    apr: 1,
    xpv: 3000,
    alignment: "CHAOTIC_EVIL",
    morale: 14,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_GIANT",
    gender: "NIETHER",
    size: "Gargantuan",
  },
  additionalData: {
    removeItems: ["BDSPIDGA", "ANTIWEB"],
    removeScripts: ["BDENSHTV", "BDSPIDGA", "BDNONIN"],
    immunities: ["spider"],
    memorizedSpells: [
      { file: SPELLS.SpiderSingleTargetWeb, memorizedCount: 1 },
    ],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 2,
      diceSize: 6,
      damageType: "Piercing",
      speed: 2,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "Sleep",
          wakeOnDamage: false,
          duration: 300,
          saveTypes: ["ParalyzePoisonDeath"],
          saveBonus: -2,
        },
        {
          opcode: "LightingEffects",
          lightingTarget: "SpellTarget",
          effect: "InvocationEarth",
          saveTypes: ["ParalyzePoisonDeath"],
          saveBonus: -2,
        },
        {
          opcode: "CharacterColorPulse",
          color: { red: 119, green: 0, blue: 0 },
          location: "ArmorGreyBeltAmulet",
          cycleSpeed: 20,
          saveTypes: ["ParalyzePoisonDeath"],
          saveBonus: -2,
        },
      ],
    },
  ],
  abilities: [
    {
      name: "Web Tangler",
      preset: SPELLS.Web,
      spell: {
        //  it can shoot web strands up to 2 feet to bind a foe. Either attack treats the spider's opponent as AC 10 and prevents the spider from making a melee attack that round.
        resource: SPELLS.SpiderSingleTargetWeb,
        type: "force",
        isAttack: true,
        probability: 70,
      },
      range: 6, // to fix issue with very close range since melee attack is 3 feet
      requireVocal: false,
    },
  ],
  files: [
    "BDSPIDGA", // Gargantuan Spider
  ],
};
