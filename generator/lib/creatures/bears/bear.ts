import { MonsterItemIconEnum } from "../../config/item";
import { SPELLS } from "../../config/spell-names";
import actionFactory from "../../src/factories/action.factory";
import creatureFactory from "../../src/factories/creature.factory";
import effectFactory from "../../src/factories/effect.factory";
import responseFactory from "../../src/factories/response.factory";
import { RawCreatureAbility } from "../../src/model/creature/ability";
import { CustomCode } from "../../src/model/script/script";
import {
  AbilityDamageTypeEnum,
  EffectDamageModeEnum,
  EffectDamageTypeEnum,
  EffectFlagsEnum,
  EffectTimingEnum,
  ItemAbilityFlagEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  LightingEffectEnum,
  SaveTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import { AreaProjectileEnum } from "../../src/model/spell-item/projectile";
import {
  PartialWeapon,
  WeaponCastSpell,
} from "../../src/model/spell-item/spell-item";
import targetService from "../../src/services/target.service";
import { hunterCustomCode } from "../common";
import { MonsterEnum, MonsterFamilyEnum } from "../monster";

const createPaws = (payload: {
  diceSize: number;
  diceThrown: number;
  hug: {
    diceSize: number;
    diceThrown: number;
  };
}): {
  weapon: PartialWeapon;
  castSpell: WeaponCastSpell;
} => ({
  weapon: {
    stringRef: "monster.bear.weapon.claws",
    icon: MonsterItemIconEnum.Wolf,
    equippedSlot: ["WEAPON1"],
    header: {
      type: ItemAbilityTypeEnum.Melee,
      diceThrown: payload.diceThrown,
      diceSize: payload.diceSize,
      damageType: AbilityDamageTypeEnum.Slashing,
      speed: 5,
      abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
    },
  },
  castSpell: {
    probability1: 10,
    spell: {
      name: "monster.bear.hug.name",
      secondaryType: ItemAbilitySecondaryTypeEnum.OffensiveDamage,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          range: 5,
          effects: [
            {
              opcode: EffectTypeEnum.Damage,
              type: EffectDamageTypeEnum.Crushing,
              diceThrown: payload.hug.diceThrown,
              diceSize: payload.hug.diceSize,
            },
          ],
        },
      ],
    },
  },
});

const createJaws = (payload: {
  diceSize: number;
  diceThrown: number;
}): {
  weapon: PartialWeapon;
} => ({
  weapon: {
    stringRef: "monster.bear.weapon.jaws",
    icon: MonsterItemIconEnum.Jaws,
    equippedSlot: ["SHIELD"],
    header: {
      type: ItemAbilityTypeEnum.Melee,
      diceThrown: payload.diceThrown,
      diceSize: payload.diceSize,
      damageType: AbilityDamageTypeEnum.Piercing,
      speed: 3,
      abilityflags: [ItemAbilityFlagEnum.AddStrengthBonus],
    },
  },
});

const turningHostile: CustomCode = {
  location: "turnHostile",
  type: "insertAfter",
  statements: [
    {
      comment: "Turn hostile if too close and not druid/ranger",
      triggers: [
        { name: "Range", params: ["GOODCUTOFF", 7] },
        {
          name: "See",
          params: [targetService.targetObject({ ea: "PC", clazz: "DRUID" })],
          negation: true,
        },
        {
          name: "See",
          params: [targetService.targetObject({ ea: "PC", clazz: "RANGER" })],
          negation: true,
        },
        {
          name: "See",
          params: [
            targetService.targetObject({ ea: "PC", clazz: "FIGHTER_DRUID" }),
          ],
          negation: true,
        },
        {
          name: "See",
          params: [
            targetService.targetObject({ ea: "PC", clazz: "CLERIC_RANGER" }),
          ],
          negation: true,
        },
        {
          name: "Allegiance",
          params: ["Myself", "NEUTRAL"],
        },
      ],
      responses: responseFactory.response([{ name: "Enemy" }]),
    },
  ],
  abilities: [],
};

const fearFire: CustomCode = {
  location: "handlePanic",
  type: "insertAfter",
  statements: [
    {
      triggers: [{ name: "HitBy", params: ["ANYONE", "FIRE"] }],
      responses: responseFactory.response(
        actionFactory.disableInterrupt([
          { name: "RunAwayFromNoLeaveArea", params: ["LastAttackerOf", 200] },
        ])
      ),
    },
  ],
  abilities: [],
};

const rage: RawCreatureAbility = {
  name: "ability.enrage",
  spell: {
    resource: SPELLS.BerserkerRage,
    selfTarget: true,
    probability: 50,
  },
  triggers: [
    { name: "See", params: ["NearestEnemyOf"] },
    { name: "CheckStat", params: ["Myself", 0, "OFFENSIVE_MODIFIER"] },
    { name: "HPPercentLT", params: ["Myself", 75] },
  ],
};

export const createBears = () => {
  /**
   * Black Bear
   */
  const black = creatureFactory.create({
    monster: MonsterEnum.BlackBear,
    family: MonsterFamilyEnum.Bear,
    name: "monster.bear.name.black",
    files: [
      "BDBEARBL",
      "BEARBL",
      "BEARBLSU",
      "PLYBEAR2",
      "RSBEARBL",
      "UBDBEAR",
    ],
    data: {
      level1: 3,
      bonusHp: 3,
      strength: 15,
      dexterity: 10,
      constitution: 15,
      intelligence: 4,
      wisdom: 12,
      charisma: 7,
      ac: 7,
      apr: 3,
      xpv: 175,
      alignment: "NEUTRAL",
      morale: 9,
      general: "ANIMAL",
      race: "BEAR",
      class: "BEAR_BLACK",
      gender: "NIETHER",
      size: "Medium",
    },
  });
  black.setAdditionalData({
    movement: { value: 12 },
    removeItems: ["B1-6"],
    removeScripts: ["CBEAR", "BEAR"],
  });
  black.addWeapon(
    createPaws({
      diceThrown: 1,
      diceSize: 3,
      hug: { diceThrown: 2, diceSize: 4 },
    })
  );
  black.addWeapon(createJaws({ diceThrown: 1, diceSize: 6 }));
  black.setAdjustments([
    { files: ["BEARBLSU"], summon: true },
    { files: ["PLYBEAR2"], additionalData: { scriptLocation: "None" } },
  ]);
  black.setBehavior({ walk: true, customCodes: [turningHostile, fearFire] });
  black.validate();

  /**
   * Brown Bear
   */
  const brown = creatureFactory.create({
    monster: MonsterEnum.BrownBear,
    family: MonsterFamilyEnum.Bear,
    name: "monster.bear.name.brown",
    files: [
      "BDBEARBN",
      "BDBEARBR",
      "BDGRIZHU",
      "BEARBR",
      "BEARBRSU",
      "PLYBEAR1",
      // "BDSHA06A", //TODO: Summon bear spirit
    ],
    data: {
      level1: 5,
      bonusHp: 5,
      specialBonusHp: 8,
      strength: 19,
      dexterity: 10,
      constitution: 16,
      intelligence: 4,
      wisdom: 13,
      charisma: 7,
      ac: 6,
      apr: 3,
      xpv: 420,
      alignment: "NEUTRAL",
      morale: 9,
      general: "ANIMAL",
      race: "BEAR",
      class: "BEAR_BROWN",
      gender: "NIETHER",
      size: "Large",
    },
  });
  brown.setAdditionalData({
    movement: { value: 12 },
    removeItems: ["B1-8"],
    removeScripts: ["CBEAR", "BEAR"],
  });
  brown.addWeapon(
    createPaws({
      diceThrown: 1,
      diceSize: 6,
      hug: { diceThrown: 2, diceSize: 6 },
    })
  );
  brown.addWeapon(createJaws({ diceThrown: 1, diceSize: 8 }));
  brown.setBehavior({
    walk: true,
    customCodes: [turningHostile, hunterCustomCode],
    abilities: [rage],
  });
  brown.setAdjustments([
    { files: ["BEARBRSU"], summon: true },
    { files: ["PLYBEAR1"], additionalData: { scriptLocation: "None" } },
    { files: ["BDGRIZHU"], data: { class: "HUNTER_CREATURE" } },
    // { do we want to give them rage? this is not RAW
    //   files: ["BDBEARBN", "BDGRIZHU"],
    //   additionalData: { removeMemorizedSpells: false },
    // },
  ]);
  brown.validate();

  /**
   * Cave Bear
   */
  const cave = creatureFactory.create({
    monster: MonsterEnum.CaveBear,
    family: MonsterFamilyEnum.Bear,
    name: "monster.bear.name.cave",
    files: ["BD328OSO", "BDBEARCA", "BEARCA", "BEARCASU", "CAVENE", "URSA"],
    data: {
      level1: 6,
      bonusHp: 6,
      specialBonusHp: 8,
      strength: 20,
      dexterity: 10,
      constitution: 16,
      intelligence: 4,
      wisdom: 13,
      charisma: 7,
      ac: 6,
      apr: 3,
      xpv: 650,
      alignment: "NEUTRAL",
      morale: 9,
      general: "ANIMAL",
      race: "BEAR",
      class: "BEAR_CAVE",
      gender: "NIETHER",
      size: "Huge",
    },
  });
  cave.setAdditionalData({
    movement: { value: 12 },
    removeItems: ["B1-10", "BEARCASU"],
    removeScripts: ["CBEAR", "BEAR"],
  });
  cave.addWeapon(
    createPaws({
      diceThrown: 1,
      diceSize: 8,
      hug: { diceThrown: 2, diceSize: 6 },
    })
  );
  cave.addWeapon(createJaws({ diceThrown: 1, diceSize: 12 }));
  cave.setBehavior({
    customCodes: [turningHostile],
    walk: true,
    abilities: [rage],
  });
  cave.setAdjustments([
    { files: ["BEARCASU"], summon: true },
    { files: ["BD328OSO"], data: { level1: 8, xpv: 900 } },
    // { do we want to give them rage? this is not RAW
    //   files: ["BDBEARCA"],
    //   additionalData: { removeMemorizedSpells: false },
    // },
  ]);
  cave.validate();

  /**
   * Polar Bear
   */
  const polar = creatureFactory.create({
    monster: MonsterEnum.PolarBear,
    family: MonsterFamilyEnum.Bear,
    name: "monster.bear.name.polar",
    files: [
      "BEARPO",
      "BEARPO1",
      "BEARPO2",
      "BEARPO3",
      "BEARPOSU",
      "NTBEARPO",
      "SPIRBEAR",
      "BDGHBRSU", // Ghost Polar Bear
      "KALDRAN",
      // "SPBEAR1", //TODO: Spirit Bear
      // "SPBEAR2", //TODO: Spirit Bear
      // "SPBEAR3", //TODO: Spirit Bear
      // "SPBEAR4", //TODO: Spirit Bear
      // "SPBEAR5", //TODO: Spirit Bear
    ],
    data: {
      level1: 8,
      bonusHp: 8,
      specialBonusHp: 12,
      strength: 20,
      dexterity: 10,
      constitution: 16,
      intelligence: 4,
      wisdom: 13,
      charisma: 7,
      ac: 6,
      apr: 3,
      xpv: 1400,
      alignment: "NEUTRAL",
      morale: 9,
      general: "ANIMAL",
      race: "BEAR",
      class: "BEAR_POLAR",
      gender: "NIETHER",
      size: "Huge",
    },
  });
  polar.setAdditionalData({
    movement: { value: 12 },
    removeItems: ["B1-12", "BEARPOSU", "KALDW1"],
    removeScripts: ["CBEAR", "BEAR", "kaldran"],
  });
  polar.addWeapon(
    createPaws({
      diceThrown: 1,
      diceSize: 10,
      hug: { diceThrown: 3, diceSize: 6 },
    })
  );
  polar.addWeapon(createJaws({ diceThrown: 2, diceSize: 6 }));
  const improvedStreamOfFrost = polar.addSpell({
    name: "monster.bear.improvedStreamOfFrost.name",
    options: { renew: 3 },
    icon: SPELLS.Fireburst,
    description: "monster.bear.improvedStreamOfFrost.description",
    secondaryType: ItemAbilitySecondaryTypeEnum.OffensiveDamage,
    headers: [
      {
        type: ItemAbilityTypeEnum.Ranged,
        target: ItemAbilityTargetEnum.AnyPointWithinRange,
        projectile: {
          copyFromFile: "CONECOLD",
          name: "Improved stream of frost",
          areaEffectInfo: {
            areaProjectileFlags: [
              AreaProjectileEnum.AffectOnlyEnemies,
              AreaProjectileEnum.UseSecondaryProjectile,
            ],
            triggerRadius: 180,
            areaOfEffect: 180,
            coneWidth: 0,
          },
        },
        range: 10,
        effects: [
          {
            opcode: EffectTypeEnum.Damage,
            timing: EffectTimingEnum.InstantPermanentUntilDeath,
            amount: 0,
            damageMode: EffectDamageModeEnum.Normal,
            type: EffectDamageTypeEnum.Cold,
            diceThrown: 6,
            diceSize: 4,
            saveTypes: [SaveTypeEnum.Breath],
            flags: [EffectFlagsEnum.SaveForHalf],
          },
          ...effectFactory.paralyze({
            duration: 60,
            saveBonus: -2,
            startSound: "MISC_04A",
            endSound: "EFF_E03",
            pulse: { blue: 255, green: 213, red: 123, speed: 20 },
            lightingEffect: LightingEffectEnum.AlterationWater,
          }),
        ],
      },
    ],
    ability: {
      targets: [
        {
          name: "NearestEnemies",
          limit: 3,
        },
      ],
      spell: {
        type: "force",
        probability: 20,
        selfTarget: true,
      },
      range: 10,
    },
  });
  const kaldranInit: CustomCode = {
    location: "init",
    type: "insertAfter",
    statements: [
      {
        triggers: [
          { name: "Name", params: ["kaldran", "Myself"] },
          { name: "Global", params: ["Kaldran", "GLOBAL", 0] },
          { name: "See", params: ["NearestEnemyOf"] },
          { name: "See", params: ["PC"] },
        ],
        responses: [
          {
            weight: 100,
            actions: [{ name: "SetGlobal", params: ["Kaldran", "GLOBAL", 1] }],
          },
        ],
      },
    ],
    abilities: [],
  };
  polar.setBehavior({
    walk: true,
    abilities: [improvedStreamOfFrost.ability!],
    customCodes: [turningHostile, kaldranInit],
  });
  polar.setAdjustments([
    { files: ["BEARPOSU", "BDGHBRSU"], summon: true },
    { files: ["BDGHBRSU"], data: { level1: 9 } },
    {
      files: ["KALDRAN"],
      data: {
        level1: 12,
        intelligence: 10,
        morale: 15,
      },
      additionalData: {
        immunities: ["cold", "coldSpells"],
        memorizedSpells: [
          { file: improvedStreamOfFrost.file, memorizedCount: 1 },
        ],
      },
    },
  ]);
  polar.validate();

  return [black, brown, cave, polar];
};
