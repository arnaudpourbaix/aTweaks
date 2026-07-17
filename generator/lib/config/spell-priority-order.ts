import { SPELLS } from "./spells/spell-names";
import { FNP_SPELLS } from "./spells/fnp-spell-names";
import { BUFF_PRESETS } from "./presets/buff-presets";
import { CURE_PRESETS } from "./presets/cure-presets";
import { CHARM_PRESETS } from "./presets/charm-presets";
import { CONFUSION_PRESETS } from "./presets/confusion-presets";
import { DISABLING_PRESETS } from "./presets/disabling-presets";
import { HOLD_PRESETS } from "./presets/hold-presets";
import { SLEEP_PRESETS } from "./presets/sleep-presets";
import { FEAR_PRESETS } from "./presets/fear-presets";
import { DEBUFF_PRESETS } from "./presets/debuff-presets";
import { DAMAGE_PRESETS } from "./presets/damage-presets";
import { DAMAGE_AOE_PRESETS } from "./presets/damage-aoe-presets";
import { DEATH_PRESETS } from "./presets/death-presets";
import { DISPEL_PRESETS } from "./presets/dispel-presets";
import { SUMMON_PRESETS } from "./presets/summon-presets";

// Greater Mummy's hand-tuned cast order (the most-scrutinized spellbook in the mod) seeds the
// default - everything else is appended below, unsorted, for manual arrangement over time.
const GREATER_MUMMY_ORDER: string[] = [
  FNP_SPELLS.Priest.GreaterMalison.file,
  SPELLS.Priest.Sanctuary.file,
  SPELLS.Priest.FingerOfDeath.file,
  SPELLS.Priest.Wither.file,
  SPELLS.Priest.DolorousDecay.file,
  SPELLS.Priest.Harm.file,
  SPELLS.Priest.MagicResistance.file,
  FNP_SPELLS.Priest.SummonShadows.file,
  FNP_SPELLS.Priest.Chaos.file,
  FNP_SPELLS.Priest.CloudOfPestilence.file,
  SPELLS.Priest.MassCauseLightWounds.file,
  FNP_SPELLS.Priest.Shades.file,
  SPELLS.Priest.SlayLiving.file,
  SPELLS.Priest.WavesOfAgony.file,
  SPELLS.Priest.GreaterCommand.file,
  FNP_SPELLS.Priest.Emotion.file,
  SPELLS.Priest.Poison.file,
  FNP_SPELLS.Priest.WavesOfFatigue.file,
  FNP_SPELLS.Priest.DemiShadowMonsters.file,
  FNP_SPELLS.Priest.CauseCriticalWounds.file,
  FNP_SPELLS.Priest.AnimateDead.file,
  SPELLS.Priest.AnimateDead.file,
  FNP_SPELLS.Priest.CircleOfBones.file,
  FNP_SPELLS.Priest.ShadowMonsters.file,
  FNP_SPELLS.Priest.CauseSeriousWounds.file,
  FNP_SPELLS.Priest.Shield.file,
  SPELLS.Priest.SymbolDeath.file,
  SPELLS.Priest.AerialServant.file,
  SPELLS.Priest.BladeBarrier.file,
  SPELLS.Priest.TrueSeeing.file,
  SPELLS.Priest.RighteousMagic.file,
  SPELLS.Priest.FlameStrike.file,
  SPELLS.Priest.HolyPower.file,
  SPELLS.Priest.MentalDomination.file,
  SPELLS.Priest.DrawUponHolyMight.file,
  SPELLS.Priest.ProtectionFromLightning.file,
  SPELLS.Priest.Bless.file,
  SPELLS.Priest.Chant.file,
  SPELLS.Priest.Silence.file,
  SPELLS.Priest.HoldPerson.file,
  SPELLS.Priest.DispelMagic.file,
  SPELLS.Priest.UnholyBlight.file,
  SPELLS.Priest.GlyphOfWarding.file,
  SPELLS.Priest.CauseSeriousWounds.file,
  FNP_SPELLS.Priest.RigidThinking.file,
  FNP_SPELLS.Priest.Forbiddance.file,
  FNP_SPELLS.Priest.Shatter.file,
  FNP_SPELLS.Priest.CauseDisease.file,
  FNP_SPELLS.Priest.Doom.file,
  SPELLS.Priest.Command.file,
];

const REMAINING_PRESET_FILES: string[] = [
  ...BUFF_PRESETS,
  ...CURE_PRESETS,
  ...CHARM_PRESETS,
  ...CONFUSION_PRESETS,
  ...DISABLING_PRESETS,
  ...HOLD_PRESETS,
  ...SLEEP_PRESETS,
  ...FEAR_PRESETS,
  ...DEBUFF_PRESETS,
  ...DAMAGE_PRESETS,
  ...DAMAGE_AOE_PRESETS,
  ...DEATH_PRESETS,
  ...DISPEL_PRESETS,
  ...SUMMON_PRESETS,
]
  .map((p) => p.preset)
  .filter((file) => !GREATER_MUMMY_ORDER.includes(file));

// Hand-tune this list directly to change cast order - AbilityOrderService sorts every
// auto-derived registry-spell ability by each spell's index here.
export const SPELL_PRIORITY_ORDER: string[] = [...GREATER_MUMMY_ORDER, ...REMAINING_PRESET_FILES];
