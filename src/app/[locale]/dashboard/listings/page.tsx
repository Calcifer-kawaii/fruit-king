import { setRequestLocale, getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { fetchOwnListings } from "@/lib/data/listings";
import { formatPrice } from "@/lib/utils";
import { DeleteListingButton } from "./DeleteListingButton";

interface OwnListingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OwnListingsPage({
  params,
}: OwnListingsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("listing");
  const tCommon = await getTranslations("common");
  const tStatus = await getTranslations("listingStatus");
  const tEmpty = await getTranslations("empty");
  const tNav = await getTranslations("nav");

  const current = (await getCurrentUser())!;
  const listings = await fetchOwnListings(current.userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {tNav("myListings")}
        </h1>
        <Button asChild>
          <Link href="/dashboard/listings/new" className="gap-1.5">
            <Plus className="h-4 w-4" />
            {tNav("newListing")}
          </Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          title={tEmpty("listings")}
          description={tEmpty("listingsHint")}
          action={
            <Button asChild>
              <Link href="/dashboard/listings/new">{tNav("newListing")}</Link>
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-4">{t("title")}</th>
                <th className="p-4">{t("price")}</th>
                <th className="p-4">{t("status")}</th>
                <th className="p-4 text-right">{tCommon("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr
                  key={listing.id}
                  className="border-t border-border/60 align-middle"
                >
                  <td className="p-4">
                    <Link
                      href={`/listings/${listing.id}`}
                      className="font-medium hover:text-brand-600"
                    >
                      {listing.title}
                    </Link>
                  </td>
                  <td className="p-4">
                    {formatPrice(Number(listing.price), listing.currency)}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        listing.status === "active"
                          ? "success"
                          : listing.status === "removed"
                            ? "destructive"
                            : "muted"
                      }
                    >
                      {tStatus(listing.status as never)}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/listings/${listing.id}/edit`}>
                          {tCommon("edit")}
                        </Link>
                      </Button>
                      <DeleteListingButton id={listing.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
