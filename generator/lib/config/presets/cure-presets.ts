import { ScriptTarget } from "../../src/model/constants";
import { AbilityPreset } from "../../src/model/misc";
import { DEFAULT_SPELL_PROBABILITY } from "../common";
import { SPELLS } from "../spell-names";

export const CURE_PRESETS: AbilityPreset[] = [
  {
    preset: SPELLS.CureLightWounds.file,
    ability: {
      name: "ability.cureLightWounds",
      //TODO: target
      spell: {
        probability: DEFAULT_SPELL_PROBABILITY,
      },
      requireVocal: true,
      triggers: [{ name: "HPPercentLT", params: [ScriptTarget.myself, 75] }],
    },
  },
];
