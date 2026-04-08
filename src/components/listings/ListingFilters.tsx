"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FRUIT_TYPES } from "@/lib/constants/fruitTypes";
import { PREFECTURES } from "@/lib/constants/prefectures";

interface ListingFiltersProps {
  defaultQ?: string;
  defaultFruitType?: string;
  defaultPrefecture?: string;
  defaultSort?: string;
}

export function ListingFilters({
  defaultQ = "",
  defaultFruitType = "",
  defaultPrefecture = "",
  defaultSort = "newest",
}: ListingFiltersProps) {
  const t = useTranslations("listing");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    const params = new URLSearchParams();
    const q = String(formData.get("q") ?? "").trim();
    const fruit = String(formData.get("fruit_type") ?? "");
    const pref = String(formData.get("prefecture") ?? "");
    const sort = String(formData.get("sort") ?? "newest");
    if (q) params.set("q", q);
    if (fruit) params.set("fruit_type", fruit);
    if (pref) params.set("prefecture", pref);
    if (sort && sort !== "newest") params.set("sort", sort);
    router.push(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      action={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-border/60 bg-white p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-5"
    >
      <Input
        name="q"
        defaultValue={defaultQ}
        placeholder={tCommon("search")}
        className="lg:col-span-2"
      />
      <Select name="fruit_type" defaultValue={defaultFruitType}>
        <option value="">{t("filterAll")}</option>
        {FRUIT_TYPES.map((f) => (
          <option key={f.code} value={f.code}>
            {f.emoji} {locale === "en" ? f.en : f.ja}
          </option>
        ))}
      </Select>
      <Select name="prefecture" defaultValue={defaultPrefecture}>
        <option value="">{t("filterAll")}</option>
        {PREFECTURES.map((p) => (
          <option key={p.code} value={p.code}>
            {locale === "en" ? p.en : p.ja}
          </option>
        ))}
      </Select>
      <div className="flex gap-2">
        <Select name="sort" defaultValue={defaultSort} className="flex-1">
          <option value="newest">{t("sortNewest")}</option>
          <option value="price_asc">{t("sortPriceAsc")}</option>
          <option value="price_desc">{t("sortPriceDesc")}</option>
        </Select>
        <Button type="submit">{tCommon("search")}</Button>
      </div>
    </form>
  );
}
