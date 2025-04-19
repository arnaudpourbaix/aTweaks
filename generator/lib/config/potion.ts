import { RawPotionConfig } from "../src/model/raw/potion";

export const POTIONS: RawPotionConfig[] = [
  {
    name: "Potion of extra healing (40hp)",
    files: ["POTN55"],
    triggers: [
      { name: "General", params: ["Myself", "UNDEAD"], negation: true },
      { name: "HPPercentLT", params: ["Myself", 30] },
    ],
  },
  {
    name: "Potion of extra healing (30hp)",
    files: ["POTN52"],
    triggers: [
      { name: "General", params: ["Myself", "UNDEAD"], negation: true },
      { name: "HPPercentLT", params: ["Myself", 40] },
    ],
  },
  {
    name: "Exilir of health (10hp)",
    files: ["POTN08"],
    triggers: [
      { name: "General", params: ["Myself", "UNDEAD"], negation: true },
      { name: "HPPercentLT", params: ["Myself", 75] },
    ],
  },
  {
    name: "Potion of healing (10hp)",
    files: ["POTN08"],
    triggers: [
      { name: "General", params: ["Myself", "UNDEAD"], negation: true },
      { name: "HPPercentLT", params: ["Myself", 75] },
    ],
  },
  {
    name: "Potion of speed",
    files: ["POTN14"],
    triggers: [{ name: "RandomNumLT", params: [888, 100] }],
  },
];
