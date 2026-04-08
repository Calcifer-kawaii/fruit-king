import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { CloseInquiryButton } from "./CloseInquiryButton";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  fetchReceivedInquiries,
  fetchSentInquiries,
} from "@/lib/data/inquiries";
import { formatDate } from "@/lib/utils";
import type { InquiryWithDetails } from "@/types/domain";

interface InquiriesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function InquiriesPage({ params }: InquiriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("inquiry");
  const tNav = await getTranslations("nav");
  const current = (await getCurrentUser())!;

  const [received, sent] = await Promise.all([
    fetchReceivedInquiries(current.userId),
    fetchSentInquiries(current.userId),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {tNav("inquiries")}
      </h1>

      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received">{t("received")}</TabsTrigger>
          <TabsTrigger value="sent">{t("sentTab")}</TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          {received.length > 0 ? (
            <InquiryList items={received} kind="received" locale={locale} />
          ) : (
            <EmptyState title={t("noReceived")} />
          )}
        </TabsContent>
        <TabsContent value="sent">
          {sent.length > 0 ? (
            <InquiryList items={sent} kind="sent" locale={locale} />
          ) : (
            <EmptyState title={t("noSent")} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface InquiryListProps {
  items: InquiryWithDetails[];
  kind: "received" | "sent";
  locale: string;
}

async function InquiryList({ items, kind, locale }: InquiryListProps) {
  const t = await getTranslations("inquiry");
  return (
    <ul className="space-y-3">
      {items.map((inq) => {
        const counterparty = kind === "received" ? inq.buyer : inq.seller;
        return (
          <li
            key={inq.id}
            className="rounded-2xl border border-border/60 bg-white p-5 shadow-soft"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge variant={inq.status === "open" ? "default" : "muted"}>
                    {inq.status === "open" ? t("open") : t("closed")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(
                      inq.created_at,
                      locale === "en" ? "en-US" : "ja-JP"
                    )}
                  </span>
                </div>
                <p className="text-sm font-semibold">
                  {inq.subject ?? "—"}
                </p>
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                  {inq.message}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>
                    {kind === "received" ? t("from") : t("to")}:{" "}
                    {counterparty?.display_name ?? "—"}
                  </span>
                  {inq.listing ? (
                    <Link
                      href={`/listings/${inq.listing.id}`}
                      className="text-brand-600 hover:underline"
                    >
                      → {t("viewListing")}
                    </Link>
                  ) : null}
                </div>
              </div>
              {inq.status === "open" ? (
                <CloseInquiryButton id={inq.id} />
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
