import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { EmptyState } from "@/components/common/EmptyState";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { fetchListings } from "@/lib/data/listings";
import { searchProfiles } from "@/lib/data/profiles";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();

  const t = await getTranslations("search");

  if (!q) {
    return (
      <div className="container py-16">
        <EmptyState title={t("emptyQuery")} />
      </div>
    );
  }

  const [listings, users] = await Promise.all([
    fetchListings({ q, limit: 24, status: "active" }),
    searchProfiles(q),
  ]);

  return (
    <div className="container py-10 space-y-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("resultsFor", { q })}
        </h1>
      </header>

      <section>
        <h2 className="mb-5 text-lg font-semibold">{t("listingsSection")}</h2>
        {listings.length > 0 ? (
          <ListingGrid listings={listings} />
        ) : (
          <EmptyState title={t("noListings")} />
        )}
      </section>

      <section>
        <h2 className="mb-5 text-lg font-semibold">{t("usersSection")}</h2>
        {users.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((u) => (
              <Link
                key={u.id}
                href={u.username ? `/u/${u.username}` : `/u/${u.id}`}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white p-4 shadow-soft transition-colors hover:border-brand-200 hover:bg-brand-50"
              >
                <Avatar className="h-12 w-12">
                  {u.avatar_url ? (
                    <AvatarImage src={u.avatar_url} alt={u.display_name ?? ""} />
                  ) : null}
                  <AvatarFallback>
                    {(u.display_name ?? "?").slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {u.display_name ?? "—"}
                  </p>
                  {u.username ? (
                    <p className="truncate text-xs text-muted-foreground">
                      @{u.username}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title={t("noUsers")} />
        )}
      </section>
    </div>
  );
}
