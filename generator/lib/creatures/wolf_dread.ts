import { MonsterItemIconEnum } from "../config/item";
import { TraStringReferenceEnum } from "../config/stringRef";
import { JEWEL_SLOTS } from "../src/model/constants";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.DreadWolf;
// Script
const script = bafFile(id);
// Spells
const downState = file(1, id);
// Items
const mainWeapon = file(1, id);
const traits = file(2, id);
const downResistances = file(3, id);

export const WOLF_DREAD: RawCreature = {
  name: "Dread Wolf",
  tpaFile: "lib/pnp-monster/wolf/dread",
  bafFile: `lib/pnp-monster/wolf/${script}`,
  tracking: true,
  combatWalk: true,
  data: {
    level1: 4,
    bonusHp: 4,
    specialBonusHp: 10,
    strength: 18,
    dexterity: 13,
    constitution: 14,
    intelligence: 9,
    wisdom: 12,
    charisma: 8,
    movement: 18,
    ac: 6,
    apr: 1,
    xpv: 650,
    alignment: "NEUTRAL_EVIL",
    morale: 18,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "ANIMAL",
    race: "WOLF",
    class: "WOLF_DREAD",
    gender: "MALE",
    size: "Small",
    resistCold: 100,
    resistElectricity: 50,
  },
  additionalData: {
    removeItems: ["P1-10", "RING95", "TROLLIMM", "BDWOLFD1", "BDWOLFDR"],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 1,
      diceSize: 10,
      damageType: "Piercing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "Disease",
          amount: 300,
          type: "OneDamagePerAmountSeconds",
          duration: 90000,
          icon: "Diseased",
        },
      ],
    },
    {
      file: traits,
      stringRef: "Dread wolf traits",
      equippedSlot: JEWEL_SLOTS,
      description: [
        "A dread wolf regenerates like a troll, regaining 3 hp per round after the first combat round.",
        "Only acid, fire, or total dismemberment will inflict permanent damage.",
        "It is immune to charm, hold, and cold-based spells.",
        "Electricity-based spells cause only half damage.",
      ],
      immunities: ["coldSpells", "charm", "hold"],
      effects: [
        {
          opcode: "Regeneration",
          amount: 2,
          type: "OneHPperAmountSeconds",
          icon: "Regenerating",
          global: true,
        },
        { opcode: "MinimumHP", value: 1, global: true },
        {
          opcode: "CastSpellOnCondition",
          conditionTarget: "Myself",
          condition: "HPLT(Myself,Extra)",
          special: 6,
          resource: downState,
          global: true,
        },
      ],
      category: "Rings",
      icon: "IRING01",
    },
    {
      file: downResistances,
      stringRef: "Dread wolf down resistances",
      description: [
        "A down dread wolf is immune to everything but fire and acid.",
      ],
      immunities: [
        "poison",
        "disease",
        "cold",
        "electricity",
        "magicDamage",
        "physical",
      ],
      category: "Rings",
      icon: "IRING01",
    },
  ],
  spells: [
    {
      name: "Dread wolf down state",
      file: downState,
      stringRef: "Dread wolf down state",
      headers: [
        {
          type: "Melee",
          effects: [
            {
              opcode: "RemoveItem",
              resource: traits,
              timing: "InstantPermanentUntilDeath",
              target: "Self",
            },
            {
              opcode: "CureAllEffects",
              timing: "InstantPermanentUntilDeath",
              target: "Self",
            },
            {
              opcode: "CreateItemInSlot",
              resource: downResistances,
              slot: "SLOT_RING_LEFT",
              duration: 12,
              timing: "InstantLimited",
              target: "Self",
            },
            {
              opcode: "Sleep",
              wakeOnDamage: false,
              timing: "InstantLimited",
              duration: 12,
              target: "Self",
            },
            {
              opcode: "CurrentHPbonus",
              value: 1,
              type: "Set",
              timing: "InstantPermanentUntilDeath",
              target: "Self",
            },
            {
              opcode: "CreateItemInSlot",
              resource: traits,
              slot: "SLOT_RING_LEFT",
              duration: 12,
              timing: "DelayPermanent",
              target: "Self",
            },
            {
              opcode: "CurrentHPbonus",
              value: 6,
              type: "Set",
              duration: 12,
              timing: "DelayPermanent",
              target: "Self",
            },
          ],
        },
      ],
    },
  ],
  files: [
    "BDWOLFDR",
    "D5WOLFD1",
    "DW#REWO",
    "P#WOLF03",
    "P#WOLF05",
    "PLYWOLF",
    "WOLFD1",
    "WOLFDR",
    "L#HALWO", // Cu-sith
  ],
};
