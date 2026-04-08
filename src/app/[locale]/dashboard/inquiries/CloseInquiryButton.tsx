"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { closeInquiry } from "@/lib/actions/inquiries";

export function CloseInquiryButton({ id }: { id: string }) {
  const t = useTranslations("inquiry");
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() => startTransition(async () => void (await closeInquiry(id)))}
    >
      {t("close")}
    </Button>
  );
}
