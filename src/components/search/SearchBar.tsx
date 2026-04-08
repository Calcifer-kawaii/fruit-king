"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  size?: "default" | "lg";
}

export function SearchBar({
  defaultValue,
  placeholder,
  size = "default",
}: SearchBarProps) {
  const tCommon = useTranslations("common");
  const tHome = useTranslations("home");
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    const q = String(formData.get("q") ?? "").trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  const isLarge = size === "lg";

  return (
    <form
      action={handleSubmit}
      className={
        isLarge
          ? "flex w-full max-w-2xl items-center gap-2 rounded-full border border-border/60 bg-white p-2 shadow-soft"
          : "flex w-full items-center gap-2"
      }
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder ?? tHome("heroSearchPlaceholder")}
          className={
            isLarge
              ? "h-12 border-none bg-transparent pl-10 text-base shadow-none focus-visible:ring-0"
              : "pl-10"
          }
        />
      </div>
      <Button type="submit" size={isLarge ? "lg" : "default"}>
        {tCommon("search")}
      </Button>
    </form>
  );
}
