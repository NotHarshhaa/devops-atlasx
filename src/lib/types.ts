export type Severity = "P1" | "P2" | "P3";

export interface Issue {
  id: string;
  title: string;
  tool: string;
  category: string;
  severity: Severity;
  popularity: number;
  symptoms: string[];
  root_cause: string[];
  diagnosis: string[];
  fix: string[];
  prevention: string[];
  tags: string[];
}

export interface IssueFilters {
  tool?: string;
  severity?: Severity;
  category?: string;
  tag?: string;
  query?: string;
}
