import { en } from "./en";

export const lang = "en";
export const getKeys = (language: string) => {
  switch (language.substring(0, 2).toLowerCase()) {
    default:
    case "en":
      return en;
  }
};
export const t = getKeys(lang);
