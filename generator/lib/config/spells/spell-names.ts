import { SpellIdentifier } from "../../src/model/ids/spell";

export interface SpellReference {
  file: string;
  id?: SpellIdentifier;
  duration?:
    | "long" // several hours
    | "mid" // several turns
    | "short"; // several rounds to one turn
}

const WIZARD_SPELLS = {
  AgannazarScorcher: { file: "SPWI217", id: "WIZARD_AGANNAZAR_SCORCHER" },
  Blur: { file: "SPWI201", id: "WIZARD_BLUR", duration: "mid" },
  Breach: { file: "SPWI513", id: "WIZARD_BREACH" },
  BurningHands: { file: "SPWI103", id: "WIZARD_BURNING_HANDS" },
  ChainLightning: { file: "SPWI615", id: "WIZARD_CHAIN_LIGHTNING" },
  CharmPerson: { file: "SPWI104", id: "WIZARD_CHARM_PERSON" },
  ChromaticOrb: { file: "SPWI118", id: "WIZARD_CHROMATIC_ORB" },
  Cloudkill: { file: "SPWI502", id: "WIZARD_CLOUDKILL" },
  ColorSpray: { file: "SPWI105", id: "WIZARD_COLOR_SPRAY" },
  Combust: { file: "SPWI232", id: "WIZARD_COMBUST" },
  ConeOfCold: { file: "SPWI503", id: "WIZARD_CONE_OF_COLD" },
  Confusion: { file: "SPWI401", id: "WIZARD_CONFUSION" },
  Darkness15Radius: { file: "SPWI228", id: "WIZARD_DARKNESS_15_FOOT" },
  DetectInvisibility: { file: "SPWI203", id: "WIZARD_DETECT_INVISIBILITY" },
  DireCharm: { file: "SPWI316", id: "WIZARD_DIRE_CHARM" },
  DimensionDoor: { file: "SPWI402", id: "WIZARD_DIMENSION_DOOR" },
  DispelMagicWizard: { file: "SPWI326", id: "WIZARD_TRUE_DISPEL_MAGIC" },
  Domination: { file: "SPWI506", id: "WIZARD_DOMINATION" },
  Emotion: { file: "SPWI411", id: "WIZARD_EMOTION_HOPELESSNESS" },
  Feeblemind: { file: "SPWI509", id: "WIZARD_FEEBLEMIND" },
  Fireburst: { file: "SPWI523", id: "WIZARD_SUN_FIRE" },
  FireShield: {
    file: "SPWI418",
    id: "WIZARD_FIRE_SHIELD_RED",
    duration: "short",
  },
  FlameArrow: { file: "SPWI303", id: "WIZARD_FLAME_ARROW" },
  FleshToStone: { file: "SPWI604", id: "WIZARD_FLESH_TO_STONE" },
  Glitterdust: { file: "SPWI224", id: "WIZARD_GLITTERDUST" },
  GreaterMalison: { file: "SPWI412", id: "WIZARD_GREATER_MALISON" },
  Haste: { file: "SPWI305", id: "WIZARD_HASTE", duration: "mid" },
  HoldPersonWizard: { file: "SPWI306", id: "WIZARD_HOLD_PERSON" },
  Horror: { file: "SPWI205", id: "WIZARD_HORROR" },
  IceStorm: { file: "SPWI404", id: "WIZARD_ICE_STORM" },
  ImprovedInvisibility: {
    file: "SPWI405",
    id: "WIZARD_IMPROVED_INVISIBILITY",
    duration: "short",
  },
  Invisibility: {
    file: "SPWI206",
    id: "WIZARD_INVISIBILITY",
  },
  LightningBolt: { file: "SPWI308", id: "WIZARD_LIGHTNING_BOLT" },
  MagicMissiles: { file: "SPWI112", id: "WIZARD_MAGIC_MISSILE" },
  MelfAcidArrow: { file: "SPWI211", id: "WIZARD_MELF_ACID_ARROW" },
  MinorGlobeOfInvulnerability: {
    file: "SPWI406",
    id: "WIZARD_MINOR_GLOBE_OF_INVULNERABILITY",
    duration: "mid",
  },
  MinorSpellDeflection: {
    file: "SPWI318",
    id: "WIZARD_MINOR_SPELL_DEFLECTION",
    duration: "mid",
  },
  MirrorImages: { file: "SPWI212", id: "WIZARD_MIRROR_IMAGE", duration: "mid" },
  MordenkainenForceMissiles: {
    file: "SPWI431",
    id: "WIZARD_MORDENKAINENS_FORCE_MISSILES",
  },
  ObscuringMist: { file: "SPWI106", id: "WIZARD_OBSCURING_MIST" },
  PolymorphSelf: { file: "SPWI416", id: "WIZARD_POLYMORPH_SELF" },
  PowerWordSleep: { file: "SPWI220", id: "WIZARD_POWER_WORD_SLEEP" },
  PowerWordBlind: { file: "SPWI815", id: "WIZARD_POWER_WORD_BLIND" },
  PowerWordKill: { file: "SPWI912", id: "WIZARD_POWER_WORD_KILL" },
  PowerWordStun: { file: "SPWI715", id: "WIZARD_POWER_WORD_STUN" },
  ProtectionFromMissiles: {
    file: "SPWI311",
    id: "WIZARD_PROTECTION_FROM_NORMAL_MISSILES",
    duration: "short",
  },
  ProtectionFromMagicalWeapons: {
    file: "SPWI611",
    id: "WIZARD_PROTECTION_FROM_MAGIC_WEAPONS",
    duration: "short",
  },
  RemoveMagic: { file: "SPWI302", id: "WIZARD_REMOVE_MAGIC" },
  ShapeshiftMustardJelly: {
    file: "SPWI496",
    id: "WIZARD_POLYMORPH_MUSTARD_JELLY",
  },
  Shield: { file: "SPWI114", id: "WIZARD_SHIELD", duration: "mid" },
  ShadowDoor: { file: "SPWI505", id: "WIZARD_SHADOW_DOOR" },
  Sleep: { file: "SPWI116", id: "WIZARD_SLEEP" },
  Slow: { file: "SPWI312", id: "WIZARD_SLOW" },
  SpellThrust: { file: "SPWI321", id: "WIZARD_SPELL_THRUST" },
  Spook: { file: "SPWI125", id: "WIZARD_SPOOK" },
  StinkingCloud: { file: "SPWI213", id: "WIZARD_STINKING_CLOUD" },
  Stoneskin: { file: "SPWI408", id: "WIZARD_STONE_SKIN", duration: "long" },
  TeleportField: { file: "SPWI421", id: "WIZARD_TELEPORT_FIELD" },
  VitriolicSphere: { file: "SPWI426", id: "WIZARD_VITRIOLIC_SPHERE" },
  Vocalize: {
    file: "SPWI219",
    id: "WIZARD_VOCALIZE",
    duration: "short",
  },
  WailOfTheBanshee: { file: "SPWI913", id: "WIZARD_WAIL_OF_THE_BANSHEE" },
  Web: { file: "SPWI215", id: "WIZARD_WEB" },
} satisfies Record<string, SpellReference>;

const PRIEST_SPELLS = {
  AerialServant: { file: "SPPR601", id: "CLERIC_AERIAL_SERVANT" },
  AnimalSummoning4: {
    file: "SPPR402",
    // id: "CLERIC_ANIMAL_SUMMONING_1" // id depends on installed mods (can be 1 or 4)
  },
  AnimateDead: { file: "SPPR301", id: "CLERIC_ANIMATE_DEAD" },
  Barkskin: { file: "SPPR202", id: "CLERIC_BARKSKIN", duration: "mid" },
  BladeBarrier: { file: "SPPR603", id: "CLERIC_BLADE_BARRIER", duration: "short" },
  Bless: { file: "SPPR101", id: "CLERIC_BLESS", duration: "mid" },
  BlindingBeauty: { file: "SPPR704", id: "CLERIC_NATURE_BEAUTY" },
  CallLightning: { file: "SPPR302", id: "CLERIC_CALL_LIGHTNING" },
  CauseSeriousWounds: { file: "SPPR414", id: "CLERIC_CAUSE_SERIOUS_WOUNDS" },
  CallWoodlandBeeings: { file: "SPPR410", id: "CLERIC_CALL_WOODLAND_BEINGS" },
  CloudOfPestilence: { file: "SPPR424", id: "CLERIC_CLOUD_OF_PESTILENCE" },
  Chant: {
    file: "SPPR203",
    id: "CLERIC_CHANT",
    duration: "short",
  },
  Chaos: { file: "SPPR709", id: "CLERIC_CONFUSION" },
  CharmPersonOrAnimal: { file: "SPPR204", id: "CLERIC_CHARM_PERSON" },
  CloakOfFear: { file: "SPPR416", id: "CLERIC_CLOAK_OF_FEAR" },
  Command: { file: "SPPR102", id: "CLERIC_COMMAND" },
  CureLightWounds: { file: "SPPR103", id: "CLERIC_CURE_LIGHT_WOUNDS" },
  DispelMagicCleric: { file: "SPPR303", id: "CLERIC_DISPEL_MAGIC" },
  DolorousDecay: { file: "SPPR610", id: "CLERIC_DOLOROUS_DECAY" },
  Doom: { file: "SPPR113", id: "CLERIC_DOOM" },
  DrawUponHolyMight: { file: "SPPR214", id: "CLERIC_DRAW_UPON_HOLY_MIGHT", duration: "short" },
  Entangle: { file: "SPPR105", id: "CLERIC_ENTANGLE" },
  FindTraps: { file: "SPPR205", id: "CLERIC_FIND_TRAPS" },
  FingerOfDeath: { file: "SPPR708", id: "CLERIC_FINGER_OF_DEATH" },
  FlameStrike: { file: "SPPR503", id: "CLERIC_FLAME_STRIKE" },
  GlyphOfWarding: { file: "SPPR304", id: "CLERIC_GLYPH_OF_WARDING" },
  GreaterCommand: { file: "SPPR512", id: "CLERIC_GREATER_COMMAND" },
  Harm: { file: "SPPR608", id: "CLERIC_HARM" },
  HoldPersonCleric: { file: "SPPR208", id: "CLERIC_HOLD_PERSON" },
  HoldPersonOrAnimal: { file: "SPPR305", id: "CLERIC_HOLD_ANIMAL" },
  HolyPower: { file: "SPPR412", id: "CLERIC_HOLY_POWER", duration: "short" },
  Ironskin: { file: "SPPR506", id: "CLERIC_IRONSKIN", duration: "long" },
  MagicResistance: {
    file: "SPPR509",
    id: "CLERIC_MAGIC_RESISTANCE",
    duration: "short",
  },
  MassCauseLightWounds: {
    file: "SPPR530",
    id: "CLERIC_MASS_CAUSE_LIGHT_WOUNDS",
  },
  MentalDomination: { file: "SPPR405", id: "CLERIC_MENTAL_DOMINATION" },
  MiscastMagic: { file: "SPPR310", id: "CLERIC_MISCAST_MAGIC" },
  Poison: { file: "SPPR411", id: "CLERIC_POISON" },
  ProtectionFromLightning: { file: "SPPR407", id: "CLERIC_PROTECTION_FROM_LIGHTNING" },
  ResistFear: { file: "SPPR108", id: "CLERIC_REMOVE_FEAR", duration: "mid" },
  RighteousMagic: { file: "SPPR513", id: "CLERIC_RIGHTEOUS_MAGIC", duration: "short" },
  RigidThinking: { file: "SPPR311", id: "CLERIC_RIGID_THINKING" },
  Sanctuary: { file: "SPPR109", id: "CLERIC_SANCTUARY" },
  Silence: { file: "SPPR211", id: "CLERIC_SILENCE_15_FOOT" },
  SlayLiving: { file: "SPPR511", id: "CLERIC_SLAY_LIVING" },
  SummonInsects: { file: "SPPR319", id: "CLERIC_SUMMON_INSECTS" },
  SymbolDeath: { file: "SPPR719", id: "CLERIC_SYMBOL_DEATH" },
  TrueSeeing: { file: "SPPR505", id: "CLERIC_TRUE_SIGHT" },
  UnholyBlight: { file: "SPPR314", id: "CLERIC_UNHOLY_BLIGHT" },
  WavesOfAgony: { file: "SPPR533", id: "CLERIC_WAVES_OF_AGONY" },
  Wither: { file: "SPPR740", id: "CLERIC_WITHER" },
} satisfies Record<string, SpellReference>;

const INNATE_SPELLS = {
  MephitColorSpray: { file: "SPIN937", id: "MEPHIT_COLOR_SPRAY" },
  SpiderSingleTargetWeb: { file: "BDSPIDGA" },
  VortexWeb: { file: "SPIN575", id: "VORTEX_WEB" },
} satisfies Record<string, SpellReference>;

const CLASS_SPELLS = {
  BerserkerRage: { file: "SPCL321", id: "BERSERKER_RAGE" },
  BarbarianRage: { file: "SPCL152", id: "BARBARIAN_RAGE" },
  OffensiveSpin: { file: "SPCL521", id: "BLADE_OFFENSIVE_SPIN" },
} satisfies Record<string, SpellReference>;

export const SPELLS = {
  Wizard: WIZARD_SPELLS,
  Priest: PRIEST_SPELLS,
  Class: CLASS_SPELLS,
  Innate: INNATE_SPELLS,
};

export function getAllSpells() {
  return { ...WIZARD_SPELLS, ...PRIEST_SPELLS, ...CLASS_SPELLS, ...INNATE_SPELLS };
}
