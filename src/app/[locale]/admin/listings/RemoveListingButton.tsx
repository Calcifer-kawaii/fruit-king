"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { adminRemoveListing } from "@/lib/actions/admin";

export function RemoveListingButton({ id }: { id: string }) {
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      size="sm"
      variant="destructive"
      disabled={pending}
      onClick={() =>
        startTransition(async () => void (await adminRemoveListing(id)))
      }
    >
      {t("removeListing")}
    </Button>
  );
}
