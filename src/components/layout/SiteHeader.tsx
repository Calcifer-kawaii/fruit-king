import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { UserMenu } from "./UserMenu";
import { SearchBar } from "@/components/search/SearchBar";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const current = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🍊</span>
          <span className="text-lg font-semibold tracking-tight text-brand-700">
            果物キング
          </span>
        </Link>

        <div className="hidden flex-1 md:block">
          <SearchBar />
        </div>

        <nav className="ml-auto flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/listings">{t("browse")}</Link>
          </Button>
          {current ? (
            <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
              <Link href="/dashboard/listings/new" className="gap-1.5">
                <Plus className="h-4 w-4" />
                {t("newListing")}
              </Link>
            </Button>
          ) : null}
          <LocaleSwitcher />
          <UserMenu profile={current?.profile ?? null} email={current?.email ?? null} />
        </nav>
      </div>
      <div className="container pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
