import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, file } from "../../src/services/misc.func";
import { StringRefUtils } from "../../src/services/string-ref.utils";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.WraithSpider;
// Script
const script = bafFile(id);
// Items
const biteWeapon = file(1, id);
const traits = file(2, id);
// Spells
const poison = file(1, id);

const name = "Wraith Spider";
export const SPIDER_WRAITH: RawCreature = {
  name,
  tpaFile: "lib/pnp-monster/spider/wraith",
  bafFile: `lib/pnp-monster/spider/${script}`,
  tracking: true,
  combatWalk: true,
  dialog: ["C#Q04009", "ttspid"],
  data: {
    level1: 3,
    bonusHp: 2,
    thac0: 17,
    strength: 17,
    dexterity: 15,
    constitution: 9,
    intelligence: 10,
    wisdom: 10,
    charisma: 1,
    movement: 12,
    ac: 5,
    apr: 1,
    xpv: 1400,
    alignment: "LAWFUL_EVIL",
    morale: 13,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SPIDER",
    class: "SPIDER_WRAITH",
    gender: "NIETHER",
    size: "Medium",
  },
  additionalData: {
    removeItems: ["IMMUNE1", "RING95", "ANTIWEB", "SPIDWR1"],
    removeScripts: [
      "DW1MELMO",
      "DW#GPSHM",
      "DW#SPIDG",
      "BPSIGHT",
      "BPASIGHT",
      "DVMELEE",
    ],
    immunities: ["spider", "undead"],
  },
  items: [
    {
      file: biteWeapon,
      stringRef: TraStringReferenceEnum.Jaws,
      icon: MonsterItemIconEnum.Jaws,
      equippedSlot: "WEAPON1",
      type: "Melee",
      speed: 2,
      abilityFlags: ["AddStrengthBonus"],
      effects: [
        {
          opcode: "Damage",
          type: "MagicCold",
          diceThrown: 1,
          diceSize: 4,
        },
        {
          opcode: "LevelDrain",
          amount: 1,
          timing: "InstantPermanentUntilDeath",
        },
        {
          opcode: "DisplayString",
          stringRef: StringRefUtils.getStringId("One Level Drained"),
          timing: "InstantPermanentUntilDeath",
        },
        {
          opcode: "CastSpell",
          type: "CastInstantlyAtCasterLevel",
          resource: poison,
          saveTypes: ["ParalyzePoisonDeath"],
        },
      ],
    },
    createTraitItem({
      name,
      file: traits,
      immunities: ["cold", "normalWeapons"],
    }),
  ],
  spells: [
    {
      file: poison,
      name: "Wraith Spider Poison",
      stringRef: TraStringReferenceEnum.WraithSpiderPoison,
      description: [
        "This poison remains active for 2-5 rounds and drains 1 point of Constitution each round it is active.",
        "The victim must roll a successful saving throw vs. poison each round to escape the poison's effects for that round.",
        "Constitution points can be regained at the rate of 1 per week; a heal spell restores 1-4 points per spell.",
      ],
      // A neutralize poison spell alleviates the effects of the poison entirely, removing it from the victim's system and restoring any lost Constitution points.
      // A slow poison delays the effects of the poison for the duration of the spell but will not restore Constitution points already lost.
      //
      secondaryType: "Disabling",
      headers: [
        {
          type: "Melee",
          range: 5,
          effects: [
            {
              opcode: "ConstitutionBonus",
              type: "Increment",
              value: -5,
              timing: "InstantLimited",
              duration: 600,
            },
            {
              opcode: "DisplayPortraitIcon",
              icon: "AbilityScoreDrained",
              timing: "InstantLimited",
              duration: 600,
            },
            {
              opcode: "ProtectionFromSpell",
              resource: poison,
              duration: 30, // should gradually loose constitution for 5 rounds
              timing: "InstantLimited",
            },
          ],
        },
      ],
    },
  ],
  //These creatures create webs that glow with an eerie dim green light. Anyope touching a web will sustain 1d4 points of damage from the numbing cold of the strands.
  // Characters in contact with the webs must also make a saving throw vs. paralyzation or be immobilized by the web for 1-6 rounds, sustaining cold damage for each round in the web.
  files: [
    "C#Q04009", // Wraith Spider
    "SPIDWR", // Wraith Spider
    "SPIDWR01", // Wraith Spider
    "TTSPID", // Wraith Spider
    "L#ULCSP", // Ssimkh, the Ghost-Feeding Spider
    "D5DRSSP1", // Spirit Spider
    "D5DRSSP2", // Spirit Spider
    "D5DRSSP3", // Spirit Spider
    "D5DRSSP4", // Spirit Spider
    "D5DRSSP5", // Spirit Spider
  ],
};
