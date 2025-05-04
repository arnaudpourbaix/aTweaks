import { EffectTypeEnum } from "../src/model/final/effect.type";
import { PortraitIconEnum } from "../src/model/final/enums";
import { MISSILE_WEAPONS } from "../src/model/ids/projectile";
import { RawEffect } from "../src/model/raw/effect";
import { RawImmunityConfig } from "../src/model/raw/immunity";
import { StringRefUtils } from "../src/services/string-ref.utils";
import { AIR_CREATURES, WATER_CREATURES } from "./creatures";
import { ITEMS } from "./item";
import { ATWEAKS_SPELLS } from "./spell";

export const IMMUNITIES: RawImmunityConfig[] = [
  {
    name: "poison",
    type: "immunity",
    description: ["Poison immunity"],
    preventEffects: [EffectTypeEnum.Poison],
    preventIcons: [PortraitIconEnum.Poisoned],
    displayIcons: [PortraitIconEnum.ProtectionFromPoison],
    strings: StringRefUtils.getStringIds("poison"),
    effects: [
      {
        opcode: "PoisonResistanceModifier",
        value: 100,
      },
      {
        opcode: "SetExtendedSpellState",
        state: "ITEM_POISON",
      },
    ],
    spells: [
      "SPWI016", // Cloudkill (trap)
      "SPWI502", // Cloudkill
      "dvckill", // Cloudkill (IR/SR)
      "SPIN979", // Golem Gas Cloud
      "SPIN642", // Poisonous Cloud
      ATWEAKS_SPELLS.Cloudkill,
      ATWEAKS_SPELLS.SpiderPoisonClassF,
      ATWEAKS_SPELLS.WraithSpiderPoisonClassF,
    ],
  },
  {
    name: "disease",
    type: "immunity",
    description: ["Disease immunity"],
    preventEffects: [EffectTypeEnum.Disease],
    preventIcons: [PortraitIconEnum.Diseased],
    strings: StringRefUtils.getStringIds("disease"),
    idsSpells: [
      { id: "CLERIC_CAUSE_DISEASE" }, // Cause Disease (IWDification)
    ],
    spells: [
      "SPWI409", // Contagion
      ATWEAKS_SPELLS.CauseDisease,
      ATWEAKS_SPELLS.PitFiendDisease,
      ATWEAKS_SPELLS.GhoulLordDisease,
      ATWEAKS_SPELLS.MummyDisease,
      ATWEAKS_SPELLS.GreaterMummyDisease,
      ATWEAKS_SPELLS.ZombieSeaDisease,
      ATWEAKS_SPELLS.SporeExplosionDisease,
      ATWEAKS_SPELLS.BoaliskDisease,
    ],
  },
  {
    name: "bleeding",
    type: "immunity",
    description: ["Bleeding immunity"],
    preventIcons: [PortraitIconEnum.Bleeding],
    strings: StringRefUtils.getStringIds("bleed"),
    spells: [ATWEAKS_SPELLS.Bleeding],
  },
  {
    name: "abilityDrain",
    type: "immunity",
    description: ["Ability drain immunity"],
    preventEffects: [
      EffectTypeEnum.IntelligenceBonus,
      EffectTypeEnum.DexterityBonus,
      EffectTypeEnum.StrengthBonus,
      EffectTypeEnum.ConstitutionBonus,
    ],
    strings: StringRefUtils.getStringIds("rigidThinking"),
  },
  {
    name: "hold",
    type: "immunity",
    description: ["Hold immunity"],
    preventEffects: [EffectTypeEnum.Paralyze, EffectTypeEnum.Hold],
    preventIcons: [PortraitIconEnum.Held],
    spells: [
      "SPPR208", // Hold Person
      "SPWI306", // Hold Person
    ],
    strings: StringRefUtils.getStringIds("held"),
    animations: ["SPFLAYER", "SPMINDAT"],
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "HOLD_IMMUNITY",
      },
    ],
  },
  {
    name: "stun",
    type: "immunity",
    description: ["Stun immunity"],
    preventEffects: [EffectTypeEnum.Stun, EffectTypeEnum.Stun90HP],
    preventIcons: [PortraitIconEnum.Stun],
    strings: StringRefUtils.getStringIds("stun"),
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "STUN_IMMUNITY",
      },
    ],
  },
  {
    name: "energyDrain",
    type: "immunity",
    description: ["Energy drain immunity"],
    preventEffects: [EffectTypeEnum.LevelDrain],
    strings: StringRefUtils.getStringIds("levelDrain"),
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "ITEM_LEVELDRAIN",
      },
    ],
  },
  {
    name: "sleep",
    type: "immunity",
    description: ["Sleep immunity"],
    preventEffects: [EffectTypeEnum.Sleep, EffectTypeEnum.Sleep20HP],
    preventIcons: [PortraitIconEnum.Sleep, PortraitIconEnum.Unconscious],
    strings: StringRefUtils.getStringIds("sleep"),
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "SLEEP_IMMUNITY",
      },
    ],
  },
  {
    name: "charm",
    type: "immunity",
    description: ["Charm immunity"],
    preventEffects: [
      EffectTypeEnum.CharmCreature,
      EffectTypeEnum.CharmControlCreature,
    ],
    preventIcons: [
      PortraitIconEnum.Charm,
      PortraitIconEnum.DireCharm,
      PortraitIconEnum.Domination,
    ],
    strings: StringRefUtils.getStringIds("charm"),
    animations: ["SPNWCHRM"],
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "CHARM_IMMUNITY",
      },
    ],
  },
  {
    name: "fear",
    type: "immunity",
    description: ["Fear immunity"],
    preventEffects: [
      EffectTypeEnum.Panic,
      EffectTypeEnum.MoraleModifier,
      EffectTypeEnum.MoraleBreakModifier,
    ],
    preventIcons: [PortraitIconEnum.Panic],
    strings: StringRefUtils.getStringIds("panic"),
    animations: ["CDHORROR"],
    idsSpells: [
      { id: "WIZARD_EMOTION_FEAR" }, // SpellPack Charm plants
    ],
    spells: [
      "SPIN203", // Cloak of Fear
      "SPIN536", // Fear
      "SPIN807", // Salyer Fear
      "SPIN882", // Vampire Fear
      "SPIN890", // Demon Fear
      "SPIN895", // Dragon Fear
      "SPIN981", // Fear
      "SPPR416", // Cloak of Fear
      "SPPR706", // Symbol, Fear
      "SPWI125", // Spook
      "SPWI205", // Horror
      "SPWI811", // Symbol, Fear
      "SPWI899", // Symbol, Fear
      "SPWI956", // Symbol, Fear
      "SPWM123", // Symbol, Fear
      "dw#licfi", // Fear Aura
      "ca#sfear", // Symbol, Fear
      "A^causfr", // Cause Fear
      "DVFEARSM", // Panic
      "DVHORRO", // Panic
      ATWEAKS_SPELLS.Fear1,
      ATWEAKS_SPELLS.Fear2,
      ATWEAKS_SPELLS.Fear3,
      ATWEAKS_SPELLS.CauseFear,
      ATWEAKS_SPELLS.AuraOfFear1,
      ATWEAKS_SPELLS.AuraOfFear2,
      ATWEAKS_SPELLS.BlastOfFear,
      ATWEAKS_SPELLS.CloakOfFear,
      ATWEAKS_SPELLS.SymbolFear,
    ],
    displaySpellIneffective: true,
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "RESIST_FEAR",
      },
      {
        opcode: "SetExtendedSpellState",
        state: "PANIC_IMMUNITY",
      },
    ],
  },
  {
    name: "fatigue",
    type: "immunity",
    description: ["Fatigue immunity"],
    preventEffects: [EffectTypeEnum.FatigueBonus],
    preventIcons: [],
    strings: [],
    spells: [
      "SPWI508", // Waves of Fatigue
    ],
    displaySpellIneffective: true,
  },
  {
    name: "confusion",
    type: "immunity",
    description: ["Confusion immunity"],
    preventEffects: [EffectTypeEnum.Confusion],
    preventIcons: [PortraitIconEnum.Confused],
    strings: StringRefUtils.getStringIds(["rigidThinking", "confusion"]),
    animations: ["SPCONFUS"],
    spells: [
      "SPPR709", // Confusion (priest version)
      "SPWI401", // Confusion (wizard version)
      "SPIN582", // Confusion
      "SPIN704", // Confusion
      "SPIN839", // Confusion
      "SPIN976", // Confusion
      "SPPR983", // Confusion
      "MISC3M", // Confusion (Divine Remix)
      "A#SHA07", // Confusion (Divine Remix)
      ATWEAKS_SPELLS.Confusion,
    ],
    displaySpellIneffective: true,
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "CONFUSION_IMMUNITY",
      },
    ],
  },
  {
    name: "magicMissile",
    type: "immunity",
    description: ["Magic missiles immunity"],
    idsSpells: [
      {
        id: "WIZARD_MORDENKAINENS_FORCE_MISSILES",
        suffixes: ["", "B"],
      }, // Mordenkainen's Force Missiles (IWDification)
    ],
    spells: [
      "SPWI003", // Magic Missile
      "SPWI112", // Magic Missile
      ATWEAKS_SPELLS.MagicMissile,
    ],
    displaySpellIneffective: true,
  },
  {
    name: "blindness",
    type: "immunity",
    description: ["Blindness immunity"],
    preventEffects: [EffectTypeEnum.Blindness],
    preventIcons: [PortraitIconEnum.Blind],
    idsSpells: [
      { id: "CLERIC_CLOUD_OF_PESTILENCE" }, // Sunscorch (IWDification)
      { id: "CLERIC_SUNSCORCH" }, // Cloud of Pestilence (IWDification)
    ],
    spells: [
      "spdr101.spl", // Chromatic Orb
      "spin595.spl", // Yellow Dragon Scorching Sand
      "spin878.spl", // Level Drain
      "spin893.spl", // Shadow Dragon Breath
      "spin929.spl", // Mist Ball
      "spin931.spl", // Sooty Ball
      "sppr704.spl", // Nature's Beauty
      "sppr707.spl", // Sunray
      "spwi106.spl", // Blindness
      "spwi118.spl", // Chromatic Orb
      "spwi224.spl", // Glitterdust
      "spwi714.spl", // Prismatic Spray
      "spwi815.spl", // Power Word, Blind
      "spwi958.spl", // Power Word, Blind
      "spwm178.spl", // Blindness
      "chalcy2.itm", // The Shadow's Blade +3
      "gorwom4.itm", // Drow Flail +3
      "halb06.itm", // Blackmist +4
      "sorb.itm", // Searing Orb
      "sw1h51.itm", // Celestial Fury +3
      "wand19.itm", // Wand of Cursing
    ],
  },
  {
    name: "fireSpells",
    type: "immunity",
    description: ["Fire spells immunity"],
    idsSpells: [
      { id: "WIZARD_BELTYNS_BURNING_BLOOD" }, // Beltyn's Burning Blood (IWDification)
      { id: "WIZARD_SHROUD_OF_FLAME" }, // Shroud of Flame (IWDification)
      { id: "CLERIC_SUNSCORCH" }, // Sunscorch (IWDification)
      { id: "CLERIC_PRODUCE_FIRE" }, // Produe Fire (IWDification)
      { id: "CLERIC_WALL_OF_FIRE" }, // Wall of Fire (SpellPack)
    ],
    spells: [
      "SPIN561", // Fire Giant Lava Pit (FIRE_GIANT_LAVA)
      "SPIN819", // Lava Burst (LAVA_BURST)
      "SPWI022", // Lava Pit (TRAP_MUCK)
      "SPWI103", // Burning Hands
      "SPIN131", // Burning Hands
      "SPWI217", // Agannazar's Scorcher
      "SPWI940", // Agannazar's Scorcher
      "SPWI304", // Fireball
      "DVFBALL", // Fireball (IRR + SRR)
      "SPIN160", // Breath Fireball
      "SPWI001", // Fireball
      "SPWI957", // Fireball
      "WAND05", // Fireball (IRR)
      "SPWI523", // Sunfire
      "CDSLSUN", // Sunfire (mod)
      "A#KOS09", // Sunfire (Divine Remix)
      "SPWI712", // Delayed Blast Fireball
      "A#KOS14", // Delayed Blast Fireball (Divine Remix)
      "SPWI810", // Incendiary Cloud
      "DW#TRPIN", // Incendiary Cloud (Stratagems)
      "SPWI911", // Meteor Swarm
      "SPWI922", // Dragon's Breath
      "SPIN719", // Meteor Swarm
      "SPWISH24", // Meteor Swarm
      "DW#TRPMS", // Meteor Swarm (Stratagems)
      "SPPR705", // Fire Storm
      "CA#FSTOM", // Fire Storm (PnP Deva)
      ATWEAKS_SPELLS.PitFiendFireball,
      ATWEAKS_SPELLS.BurningHand,
      ATWEAKS_SPELLS.SunfireBlazingGloryBuckler,
      ATWEAKS_SPELLS.FireStorm,
      ATWEAKS_SPELLS.FlameFan,
      ATWEAKS_SPELLS.FlameJet,
      ATWEAKS_SPELLS.HeatAura,
      ATWEAKS_SPELLS.HeatEmission,
      ATWEAKS_SPELLS.ImixHeatEmission,
      ATWEAKS_SPELLS.ImixFireball,
      ATWEAKS_SPELLS.ZaamanRulFireball,
      ATWEAKS_SPELLS.Burn,
      ATWEAKS_SPELLS.Engulf,
      ATWEAKS_SPELLS.WallOfFire,
      ATWEAKS_SPELLS.FireBreath,
    ],
  },
  {
    name: "coldSpells",
    type: "immunity",
    description: ["Cold spells immunity"],
    idsSpells: [
      { id: "WIZARD_OTILUKES_FREEZING_SPHERE" }, // Otiluke's Freezing Sphere (IWDification)
      { id: "WIZARD_SNILLOCS_SNOWBALL_SWARM" }, // Snilloc's Snowball Swarm (IWDification)
      { id: "WIZARD_ICELANCE" }, // Icelance (IWDification)
    ],
    spells: [
      "SPWI404", // Ice Storm
      "SPWI503", // Cone of Cold
      "d1#wi503", // Cone of Cold (mod)
      "DVCONEC", // Cone of Cold (IR)
      "SPCRYO01", // Cone of Cold (mod)
      "SPIN133", // Cone of Cold (mod)
      "SPIN158", // Cone of Cold (mod)
      "SPIN162", // Cone of Cold (mod)
      "SPIN833", // Dragon Cone of Cold
      "WAND06", // Cone of Cold (IR)
      ATWEAKS_SPELLS.IceStorm,
      ATWEAKS_SPELLS.ConeOfCold,
      ATWEAKS_SPELLS.WallOfIce,
      ATWEAKS_SPELLS.Freeze,
      ATWEAKS_SPELLS.IceStorn,
    ],
  },
  {
    name: "electricalSpells",
    type: "immunity",
    description: ["Electrical spells immunity"],
    idsSpells: [
      { id: "CLERIC_STATIC_CHARGE" }, // Static Charge (IWDification)
    ],
    spells: [
      "CDSTAF12", // Lightning Bolt
      "SPCL722", // Lightning Bolt
      "SPIN579", // Lightning Bolt
      "SPIN714", // Lightning Bolt
      "SPIN932", // Lightning Bolt
      "SPIN933", // Lightning Bolt
      "SIN989", // Lightning Bolt
      "SPWI002", // Lightning Bolt
      "SPWI017", // Minor Lightning Bolt
      "SPWI025", // Minor Lightning Bolt
      "SPWI026", // Minor Lightning Bolt
      "SPWI027", // Minor Lightning Bolt
      "SPWI308", // Lightning Bolt
      "SPWI399", // Lightning Bolt
      "SPWI997", // Lightning Bolt
      ATWEAKS_SPELLS.LightningBolt,
      "SPDR601", // Chain Lightning
      "SPWI615", // Chain Lightning
      "SPBLUN29", // Chain Lightning
      "SPPR302", // Call Lightning
      "SPPR987", // Call Lightning
      "SPIN597", // Blue Dragon Lightning Breath
    ],
  },
  {
    name: "acidSpells",
    type: "immunity",
    description: ["Acid spells immunity"],
    idsSpells: [
      { id: "WIZARD_VITRIOLIC_SPHERE" }, // Vitriolic Sphere (IWDification)
      { id: "WIZARD_ACID_STORM" }, // Acid Storm (IWDification)
    ],
    spells: [
      "SPIN994", // Acid Pools in Durlag's Tower (ACID_DAMAGE_1)
      "SPWI614", // Death Fog
      "A#CYR11", // Death Fog (Divine Remix)
      "SPIN596", // Brown Dragon Acid Breath
      "SPIN691", // Black Dragon Breath
      "SPIN913", // Mimic Acid
    ],
  },
  {
    name: "cureSpells",
    type: "immunity",
    description: ["Cure spells immunity"],
    idsSpells: [
      { id: "CLERIC_CAUSE_MODERATE_WOUNDS" }, // Cause moderate Wounds (IWDification)
      { id: "CLERIC_CURE_MODERATE_WOUNDS" }, // Cure moderate Wounds  (IWDification)
      { id: "CLERIC_CAUSE_LIGHT_WOUNDS" }, // Cause Light Wounds (IWDification)
      { id: "CLERIC_CAUSE_MEDIUM_WOUNDS" }, // Cause medium Wounds (IWDification)
      { id: "CLERIC_MASS_CAUSE_LIGHT_WOUNDS" }, // Mass Cause Light Wounds (IWDification)
      { id: "CLERIC_CURE_MEDIUM_WOUNDS" }, // Cure Medium Wounds  (Spell Revisions)
    ],
    spells: [
      "SPPR103", // Cure Light Wounds
      "A#JUSTCL", // Cure Light Wounds (Divine Remix)
      "ca#culw", // Cure Light Wounds (PnP Deva)
      "L#KORIEP", // Cure Light Wounds (mod)
      "A7Q6CURE", // Cure Light Wounds (afaaq)
      "SPPR401", // Cure Serious Wounds
      "CA#CURSW", // Cure Serious Wounds (PnP Deva)
      "SPIN200", // Cure Serious Wounds
      "SPIN958", // Cure Serious Wounds
      "SPPR404", // Neutralize Poison
      "cdilnps", // Neutralize Poison (mod)
      "scrl08", // Neutralize Poison (IR)
      "SPIN201", // Neutralize Poison
      "SPPR502", // Cure Critical Wounds
      "SPPR514", // Mass Cure
      "A#RE11", // Mass Cure (Divine Remix)
      "DVMCURE", // Mass Cure (IR/SR)
      "SPPR607", // Heal
      "SPWM168", // Heal (Wild Mage)
      "SPWISH39", // Heal
      "spin711", // Heal
      "spin679", // Heal
      "SPIN101", // Cure Light Wounds (Bhaalpower)
      "FINP101", // Cure Light Wounds (TOB Bhaalpower Ascension)
      "SPIN202", // Cause Serious Wounds
      "SPIN551", // Cause Serious Wounds (Hive Mother)
      "SPIN986", // Cause Serious Wounds (Beholder)
      "SPPR414", // Cause Serious Wounds
      "SPPR510", // Cause critical Wounds
      "SPCL211", // Paladin Lay On Hands
      "BHAAL1A", // Mass Healing (Bhaalpower restored by Ascension/UB)
      "sppr608", // Harm
      "sppr699", // Harm
      ATWEAKS_SPELLS.CureLightWounds,
      ATWEAKS_SPELLS.TempleMassCure,
      ATWEAKS_SPELLS.MarilithCauseSeriousWounds,
      ATWEAKS_SPELLS.CauseSeriousWounds,
      ATWEAKS_SPELLS.CauseCriticalWounds,
      ATWEAKS_SPELLS.Harm,
    ],
    displaySpellIneffective: true,
  },
  {
    name: "cloudSpells",
    type: "immunity",
    description: ["Cloud spells immunity"],
    idsSpells: [
      { id: "CLERIC_CLOUD_OF_PESTILENCE" }, // Cloud of Pestilence (IWDification)
    ],
    spells: [
      "SPWI004", // Stinking Cloud (trap)
      "SPWI016", // Cloudkill (trap)
      "SPWI213", // Stinking Cloud
      "SPWI502", // Cloudkill
      "SPWI614", // Death Fog
      "A#CYR11", // Death Fog (Divine Remix)
      "SPWI810", // Incendiary Cloud
      "DW#TRPIN", // Incendiary Cloud (Stratagems)
      "SPIN673", // Cloudkill
      "dvckill", // Cloudkill (IR/SR)
      "SPIN940", // Stinking Cloud (mephit)
      "SPIN979", // Golem Gas Cloud
      "SPIN642", // Poisonous Cloud
      ATWEAKS_SPELLS.Cloudkill,
      ATWEAKS_SPELLS.WallOfFog,
      ATWEAKS_SPELLS.FogCloud,
      ATWEAKS_SPELLS.ToxicVapors,
      ATWEAKS_SPELLS.OozeStinkingCloud,
      ATWEAKS_SPELLS.SolidFog,
      ATWEAKS_SPELLS.StinkingCloud,
    ],
    displaySpellIneffective: true,
  },
  {
    name: "web",
    type: "immunity",
    description: ["Web immunity"],
    preventEffects: [EffectTypeEnum.Web],
    preventIcons: [PortraitIconEnum.Webbed],
    spells: [
      "SPDR201", // Web (druid version)
      "SPIN566", // Mimic Web
      "SPIN575", // Vortex web
      "SPIN683", // Web Tangle
      "SPWI215", // Web (wizard version)
      "D0SPIWEB", // Web (D0QUESTPACK)
      "ETTERWEB", // Web (heartwood)
      "spletter", // Web (heartwood)
      "wand14", // Web (IR/IRR)
      "wtpin05", // Web (wtp familiar)
      ATWEAKS_SPELLS.WebTangle,
      ATWEAKS_SPELLS.WraithWeb,
      ATWEAKS_SPELLS.Web,
    ],
    displaySpellIneffective: true,
  },
  {
    name: "entangle",
    type: "immunity",
    description: ["Entangle immunity"],
    preventEffects: [EffectTypeEnum.EntangleOverlay],
    preventIcons: [PortraitIconEnum.Entangled],
    idsSpells: [
      { id: "WIZARD_CHARM_PLANTS" }, // Charm plants (SpellPack)
    ],
    spells: [
      "SPPR105", // Entangle (Priest)
      "SPWM111", // Entangle (Wild Mage)
      "SPIN688", // Plant Growth (Black Dragon)
      "BDBOW06", // Entangle (Hamadryad SoD ?)
      ATWEAKS_SPELLS.ShamblerEntangle,
      ATWEAKS_SPELLS.HamadryadEntangle,
    ],
    displaySpellIneffective: true,
    itemSlot: { file: ITEMS.EntangleImmunity, slot: "AMULET" },
  },
  {
    name: "insectSpells",
    type: "immunity",
    description: ["Insect spells immunity"],
    spells: [
      "SPPR319", // Summon Insects
      "SPPR517", // Insect Plague
      "SPPR717", // Creeping Doom
      "SPIN689", // Summon Insects (Black Dragon)
      "DW#VBAT1", // Bat Cloud (SCSII)
      "DW#VBAT2", // Bat Cloud (SCSII)
      "CA#IPLAG", // Insect Plague (PnP Deva)
      "U#HFDTPD", // Insect Plague (Ruad)
    ],
    //TODO: why: LPF ADD_IMMUNITY_CRE_ITM_SPL STR_VAR spells duration=120 resist_dispel=3 power=3 displaySpellIneffective=1 END
    displaySpellIneffective: true,
  },
  {
    name: "petrification",
    type: "immunity",
    description: ["Petrification immunity"],
    preventEffects: [EffectTypeEnum.Petrification],
    strings: StringRefUtils.getStringIds("petrified"),
    spells: [
      "SPWI604", // Flesh to Stone
      "SPWI604D", // Flesh to Stone
    ],
    displaySpellIneffective: true,
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "PETRIFY_IMMUNITY",
      },
    ],
  },
  {
    name: "missileWeapons",
    type: "immunity",
    description: ["Missile weapons immunity"],
    effects: MISSILE_WEAPONS.map((w) => ({
      opcode: "ProtectionFromProjectile",
      projectile: w,
    })),
  },
  {
    name: "polymorph",
    type: "immunity",
    description: ["Polymorph immunity"],
    //preventEffects: [EffectTypeEnum.PolymorphIntoSpecific], // not used anymore
    preventIcons: [PortraitIconEnum.Polymorphed],
    strings: StringRefUtils.getStringIds("polymorph"),
    spells: [
      "SPIN538", // Polymorph Other
      "SPWI415", // Polymorph Other
      "CA#PAOO", // Polymorph Other (Pnp Celestial)
    ],
    displaySpellIneffective: true,
  },
  {
    name: "vorpal",
    type: "immunity",
    description: ["Vorpal immunity"],
    preventEffects: [EffectTypeEnum.KillTarget, EffectTypeEnum.Slay],
    strings: StringRefUtils.getStringIds("death"),
  },
  {
    name: "earthquake",
    type: "immunity",
    description: ["Earthquake spells immunity"],
    spells: [
      "SPOGRE01", // Earthquake (Ogremoch)
      "SPPR720", // Earthquake (Priest version)
      "CA#EQ", // Earthquake (PnP Deva)
      "CDTLQAK", // Earthquake (mod)
      ATWEAKS_SPELLS.Earthquake,
      ATWEAKS_SPELLS.RockToMud,
    ],
    displaySpellIneffective: true,
  },
  {
    name: "cold",
    type: "immunity",
    description: ["Cold and magical cold immunity"],
    effects: [
      {
        opcode: "ColdResistanceModifier",
        value: 100,
        type: "Set",
      },
      {
        opcode: "MagicalColdResistanceModifier",
        value: 100,
        type: "Set",
      },
    ],
  },
  {
    name: "physical",
    type: "immunity",
    description: ["All physical damage"],
    effects: [
      {
        opcode: "SlashingResistanceModifier",
        value: 100,
        type: "Set",
      },
      {
        opcode: "PiercingResistanceModifier",
        value: 100,
        type: "Set",
      },
      {
        opcode: "MissilesResistanceModifier",
        value: 100,
        type: "Set",
      },
      {
        opcode: "CrushingResistanceModifier",
        value: 100,
        type: "Set",
      },
    ],
  },
  {
    name: "unturnable",
    type: "immunity",
    description: ["Turn undead immunity"],
    effects: [{ opcode: "ImmunityToTurnUndead" }],
  },
  {
    name: "illusion",
    type: "immunity",
    description: ["Illusion spells immunity"],
    spells: [
      "sppr704", //Nature's beauty
      "spwi106", //Blindness
      "IKDB2", //Spook (mod)
      "spwi125", //Spook
      "spwi223", //Deafness
      "spwm178", //Blindness (Wild mage)
    ],
    displaySpellIneffective: true,
  },
  {
    name: "necromancyEffects",
    type: "immunity",
    description: ["Necromancy effects immunity"],
    immunities: ["cureSpells"],
    spells: [
      "sppr313", // Holy Smite
      "sppr314", // Unholy Blight
      "spwi117", // Chill Touch
      "spwi117d", // Chill Touch
      "spwi119", // Larloch's Minor Drain
      "spwi221", // Ray of Enfeeblement
      "spwi313", // Skull Trap
      "spwi314", // Vampiric Touch
      "spwi812", // Abi-Dalzim's Horrid Wilting
      "spwi812d", // Abi-Dalzim's Horrid Wilting
      "spwi914", // Larloch's Energy Drain
    ],
    displaySpellIneffective: true,
  },
  {
    name: "deathEffects",
    type: "immunity",
    description: ["Death effects immunity"],
    preventEffects: [
      EffectTypeEnum.DeathKill60HP,
      EffectTypeEnum.KillTarget,
      EffectTypeEnum.Slay,
    ],
    effects: [
      {
        opcode: "SetExtendedSpellState",
        state: "DEATH_IMMUNITY",
      },
    ],
  },
  {
    name: "deathSpell",
    type: "immunity",
    description: ["Death spell immunity"],
    spells: [
      "SPWI605", // Death Spell
      "cdxvdth", // Death Spell (mod)
    ],
    displaySpellIneffective: true,
  },
  {
    name: "mindSpells",
    type: "immunity",
    description: [
      "Immunity to mind-affecting spells and abilities (charms, compulsions, phantasms, patterns, and morale effects)",
    ],
    preventEffects: [EffectTypeEnum.Berserk],
    immunities: ["charm", "fear", "confusion", "illusion", "hold", "stun"],
  },
  {
    name: "hover",
    type: "trait",
    itemSlot: { file: ITEMS.Hover, slot: "BOOTS" },
    description: [
      "Hover (flight)",
      "This effectively prevents ground-based spells such as Earthquake, Entangle, Grease and Web from affecting the creature.",
      "Furthermore, creatures with this ability can cross lava and acid pools without taking damage by hovering above them",
    ],
    immunities: ["entangle", "web"],
    spells: [
      "SPIN561", // Fire Giant Lava Pit (FIRE_GIANT_LAVA)
      "SPIN819", // Lava Burst (LAVA_BURST)
      "SPIN994", // Acid Pools in Durlag's Tower (ACID_DAMAGE_1)
      "SPWI022", // Lava Pit (TRAP_MUCK)
      "SPIN914", // Mimic Glue
      "SPOGRE01", // Earthquake (Ogremoch)
      "SPPR720", // Earthquake (Priest version)
      "rr#equa", // Earthquake (aTweaks)
      "CA#EQ", // Earthquake (PnP Deva)
      "CDTLQAK", // Earthquake (mod)
      "SPWI101", // Grease
      "rr#r2mud", // Rock to mud spell (Dao)
    ],
    displaySpellIneffective: true,
  },
  {
    name: "normalWeapons",
    type: "immunity",
    description: ["Immunity to normal weapons"],
    effects: [
      { opcode: "ProtectionFromWeapons", type: "NonMagical", enchantment: 0 },
    ],
  },
  {
    name: "backstab",
    type: "immunity",
    description: ["Immunity to backstab"],
    effects: [{ opcode: "ProtectionFromBackstab" }],
  },
  {
    name: "criticalHit",
    type: "immunity",
    itemSlot: { file: ITEMS.CriticalHitImmunity, slot: "HELMET" },
    description: ["Immunity to critical hits"],
  },
  {
    name: "devourBrain",
    type: "immunity",
    description: ["Immunity to Devour Brain ability (Mind Flayer)"],
    preventEffects: [EffectTypeEnum.IntelligenceBonus],
  },
  {
    name: "construct",
    type: "trait",
    itemSlot: { file: ITEMS.Construct, slot: "LRING" },
    description: [
      "Construct trait.",
      "Immunity to poison, sleep effects, paralysis, stunning, disease, death effects, necromancy effects, mind-affecting spells and abilities (charms, compulsions, phantasms, patterns, and morale effects).",
      "Not subject to critical hits, backstab, nonlethal damage, ability damage, ability drain, fatigue, exhaustion, energy drain, flesh to Stone, insect Plague and similar spells.",
      "Darkvision out to 60 feet.",
    ],
    immunities: [
      "poison",
      "sleep",
      "hold",
      "bleeding",
      "stun",
      "disease",
      "deathEffects",
      "necromancyEffects",
      "mindSpells",
      "backstab",
      "criticalHit",
      "backstab",
      "abilityDrain",
      "energyDrain",
      "fatigue",
      "petrification",
      "insectSpells",
      "infravision",
    ],
  },
  {
    name: "elemental",
    type: "trait",
    description: [
      "Immunity to poison, sleep effects, paralysis, bleeding, and stunning.",
      "Not subject to critical hits or backstab. Due to their unique physiology, elementals are not subject to the Mind Flayers' Devour Brain attack.",
      "They are also unaffected by Flesh to Stone, Insect Plague and similar spells. Darkvision out to 60 feet.",
    ],
    immunities: [
      "poison",
      "sleep",
      "hold",
      "bleeding",
      "stun",
      "criticalHit",
      "backstab",
      "devourBrain",
      "petrification",
      "insectSpells",
      "infravision",
    ],
  },
  {
    name: "airAffinity",
    type: "trait",
    description: [
      "Creatures with this trait receive a +1 bonus to hit and a +4 bonus to damage when fighting airborne opponents.",
    ],
    effects: AIR_CREATURES.map(([f, e]): RawEffect[] => [
      {
        opcode: "DamageVsCreatureTypeModifier",
        idsFile: f,
        idsEntry: e,
        special: 4,
      },
      {
        opcode: "Thac0VsCreatureTypeModifier",
        idsFile: f,
        idsEntry: e,
        special: 1,
      },
    ]).flat(),
  },
  {
    name: "earthAffinity",
    type: "trait",
    description: [
      "Creatures with this trait receive a -2 penalty to hit and damage when fighting airborne and waterborne opponents. They are also unaffected by the Earthquake spell.",
    ],
    immunities: ["earthquake"],
    effects: [...AIR_CREATURES, ...WATER_CREATURES]
      .map(([f, e]): RawEffect[] => [
        {
          opcode: "DamageVsCreatureTypeModifier",
          idsFile: f,
          idsEntry: e,
          special: -2,
        },
        {
          opcode: "Thac0VsCreatureTypeModifier",
          idsFile: f,
          idsEntry: e,
          special: -2,
        },
      ])
      .flat(),
  },
  {
    name: "skeletal",
    type: "trait",
    itemSlot: { file: ITEMS.Sketetal, slot: "RRING" },
    description: [
      "Skeletal undead suffer no damage from cold-based attacks. Due to their bony frames, edged and piercing weapons inflict only half damage.",
    ],
    immunities: ["cold", "coldSpells"],
    effects: [
      {
        opcode: "SlashingResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "MissilesResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "PiercingResistanceModifier",
        value: 50,
        type: "Set",
      },
    ],
  },
  {
    name: "extraplanar",
    type: "trait",
    description: [
      "Extraplanar creatures are immune to Death Spell and are unaffected by all Cure and Cause Wound spells including Heal and Harm.",
    ],
    immunities: ["cureSpells", "deathSpell"],
  },
  {
    name: "plant",
    type: "trait",
    description: ["Plants' traits"],
    immunities: [
      "mindSpells",
      "poison",
      "sleep",
      "hold",
      "polymorph",
      "stun",
      "criticalHit",
      "backstab",
      "disease",
      "bleeding",
      "petrification",
      "insectSpells",
      "entangle",
    ],
  },
  {
    name: "infravision",
    type: "trait",
    description: ["Infravision"],
    effects: [{ opcode: "Infravision" }],
  },
  {
    name: "seeInvisible",
    type: "trait",
    description: ["See invisible creatures"],
    effects: [{ opcode: "InvisibilityDetection" }],
  },
  {
    name: "fireballSpell",
    type: "immunity",
    description: ["Fireball spell immunity"],
    spells: [
      "BDBLOWUP",
      "BDDAUSTO",
      "BDKORLAS",
      "BDMORLIS",
      "c0ausp03",
      "SPWI001",
      "SPWI304",
      "SPIN957",
      "wand05a",
    ],
    displaySpellIneffective: true,
  },
  {
    name: "lightningBoltSpell",
    type: "immunity",
    description: ["Lightning Bolt spell immunity"],
    spells: [
      "b_tal10",
      "c0dm302",
      "spcl722",
      "spdr301",
      "spin714",
      "spin933",
      "spin989",
      "SPWI002",
      "SPWI017",
      "SPWI231",
      "SPWI308",
      "SPWI399",
      "SPWI997",
      "wand07",
    ],
    displaySpellIneffective: true,
  },
  {
    name: "flameArrowSpell",
    type: "immunity",
    description: ["Flame Arrow spell immunity"],
    spells: ["d5f2303", "d5p2303", "d5p2303W", "d5y391i", "SPWI303", "SPWI888"],
    displaySpellIneffective: true,
  },
  {
    name: "incorporeal",
    itemSlot: { file: ITEMS.Incorporeal, slot: "RRING" },
    type: "trait",
    description: [
      "An incorporeal creature has no physical body.",
      "",
      "Immune to backstab and critical hits",
      "Immune to all nonmagical attacks.",
      "Has a 50% resistance to every damages.",
      "Deflection bonus (+3 AC).",
      "Attacks pass through armor (+4 THAC0).",
      "Do not set off traps that are triggered by weight. (not implemented)",
    ],
    immunities: ["backstab", "criticalHit"],
    effects: [
      {
        opcode: "Translucency",
        amount: 99,
        type: "DrawInstantly",
      },
      {
        opcode: "SetColorGlowPulse",
        color: { red: 125, green: 125, blue: 125 },
        location: "CharacterColor",
        cycleSpeed: 30,
      },
      {
        opcode: "CreatureRGBColorFade",
        color: { red: 90, green: 30, blue: 90 },
        fadeSpeed: 25,
      },
      { opcode: "NoCollisionDetection", passWalls: true },
      { opcode: "ModifyCollisionBehavior" },
      { opcode: "OverrideCreatureData", field: "PersonalSpace", value: 0 },
      { opcode: "MakeUnselectable", disableDialog: false },
      // { opcode: "SelectionCircleRemoval" },
      {
        opcode: "ProtectionFromWeapons",
        enchantment: 0,
        type: "NonMagical",
      },
      {
        opcode: "DisplayPortraitIcon",
        icon: "Invulnerable",
      },
      {
        opcode: "ArmorClassBonus",
        value: 3,
        bonusTo: "AllWeapons",
      },
      {
        opcode: "Thac0Bonus",
        value: 4,
        type: "Increment",
      },
      {
        opcode: "FireResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "MagicalFireResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "ColdResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "MagicalColdResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "ElectricityResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "AcidResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "MagicDamageResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "SlashingResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "CrushingResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "PiercingResistanceModifier",
        value: 50,
        type: "Set",
      },
      {
        opcode: "MissilesResistanceModifier",
        value: 50,
        type: "Set",
      },
      { opcode: "PoisonResistanceModifier", value: 50 },
    ],
  },
];
