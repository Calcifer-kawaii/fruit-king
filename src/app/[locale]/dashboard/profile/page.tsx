import { setRequestLocale, getTranslations } from "next-intl/server";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("profile");
  const current = (await getCurrentUser())!;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t("editTitle")}</h1>
      {current.profile ? (
        <ProfileForm profile={current.profile} />
      ) : (
        <p className="text-sm text-muted-foreground">—</p>
      )}
    </div>
  );
}
