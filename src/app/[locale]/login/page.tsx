import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { LoginCard } from "./LoginCard";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const current = await getCurrentUser();
  if (current) redirect({ href: "/dashboard", locale });

  const t = await getTranslations("auth");

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-16">
      <LoginCard title={t("loginTitle")} subtitle={t("loginSubtitle")} cta={t("googleSignIn")} />
    </div>
  );
}
