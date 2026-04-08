import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";

interface AdminUsersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminUsersPage({ params }: AdminUsersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin");

  const supabase = createAdminClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, display_name, username, is_admin, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t("users")}</h1>
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id} className="border-t border-border/60">
                <td className="p-4">
                  <Link
                    href={u.username ? `/u/${u.username}` : `/u/${u.id}`}
                    className="font-medium hover:text-brand-600"
                  >
                    {u.display_name ?? "—"}
                  </Link>
                </td>
                <td className="p-4 text-muted-foreground">{u.email ?? "—"}</td>
                <td className="p-4 text-muted-foreground">
                  {formatDate(u.created_at, locale === "en" ? "en-US" : "ja-JP")}
                </td>
                <td className="p-4">
                  {u.is_admin ? (
                    <Badge variant="default">admin</Badge>
                  ) : (
                    <Badge variant="muted">user</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* TODO: wire admin toggle UI to lib/actions/admin#adminToggleAdmin once needed. */}
    </div>
  );
}
