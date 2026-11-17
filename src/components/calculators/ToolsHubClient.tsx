"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { NutritionTool, ToolGroup } from "@/lib/nutrition-tools/types";
import { TOOL_GROUPS } from "@/lib/nutrition-tools/registry";
import { cn } from "@/lib/cn";

type Props = { tools: NutritionTool[] };

const groupAccent: Record<ToolGroup, string> = {
  A: "bg-primary",
  B: "bg-tertiary",
  C: "bg-secondary",
  D: "bg-outline",
};

export function ToolsHubClient({ tools }: Props) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<ToolGroup | "ALL">("ALL");

  const filtered = useMemo(() => {
    const query = q.trim().toLocaleLowerCase("tr");
    return tools.filter((t) => {
      if (group !== "ALL" && t.group !== group) return false;
      if (!query) return true;
      return (
        t.title.toLocaleLowerCase("tr").includes(query) ||
        t.summary.toLocaleLowerCase("tr").includes(query) ||
        t.id.toLowerCase().includes(query)
      );
    });
  }, [tools, q, group]);

  return (
    <div>
      <div className="relative mb-space-xl overflow-hidden rounded-[2rem] border border-outline-variant/25 bg-surface-container-lowest p-space-lg md:p-space-xl">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-fixed/40 blur-3xl motion-reduce:hidden"
          aria-hidden
        />
        <label className="relative flex flex-col gap-2 text-label-sm text-tertiary">
          Araçlarda ara
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="VKİ, protein, tuz, tarif…"
            className="w-full rounded-2xl border border-outline-variant/40 bg-background px-space-md py-3 text-body-lg text-on-surface placeholder:text-on-surface-variant/45 focus:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </label>
        <div className="relative mt-space-md flex flex-wrap gap-space-xs">
          <FilterChip active={group === "ALL"} onClick={() => setGroup("ALL")}>
            Tümü ({tools.length})
          </FilterChip>
          {TOOL_GROUPS.map((g) => {
            const count = tools.filter((t) => t.group === g.id).length;
            return (
              <FilterChip
                key={g.id}
                active={group === g.id}
                onClick={() => setGroup(g.id)}
              >
                {g.label} ({count})
              </FilterChip>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-surface-container-low px-space-lg py-space-xl text-center text-body-md text-on-surface-variant">
          Bu filtreyle araç bulunamadı.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/hesaplayicilar/${tool.slug}`}
                className="group block h-full focus-visible:outline-none"
              >
                <article
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-outline-variant/30",
                    "bg-surface-container-lowest p-space-lg transition-all duration-300",
                    "hover:-translate-y-1 hover:border-primary/25 hover:shadow-md",
                    "motion-reduce:transform-none motion-reduce:transition-none",
                    tool.status === "Blocked" && "opacity-90",
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-y-0 left-0 w-1.5",
                      groupAccent[tool.group],
                    )}
                    aria-hidden
                  />
                  <div className="flex items-start justify-between gap-space-sm pl-space-sm">
                    <span className="text-label-sm font-bold tracking-wide text-tertiary">
                      {tool.id}
                    </span>
                    <span className="rounded-full bg-surface-container px-space-sm py-0.5 text-label-sm text-on-surface-variant">
                      ~{tool.minutes} dk
                      {tool.status === "Blocked" ? " · Kapalı" : ""}
                    </span>
                  </div>
                  <h2 className="mt-space-md pl-space-sm text-headline-sm text-on-surface transition-colors group-hover:text-primary">
                    {tool.title}
                  </h2>
                  <p className="mt-space-sm flex-1 pl-space-sm text-body-sm leading-relaxed text-on-surface-variant">
                    {tool.summary}
                  </p>
                  <div className="mt-space-md flex items-center justify-between gap-space-sm pl-space-sm">
                    <span className="text-label-sm text-on-surface-variant">
                      {tool.groupLabel}
                    </span>
                    <span className="text-label-md font-semibold text-primary transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none">
                      {tool.status === "Blocked" ? "Bilgi" : "Hesapla"} →
                    </span>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-space-md py-space-sm text-label-sm transition-colors",
        active
          ? "bg-primary text-on-primary"
          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high",
      )}
    >
      {children}
    </button>
  );
}
