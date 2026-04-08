"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ListingImageUploader } from "./ListingImageUploader";
import { FRUIT_TYPES } from "@/lib/constants/fruitTypes";
import { PREFECTURES } from "@/lib/constants/prefectures";
import { CURRENCIES } from "@/lib/constants/currencies";
import { createListing, updateListing } from "@/lib/actions/listings";
import type { ActionResult } from "@/lib/actions/types";
import type { ListingWithDetails } from "@/types/domain";

interface ListingFormProps {
  userId: string;
  locale: string;
  initial?: ListingWithDetails;
}

export function ListingForm({ userId, locale, initial }: ListingFormProps) {
  const t = useTranslations("listing");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const tStatus = useTranslations("listingStatus");

  const isEdit = Boolean(initial);
  const action = isEdit
    ? updateListing.bind(null, initial!.id)
    : createListing;

  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    // useActionState expects (state, formData) — both create/update wrappers match
    action as (
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
        <Label htmlFor="title">{t("title")}</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={initial?.title}
          maxLength={120}
        />
        {fieldError("title") ? (
          <p className="text-xs text-red-600">{fieldError("title")}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fruit_type">{t("fruitType")}</Label>
          <Select
            id="fruit_type"
            name="fruit_type"
            required
            defaultValue={initial?.fruit_type ?? "apple"}
          >
            {FRUIT_TYPES.map((f) => (
              <option key={f.code} value={f.code}>
                {f.emoji} {locale === "en" ? f.en : f.ja}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prefecture">{t("prefecture")}</Label>
          <Select
            id="prefecture"
            name="prefecture"
            defaultValue={initial?.prefecture ?? ""}
          >
            <option value="">—</option>
            {PREFECTURES.map((p) => (
              <option key={p.code} value={p.code}>
                {locale === "en" ? p.en : p.ja}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price">{t("price")}</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step="1"
            required
            defaultValue={initial?.price ?? 1000}
          />
          {fieldError("price") ? (
            <p className="text-xs text-red-600">{fieldError("price")}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">{t("currency")}</Label>
          <Select
            id="currency"
            name="currency"
            defaultValue={initial?.currency ?? "JPY"}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">{t("stock")}</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min={0}
            step="1"
            required
            defaultValue={initial?.stock ?? 1}
          />
          {fieldError("stock") ? (
            <p className="text-xs text-red-600">{fieldError("stock")}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          {t("description")}{" "}
          <span className="text-xs text-muted-foreground">
            ({tCommon("optional")})
          </span>
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={initial?.description ?? ""}
          maxLength={2000}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("images")}</Label>
        <ListingImageUploader
          userId={userId}
          initialUrls={initial?.images.map((i) => i.image_url) ?? []}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">{t("status")}</Label>
        <Select
          id="status"
          name="status"
          defaultValue={initial?.status ?? "active"}
        >
          <option value="draft">{tStatus("draft")}</option>
          <option value="active">{tStatus("active")}</option>
          <option value="sold">{tStatus("sold")}</option>
        </Select>
      </div>

      {state.error && state.error !== "validation" ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={pending} size="lg">
          {pending
            ? tCommon("loading")
            : isEdit
              ? tCommon("save")
              : t("createSubmit")}
        </Button>
      </div>
    </form>
  );
}
