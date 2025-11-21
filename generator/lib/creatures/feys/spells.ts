import {
  DEFAULT_SPELL_PROBABILITY,
  PRESET_NAMES,
} from "../../config/ability-presets";
import {
  GARGANTUAN_CREATURES,
  INCORPOREAL_CREATURES,
} from "../../config/creatures";
import { GLOBAL_CONFIG } from "../../config/generate";
import { ITEMS } from "../../config/item";
import { ATWEAKS_SPELLS, SPELLS } from "../../config/spell-names";
import { createDimensionDoor } from "../../spells/dimension_door";
import effectFactory from "../../src/factories/effect.factory";
import { CreatureFamily } from "../../src/model/creature/family";
import { AdditionalCode } from "../../src/model/script/script";
import { BaseEffect, IdsEffect } from "../../src/model/spell-item/effect";
import {
  CharmTypeEnum,
  EffectBonusToEnum,
  EffectColorLocationEnum,
  EffectDispelResistanceEnum,
  EffectIDSFileEnum,
  EffectModifierTypeEnum,
  EffectTargetEnum,
  EffectTimingEnum,
  EffectVisualEffectLocationEnum,
  ItemAbilityCastingAnimationEnum,
  ItemAbilityLocationEnum,
  ItemAbilityPrimaryTypeEnum,
  ItemAbilitySecondaryTypeEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  LightingEffectEnum,
  LightingEffectTargetEnum,
  PortraitIconEnum,
  SaveTypeEnum,
  SpellFlagEnum,
  SpellTypeEnum,
} from "../../src/model/spell-item/effect.enums";
import { EffectTypeEnum } from "../../src/model/spell-item/effect.type";
import { AreaProjectileEnum } from "../../src/model/spell-item/projectile";
import {
  SpellProtectionRelation,
  SpellProtectionStat,
} from "../../src/model/spell-item/spell-protection";
import { MonsterFamilyEnum } from "../monster";

const entangleCommonEffect: BaseEffect = {
  timing: EffectTimingEnum.InstantLimited,
  duration: 6,
  dispelResistance: EffectDispelResistanceEnum.DispelNotBypassResistance,
  saveTypes: [SaveTypeEnum.Spell],
};

const animalFriendshipCommonEffect: BaseEffect = {
  timing: EffectTimingEnum.InstantLimited,
  duration: 120,
  dispelResistance: EffectDispelResistanceEnum.DispelNotBypassResistance,
  saveTypes: [SaveTypeEnum.Spell],
};

export class FeyFamily extends CreatureFamily {
  constructor() {
    super(MonsterFamilyEnum.Fey);
  }
  /**
   * Dimension Door
   */
  innateDimensionDoor = this.addSpell(
    {
      ...createDimensionDoor({
        spellLevel: 1,
        spellType: SpellTypeEnum.Innate,
        renew: 1,
      }),
      ability: {
        preset: PRESET_NAMES.DimensionDoorOffscreen,
        spell: {
          type: "force",
        },
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.DimensionDoorInfinite
  );
  priestDimensionDoor = this.addSpell(
    {
      ...createDimensionDoor({
        spellLevel: 1,
        spellType: SpellTypeEnum.Priest,
      }),
      ability: {
        preset: PRESET_NAMES.DimensionDoorOffscreen,
        spell: {
          type: "force",
          remove: true,
        },
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.DimensionDoorInfinite
  );

  /**
   * Charm
   */
  charm = this.addSpell(
    {
      name: "monster.fey.ability.dryadDireCharm",
      icon: SPELLS.DireCharm,
      castingSound: "CAS_M05",
      flags: [SpellFlagEnum.BreakSanctuary],
      spellType: SpellTypeEnum.Innate,
      castingAnimation: ItemAbilityCastingAnimationEnum.Enchantment,
      primaryType: ItemAbilityPrimaryTypeEnum.Enchanter,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      spellLevel: 1,
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          projectile: "SPARKLGO",
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.LivingActor,
          range: 30,
          speed: 1,
          effects: effectFactory.charm({
            charmType: CharmTypeEnum.NeutralDireCharm,
            duration: 180,
            dispelResistance:
              EffectDispelResistanceEnum.DispelNotBypassResistance,
            saveType: SaveTypeEnum.Spell,
            saveBonus: -3,
          }),
        },
      ],
      ability: {
        preset: SPELLS.DireCharm,
        spell: {
          type: "force",
          remove: true,
        },
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.DryadCharmPerson
  );

  /**
   * Speak with Plants
   */
  speakWithPlants = this.addSpell(
    {
      name: "monster.fey.ability.speakWithPlants.name",
      description: "monster.fey.ability.speakWithPlants.description",
      icon: "RR#FSPKP",
      castingSound: "CAS_P02",
      spellType: SpellTypeEnum.Innate,
      castingAnimation: ItemAbilityCastingAnimationEnum.Alteration,
      primaryType: ItemAbilityPrimaryTypeEnum.Transmuter,
      secondaryType: ItemAbilitySecondaryTypeEnum.NonCombat,
      spellLevel: 1,
      options: { renew: 1 },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.Caster,
          icon: "RR#FSPKP",
          range: 30,
          speed: 1,
          effects: [
            {
              opcode: EffectTypeEnum.CreateItemInSlot,
              slot: "SLOT_AMULET",
              resource: ITEMS.EntangleImmunity,
              timing: EffectTimingEnum.InstantLimited,
              duration: 60,
              dispelResistance:
                EffectDispelResistanceEnum.DispelBypassResistance,
            },
            {
              opcode: EffectTypeEnum.CharacterColorPulse,
              color: { red: 72, green: 243, blue: 102 },
              location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
              cycleSpeed: 30,
              timing: EffectTimingEnum.InstantLimited,
              duration: 1,
              dispelResistance:
                EffectDispelResistanceEnum.DispelBypassResistance,
            },
            {
              opcode: EffectTypeEnum.PlayVisualEffect,
              playWhere: EffectVisualEffectLocationEnum.OverTargetAttached,
              resource: "SPRMCURS",
              timing: EffectTimingEnum.InstantLimited,
              duration: 2,
              dispelResistance:
                EffectDispelResistanceEnum.DispelBypassResistance,
            },
          ],
        },
      ],
      ability: {
        spell: {
          type: "force",
        },
        disableInterrupt: true,
        triggers: [{ name: "CheckStatGT", params: ["Myself", 0, "ENTANGLE"] }],
        timer: { name: "speakWithPlants", value: 60 },
      },
    },
    ATWEAKS_SPELLS.SpeakWithPlants
  );

  /**
   * Entangle
   */
  entangle = this.addSpell(
    {
      name: "monster.fey.ability.entangle.name",
      description: "monster.fey.ability.entangle.description",
      icon: SPELLS.Entangle,
      castingSound: "CAS_P08",
      spellType: SpellTypeEnum.Innate,
      castingAnimation: ItemAbilityCastingAnimationEnum.Alteration,
      primaryType: ItemAbilityPrimaryTypeEnum.Transmuter,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      spellLevel: 1,
      options: {
        renew: 3,
      },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          projectile: {
            copyFromFile: "ENTANG2",
            name: "Hamadryad Entangle",
            areaEffectInfo: {
              areaProjectileFlags: [AreaProjectileEnum.AffectOnlyEnemies],
            },
          },
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.AnyPointWithinRange,
          range: 30,
          speed: 1,
          effects: [
            ...[...GARGANTUAN_CREATURES, ...INCORPOREAL_CREATURES].map(
              (c) =>
                <IdsEffect>{
                  opcode: EffectTypeEnum.UseEFFFile,
                  idsFile: c[0],
                  idsEntry: c[1],
                  timing: EffectTimingEnum.InstantLimited,
                  duration: 6,
                }
            ),
            {
              opcode: EffectTypeEnum.MovementRateBonus,
              type: EffectModifierTypeEnum.SetPercentOf,
              value: 50,
              ...entangleCommonEffect,
              saveTypes: undefined,
            },
            {
              opcode: EffectTypeEnum.MovementRateBonus,
              type: EffectModifierTypeEnum.Set,
              value: 0,
              ...entangleCommonEffect,
            },
            {
              opcode: EffectTypeEnum.Thac0Bonus,
              type: EffectModifierTypeEnum.Increment,
              value: -2,
              ...entangleCommonEffect,
            },
            {
              opcode: EffectTypeEnum.ArmorClassBonus,
              bonusTo: EffectBonusToEnum.AllWeapons,
              value: -2,
              ...entangleCommonEffect,
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "CRE_P01",
              ...entangleCommonEffect,
              duration: 1,
            },
            {
              opcode: EffectTypeEnum.PlaySound,
              resource: "EFF_M22A",
              ...entangleCommonEffect,
              timing: EffectTimingEnum.DelayPermanent,
            },
            {
              opcode: EffectTypeEnum.EntangleOverlay,
              ...entangleCommonEffect,
            },
            {
              opcode: EffectTypeEnum.DisplayPortraitIcon,
              icon: PortraitIconEnum.Entangled,
              ...entangleCommonEffect,
            },
          ],
        },
      ],
      ability: {
        preset: SPELLS.Entangle,
        spell: {
          type: "force",
        },
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.HamadryadEntangle
  );

  /**
   * Animal Friendship
   */
  animalFriendship = this.addSpell(
    {
      name: "monster.fey.ability.animalFriendship.name",
      description: "monster.fey.ability.animalFriendship.description",
      icon: SPELLS.CharmPersonOrAnimal,
      flags: [SpellFlagEnum.CastableWhenSilenced],
      castingSound: "CORAN03",
      spellType: SpellTypeEnum.Innate,
      primaryType: ItemAbilityPrimaryTypeEnum.Enchanter,
      secondaryType: ItemAbilitySecondaryTypeEnum.Disabling,
      spellLevel: 1,
      options: {
        renew: 1,
      },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.LivingActor,
          range: 30,
          speed: 1,
          effects: [
            {
              opcode: EffectTypeEnum.ProtectionFromResourceAndMessage,
              type: {
                stat: SpellProtectionStat.General,
                relation: SpellProtectionRelation.NotEqual,
              },
              value: "ANIMAL",
              resource: ATWEAKS_SPELLS.AnimalFriendship,
              ...animalFriendshipCommonEffect,
            },
            {
              opcode: EffectTypeEnum.CharmCreature,
              charmType: CharmTypeEnum.NeutralCharm,
              generalType: "ANIMAL",
              ...animalFriendshipCommonEffect,
            },
            {
              opcode: EffectTypeEnum.CharacterColorPulse,
              color: { red: 120, green: 90, blue: 30 },
              location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
              cycleSpeed: 25,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              ...animalFriendshipCommonEffect,
              duration: 1,
            },
            {
              opcode: EffectTypeEnum.PlayVisualEffect,
              playWhere: EffectVisualEffectLocationEnum.OverTargetAttached,
              resource: "SPNWCHRM",
              ...animalFriendshipCommonEffect,
              duration: 3,
            },
          ],
        },
      ],
      ability: {
        spell: {
          type: "force",
          probability: DEFAULT_SPELL_PROBABILITY,
        },
        targets: [
          {
            name: "Animals",
          },
        ],
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.AnimalFriendship
  );

  /**
   * Detect Traps
   */
  detectTraps = this.addSpell(
    {
      name: "monster.fey.ability.detectTraps.name",
      description: "monster.fey.ability.detectTraps.description",
      castingSound: "CAS_P04",
      flags: [SpellFlagEnum.OutdoorsOnly],
      spellType: SpellTypeEnum.Innate,
      castingAnimation: ItemAbilityCastingAnimationEnum.Divination,
      primaryType: ItemAbilityPrimaryTypeEnum.Diviner,
      secondaryType: ItemAbilitySecondaryTypeEnum.NonCombat,
      icon: SPELLS.FindTraps,
      options: {
        renew: 16,
      },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.Caster,
          speed: 1,
          projectile: "INAREANS",
          effects: [
            {
              opcode: EffectTypeEnum.FindTraps,
              duration: 96,
              target: EffectTargetEnum.Self,
            },
            {
              opcode: EffectTypeEnum.DisplayPortraitIcon,
              icon: PortraitIconEnum.DetectingTrapsIllusions,
              duration: 96,
              target: EffectTargetEnum.Self,
            },
            {
              opcode: EffectTypeEnum.LightingEffects,
              effect: LightingEffectEnum.DivinationWater,
              lightingTarget: LightingEffectTargetEnum.SpellTarget,
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              target: EffectTargetEnum.Self,
            },
            {
              opcode: EffectTypeEnum.CharacterColorPulse,
              color: { red: 70, green: 32, blue: 73 },
              location: EffectColorLocationEnum.ArmorGreyBeltAmulet,
              cycleSpeed: 20,
              duration: 2,
            },
          ],
        },
      ],
      ability: {
        spell: {
          resource: ATWEAKS_SPELLS.DetectSnaresAndPits,
          type: "force",
          probability: DEFAULT_SPELL_PROBABILITY,
        },
        disableInterrupt: true,
      },
    },
    ATWEAKS_SPELLS.DetectSnaresAndPits
  );

  // TODO: Quench Fire
  // You extinguish all fires in a 30-foot cube centered on a point you choose within range. Any nonmagical fire is put out automatically, as are magical flames created by a spell of 3rd level or lower.
  // For each spell of 4th level or higher which is creating flame within this area,  make an ability check using your spellcasting ability.
  // On a successful check, the spell that created the fire ends. Fire created by a magical item is also doused, and the item becomes unable to produce fire for 1d4 hours.

  /**
   * Blinding Beauty
   */
  blindingBeauty = this.addSpell(
    {
      name: "common.traits.blindsight.name",
      description: "monster.fey.ability.blindingBeauty.description",
      spellType: SpellTypeEnum.Innate,
      icon: SPELLS.BlindingBeauty,
      options: {
        renew: 1,
      },
      headers: [
        {
          type: ItemAbilityTypeEnum.Melee,
          location: ItemAbilityLocationEnum.Ability,
          target: ItemAbilityTargetEnum.Caster,
          projectile: ATWEAKS_SPELLS.BlindingBeauty,
          effects: [
            {
              opcode: EffectTypeEnum.PlayVisualEffect,
              target: EffectTargetEnum.Self,
              playWhere: EffectVisualEffectLocationEnum.OverTargetAttached,
              timing: EffectTimingEnum.InstantLimited,
              dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
              duration: 2,
              resource: "ICCLKFR2",
            },
            {
              opcode: EffectTypeEnum.UseEFFFile,
              idsFile: EffectIDSFileEnum.GENERAL,
              idsEntry: "HUMANOID",
              timing: EffectTimingEnum.InstantPermanentUntilDeath,
              dispelResistance: EffectDispelResistanceEnum.NaturalNonMagical,
              resource: ATWEAKS_SPELLS.BlindingBeauty,
            },
          ],
        },
      ],
      ability: {
        spell: {
          type: "reallyForce",
          selfTarget: true,
          excludeStateChecks: ["STATE_BLIND"],
        },
        targets: [
          {
            name: "NearestEnemies",
            triggers: [
              {
                name: "General",
                params: [GLOBAL_CONFIG.tokens.target, "HUMANOID"],
              },
            ],
          },
        ],
        noRoundTimer: true,
      },
    },
    ATWEAKS_SPELLS.BlindingBeauty
  );

  dryadAdditionalCode: AdditionalCode = {
    location: "trackTargets",
    triggers: [
      { name: "HaveSpellRES", params: [ATWEAKS_SPELLS.DryadCharmPerson] },
    ],
    actions: [],
  };
}
