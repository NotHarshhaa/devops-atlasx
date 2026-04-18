'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPopularIssues, getTools, getCategories, getAllIssues } from '@/lib/issues';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SearchIcon,
  ArrowRightIcon,
  GitBranchIcon,
  DashboardSpeed02Icon,
  Alert02Icon,
  LeftToRightListBulletIcon,
  EyeIcon,
  Stethoscope02Icon,
  BandageIcon,
  Shield01Icon,
} from '@hugeicons/core-free-icons';

const toolIcons: Record<string, React.ReactNode> = {
  'Docker': <HugeiconsIcon icon={GitBranchIcon} size={22} />,
  'Kubernetes': <HugeiconsIcon icon={GitBranchIcon} size={22} />,
  'AWS': <HugeiconsIcon icon={GitBranchIcon} size={22} />,
  'Terraform': <HugeiconsIcon icon={GitBranchIcon} size={22} />,
  'Jenkins': <HugeiconsIcon icon={GitBranchIcon} size={22} />,
  'GitHub Actions': <HugeiconsIcon icon={GitBranchIcon} size={22} />,
  'Networking': <HugeiconsIcon icon={GitBranchIcon} size={22} />,
  'Observability': <HugeiconsIcon icon={GitBranchIcon} size={22} />,
};

const severityConfig: Record<string, { label: string; bar: string; dot: string }> = {
  'P1': { label: 'Critical', bar: 'bg-destructive', dot: 'bg-destructive' },
  'P2': { label: 'Warning', bar: 'bg-secondary', dot: 'bg-secondary' },
  'P3': { label: 'Low', bar: 'bg-primary', dot: 'bg-primary' },
};

const categoryIcons: Record<string, React.ReactNode> = {
  'Containers': <HugeiconsIcon icon={GitBranchIcon} size={28} />,
  'Cloud': <HugeiconsIcon icon={DashboardSpeed02Icon} size={28} />,
  'Infrastructure as Code': <HugeiconsIcon icon={GitBranchIcon} size={28} />,
  'CI/CD': <HugeiconsIcon icon={LeftToRightListBulletIcon} size={28} />,
  'Networking': <HugeiconsIcon icon={GitBranchIcon} size={28} />,
  'Observability': <HugeiconsIcon icon={EyeIcon} size={28} />,
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const popularIssues = getPopularIssues(6);
  const tools = getTools();
  const categories = getCategories();
  const totalIssues = getAllIssues().length;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/issues?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30" />
        
        <div className="relative container mx-auto px-3 pt-16 pb-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur px-4 py-2 text-sm text-muted-foreground mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-medium">{totalIssues}+</span> production issues solved
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.1]">
              <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Debug faster.
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Ship confidently.
              </span>
            </h1>
            
            <p className="text-sm sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto">
              Your production incident handbook. Search symptoms, get root causes, and apply fixes across Docker, Kubernetes, AWS, and more.
            </p>

            {/* Search */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <HugeiconsIcon icon={SearchIcon} size={16} className="sm:size-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Search issues, errors, or symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-base shadow-lg pr-24 sm:pr-32"
                />
                <Button
                  onClick={handleSearch}
                  size="default"
                  className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-9 sm:h-11 text-xs sm:text-base px-3 sm:px-4"
                >
                  Search
                </Button>
              </div>
              
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Try:</span>
                {['OOMKilled', 'CrashLoopBackOff', '502 Bad Gateway'].map((q) => (
                  <Link
                    key={q}
                    href={`/issues?q=${encodeURIComponent(q)}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {q}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="border-b bg-gradient-to-r from-background via-muted/20 to-background">
        <div className="container mx-auto px-3">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/50">
            {[
              { value: totalIssues.toString(), label: 'Issues', icon: <HugeiconsIcon icon={Alert02Icon} size={16} className="text-primary" /> },
              { value: tools.length.toString(), label: 'Tools', icon: <HugeiconsIcon icon={GitBranchIcon} size={16} className="text-primary" /> },
              { value: categories.length.toString(), label: 'Categories', icon: <HugeiconsIcon icon={DashboardSpeed02Icon} size={16} className="text-primary" /> },
              { value: '100%', label: 'Tested', icon: <HugeiconsIcon icon={Shield01Icon} size={16} className="text-primary" /> },
            ].map((stat, index) => (
              <div key={stat.label} className="py-3 sm:py-4 text-center group hover:bg-muted/30 transition-colors">
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <div className={`p-1.5 sm:p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all ${index === 0 ? 'animate-pulse' : ''}`}>
                    {stat.icon}
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Issues (Timeline / List) ── */}
      <section className="py-12 sm:py-16 md:py-24 bg-secondary/20">
        <div className="container mx-auto px-3">
          <div className="flex items-end justify-between mb-6 sm:mb-8 md:mb-12">
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Trending</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Popular Issues</h2>
            </div>
            <Link href="/issues" className="group flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all">
              View all <HugeiconsIcon icon={ArrowRightIcon} size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {popularIssues.map((issue) => (
              <Link key={issue.id} href={`/issues/${issue.id}`}>
                <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-shadow h-full">
                  <CardHeader className="pb-1 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
                    <div className="text-[9px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-2 uppercase tracking-wide">{issue.category}</div>
                    <CardTitle className="text-sm sm:text-lg line-clamp-2">{issue.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                    <p className="text-[10px] sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-4">
                      {issue.symptoms[0]}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                          issue.severity === 'P1' ? 'bg-red-500/20 text-red-400' :
                          issue.severity === 'P2' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {severityConfig[issue.severity]?.label}
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground uppercase">{issue.tool}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Tool (Pill Layout) ── */}
      <section className="py-12 sm:py-16 md:py-24 bg-background">
        <div className="container mx-auto px-3">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Explore</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Browse by Tool</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={`/issues?tool=${encodeURIComponent(tool.name)}`}
                className="group inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3.5 rounded-2xl border hover:border-foreground bg-muted hover:bg-foreground hover:text-background transition-all"
              >
                <span className="text-muted-foreground group-hover:text-background transition-colors">
                  {toolIcons[tool.name] || <HugeiconsIcon icon={GitBranchIcon} size={22} />}
                </span>
                <span className="font-semibold group-hover:text-background transition-colors">{tool.name}</span>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-background/70 transition-colors">
                  {tool.count} issues
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Category (Bento Grid) ── */}
      <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-3">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">Organized</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Browse by Category</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                href={`/issues?category=${encodeURIComponent(cat.name)}`}
                className={`group relative overflow-hidden rounded-2xl border bg-background p-4 sm:p-6 md:p-8 hover:border-foreground transition-all ${
                  i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className={`flex flex-col ${i === 0 ? 'h-full justify-between' : ''}`}>
                  <div className={`text-muted-foreground group-hover:foreground transition-colors mb-2 sm:mb-4 ${i === 0 ? 'text-3xl sm:text-4xl' : ''}`}>
                    {categoryIcons[cat.name] || <HugeiconsIcon icon={GitBranchIcon} size={i === 0 ? 36 : 28} />}
                  </div>
                  <h3 className={`font-bold group-hover:underline underline-offset-4 ${i === 0 ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{cat.count} issues</p>
                </div>
                {i === 0 && (
                  <div className="absolute -bottom-4 -right-4 text-[8rem] font-extrabold text-muted leading-none select-none pointer-events-none">
                    {cat.count}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-12 sm:py-16 md:py-24 bg-background border-t">
        <div className="container mx-auto px-3">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">How it works</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">From symptom to fix in seconds</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              { icon: <HugeiconsIcon icon={Alert02Icon} size={28} />, step: '01', title: 'Spot the symptom', desc: 'Recognize the error from your logs, metrics, or alerts' },
              { icon: <HugeiconsIcon icon={Stethoscope02Icon} size={28} />, step: '02', title: 'Diagnose the cause', desc: 'Get the root cause analysis and diagnosis commands' },
              { icon: <HugeiconsIcon icon={BandageIcon} size={28} />, step: '03', title: 'Apply the fix', desc: 'Copy-paste the exact commands to resolve the issue' },
              { icon: <HugeiconsIcon icon={Shield01Icon} size={28} />, step: '04', title: 'Prevent recurrence', desc: 'Implement safeguards and monitoring to stay safe' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-muted mb-3 sm:mb-5">
                  {item.icon}
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 sm:mb-2">{item.step}</div>
                <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 sm:py-16 md:py-24 bg-foreground text-background">
        <div className="container mx-auto px-3 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-3 sm:mb-4">Stop guessing, start fixing</h2>
          <p className="text-sm sm:text-lg text-background/70 mb-6 sm:mb-8 max-w-lg mx-auto">
            Every minute of downtime costs money. Find the fix before the pager stops ringing.
          </p>
          <Link href="/issues">
            <Button variant="outline" size="lg">
              Browse All Issues <HugeiconsIcon icon={ArrowRightIcon} size={18} className="ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
