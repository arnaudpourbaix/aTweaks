import { SpellGroup } from "../src/model/raw/item-spell-group";

export const SPELL_GROUPS: SpellGroup[] = [
  {
    name: "blind",
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
      // Added:
      "sppr313.spl", // SpellPack b6
      "sppr614c.spl", // SpellPack b6
      "sppr614d.spl", // SpellPack b6
      "spwi224c.spl", // SpellPack b6
      "halb06.spl", // IR/IRR
      "sw1h51.spl", // IR/IRR
      "wand19.spl", // IR/IRR
    ],
  },
];
