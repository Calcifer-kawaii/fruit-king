import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ListingForm } from "@/components/listings/ListingForm";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { fetchListingById } from "@/lib/data/listings";

interface EditListingPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditListingPage({
  params,
}: EditListingPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("listing");
  const current = (await getCurrentUser())!;
  const listing = await fetchListingById(id);
  if (!listing || listing.seller_id !== current.userId) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t("editTitle")}</h1>
      <ListingForm userId={current.userId} locale={locale} initial={listing} />
    </div>
  );
}
