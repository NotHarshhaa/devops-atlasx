import awsIssues from "@/data/aws.json";
import cicdIssues from "@/data/cicd.json";
import dockerIssues from "@/data/docker.json";
import k8sIssues from "@/data/kubernetes.json";
import networkingIssues from "@/data/networking.json";
import observabilityIssues from "@/data/observability.json";
import terraformIssues from "@/data/terraform.json";
import type { Issue, IssueFilters } from "./types";

const sources: Issue[][] = [
  awsIssues as Issue[],
  cicdIssues as Issue[],
  dockerIssues as Issue[],
  k8sIssues as Issue[],
  networkingIssues as Issue[],
  observabilityIssues as Issue[],
  terraformIssues as Issue[],
];

let cached: Issue[] | null = null;

export function getAllIssues(): Issue[] {
  if (cached) return cached;
  const merged = sources.flat();
  const seen = new Set<string>();
  const unique: Issue[] = [];
  for (const issue of merged) {
    if (seen.has(issue.id)) continue;
    seen.add(issue.id);
    unique.push(issue);
  }
  unique.sort((a, b) => b.popularity - a.popularity);
  cached = unique;
  return cached;
}

export function getIssueById(id: string): Issue | undefined {
  return getAllIssues().find((issue) => issue.id === id);
}

export function getPopularIssues(limit = 6): Issue[] {
  return getAllIssues().slice(0, limit);
}

export function getTools(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const issue of getAllIssues()) {
    counts.set(issue.tool, (counts.get(issue.tool) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const issue of getAllIssues()) {
    counts.set(issue.category, (counts.get(issue.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const issue of getAllIssues()) {
    for (const tag of issue.tags) set.add(tag);
  }
  return Array.from(set).sort();
}

export function searchIssues(query: string, issues: Issue[] = getAllIssues()): Issue[] {
  const q = query.trim().toLowerCase();
  if (!q) return issues;
  return issues.filter((issue) => {
    const haystack = [
      issue.title,
      issue.tool,
      issue.category,
      ...issue.symptoms,
      ...issue.tags,
    ]
      .join(" \u0000 ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function filterIssues(filters: IssueFilters, issues: Issue[] = getAllIssues()): Issue[] {
  let result = issues;
  if (filters.tool && filters.tool !== "all") {
    result = result.filter((i) => i.tool === filters.tool);
  }
  if (filters.severity) {
    result = result.filter((i) => i.severity === filters.severity);
  }
  if (filters.category && filters.category !== "all") {
    result = result.filter((i) => i.category === filters.category);
  }
  if (filters.tag) {
    result = result.filter((i) => i.tags.includes(filters.tag as string));
  }
  if (filters.query) {
    result = searchIssues(filters.query, result);
  }
  return result;
}
