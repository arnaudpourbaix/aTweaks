import commonEn from "./en/common";
import monsterEn from "./en/monster";

export const lang = "en";

export const getKeys = (language: string) => {
  switch (language.substring(0, 2).toLowerCase()) {
    default:
    case "en":
      return { common: commonEn, monster: monsterEn };
  }
};
export const t = getKeys(lang);

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Paths<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K]>>
        : never;
    }[keyof T]
  : "";

type Leaves<T> = T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K]>> }[keyof T]
  : "";

export type TranslationKey = Leaves<typeof t>;

export const translation = (path: TranslationKey) => {
  let value = t as any;
  for (let i = 0, p = path.split("."), len = p.length; i < len; i++) {
    value = value[p[i]];
  }
  return value;
};
