import { RawPotionConfig } from "../src/model/raw/potion";

export const POTIONS: RawPotionConfig[] = [
  {
    files: ["POTN08"],
    triggers: [
      { name: "General", params: ["Myself", "UNDEAD"], negation: true },
    ],
    // actions: [{ name: "DisplayStringHead", params: ["Myself", 1] }],
  },
];
