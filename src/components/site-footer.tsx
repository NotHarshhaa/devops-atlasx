import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t py-8 text-sm text-muted-foreground">
      <div className="container flex flex-col gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <p>
          Built for SREs and platform engineers. Data lives in local JSON files.
        </p>
        <p>
          <Link
            href="/issues"
            className="font-medium text-foreground hover:underline"
          >
            Browse all issues →
          </Link>
        </p>
      </div>
    </footer>
  );
}
