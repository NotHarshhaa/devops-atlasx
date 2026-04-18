import Link from "next/link";

import { IssueCard } from "@/components/issue-card";
import { IssueFilters } from "@/components/issue-filters";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
  filterIssues,
  getAllIssues,
  getCategories,
  getTools,
} from "@/lib/issues";
import type { Severity } from "@/lib/types";

const PAGE_SIZE = 9;

function isSeverity(value: string | undefined): value is Severity {
  return value === "P1" || value === "P2" || value === "P3";
}

export default function IssuesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const query = first(searchParams.q) ?? "";
  const tool = first(searchParams.tool) ?? "all";
  const rawSeverity = first(searchParams.severity);
  const severity = isSeverity(rawSeverity) ? rawSeverity : undefined;
  const category = first(searchParams.category) ?? "all";
  const tag = first(searchParams.tag) ?? "";
  const page = Math.max(1, Number(first(searchParams.page) ?? "1") || 1);

  const all = getAllIssues();
  const filtered = filterIssues({
    query,
    tool,
    severity,
    category,
    tag: tag || undefined,
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const tools = getTools().map((t) => t.name);
  const categories = getCategories().map((c) => c.name);

  return (
    <div className="container py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Issue playbooks
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} of {all.length} issues match your filters.
          </p>
        </div>
      </div>

      <IssueFilters tools={tools} categories={categories} />

      {pageItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <div className="text-4xl">🧭</div>
      <h2 className="mt-4 text-lg font-semibold">No playbooks match</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try removing a filter or searching a shorter term — the atlas is still
        growing.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link href="/issues">Reset filters</Link>
      </Button>
    </div>
  );
}
