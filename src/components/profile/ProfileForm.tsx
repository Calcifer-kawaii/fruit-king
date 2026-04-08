"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AvatarUploader } from "./AvatarUploader";
import {
  updateProfile,
} from "@/lib/actions/profile";
import type { ActionResult } from "@/lib/actions/types";
import type { ProfileRow } from "@/types/database";

interface ProfileFormProps {
  profile: ProfileRow;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");

  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    updateProfile as (
      state: ActionResult | undefined,
      formData: FormData
    ) => Promise<ActionResult>,
    { ok: false }
  );

  const fieldError = (key: string) =>
    state.fieldErrors?.[key]
      ? tValidation(state.fieldErrors[key] as never)
      : null;

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label>{t("avatar")}</Label>
        <AvatarUploader userId={profile.id} initialUrl={profile.avatar_url} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_name">{t("displayName")}</Label>
        <Input
          id="display_name"
          name="display_name"
          required
          defaultValue={profile.display_name ?? ""}
          maxLength={60}
        />
        {fieldError("display_name") ? (
          <p className="text-xs text-red-600">{fieldError("display_name")}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">
          {t("username")}{" "}
          <span className="text-xs text-muted-foreground">
            ({tCommon("optional")})
          </span>
        </Label>
        <Input
          id="username"
          name="username"
          defaultValue={profile.username ?? ""}
          maxLength={40}
          placeholder="my-fruit-shop"
        />
        <p className="text-xs text-muted-foreground">{t("usernameHint")}</p>
        {fieldError("username") ? (
          <p className="text-xs text-red-600">{fieldError("username")}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">{t("bio")}</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={profile.bio ?? ""}
          maxLength={500}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred_language">{t("preferredLanguage")}</Label>
        <Select
          id="preferred_language"
          name="preferred_language"
          defaultValue={profile.preferred_language}
        >
          <option value="ja">{t("languageJa")}</option>
          <option value="en">{t("languageEn")}</option>
        </Select>
      </div>

      {state.ok ? (
        <p className="text-sm text-emerald-700">✓ {t("saved")}</p>
      ) : null}
      {state.error && state.error !== "validation" ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? tCommon("loading") : tCommon("save")}
      </Button>
    </form>
  );
}
