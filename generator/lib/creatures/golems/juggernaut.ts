import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, convertMovement, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster.enum";

// Creature Id
const id = MonsterEnum.JuggernautGolem;
// Script
const script = bafFile(id);
// Spells
const charge = file(1, id);
// Items
const mainWeapon = file(1, id);
const traits = file(2, id);

const name = "Juggernaut Golem";

export const GOLEM_JUGGERNAUT: RawCreature = {
  name,
  bafFile: `lib/pnp-monster/golem/${script}`,
  tpaFile: "lib/pnp-monster/golem/juggernaut",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 18,
    bonusHp: 0,
    strength: 22,
    dexterity: 9,
    constitution: 20,
    intelligence: 3,
    wisdom: 11,
    charisma: 1,
    movement: 3,
    ac: 2,
    apr: 2,
    xpv: 11000,
    alignment: "NEUTRAL",
    morale: 16,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "GOLEM",
    class: "GOLEM_STONE",
    gender: "NIETHER",
    size: "Large",
    animation: "GOLEM_CLAY",
  },
  additionalData: {
    immunities: ["construct"],
    removeScripts: ["GOLSTO01", "GOLIRO01", "TOMEGOL4"],
    removeItems: ["IRONGOL"],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.LethalFists,
      icon: MonsterItemIconEnum.Golem,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 2,
      diceSize: 6,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
    createTraitItem({
      file: traits,
      name,
      immunities: ["magic", "fire"],
    }),
  ],
  spells: [
    {
      //TODO: this is a very basic idea of charge, many improvements can be done but since this golem is only used once by a mod, it is a low priority.
      // Anyone caught in the path of a juggernaut charge is run over by the thundering behemoth, though the juggernaut must make a normal attack roll if the victim can avoid the charge.
      // A hit indicates that the victim is crushed, suffering 10d10 points of damage
      // Should be like this:
      // 1. Choose a target, activate charge
      // 2. Run to target (no attack)
      // 3. Once within 5 range, switch to a new weapon that does 10d10 crushing damage then end charge
      // If target can't be reached within a reasonable amount of time, it can end charge and pick another target.
      // To make a better movement implementation: create several boots items and create/remove them (this is especially important for ending charge)
      name: "Juggernaut charge",
      file: charge,
      stringRef: TraStringReferenceEnum.Charge,
      description: [
        "",
        "Gradually increases movement for 4 rounds. Peak speed is reached after 2 rounds.",
      ],
      icon: SPELLS.Haste,
      infiniteUse: 5,
      memorizedCount: 1,
      headers: [
        {
          type: "Melee",
          effects: [
            {
              opcode: "MovementRateBonus2",
              type: "Set",
              value: convertMovement(6),
              timing: "InstantLimited",
              duration: 6,
            },
            {
              opcode: "MovementRateBonus2",
              type: "Set",
              value: convertMovement(9),
              timing: "DelayLimited",
              duration: 6,
            },
            {
              opcode: "MovementRateBonus2",
              type: "Set",
              value: convertMovement(12),
              timing: "DelayLimited",
              duration: 12,
            },
            {
              opcode: "DisplayString",
              stringRef: TraStringReferenceEnum.EndCharge,
              timing: "DelayPermanent",
              duration: 24,
            },
          ],
        },
      ],
    },
  ],
  abilities: [
    {
      name: "Charge",
      spell: {
        resource: charge,
        selfTarget: true,
        type: "reallyForce",
      },
      triggers: [
        { name: "Range", params: ["NearestEnemyOf", 5], negation: true },
      ],
      timer: { name: "Charge", value: 25 },
    },
  ],
  files: ["TOMEGOL4"],
};
