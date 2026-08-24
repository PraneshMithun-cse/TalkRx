"use client";

import React, { useState } from "react";
import { Building2, Search } from "lucide-react";
import type { TimelineEvent } from "./types";

const DEFAULT_CATEGORIES: TimelineEvent["category"][] = [
  "case-taking",
  "consultation",
  "prescription",
  "dispensation",
  "lab",
  "document",
  "ayush",
  "triage",
];

export interface TimelineStreamProps {
  events: TimelineEvent[];
  variant?: "card" | "inline";
  showSearch?: boolean;
  showFilters?: boolean;
  categories?: TimelineEvent["category"][];
  emptyStateLabel?: string;
}

export function TimelineStream({
  events,
  variant = "card",
  showSearch = false,
  showFilters = true,
  categories = DEFAULT_CATEGORIES,
  emptyStateLabel = "No timeline events yet.",
}: TimelineStreamProps) {
  const [filterCat, setFilterCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = events.filter((ev) => {
    const matchesCat = filterCat === "all" || ev.category === filterCat;
    const matchesSearch =
      !showSearch ||
      !searchQuery ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const cardClass =
    variant === "card"
      ? "rounded-3xl border border-black/[0.08] bg-white/80 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-shadow"
      : "rounded-2xl border border-black/5 bg-white p-4 shadow-sm hover:shadow-md transition-shadow";

  return (
    <div className="space-y-6">
      {(showFilters || showSearch) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {showFilters && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-semibold text-neutral-500 mr-1 uppercase text-[9px]" style={{ fontFamily: "var(--do-font-label)" }}>
                Categories:
              </span>
              {["all", ...categories].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCat(cat)}
                  className={`rounded-full px-3 py-1 font-medium uppercase text-[9px] transition-colors ${
                    filterCat === cat ? "bg-black text-white shadow-sm" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                  style={{ fontFamily: "var(--do-font-label)" }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search timeline events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full border border-black/10 bg-white/80 backdrop-blur-md pl-9 pr-4 py-1.5 text-xs text-neutral-900 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-black/5 bg-neutral-50 p-6 text-center text-xs text-neutral-500">
          {emptyStateLabel}
        </div>
      ) : (
        <div className="space-y-4 relative pl-6 border-l-2 border-neutral-200 ml-4">
          {filtered.map((event) => (
            <div key={event.id} className="relative group">
              <div
                className={`absolute -left-[31px] top-2 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm ${
                  event.isRedFlag ? "bg-red-600" : "bg-black"
                }`}
              />

              <div className={cardClass}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.04] pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-950">{event.title}</span>
                    <span
                      className="rounded-full bg-neutral-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-neutral-700"
                      style={{ fontFamily: "var(--do-font-label)" }}
                    >
                      Source: {event.source}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {event.date} {event.time && `• ${event.time}`}
                  </span>
                </div>

                <div className="text-xs text-neutral-700 leading-relaxed">{event.description}</div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3 w-3" />
                    <span>{event.facility}</span>
                    <span>&bull;</span>
                    <span className="italic">{event.sourceEntity}</span>
                  </div>
                  <div className="flex gap-1">
                    {event.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="rounded bg-neutral-100 px-2 py-0.5 text-[9px] text-neutral-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
