import Link from "next/link";
import { ArrowUpRight, Flame } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Issue, Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

const severityVariant: Record<Severity, "p1" | "p2" | "p3"> = {
  P1: "p1",
  P2: "p2",
  P3: "p3",
};

const severityLabel: Record<Severity, string> = {
  P1: "P1 · Critical",
  P2: "P2 · Major",
  P3: "P3 · Minor",
};

export function IssueCard({ issue, compact = false }: { issue: Issue; compact?: boolean }) {
  return (
    <Link
      href={`/issues/${issue.id}`}
      className="group block h-full focus:outline-none"
    >
      <Card
        className={cn(
          "flex h-full flex-col transition-all duration-200",
          "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md",
          "focus-visible:border-primary/60 focus-visible:shadow-md"
        )}
      >
        <CardHeader className="flex-none gap-2 pb-3">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-primary/80" />
              {issue.tool}
            </span>
            <span className="inline-flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" />
              {issue.popularity}
            </span>
          </div>
          <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary">
            {issue.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto flex flex-col gap-3 pt-0">
          {!compact && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {issue.symptoms[0]}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={severityVariant[issue.severity]}>
              {severityLabel[issue.severity]}
            </Badge>
            <Badge variant="secondary">{issue.category}</Badge>
            {issue.tags.slice(0, compact ? 2 : 3).map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal">
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
            View playbook
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
