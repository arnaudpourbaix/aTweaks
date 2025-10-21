import { MonsterItemIconEnum } from "../../config/item";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { RawCreature } from "../../src/model/raw/creature";
import { createTraitItem } from "../../src/services/creature-helper";
import { bafFile, file } from "../../src/services/misc.func";
import { MonsterEnum } from "../monster";

// Creature Id
const id = MonsterEnum.FleshGolem;
// Script
const script = bafFile(id);
// Items
const mainWeapon = file(1, id);
const traits = file(2, id);

const name = "Flesh Golem";

export const GOLEM_FLESH: RawCreature = {
  name,
  bafFile: `lib/pnp-monster/golem/${script}`,
  tpaFile: "lib/pnp-monster/golem/flesh",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  data: {
    level1: 9,
    bonusHp: 0,
    strength: 19,
    dexterity: 9,
    constitution: 18,
    intelligence: 3,
    wisdom: 10,
    charisma: 5,
    movement: 8,
    ac: 9,
    apr: 2,
    xpv: 2000,
    alignment: "NEUTRAL",
    morale: 20,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "GIANTHUMANOID",
    race: "GOLEM",
    class: "GOLEM_FLESH",
    gender: "NIETHER",
    size: "Large",
    modAnimation: "A7!GOLEM_FLESH_PST",
  },
  additionalData: {
    immunities: ["construct"],
    removeScripts: ["dw1melmo"],
    removeItems: ["GOLFLE"],
  },
  items: [
    {
      file: mainWeapon,
      stringRef: TraStringReferenceEnum.LethalFists,
      icon: MonsterItemIconEnum.Golem,
      equippedSlot: "WEAPON1",
      type: "Melee",
      diceThrown: 2,
      diceSize: 8,
      damageType: "Crushing",
      speed: 3,
      abilityFlags: ["AddStrengthBonus"],
    },
    createTraitItem({
      file: traits,
      name,
      immunities: ["magic", "fire", "cold"],
      effects: [
        {
          opcode: "ElectricityResistanceModifier",
          value: 125,
          type: "Set",
        },
      ],
    }),
  ],
  files: ["BPGOFL01", "FGOLEM", "GOLEMF", "GOLEMF2", "TOMEGOL1"],
  customCode: [
    // Lost control and Berserk are not implemented because it would be difficult to handle for AI.
    // FIXME: Not good enough, should be only spells and slow is too much for "merely slow". Maybe create a spell with -1 movement, but how to properly check spells ? SpellCast doesn't seem to work, maybe because of magic resistance?
    // {
    //   location: "creatureAbilities",
    //   type: "insertBefore",
    //   statements: [
    //     {
    //       comment: "Fire and cold based spells merely slow them for 6 rounds.",
    //       triggers: [
    //         {
    //           name: "StateCheck",
    //           params: ["Myself", "STATE_SLOWED"],
    //           negation: true,
    //         },
    //         {
    //           name: "Or",
    //           triggers: [
    //             { name: "HitBy", params: ["ANYONE", "FIRE"] },
    //             { name: "HitBy", params: ["ANYONE", "MAGICFIRE"] },
    //             { name: "HitBy", params: ["ANYONE", "COLD"] },
    //             { name: "HitBy", params: ["ANYONE", "MAGICCOLD"] },
    //           ],
    //         },
    //       ],
    //       responses: [
    //         {
    //           weight: 100,
    //           actions: [
    //             { name: "ReallyForceSpell", params: ["Myself", "GOLEM_SLOW"] },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],
};
