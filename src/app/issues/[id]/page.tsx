import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Flame,
  ShieldCheck,
  Stethoscope,
  Wrench,
} from "lucide-react";

import { IssueCard } from "@/components/issue-card";
import { IssueContent } from "@/components/issue-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAllIssues, getIssueById } from "@/lib/issues";
import type { Severity } from "@/lib/types";

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

export function generateStaticParams() {
  return getAllIssues().map((issue) => ({ id: issue.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const issue = getIssueById(params.id);
  if (!issue) return { title: "Issue not found" };
  return {
    title: `${issue.title} · DevOps AtlasX`,
    description: issue.symptoms[0] ?? issue.title,
  };
}

export default function IssueDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const issue = getIssueById(params.id);
  if (!issue) notFound();

  const related = getAllIssues()
    .filter(
      (candidate) =>
        candidate.id !== issue.id &&
        (candidate.tool === issue.tool ||
          candidate.category === issue.category ||
          candidate.tags.some((tag) => issue.tags.includes(tag)))
    )
    .slice(0, 3);

  return (
    <article className="container py-8 sm:py-10">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/issues">
            <ArrowLeft className="h-4 w-4" /> All issues
          </Link>
        </Button>
      </div>

      <header className="flex flex-col gap-4 border-b pb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-primary/80" />
            {issue.tool}
          </span>
          <span>·</span>
          <span>{issue.category}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" />
            popularity {issue.popularity}
          </span>
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {issue.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={severityVariant[issue.severity]}>
            {severityLabel[issue.severity]}
          </Badge>
          {issue.tags.map((tag) => (
            <Link
              key={tag}
              href={`/issues?tag=${encodeURIComponent(tag)}`}
              className="rounded-md border bg-background px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <Section
            icon={<AlertTriangle className="h-4 w-4" />}
            title="Symptoms"
            description="What you observe in production"
          >
            <IssueContent items={issue.symptoms} />
          </Section>

          <Section
            icon={<Stethoscope className="h-4 w-4" />}
            title="Root cause"
            description="Why this really happens"
          >
            <IssueContent items={issue.root_cause} />
          </Section>

          <Section
            icon={<Stethoscope className="h-4 w-4" />}
            title="Diagnosis"
            description="Commands and signals to confirm the hypothesis"
          >
            <IssueContent items={issue.diagnosis} ordered />
          </Section>

          <Section
            icon={<Wrench className="h-4 w-4" />}
            title="Fix"
            description="Field-tested remediation, runnable in a terminal"
            accent
          >
            <IssueContent items={issue.fix} ordered />
          </Section>

          <Section
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Prevention"
            description="Keep it from coming back"
          >
            <IssueContent items={issue.prevention} />
          </Section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                At a glance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <MetaRow label="Tool" value={issue.tool} />
              <MetaRow label="Category" value={issue.category} />
              <MetaRow label="Severity" value={severityLabel[issue.severity]} />
              <MetaRow label="Popularity" value={String(issue.popularity)} />
              <Separator />
              <MetaRow
                label="Symptoms"
                value={`${issue.symptoms.length} observed`}
              />
              <MetaRow
                label="Fix steps"
                value={`${issue.fix.length} step${issue.fix.length > 1 ? "s" : ""}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Runbook ready
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Copy any command with one click, or link this playbook in your
              incident channel.
            </CardContent>
          </Card>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              Related playbooks
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/issues?tool=${encodeURIComponent(issue.tool)}`}>
                More {issue.tool} issues
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <IssueCard key={r.id} issue={r} compact />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Section({
  icon,
  title,
  description,
  children,
  accent = false,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Card className={accent ? "border-primary/30 bg-primary/[0.03]" : undefined}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border bg-background text-muted-foreground">
            {icon}
          </span>
          {title}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
