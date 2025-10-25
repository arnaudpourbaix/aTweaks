import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { RawItem } from "../../src/model/raw/item";
import { FactoryService } from "../../src/services/factory.service";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.GhostwalkSpider;
// Script
const script = bafFile(id);
// Items
const biteWeapon = getFilename(1, id);
const ghostBiteWeapon = getFilename(2, id);
const traits = getFilename(2, id);
// Spells
const ghostwalk = getFilename(1, id);

const factory = FactoryService.instance;

const baseWeapon: RawItem = {
  file: biteWeapon,
  stringRef: TraStringReferenceEnum.Jaws,
  icon: MonsterItemIconEnum.Jaws,
  equippedSlot: "WEAPON1",
  type: "Melee",
  // diceThrown: 3,
  // diceSize: 10,
  diceThrown: 1,
  diceSize: 2,
  range: 5,
  damageType: "Piercing",
  speed: 2,
  abilityFlags: ["AddStrengthBonus"],
};

const name = "Ghostwalk Spider";
export const SPIDER_GHOSTWALK: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/ghostwalk",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  dialog: ["C#LCCENS"],
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
  attack: {
    defaultWeaponSlot: "SLOT_WEAPON1",
  },
  additionalData: {
    removeItems: ["SPIDPH1", "ANTIWEB", "GHOST2"],
    removeScripts: ["INITDLG", "C#LCCENS", "PSPIDER", "DW1MELMO", "L#ULCSP"],
    immunities: ["spider"],
  },
  items: [
    {
      ...baseWeapon,
      effects: [
        {
          opcode: "PoisonTypeEffects",
          poisonType: "E",
          saveBonus: -2,
        },
      ],
    },
    //TODO:
    // Multiattack. The ghostwalk spider makes one Bite attack and one Ghostly Snare attack, or it makes two Bite attacks.
    // Ghostly Snare (Ghostwalk Form Only, Recharge 4–6). Ranged Weapon Attack: range 30, one target. Hit: The target is restrained by invisible webbing. While restrained in this way, the target is invisible.
    {
      ...baseWeapon,
      file: ghostBiteWeapon,
      equippedSlot: "WEAPON2",
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
      ],
    },
    // createTraitItem({
    //   name,
    //   file: traits,
    //   immunities: [
    //     "acidResistance",
    //     "coldResistance",
    //     "fireResistance",
    //     "electricityResistance",
    //     "normalWeapons",
    //     "hold",
    //     "stun",
    //     "petrification",
    //     "ghostVisual1",
    //   ],
    //   effects: [
    //     { opcode: "NoCollisionDetection", passWalls: true },
    //     { opcode: "ModifyCollisionBehavior" },
    //   ],
    // }),
  ],
  // spells: [
  //   {
  //     file: ghostwalk,
  //     name: "Ghostwalk",
  //     stringRef: TraStringReferenceEnum.Ghostwalk,
  //     description: [
  //       "This poison remains active for 2-5 rounds and drains 1 point of Constitution each round it is active.",
  //       "The victim must roll a successful saving throw vs. poison each round to escape the poison's effects for that round.",
  //       "Constitution points can be regained at the rate of 1 per week; a heal spell restores 1-4 points per spell.",
  //     ],
  //     // A neutralize poison spell alleviates the effects of the poison entirely, removing it from the victim's system and restoring any lost Constitution points.
  //     // A slow poison delays the effects of the poison for the duration of the spell but will not restore Constitution points already lost.
  //     //
  //     secondaryType: "Disabling",
  //     headers: [
  //       {
  //         type: "Melee",
  //         range: 5,
  //         immunities: [
  //           "acidResistance",
  //           "coldResistance",
  //           "fireResistance",
  //           "electricityResistance",
  //           "normalWeapons",
  //           "hold",
  //           "stun",
  //           "petrification",
  //           "ghostVisual1",
  //         ],
  //         effects: [
  //           { opcode: "NoCollisionDetection", passWalls: true },
  //           { opcode: "ModifyCollisionBehavior" },
  //         ],
  //       },
  //     ],
  //   },
  // ],
  customCode: [
    // {
    //   // TODO: Ghostwalk. The ghostwalk spider magically takes on a ghostly form or returns to its true, tangible form.
    //   // should stay in Ghostwalk form and switch to tangible form in melee to attack a non-poisoned target
    //   location: "attack",
    //   type: "insertBefore",
    //   statements: [
    //     {
    //       triggers: [factory.globalRoundTimerExpired()],
    //       responses: factory.response([
    //         { name: "SelectWeaponAbility", params: ["SLOT_WEAPON1", 0] },
    //         factory.setGlobalRoundTimer(),
    //         { name: "Continue" },
    //       ]),
    //     },
    //   ],
    // },
  ],
  files: [
    "C#LCCENS", // Ghostly Spirit
    "L#ULCSP", // Ssimkh, the Ghost-Feeding Spider
  ],
};
