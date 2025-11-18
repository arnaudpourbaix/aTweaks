import { ATWEAKS_CREATURES } from "../../config/creatures";
import { SPELLS } from "../../config/spell-names";
import CreatureFactory from "../../src/factories/creature.factory";
import {
  EffectDamageTypeEnum,
  EffectFlagsEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTypeEnum,
  ProficiencyTypeEnum,
  SaveTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

export const createFeys = () => {
  const dryad = CreatureFactory.create({
    monster: MonsterEnum.Dryad,
    family: MonsterFamilyEnum.Fey,
    name: "monster.fey.name.dryad",
    files: [
      "DRYAD", // Dryad of the Cloudpeaks
      ATWEAKS_CREATURES.DryadSummon,
      "DRY01", // Dryad (unused?)
      "DRYAD01", // Dryad (unused?)
      "DRYAD02", // Dryad (unused?)
      "DRYAD03", // Dryad (unused?)
      "IDRYAD01", // Ulene (one of Irenicus captive Dryads)
      "IDRYAD02", // Cania (one of Irenicus captive Dryads)
      "IDRYAD03", // Elyme (one of Irenicus captive Dryads)
      "dr01mod", // Dryad (PofQuestPack)
      "drmod", // Dryad (PofQuestPack)
      "RE_DRYAD", // Dryad (PofQuestPack)
      "H_KATREC", // Katreda
      "L#APEST", // Y'Uula
      "NTARCHAN", // Archandra
      "NTASSAIA", // Assaia
      "NTESSILA", // Essila
      "NTLUCRET", // Lucretia
      "NTMILEA", // Milea
      "NTPAULIA", // Paulia
      "NTTAMAEL", // Tamael
    ],
    data: {
      level1: 2,
      strength: 10,
      dexterity: 12,
      constitution: 11,
      intelligence: 14,
      wisdom: 15,
      charisma: 18,
      ac: 9,
      apr: 1,
      xpv: 975,
      alignment: "NEUTRAL",
      morale: 12,
      general: "HUMANOID",
      race: "FAIRY",
      class: "FAIRY_DRYAD",
      gender: "FEMALE",
      size: "Medium",
    },
  });
  dryad.setAdditionalData({
    movement: { value: 12 },
    immunities: ["fey"],
    proficiencies: [{ type: ProficiencyTypeEnum.PROFICIENCYDAGGER, value: 2 }],
    removeItems: [],
    removeScripts: ["DRYAD"],
  });
  const stream = dryad.addSpell({
    memorizedCount: 1,
    name: "monster.ankheg.enzymeStream.name",
    description: "monster.ankheg.enzymeStream.description",
    secondaryType: ItemAbilitySecondaryTypeEnum.OffensiveDamage,
    icon: SPELLS.MelfAcidArrow,
    headers: [
      {
        type: ItemAbilityTypeEnum.Ranged,
        range: 30,
        speed: 3,
        projectile: "acidblob",
        effects: [
          {
            opcode: EffectTypeEnum.Damage,
            type: EffectDamageTypeEnum.Acid,
            diceThrown: 8,
            diceSize: 4,
            saveTypes: [SaveTypeEnum.ParalyzePoisonDeath],
            flags: [EffectFlagsEnum.SaveForHalf],
          },
        ],
      },
    ],
    ability: {
      disableInterrupt: true,
      spell: {
        type: "force",
        remove: true,
      },
      targets: [{ name: "PCsPreferringWeak", random: true }],
      triggers: [{ name: "HPPercentLT", params: ["Myself", 50] }],
      range: 30,
    },
  });
  dryad.setAttack({ melee: false });
  dryad.setBehavior({
    dialog: ["CDryad", "Ulene", "L#APEST"],
    abilities: [stream.ability!],
  });
  dryad.setAdjustments([
    {
      files: [ATWEAKS_CREATURES.DryadSummon],
      summon: true,
    },
    {
      files: ["DRYAD", "L#APEST"],
      data: { class: "INNOCENT" },
    },
  ]);
  dryad.validate();
  return [dryad];
};
