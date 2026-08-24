"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { resolveImage } from "./resolve-image";
import type { NewsArticleData } from "./types";

export function NewsIndex({ articles }: { articles: NewsArticleData[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.category && set.add(a.category));
    return Array.from(set).sort();
  }, [articles]);

  const [active, setActive] = useState<string | null>(null);
  const filtered = active ? articles.filter((a) => a.category === active) : articles;

  return (
    <div>
      <div className="flex flex-wrap gap-3 border-y border-black/10 py-6">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide ${!active ? "border-black bg-black text-white" : "border-black/20"}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide ${active === c ? "border-black bg-black text-white" : "border-black/20"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <Link key={a.slug} href={`/news/${a.slug}/`} className="block">
            <div className="aspect-[4/3] overflow-hidden rounded-[10px] bg-[#f3f1f2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resolveImage(a.image)} alt={a.title} className="h-full w-full object-cover" />
            </div>
            {a.category && (
              <div className="mt-3 text-[11px] uppercase tracking-[1px]" style={{ fontFamily: "var(--do-font-label)" }}>
                {a.category}
              </div>
            )}
            <div className="mt-1 text-sm text-[#666]">{a.date}</div>
            <div className="mt-1 text-base">{a.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
