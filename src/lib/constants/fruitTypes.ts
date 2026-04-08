export interface FruitType {
  code: string;
  ja: string;
  en: string;
  emoji: string;
}

export const FRUIT_TYPES: FruitType[] = [
  { code: "apple", ja: "りんご", en: "Apple", emoji: "🍎" },
  { code: "citrus", ja: "柑橘", en: "Citrus", emoji: "🍊" },
  { code: "berry", ja: "ベリー", en: "Berry", emoji: "🍓" },
  { code: "grape", ja: "ぶどう", en: "Grape", emoji: "🍇" },
  { code: "melon", ja: "メロン", en: "Melon", emoji: "🍈" },
  { code: "peach", ja: "桃", en: "Peach", emoji: "🍑" },
  { code: "pear", ja: "梨", en: "Pear", emoji: "🍐" },
  { code: "mango", ja: "マンゴー", en: "Mango", emoji: "🥭" },
  { code: "tropical", ja: "トロピカル", en: "Tropical", emoji: "🍍" },
  { code: "persimmon", ja: "柿", en: "Persimmon", emoji: "🟠" },
  { code: "fig", ja: "いちじく", en: "Fig", emoji: "🟣" },
  { code: "other", ja: "その他", en: "Other", emoji: "🍒" },
];

export function localizedFruitType(value: string | null, locale: string) {
  if (!value) return "";
  const match = FRUIT_TYPES.find(
    (f) => f.code === value || f.ja === value || f.en === value
  );
  if (!match) return value;
  return locale === "en" ? match.en : match.ja;
}
