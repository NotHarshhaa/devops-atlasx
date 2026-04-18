"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  size?: "default" | "lg";
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  defaultValue = "",
  size = "default",
  className,
  autoFocus,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = React.useState(defaultValue);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.push(`/issues${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "relative flex w-full items-center gap-2 rounded-lg border bg-background shadow-sm",
        size === "lg" ? "p-1.5" : "p-1",
        className
      )}
      role="search"
    >
      <Search
        className={cn(
          "ml-2 shrink-0 text-muted-foreground",
          size === "lg" ? "h-5 w-5" : "h-4 w-4"
        )}
      />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search for a tool, error message, or symptom..."
        className={cn(
          "border-0 bg-transparent shadow-none focus-visible:ring-0",
          size === "lg" ? "h-11 text-base" : "h-9"
        )}
        autoFocus={autoFocus}
      />
      <Button type="submit" size={size === "lg" ? "default" : "sm"}>
        Search
      </Button>
    </form>
  );
}
