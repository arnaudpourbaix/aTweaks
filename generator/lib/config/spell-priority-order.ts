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

// Hand-tune this list directly to change cast order - AbilityOrderService sorts every
// auto-derived registry-spell ability by each spell's index here.
export const SPELL_PRIORITY_ORDER: string[] = [
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
].map((p) => p.preset);
