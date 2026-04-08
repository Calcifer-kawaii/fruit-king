"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  createInquiry,
  type ActionResult as InquiryResult,
} from "@/lib/actions/inquiries";

interface ContactSellerFormProps {
  listingId: string;
}

export function ContactSellerForm({ listingId }: ContactSellerFormProps) {
  const t = useTranslations("inquiry");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");

  const action = createInquiry.bind(null, listingId);
  const [state, formAction, pending] = useActionState<
    InquiryResult,
    FormData
  >(
    action as (
      state: InquiryResult | undefined,
      formData: FormData
    ) => Promise<InquiryResult>,
    { ok: false }
  );

  const fieldError = (key: string) =>
    state.fieldErrors?.[key]
      ? tValidation(state.fieldErrors[key] as never)
      : null;

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 text-sm text-emerald-800">
        ✓ {t("sent")}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject">
          {t("subject")}{" "}
          <span className="text-xs text-muted-foreground">
            ({tCommon("optional")})
          </span>
        </Label>
        <Input id="subject" name="subject" placeholder={t("subjectPlaceholder")} />
        {fieldError("subject") ? (
          <p className="text-xs text-red-600">{fieldError("subject")}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={t("messagePlaceholder")}
        />
        {fieldError("message") ? (
          <p className="text-xs text-red-600">{fieldError("message")}</p>
        ) : null}
      </div>
      {state.error === "own_listing" ? (
        <p className="text-sm text-red-600">{t("ownListing")}</p>
      ) : null}
      {state.error && !["validation", "own_listing"].includes(state.error) ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? tCommon("loading") : t("send")}
      </Button>
    </form>
  );
}
