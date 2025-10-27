import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { createSingleTargetWeb } from "../../spells/web";
import { RawCreature } from "../../src/model/raw/creature";
import { EffectDamageTypeEnum } from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, getFilename } from "../../src/services/misc.func";
import { StringRefUtils } from "../../src/services/string-ref.utils";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.WraithSpider;
// Script
const script = bafFile(id);
// Items
const biteWeapon = getFilename(1, id);
const traits = getFilename(2, id);
// Spells
const poison = getFilename(1, id);
const web = getFilename(2, id);

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
    morale: 15,
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
          type: "Cold",
          diceThrown: 1,
          diceSize: 4,
          amount: 1, // strength bonus
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
      effects: [
        {
          opcode: "MagicResistanceModifier",
          value: 15,
          type: "Set",
        },
      ],
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
    createSingleTargetWeb({
      file: web,
      duration: 24,
      // saveBonus: -2,
      description: "monster.spider.webTangle.wraithDesc",
      damageEffect: {
        opcode: EffectTypeEnum.Damage,
        type: EffectDamageTypeEnum.Cold,
        diceThrown: 1,
        diceSize: 4,
      },
    }),
  ],
  abilities: [
    {
      name: "Web Tangle",
      preset: SPELLS.Web,
      spell: {
        resource: web,
        type: "force",
        isAttack: true,
        probability: 70,
      },
      range: 6, // to fix issue with very close range since melee attack is 3 feet
      requireVocal: false,
    },
  ],
  files: [
    "C#Q04009", // Wraith Spider
    "SPIDWR", // Wraith Spider
    "SPIDWR01", // Wraith Spider
    "TTSPID", // Wraith Spider
    // "D5DRSSP1", //TODO: Spirit Spider (Faiths and Powers)
    // "D5DRSSP2", //TODO: Spirit Spider (Faiths and Powers)
    // "D5DRSSP3", //TODO: Spirit Spider (Faiths and Powers)
    // "D5DRSSP4", //TODO: Spirit Spider (Faiths and Powers)
    // "D5DRSSP5", //TODO: Spirit Spider (Faiths and Powers)
  ],
};
