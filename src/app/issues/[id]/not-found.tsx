import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function IssueNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl">🛰️</div>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Playbook not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The issue you were looking for has been moved or never existed. Head
        back to the atlas to keep exploring.
      </p>
      <Button asChild className="mt-6">
        <Link href="/issues">Browse all issues</Link>
      </Button>
    </div>
  );
}
