import { Leaves } from "../src/model/utility-types";
import commonEn from "./en/common";
import monsterEn from "./en/monster";

export const getTranslationKeys = (language: string) => {
  switch (language.substring(0, 2).toLowerCase()) {
    default:
    case "en":
      return { common: commonEn, monster: monsterEn };
  }
};

const t = getTranslationKeys("en"); // typings is based on reference language
export type TranslationKey = Leaves<typeof t>;

export const LANG = "en";
