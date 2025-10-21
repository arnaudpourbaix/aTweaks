export const en = {
  ankheg: {
    name: "Ankheg",
    acidicEnzymes: {
      name: "Acidic Enzymes",
      description:
        "The ankheg can secret acidic digestive enzymes to cause an additional 1d4 points of damage per round until the victim is dissolved (truncated to 4 rounds).",
    },
  },
};
export type TranslationKeys = typeof en;

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];

type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : "";

type MyGenericType<T extends object> = {
  keys: Array<Paths<T>>;
};

const test: MyGenericType<typeof en> = {
  keys: ["ankheg.acidicEnzymes.description", "ankheg.name"],
};
