import Image from "next/image";
import { MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { localizedFruitType } from "@/lib/constants/fruitTypes";
import { localizedPrefecture } from "@/lib/constants/prefectures";
import type { ListingWithDetails } from "@/types/domain";

interface ListingCardProps {
  listing: ListingWithDetails;
}

export function ListingCard({ listing }: ListingCardProps) {
  const locale = useLocale();
  const t = useTranslations("listing");
  const cover = listing.images[0]?.image_url;
  const seller = listing.seller;
  const sellerHref = seller?.username
    ? `/u/${seller.username}`
    : seller
      ? `/u/${seller.id}`
      : null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <Link href={`/listings/${listing.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-brand-50">
          {cover ? (
            <Image
              src={cover}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">
              🍎
            </div>
          )}
          {listing.status === "sold" ? (
            <Badge variant="muted" className="absolute left-3 top-3">
              {t("soldOut")}
            </Badge>
          ) : null}
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/listings/${listing.id}`}
            className="line-clamp-2 text-sm font-semibold text-foreground hover:text-brand-600"
          >
            {listing.title}
          </Link>
          <Badge variant="secondary" className="shrink-0">
            {localizedFruitType(listing.fruit_type, locale)}
          </Badge>
        </div>

        <div className="flex items-end justify-between">
          <p className="text-lg font-bold text-brand-700">
            {formatPrice(Number(listing.price), listing.currency)}
          </p>
          {listing.prefecture ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {localizedPrefecture(listing.prefecture, locale)}
            </span>
          ) : null}
        </div>

        {sellerHref ? (
          <Link
            href={sellerHref}
            className="flex items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground hover:text-brand-600"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[10px] font-semibold text-brand-700">
              {(seller?.display_name ?? "?").slice(0, 1)}
            </span>
            <span className="truncate">
              {t("by")}: {seller?.display_name ?? "—"}
            </span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
