import { getTranslations, setRequestLocale } from "next-intl/server";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { ListingFilters } from "@/components/listings/ListingFilters";
import { EmptyState } from "@/components/common/EmptyState";
import { fetchListings } from "@/lib/data/listings";

interface ListingsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    fruit_type?: string;
    prefecture?: string;
    sort?: "newest" | "price_asc" | "price_desc";
  }>;
}

export default async function ListingsPage({
  params,
  searchParams,
}: ListingsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("listing");

  const listings = await fetchListings({
    q: sp.q,
    fruitType: sp.fruit_type,
    prefecture: sp.prefecture,
    sort: sp.sort ?? "newest",
    limit: 48,
    status: "active",
  });

  return (
    <div className="container py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("browseTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("browseSubtitle")}
        </p>
      </header>

      <div className="mb-6">
        <ListingFilters
          defaultQ={sp.q}
          defaultFruitType={sp.fruit_type}
          defaultPrefecture={sp.prefecture}
          defaultSort={sp.sort ?? "newest"}
        />
      </div>

      {listings.length > 0 ? (
        <ListingGrid listings={listings} />
      ) : (
        <EmptyState title={t("noResults")} />
      )}
    </div>
  );
}
