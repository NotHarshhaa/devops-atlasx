"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete("page");
    else params.set("page", String(page));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const pages = buildRange(currentPage, totalPages);

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <PageLink
        href={createHref(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </PageLink>
      {pages.map((page, i) =>
        page === "…" ? (
          <span
            key={`e-${i}`}
            className="px-2 text-sm text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <PageLink
            key={page}
            href={createHref(page)}
            active={page === currentPage}
          >
            {page}
          </PageLink>
        )
      )}
      <PageLink
        href={createHref(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  children,
  active,
  disabled,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const classes = cn(
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "bg-background hover:bg-accent hover:text-accent-foreground",
    disabled && "pointer-events-none opacity-50"
  );
  if (disabled) {
    return (
      <span className={classes} aria-disabled {...rest}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

function buildRange(current: number, total: number): (number | "…")[] {
  const out: (number | "…")[] = [];
  const push = (v: number | "…") => out.push(v);
  const window = 1;
  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - window && i <= current + window)
    ) {
      push(i);
    } else if (out[out.length - 1] !== "…") {
      push("…");
    }
  }
  return out;
}
