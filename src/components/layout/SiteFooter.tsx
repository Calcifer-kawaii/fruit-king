import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border/60 bg-white">
      <div className="container flex flex-col items-start justify-between gap-4 py-8 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg">🍊</span>
          <p className="text-sm text-muted-foreground">{t("tagline")}</p>
        </div>
        <p className="text-xs text-muted-foreground">{t("copy", { year })}</p>
      </div>
    </footer>
  );
}
