import heDict from "./dictionaries/he.json";

export type Language = "he" | "en";

// Derive the dot-path union of every leaf string in the Hebrew dictionary.
// `t('common.buy')` is type-checked; `t('common.nope')` is a compile error.
// Hebrew is the source of truth — English must match its shape.
type LeafPaths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends object
      ? LeafPaths<T[K], `${Prefix}${K}.`>
      : never;
}[keyof T & string];

export type TranslationKey = LeafPaths<typeof heDict>;
export type Dictionary = typeof heDict;
