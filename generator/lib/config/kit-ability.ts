import { KitAbilityConfig } from "../src/model/raw/kit-ability";
import { SPELLS } from "./spell-names";

export const KIT_ABILITIES: KitAbilityConfig[] = [
  {
    name: "Enrage",
    files: [SPELLS.BerserkerRage],
    triggers: [
      {
        name: "CheckSpellState",
        params: ["Myself", "STATE_ENRAGED"],
        negation: true,
      },
    ],
  },
];
