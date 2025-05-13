import { TraStringReferenceEnum } from "../config/stringRef";
import { RawCreature } from "../src/model/raw/creature";
import { bafFile, file } from "../src/services/misc.func";
import { MonsterEnum } from "./monster.enum";

// Creature Id
const id = MonsterEnum.ClayGolem;
// Script
const script = bafFile(id);
// Spells
const haste = file(1, id);
// Items
const mainWeapon = file(1, id);

export const GOLEM_CLAY: RawCreature = {
  name: "Clay Golem",
  bafFile: `lib/pnp-monster/golem/${script}`,
  tpaFile: "lib/pnp-monster/golem/clay",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 11,
    bonusHp: 0,
    strength: 20,
    dexterity: 9,
    constitution: 18,
    intelligence: 3,
    wisdom: 8,
    charisma: 1,
    movement: 7,
    ac: 7,
    apr: 1,
    xpv: 5000,
    alignment: "NEUTRAL",
    morale: 20,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "GOLEM",
    class: "GOLEM_CLAY",
    gender: "NIETHER",
    size: "Large",
    resistMissile: 100,
    resistPiercing: 100,
    resistSlashing: 100,
    resistMagic: 100,
  },
  additionalData: {
    immunities: ["construct"],
    removeScripts: ["GOLCLY01", "BPFHT"],
    removeItems: ["GOLCLA", "RING95"],
  },
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 3,
      diceSize: 10,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
  ],
  spells: [
    {
      name: "Haste",
      file: haste,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.Haste,
      headers: [
        {
          type: "Melee",
          effects: [
            {
              opcode: "RemoveSpellTypeProtections",
              maximumLevel: 9,
              type: "K1#SLOW",
              timing: "InstantLimited",
              duration: 18,
            },
            {
              opcode: "Haste",
              type: "NormalHaste",
              timing: "InstantLimited",
              duration: 18,
            },
            {
              opcode: "DisplayPortraitIcon",
              icon: "Haste",
              timing: "InstantLimited",
              duration: 18,
            },
            {
              opcode: "LightingEffects",
              effect: "AlterationAir",
              lightingTarget: "SpellTarget",
              timing: "InstantPermanentUntilDeath",
            },
            {
              opcode: "CreatureRGBColorFade",
              color: {
                red: 60,
                green: 60,
                blue: 120,
              },
              fadeSpeed: 25,
              timing: "InstantPermanentUntilDeath",
            },
            {
              opcode: "DisplayString",
              stringRef: "14023",
              timing: "InstantPermanentUntilDeath",
            },
            {
              opcode: "PlaySound",
              timing: "InstantPermanentUntilDeath",
              resource: "EFF_M28",
            },
            {
              opcode: "PlaySound",
              timing: "DelayPermanent",
              duration: 18,
              resource: "EFF_M29",
            },
          ],
        },
      ],
    },
  ],
  abilities: [
    {
      name: "Haste",
      spell: {
        resource: haste,
        type: "reallyForce",
        excludeStateChecks: ["STATE_HASTED"],
        remove: true,
      },
      triggers: [{ name: "Delay", params: [6] }],
    },
  ],
  files: ["AC#FPCLG", "AC#FPCLY", "BPCLAY", "TOMEGOL2", "WICLAYGO"],
};
