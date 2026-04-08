"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface ListingImageUploaderProps {
  userId: string;
  initialUrls?: string[];
  max?: number;
  name?: string;
}

export function ListingImageUploader({
  userId,
  initialUrls = [],
  max = 5,
  name = "images",
}: ListingImageUploaderProps) {
  const t = useTranslations("listing");
  const tValidation = useTranslations("validation");
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    const supabase = createClient();
    const next = [...urls];

    for (const file of Array.from(files)) {
      if (next.length >= max) break;
      if (file.size > 5 * 1024 * 1024) {
        setError(tValidation("imageTooLarge"));
        continue;
      }
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, file, { upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }
      const { data } = supabase.storage
        .from("listing-images")
        .getPublicUrl(path);
      next.push(data.publicUrl);
    }

    setUrls(next);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(i: number) {
    setUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      {/* Hidden inputs so the URLs are submitted with the form */}
      {urls.map((url, i) => (
        <input key={`${url}-${i}`} type="hidden" name={name} value={url} />
      ))}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {urls.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted"
          >
            <Image src={url} alt="" fill sizes="200px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft hover:bg-white"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {urls.length < max ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-brand-50/50 text-sm text-muted-foreground transition-colors hover:bg-brand-50 hover:text-brand-600"
          >
            <ImagePlus className="h-6 w-6" />
            <span>{t("uploadImages")}</span>
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">{t("imageHint")}</p>
      {uploading ? (
        <p className="text-xs text-brand-600">…</p>
      ) : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
