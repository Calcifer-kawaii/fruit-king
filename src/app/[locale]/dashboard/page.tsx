import { setRequestLocale, getTranslations } from "next-intl/server";
import { Plus, Mail, UserCircle2, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { fetchOwnListings } from "@/lib/data/listings";
import { fetchReceivedInquiries } from "@/lib/data/inquiries";

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");
  const tNav = await getTranslations("nav");
  const current = (await getCurrentUser())!;

  const [listings, inquiries] = await Promise.all([
    fetchOwnListings(current.userId),
    fetchReceivedInquiries(current.userId),
  ]);
  const activeCount = listings.filter((l) => l.status === "active").length;
  const openInquiries = inquiries.filter((i) => i.status === "open").length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("welcome", {
            name: current.profile?.display_name ?? current.email ?? "—",
          })}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase text-muted-foreground">
              {t("stats.listings")}
            </p>
            <p className="mt-1 text-2xl font-semibold">{listings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase text-muted-foreground">
              {t("stats.active")}
            </p>
            <p className="mt-1 text-2xl font-semibold">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase text-muted-foreground">
              {t("stats.inquiries")}
            </p>
            <p className="mt-1 text-2xl font-semibold">{openInquiries}</p>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">
          {t("quickActions")}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Button asChild variant="outline" className="h-auto justify-start gap-3 p-5">
            <Link href="/dashboard/listings/new">
              <Plus className="h-5 w-5 text-brand-600" />
              <span className="flex flex-col items-start">
                <span className="text-sm font-semibold">
                  {t("createListing")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tNav("newListing")}
                </span>
              </span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto justify-start gap-3 p-5">
            <Link href="/dashboard/listings">
              <Sparkles className="h-5 w-5 text-brand-600" />
              <span className="flex flex-col items-start">
                <span className="text-sm font-semibold">
                  {t("manageListings")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tNav("myListings")}
                </span>
              </span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto justify-start gap-3 p-5">
            <Link href="/dashboard/inquiries">
              <Mail className="h-5 w-5 text-brand-600" />
              <span className="flex flex-col items-start">
                <span className="text-sm font-semibold">
                  {tNav("inquiries")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {openInquiries}
                </span>
              </span>
            </Link>
          </Button>
          {current.profile?.username ? (
            <Button asChild variant="outline" className="h-auto justify-start gap-3 p-5">
              <Link href={`/u/${current.profile.username}`}>
                <UserCircle2 className="h-5 w-5 text-brand-600" />
                <span className="flex flex-col items-start">
                  <span className="text-sm font-semibold">
                    {t("viewProfile")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    @{current.profile.username}
                  </span>
                </span>
              </Link>
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
