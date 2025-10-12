import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, file } from "../../src/services/misc.func";
import { StringRefUtils } from "../../src/services/string-ref.utils";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.ClayGolem;
// Script
const script = bafFile(id);
// Spells
const haste = file(1, id);
// Items
const mainWeapon = file(1, id);
const traits = file(2, id);

const name = "Clay Golem";

export const GOLEM_CLAY: RawCreature = {
  name,
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
  },
  additionalData: {
    immunities: ["construct"],
    removeScripts: ["GOLCLY01", "BPFHT"],
    removeItems: ["GOLCLA", "RING95"],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.LethalFists,
      icon: MonsterItemIconEnum.Golem,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 3,
      diceSize: 10,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
    createTraitItem({
      file: traits,
      name,
      immunities: [
        "magic",
        "slashingDamage",
        "piercingDamage",
        "missileDamage",
      ],
    }),
  ],
  spells: [
    {
      name: "Haste",
      file: haste,
      memorizedCount: 1,
      stringRef: TraStringReferenceEnum.Haste,
      description: ["", "Haste golem for 3 rounds."],
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
              stringRef: StringRefUtils.getStringId("Hasted"),
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
