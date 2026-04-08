import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { fetchProfileByUsername, fetchProfileById } from "@/lib/data/profiles";
import { fetchListings } from "@/lib/data/listings";

interface SellerPageProps {
  params: Promise<{ locale: string; username: string }>;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function SellerPage({ params }: SellerPageProps) {
  const { locale, username } = await params;
  setRequestLocale(locale);

  const decoded = decodeURIComponent(username);
  const profile = UUID_RE.test(decoded)
    ? await fetchProfileById(decoded)
    : await fetchProfileByUsername(decoded);
  if (!profile) notFound();

  const t = await getTranslations("profile");
  const listings = await fetchListings({
    sellerId: profile.id,
    status: "active",
    limit: 48,
  });

  return (
    <div className="container py-10 space-y-8">
      <ProfileHeader profile={profile} locale={locale} />

      <section>
        <h2 className="mb-5 text-xl font-semibold tracking-tight">
          {t("sellingNow")}
        </h2>
        {listings.length > 0 ? (
          <ListingGrid listings={listings} />
        ) : (
          <EmptyState title={t("sellingNow")} description="—" />
        )}
      </section>
    </div>
  );
}
