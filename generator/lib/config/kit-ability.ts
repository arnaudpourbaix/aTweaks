import { KitAbilityConfig } from "../src/model/raw/kit-ability";
import { SPELLS } from "./spell";

export const KIT_ABILITIES: KitAbilityConfig[] = [
  {
    name: "Enrage",
    files: [SPELLS.Enrage],
    triggers: [
      {
        name: "CheckSpellState",
        params: ["Myself", "STATE_ENRAGED"],
        negation: true,
      },
    ],
  },
];
