import { Leaves } from "../src/model/utility-types";
import commonEn from "./en/common";
import monsterEn from "./en/monster";

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
      return { common: commonEn, monster: monsterEn };
  }
};

const t = getTranslationKeys("english"); // typings is based on reference language
export type TranslationKey = Leaves<typeof t>;

export const LANG: Language = "english";
