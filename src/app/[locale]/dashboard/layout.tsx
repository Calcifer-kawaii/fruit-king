import { setRequestLocale, getTranslations } from "next-intl/server";
import { LayoutDashboard, Plus, Mail, User as UserIcon } from "lucide-react";
import { redirect, Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const current = await getCurrentUser();
  if (!current) redirect({ href: "/login", locale });

  const t = await getTranslations("nav");

  const items = [
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/dashboard/listings", label: t("myListings"), icon: Plus },
    { href: "/dashboard/inquiries", label: t("inquiries"), icon: Mail },
    { href: "/dashboard/profile", label: t("myProfile"), icon: UserIcon },
  ] as const;

  return (
    <div className="container py-10">
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
