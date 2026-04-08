import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Package } from "lucide-react";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ContactSellerForm } from "@/components/listings/ContactSellerForm";
import { fetchListingById } from "@/lib/data/listings";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { formatPrice } from "@/lib/utils";
import { localizedFruitType } from "@/lib/constants/fruitTypes";
import { localizedPrefecture } from "@/lib/constants/prefectures";

interface ListingDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const listing = await fetchListingById(id);
  if (!listing) notFound();

  const t = await getTranslations("listing");
  const tInquiry = await getTranslations("inquiry");
  const tStatus = await getTranslations("listingStatus");
  const currentLocale = await getLocale();

  const current = await getCurrentUser();
  const isOwner = current?.userId === listing.seller_id;
  const seller = listing.seller;
  const sellerHref = seller?.username
    ? `/u/${seller.username}`
    : seller
      ? `/u/${seller.id}`
      : null;

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Image gallery */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/60 bg-brand-50">
            {listing.images[0] ? (
              <Image
                src={listing.images[0].image_url}
                alt={listing.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl">
                🍎
              </div>
            )}
          </div>
          {listing.images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {listing.images.slice(1).map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted"
                >
                  <Image
                    src={img.image_url}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Details */}
        <aside className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {localizedFruitType(listing.fruit_type, currentLocale)}
              </Badge>
              {listing.status !== "active" ? (
                <Badge variant="muted">{tStatus(listing.status as never)}</Badge>
              ) : null}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {listing.title}
            </h1>
            <p className="text-3xl font-bold text-brand-700">
              {formatPrice(Number(listing.price), listing.currency)}
            </p>
          </div>

          <ul className="space-y-2 rounded-2xl border border-border/60 bg-white p-4 text-sm shadow-soft">
            <li className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              {t("stockUnit", { count: listing.stock })}
            </li>
            {listing.prefecture ? (
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {t("fromPrefecture", {
                  prefecture: localizedPrefecture(
                    listing.prefecture,
                    currentLocale
                  ),
                })}
              </li>
            ) : null}
          </ul>

          {/* Seller card */}
          {seller && sellerHref ? (
            <Link
              href={sellerHref}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white p-4 shadow-soft transition-colors hover:border-brand-200 hover:bg-brand-50"
            >
              <Avatar className="h-12 w-12">
                {seller.avatar_url ? (
                  <AvatarImage
                    src={seller.avatar_url}
                    alt={seller.display_name ?? ""}
                  />
                ) : null}
                <AvatarFallback>
                  {(seller.display_name ?? "?").slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-xs uppercase text-muted-foreground">
                  {t("by")}
                </p>
                <p className="truncate text-sm font-semibold">
                  {seller.display_name ?? "—"}
                </p>
              </div>
              <span className="ml-auto text-sm text-brand-600">→</span>
            </Link>
          ) : null}

          {/* Contact */}
          <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-soft">
            <h2 className="mb-3 text-sm font-semibold">{t("contactSeller")}</h2>
            {!current ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {tInquiry("loginRequired")}
                </p>
                <Button asChild className="w-full">
                  <Link href="/login">{tInquiry("send")}</Link>
                </Button>
              </div>
            ) : isOwner ? (
              <p className="text-sm text-muted-foreground">
                {tInquiry("ownListing")}
              </p>
            ) : (
              <ContactSellerForm listingId={listing.id} />
            )}
          </div>
        </aside>
      </div>

      {/* Description */}
      {listing.description ? (
        <section className="mt-12 max-w-3xl">
          <h2 className="mb-3 text-lg font-semibold">{t("description")}</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
            {listing.description}
          </p>
        </section>
      ) : null}
    </div>
  );
}
