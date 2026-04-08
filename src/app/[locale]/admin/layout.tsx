import { setRequestLocale, getTranslations } from "next-intl/server";
import { ShieldCheck, Users, ListOrdered } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);

  const t = await getTranslations("admin");
  const tNav = await getTranslations("nav");

  const items = [
    { href: "/admin", label: t("title"), icon: ShieldCheck },
    { href: "/admin/listings", label: t("listings"), icon: ListOrdered },
    { href: "/admin/users", label: t("users"), icon: Users },
  ] as const;

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center gap-2 text-xs uppercase text-brand-700">
        <ShieldCheck className="h-4 w-4" />
        {tNav("admin")}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="sticky top-24 space-y-1 rounded-2xl border border-border/60 bg-white p-3 shadow-soft">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
