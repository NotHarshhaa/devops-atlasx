import * as React from "react";

import { cn } from "@/lib/utils";

interface IssueContentProps {
  items: string[];
  ordered?: boolean;
  className?: string;
}

type Block =
  | { type: "text"; content: string }
  | { type: "code"; lang: string; content: string };

const CODE_FENCE = /```(\w+)?\n([\s\S]*?)```/g;

function parseBlocks(value: string): Block[] {
  const blocks: Block[] = [];
  let lastIndex = 0;
  for (const match of value.matchAll(CODE_FENCE)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) {
      const textSlice = value.slice(lastIndex, idx).trim();
      if (textSlice) blocks.push({ type: "text", content: textSlice });
    }
    blocks.push({
      type: "code",
      lang: match[1] ?? "",
      content: match[2].replace(/\n$/, ""),
    });
    lastIndex = idx + match[0].length;
  }
  if (lastIndex < value.length) {
    const tail = value.slice(lastIndex).trim();
    if (tail) blocks.push({ type: "text", content: tail });
  }
  if (blocks.length === 0) blocks.push({ type: "text", content: value });
  return blocks;
}

function Inline({ value }: { value: string }) {
  const parts = value.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={i}>{part.slice(1, -1)}</code>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

function CodeBlock({ content, lang }: { content: string; lang: string }) {
  return (
    <pre>
      <code className={lang ? `language-${lang}` : undefined}>{content}</code>
    </pre>
  );
}

function Item({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  return (
    <li className="space-y-2">
      {blocks.map((block, i) =>
        block.type === "code" ? (
          <CodeBlock key={i} content={block.content} lang={block.lang} />
        ) : (
          <p key={i} className="leading-relaxed">
            <Inline value={block.content} />
          </p>
        )
      )}
    </li>
  );
}

export function IssueContent({ items, ordered = false, className }: IssueContentProps) {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <ListTag
      className={cn(
        "prose-issue space-y-3 text-sm sm:text-[0.95rem]",
        ordered ? "list-decimal" : "list-disc",
        "pl-5 marker:text-muted-foreground",
        className
      )}
    >
      {items.map((item, i) => (
        <Item key={i} content={item} />
      ))}
    </ListTag>
  );
}
