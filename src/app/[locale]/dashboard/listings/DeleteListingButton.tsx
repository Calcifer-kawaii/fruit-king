"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { deleteListing } from "@/lib/actions/listings";

export function DeleteListingButton({ id }: { id: string }) {
  const t = useTranslations("listing");
  const tCommon = useTranslations("common");
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      await deleteListing(id);
    });
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="destructive"
      onClick={handleDelete}
      disabled={pending}
    >
      {pending ? tCommon("loading") : tCommon("delete")}
    </Button>
  );
}
