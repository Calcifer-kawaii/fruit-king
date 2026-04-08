import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";
import { RemoveListingButton } from "./RemoveListingButton";

interface AdminListingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminListingsPage({
  params,
}: AdminListingsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin");
  const tListing = await getTranslations("listing");
  const tStatus = await getTranslations("listingStatus");

  const supabase = createAdminClient();
  const { data: listings } = await supabase
    .from("listings")
    .select(
      "id, title, price, currency, status, created_at, seller:profiles!listings_seller_id_fkey(id, display_name, username)"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("listings")}</h1>
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-4">{tListing("title")}</th>
              <th className="p-4">{tListing("price")}</th>
              <th className="p-4">Seller</th>
              <th className="p-4">{tListing("status")}</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(listings ?? []).map((l) => {
              const seller = Array.isArray(l.seller) ? l.seller[0] : l.seller;
              return (
                <tr key={l.id} className="border-t border-border/60">
                  <td className="p-4">
                    <Link
                      href={`/listings/${l.id}`}
                      className="font-medium hover:text-brand-600"
                    >
                      {l.title}
                    </Link>
                  </td>
                  <td className="p-4">
                    {formatPrice(Number(l.price), l.currency)}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {seller?.display_name ?? "—"}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        l.status === "active"
                          ? "success"
                          : l.status === "removed"
                            ? "destructive"
                            : "muted"
                      }
                    >
                      {tStatus(l.status as never)}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    {l.status !== "removed" ? (
                      <RemoveListingButton id={l.id} />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {t("removed")}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
