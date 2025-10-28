import { Leaves } from "../src/model/utility-types";
import commonEn from "./en/common";
import monsterEn from "./en/monster";
import spellEn from "./en/spell";
import itemEn from "./en/item";
import descriptionEn from "./en/description";

export const LANGUAGES = [
  "english",
  "french",
  "german",
  "italian",
  "polish",
  "russian",
  "spanish",
] as const;
export type Language = (typeof LANGUAGES)[number];

export const getTranslationKeys = (language: Language) => {
  switch (language) {
    default:
    case "english":
      return {
        common: commonEn,
        monster: monsterEn,
        spell: spellEn,
        description: descriptionEn,
        item: itemEn,
      };
  }
};

const t = getTranslationKeys("english"); // typings is based on reference language
export type TranslationKey = Leaves<typeof t>;

export const LANG: Language = "english";
