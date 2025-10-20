import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.HuntingSpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
// Spells
const leap = file(1, id);

const name = "Hunting Spider";
export const SPIDER_HUNTING: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/hunting",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  data: {
    level1: 3,
    bonusHp: 3,
    thac0: 17,
    strength: 14,
    dexterity: 16,
    constitution: 12,
    intelligence: 10,
    wisdom: 11,
    charisma: 4,
    movement: 8,
    ac: 6, // -2 with dex bonus
    apr: 1,
    xpv: 650,
    alignment: "NEUTRAL",
    morale: 13,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_GIANT",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: {
    removeItems: ["D5SMSPID", "ANTIWEB"],
    removeScripts: ["DW1MELMO"],
    immunities: ["spider", "seeInvisible"],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 3,
      damageType: "Piercing",
      speed: 2,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "PoisonTypeEffects",
          poisonType: "A",
          saveBonus: 2,
        },
      ],
    },
  ],
  spells: [
    {
      name: "Leap",
      file: leap,
      memorizedCount: 1,
      icon: SPELLS.Haste,
      infiniteUse: 1,
      stringRef: TraStringReferenceEnum.Leap,
      description: ["", "Leaps horizontally as far as 30 feet."],
      headers: [
        {
          type: "Melee",
          range: 30,
          effects: [
            {
              opcode: "WingBuffet",
              target: "Self",
              speed: 150,
              direction: "TowardsTargetPoint",
              duration: 2,
            },
          ],
        },
      ],
    },
  ],
  abilities: [
    {
      name: "Leap Attack",
      target: { name: "FarthestEnemies", random: true },
      minRange: 5,
      range: 30,
      spell: {
        resource: leap,
        type: "force",
        isAttack: true,
      },
      disableInterrupt: true,
      actionsAfter: [{ name: "AttackOneRound", params: ["LastSeenBy"] }],
    },
  ],
  files: [
    "D5SMSPID", // Beetle Swarm (Faiths and Powers)
  ],
  adjustments: [{ files: ["D5SMSPID"], summon: true }],
};
