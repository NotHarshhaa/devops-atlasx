import Link from "next/link";
import { ArrowRight, Layers, LineChart, ShieldCheck, Sparkles } from "lucide-react";

import { IssueCard } from "@/components/issue-card";
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAllTags,
  getCategories,
  getPopularIssues,
  getTools,
} from "@/lib/issues";

export default function HomePage() {
  const popular = getPopularIssues(6);
  const tools = getTools();
  const categories = getCategories();
  const tags = getAllTags().slice(0, 14);

  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <div className="atlasx-grid-bg pointer-events-none absolute inset-0" />
        <div className="atlasx-gradient pointer-events-none absolute inset-0" />
        <div className="container relative py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-5 gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Field-tested production playbooks
            </Badge>
            <h1 className="text-balance bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
              DevOps AtlasX
            </h1>
            <p className="mt-4 text-balance text-lg text-muted-foreground sm:text-xl">
              Find real-world DevOps production issues and fixes instantly.
            </p>
            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBar size="lg" />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Popular searches:</span>
              {["CrashLoopBackOff", "RDS connections", "Terraform lock", "502"].map(
                (suggestion) => (
                  <Link
                    key={suggestion}
                    href={`/issues?q=${encodeURIComponent(suggestion)}`}
                    className="rounded-full border bg-background px-3 py-1 transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {suggestion}
                  </Link>
                )
              )}
            </div>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
            <HeroStat
              icon={<Layers className="h-4 w-4" />}
              label="Tools covered"
              value={tools.length}
            />
            <HeroStat
              icon={<LineChart className="h-4 w-4" />}
              label="Issue playbooks"
              value={getPopularIssues(9999).length}
            />
            <HeroStat
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Categories"
              value={categories.length}
            />
          </div>
        </div>
      </section>

      <section className="container py-14">
        <SectionHeader
          eyebrow="Most searched"
          title="Popular issues"
          description="Ranked by how often platform teams hit them in production."
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/issues">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container py-14">
          <SectionHeader
            eyebrow="By stack"
            title="Browse by tool"
            description="Jump straight into playbooks for the tool you're debugging."
          />
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={`/issues?tool=${encodeURIComponent(tool.name)}`}
                className="group"
              >
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm">
                  <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold group-hover:text-primary">
                      {tool.name}
                    </CardTitle>
                    <Badge variant="secondary">{tool.count}</Badge>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    {tool.count === 1 ? "1 playbook" : `${tool.count} playbooks`}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <SectionHeader
          eyebrow="By domain"
          title="Browse by category"
          description="Find the right playbook by the area of your infrastructure."
        />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/issues?category=${encodeURIComponent(category.name)}`}
              className="group"
            >
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm">
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-semibold group-hover:text-primary">
                    {category.name}
                  </CardTitle>
                  <Badge variant="outline">{category.count}</Badge>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {category.count === 1
                    ? "1 playbook"
                    : `${category.count} playbooks`}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container py-12">
          <SectionHeader
            eyebrow="Tag cloud"
            title="Trending tags"
            description="Filter issues by an individual tag."
          />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/issues?tag=${encodeURIComponent(tag)}`}
                className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card className="border-border/70 bg-background/60">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </div>
          <div className="mt-0.5 text-2xl font-semibold">{value}</div>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground">
          {icon}
        </span>
      </CardContent>
    </Card>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
