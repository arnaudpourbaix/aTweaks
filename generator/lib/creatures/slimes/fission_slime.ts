import { ATWEAKS_SPELLS } from "../../config/spell-names";
import { RawCreature } from "../../src/model/raw/creature";
import { EffectService } from "../../src/services/effect.service";
import { bafFile, file } from "../../src/services/misc.func";
import { UtilsService } from "../../src/services/utils.service";
import { MonsterEnum } from "../monster.enum";

const effects = EffectService.instance;
const utils = UtilsService.instance;
// Creature Id
const id = MonsterEnum.FissionSlime;
// Items
const mainWeapon = file(1, id);
const traits = file(2, id);
// Script
const script = bafFile(id);

export const SLIME_FISSION: RawCreature = {
  name: "Fission Slime",
  bafFile: `lib/pnp-monster/slime/${script}`,
  tpaFile: "lib/pnp-monster/slime/fission_slime",
  tracking: true,
  combatWalk: true,
  restHeal: true,
  dialog: [],
  canPolymorph: true,
  autoGenerate: {
    savingThrows: false,
  },
  attack: {
    ranged: true,
  },
  data: {
    level1: 7,
    bonusHp: 14,
    thac0: 13,
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 10,
    wisdom: 0,
    charisma: 0,
    ac: 4,
    apr: 2,
    resistMagic: 10,
    xpv: 4000,
    alignment: "NEUTRAL",
    morale: 14,
    moraleBreak: 4,
    moraleRecovery: 15,
    general: "MONSTER",
    race: "SLIME",
    class: "MUSTARD_JELLY",
    gender: "NIETHER",
    size: "Large",
  },
  additionalData: {
    removeItems: [],
    removeScripts: [
      "SHOUT",
      "INITDLG",
      "DW#GPSHT",
      "DW#MG84",
      // "J#SIRIN1",
      "SIRSPELL",
      "DW1RANMO",
      "DW1RANGE",
      "SIL",
    ],
    immunities: ["ooze"],
  },
  effectFiles: [
    {
      file: ATWEAKS_SPELLS.CharmingSong,
      opcode: "CastSpell",
      type: "CastInstantlyAtCasterLevel",
      resource: ATWEAKS_SPELLS.CharmingSongTechnical,
      timing: "InstantPermanentUntilDeath",
      dispelResistance: "NaturalNonMagical",
    },
  ],
  items: [
    {
      file: mainWeapon,
      equippedSlot: "WEAPON1",
      icon: "IGHOUL",
      type: "Melee",
      diceSize: 3,
      diceThrown: 1,
      damageType: "Crushing",
      effects: [
        {
          opcode: "CastSpell",
          type: "CastInstantlyAtCasterLevel",
          castingLevel: 1,
          timing: "InstantPermanentUntilDeath",
          dispelResistance: "NaturalNonMagical",
          resource: ATWEAKS_SPELLS.TouchOfTranquility,
        },
      ],
    },
  ],
  files: [
    "JELLSPA", // Fission Slime
  ],
  adjustments: [],
};
