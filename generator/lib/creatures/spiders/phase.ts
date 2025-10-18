import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.PhaseSpider;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
const traits = file(2, id);

const name = "Phase Spider";
export const SPIDER_PHASE: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/phase",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  data: {
    level1: 5,
    bonusHp: 5,
    thac0: 15,
    strength: 15,
    dexterity: 15,
    constitution: 12,
    intelligence: 7,
    wisdom: 10,
    charisma: 6,
    movement: 15,
    ac: 7,
    apr: 1,
    xpv: 1400,
    alignment: "NEUTRAL",
    morale: 15,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_PHASE",
    gender: "NIETHER",
    size: "Huge",
  },
  additionalData: {
    removeItems: ["BDSPIDHU", "SPIDHU1", "ANTIWEB"],
    removeScripts: ["DW1MELMO", "DW#GPSHM", "DW#SPIDS", "BPSIGHT", "BPASIGHT"],
  },
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
      effects: [
        // They phase in, attack, and phase out, all in a single round.
        // This gives them a -3 modifier on initiative rolls; if a phase spider wins initiative by more than 4, it attacks and phases out before its opponent has a chance to strike back.
        // Then too, a phase spider usually phases into existence behind its chosen victim, so they get a +4 modifier for attacking from behind.
        // Phase spiders flee to the Ethereal plane when outmatched; there, they gain only a -1 modifier to initiative and can be attacked every round, regardless of the initiative result.
        {
          opcode: "PoisonTypeEffects",
          poisonType: "F",
          saveBonus: -2,
        },
      ],
    },
    createTraitItem({
      file: traits,
      name,
      description: [],
    }),
  ],
  files: [],
};
