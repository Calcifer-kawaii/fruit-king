import { setRequestLocale, getTranslations } from "next-intl/server";
import { ListingForm } from "@/components/listings/ListingForm";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

interface NewListingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewListingPage({ params }: NewListingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("listing");
  const current = (await getCurrentUser())!;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("createTitle")}
      </h1>
      <ListingForm userId={current.userId} locale={locale} />
    </div>
  );
}
