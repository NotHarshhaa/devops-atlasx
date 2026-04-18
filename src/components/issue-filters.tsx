"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface IssueFiltersProps {
  tools: string[];
  categories: string[];
  className?: string;
}

const SEVERITIES = ["P1", "P2", "P3"] as const;

export function IssueFilters({ tools, categories, className }: IssueFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const tool = searchParams.get("tool") ?? "all";
  const severity = searchParams.get("severity") ?? "all";
  const category = searchParams.get("category") ?? "all";
  const tag = searchParams.get("tag") ?? "";

  const [queryInput, setQueryInput] = React.useState(q);

  React.useEffect(() => {
    setQueryInput(q);
  }, [q]);

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const activeCount = [tool, severity, category].filter((v) => v && v !== "all").length + (tag ? 1 : 0);

  return (
    <div
      className={cn(
        "sticky top-14 z-30 -mx-4 border-b bg-background/85 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:mx-0 sm:rounded-lg sm:border sm:px-4",
        className
      )}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          updateParams({ q: queryInput.trim() || null });
        }}
        className="flex flex-col gap-3 md:flex-row md:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Search title, symptoms, tags..."
            className="pl-9"
            aria-label="Search issues"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-none md:items-center">
          <Select
            value={tool}
            onValueChange={(value) => updateParams({ tool: value })}
          >
            <SelectTrigger className="md:w-40" aria-label="Filter by tool">
              <SelectValue placeholder="Tool" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tools</SelectItem>
              {tools.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={severity}
            onValueChange={(value) => updateParams({ severity: value })}
          >
            <SelectTrigger className="md:w-36" aria-label="Filter by severity">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any severity</SelectItem>
              {SEVERITIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={category}
            onValueChange={(value) => updateParams({ category: value })}
          >
            <SelectTrigger className="md:w-44" aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full md:w-auto">
            Apply
          </Button>
        </div>
      </form>
      {(activeCount > 0 || q) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Active:</span>
          {q && (
            <ActiveChip
              label={`“${q}”`}
              onClear={() => {
                setQueryInput("");
                updateParams({ q: null });
              }}
            />
          )}
          {tool !== "all" && (
            <ActiveChip label={`Tool: ${tool}`} onClear={() => updateParams({ tool: null })} />
          )}
          {severity !== "all" && (
            <ActiveChip
              label={`Severity: ${severity}`}
              onClear={() => updateParams({ severity: null })}
            />
          )}
          {category !== "all" && (
            <ActiveChip
              label={`Category: ${category}`}
              onClear={() => updateParams({ category: null })}
            />
          )}
          {tag && (
            <ActiveChip label={`#${tag}`} onClear={() => updateParams({ tag: null })} />
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto h-7 px-2 text-xs"
            onClick={() => {
              setQueryInput("");
              router.push(pathname);
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

function ActiveChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs text-foreground">
      {label}
      <button
        type="button"
        onClick={onClear}
        className="text-muted-foreground hover:text-foreground"
        aria-label={`Clear ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
