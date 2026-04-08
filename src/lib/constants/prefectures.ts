export interface Prefecture {
  code: string;
  ja: string;
  en: string;
}

/** All 47 prefectures of Japan (north → south). */
export const PREFECTURES: Prefecture[] = [
  { code: "hokkaido", ja: "北海道", en: "Hokkaido" },
  { code: "aomori", ja: "青森県", en: "Aomori" },
  { code: "iwate", ja: "岩手県", en: "Iwate" },
  { code: "miyagi", ja: "宮城県", en: "Miyagi" },
  { code: "akita", ja: "秋田県", en: "Akita" },
  { code: "yamagata", ja: "山形県", en: "Yamagata" },
  { code: "fukushima", ja: "福島県", en: "Fukushima" },
  { code: "ibaraki", ja: "茨城県", en: "Ibaraki" },
  { code: "tochigi", ja: "栃木県", en: "Tochigi" },
  { code: "gunma", ja: "群馬県", en: "Gunma" },
  { code: "saitama", ja: "埼玉県", en: "Saitama" },
  { code: "chiba", ja: "千葉県", en: "Chiba" },
  { code: "tokyo", ja: "東京都", en: "Tokyo" },
  { code: "kanagawa", ja: "神奈川県", en: "Kanagawa" },
  { code: "niigata", ja: "新潟県", en: "Niigata" },
  { code: "toyama", ja: "富山県", en: "Toyama" },
  { code: "ishikawa", ja: "石川県", en: "Ishikawa" },
  { code: "fukui", ja: "福井県", en: "Fukui" },
  { code: "yamanashi", ja: "山梨県", en: "Yamanashi" },
  { code: "nagano", ja: "長野県", en: "Nagano" },
  { code: "gifu", ja: "岐阜県", en: "Gifu" },
  { code: "shizuoka", ja: "静岡県", en: "Shizuoka" },
  { code: "aichi", ja: "愛知県", en: "Aichi" },
  { code: "mie", ja: "三重県", en: "Mie" },
  { code: "shiga", ja: "滋賀県", en: "Shiga" },
  { code: "kyoto", ja: "京都府", en: "Kyoto" },
  { code: "osaka", ja: "大阪府", en: "Osaka" },
  { code: "hyogo", ja: "兵庫県", en: "Hyogo" },
  { code: "nara", ja: "奈良県", en: "Nara" },
  { code: "wakayama", ja: "和歌山県", en: "Wakayama" },
  { code: "tottori", ja: "鳥取県", en: "Tottori" },
  { code: "shimane", ja: "島根県", en: "Shimane" },
  { code: "okayama", ja: "岡山県", en: "Okayama" },
  { code: "hiroshima", ja: "広島県", en: "Hiroshima" },
  { code: "yamaguchi", ja: "山口県", en: "Yamaguchi" },
  { code: "tokushima", ja: "徳島県", en: "Tokushima" },
  { code: "kagawa", ja: "香川県", en: "Kagawa" },
  { code: "ehime", ja: "愛媛県", en: "Ehime" },
  { code: "kochi", ja: "高知県", en: "Kochi" },
  { code: "fukuoka", ja: "福岡県", en: "Fukuoka" },
  { code: "saga", ja: "佐賀県", en: "Saga" },
  { code: "nagasaki", ja: "長崎県", en: "Nagasaki" },
  { code: "kumamoto", ja: "熊本県", en: "Kumamoto" },
  { code: "oita", ja: "大分県", en: "Oita" },
  { code: "miyazaki", ja: "宮崎県", en: "Miyazaki" },
  { code: "kagoshima", ja: "鹿児島県", en: "Kagoshima" },
  { code: "okinawa", ja: "沖縄県", en: "Okinawa" },
];

export function localizedPrefecture(value: string | null, locale: string) {
  if (!value) return "";
  const match = PREFECTURES.find(
    (p) => p.code === value || p.ja === value || p.en === value
  );
  if (!match) return value;
  return locale === "en" ? match.en : match.ja;
}
