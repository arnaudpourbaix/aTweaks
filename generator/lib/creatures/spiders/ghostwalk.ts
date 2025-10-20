import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.GhostwalkSpider;
// Script
const script = bafFile(id);
// Items
const biteWeapon = file(1, id);
const traits = file(2, id);

const name = "Ghostwalk Spider";
export const SPIDER_GHOSTWALK: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/ghostwalk",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  // dialog: ["C#LCCENS"],
  data: {
    level1: 14,
    strength: 15,
    dexterity: 20,
    constitution: 17,
    intelligence: 9,
    wisdom: 14,
    charisma: 8,
    movement: 15,
    ac: 10, // -4 with dex bonus
    apr: 2,
    xpv: 5000,
    alignment: "CHAOTIC_EVIL",
    morale: 13,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_WRAITH",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: {
    removeItems: ["SPIDPH1", "ANTIWEB", "GHOST2"],
    removeScripts: ["INITDLG", "C#LCCENS"],
    immunities: ["spider"],
  },
  items: [
    // Multiattack. The ghostwalk spider makes one Bite attack and one Ghostly Snare attack, or it makes two Bite attacks.
    // Bite. reach 5 ft., 3d10 piercing damage. If the ghostwalk spider is in its true form, the target must make a DC 15 Constitution saving throw, taking 3d8 poison damage on a failed save, or half as much damage on a successful one.
    // Ghostly Snare (Ghostwalk Form Only, Recharge 4–6). Ranged Weapon Attack: range 30, one target. Hit: The target is restrained by invisible webbing. While restrained in this way, the target is invisible.
    {
      file: biteWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 3,
      diceSize: 10,
      range: 5,
      damageType: "Piercing",
      speed: 2,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "PoisonTypeEffects",
          poisonType: "E",
        },
      ],
    },
    createTraitItem({
      name,
      file: traits,
      immunities: [
        "acidResistance",
        "coldResistance",
        "fireResistance",
        "electricityResistance",
        "normalWeapons",
        "hold",
        "stun",
        "petrification",
        "ghostVisual1",
      ],
      effects: [
        { opcode: "NoCollisionDetection", passWalls: true },
        { opcode: "ModifyCollisionBehavior" },
        // { opcode: "MagicDamageResistanceModifier", type: "Set", value: 100 },
      ],
      // Ghostly Body (Ghostwalk Form Only). The ghostwalk spider has resistance to acid, cold, fire, lightning, and thunder damage and to bludgeoning, piercing, and slashing damage from nonmagical attacks,
      // and it has immunity to the grappled, paralyzed, petrified, and restrained conditions.
    }),
  ],
  abilities: [
    // Ghostwalk. The ghostwalk spider magically takes on a ghostly form or returns to its true, tangible form.
  ],
  files: [
    "C#LCCENS", // Ghostly Spirit
  ],
};
