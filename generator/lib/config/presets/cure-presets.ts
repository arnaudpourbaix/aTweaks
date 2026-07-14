import { ScriptTarget } from "../../src/model/constants";
import { AbilityPreset } from "../../src/model/misc";
import { DEFAULT_SPELL_PROBABILITY } from "../common";
import { SPELLS } from "../spell-names";

export const CURE_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.CureLightWounds.file,
    ability: {
      name: "ability.cureLightWounds",
      // selfTarget: without it, parseAbilitySpell() defaults an untargeted spell's cast target
      // to ScriptTarget.lastSeen - wrong for a HPPercentLT(myself, ...)-triggered self-heal,
      // which should always be cast on the caster.
      spell: { selfTarget: true },
      requireVocal: true,
      probability: DEFAULT_SPELL_PROBABILITY,
      triggers: [{ name: "HPPercentLT", params: [ScriptTarget.myself, 75] }],
    },
  },
];
