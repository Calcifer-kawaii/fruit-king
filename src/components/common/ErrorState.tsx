"use client";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title: string;
  description?: string;
  reset?: () => void;
  resetLabel?: string;
}

export function ErrorState({
  title,
  description,
  reset,
  resetLabel = "Retry",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/40 px-6 py-12 text-center">
      <h3 className="text-base font-semibold text-red-700">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-red-600/80">{description}</p>
      ) : null}
      {reset ? (
        <Button variant="outline" className="mt-5" onClick={reset}>
          {resetLabel}
        </Button>
      ) : null}
    </div>
  );
}
