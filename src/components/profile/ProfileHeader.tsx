import { useTranslations } from "next-intl";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import type { ProfileRow } from "@/types/database";

interface ProfileHeaderProps {
  profile: ProfileRow;
  locale: string;
}

export function ProfileHeader({ profile, locale }: ProfileHeaderProps) {
  const t = useTranslations("profile");
  const initial = (profile.display_name ?? profile.email ?? "?").slice(0, 1);

  return (
    <section className="rounded-2xl border border-border/60 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
          {profile.avatar_url ? (
            <AvatarImage
              src={profile.avatar_url}
              alt={profile.display_name ?? ""}
            />
          ) : null}
          <AvatarFallback className="text-2xl">{initial}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {profile.display_name ?? "—"}
          </h1>
          {profile.username ? (
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          ) : null}
          <p className="mt-2 max-w-prose whitespace-pre-line text-sm text-foreground/80">
            {profile.bio ?? t("noBio")}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {t("joinedAt", {
              date: formatDate(
                profile.created_at,
                locale === "en" ? "en-US" : "ja-JP"
              ),
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
