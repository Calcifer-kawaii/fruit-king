import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="text-5xl">🍊</span>
      <h1 className="mt-4 text-2xl font-semibold">404</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Page not found / ページが見つかりません
      </p>
      <Button asChild className="mt-6">
        <Link href="/">←</Link>
      </Button>
    </div>
  );
}
