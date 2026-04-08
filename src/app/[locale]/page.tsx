import { getTranslations, setRequestLocale } from "next-intl/server";
import { Sprout } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { SearchBar } from "@/components/search/SearchBar";
import { EmptyState } from "@/components/common/EmptyState";
import { fetchListings } from "@/lib/data/listings";
import { FRUIT_TYPES } from "@/lib/constants/fruitTypes";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tNav = await getTranslations("nav");
  const tListing = await getTranslations("listing");

  const listings = await fetchListings({ limit: 12, status: "active" });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <div className="container py-16 sm:py-20 lg:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-medium text-brand-700 shadow-soft">
              <Sprout className="h-3.5 w-3.5" />
              {t("heroSubtitle")}
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-br from-brand-600 to-brand-500 bg-clip-text text-transparent">
                {t("heroTitle")}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 w-full">
              <SearchBar size="lg" />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <Button asChild size="lg">
                <Link href="/dashboard/listings/new">{t("heroCta")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/listings">{tNav("browse")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-10">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            {t("categoriesHeading")}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FRUIT_TYPES.slice(0, 9).map((f) => (
            <Link
              key={f.code}
              href={{ pathname: "/listings", query: { fruit_type: f.code } }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white px-4 py-2 text-sm shadow-soft transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              <span className="text-base">{f.emoji}</span>
              <span>{locale === "en" ? f.en : f.ja}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="container pb-16 pt-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {t("featuredHeading")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("featuredSubheading")}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/listings">{t("viewAll")} →</Link>
          </Button>
        </div>
        {listings.length > 0 ? (
          <ListingGrid listings={listings} />
        ) : (
          <EmptyState
            title={tListing("noListings")}
            description={t("featuredSubheading")}
            action={
              <Button asChild>
                <Link href="/dashboard/listings/new">{t("heroCta")}</Link>
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}
