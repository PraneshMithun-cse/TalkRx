"use client";

import React from "react";
import { History } from "lucide-react";
import { MOCK_PATIENTS } from "./mock-data";
import { TimelineStream } from "./TimelineStream";

export function LongitudinalTimeline() {
  const patient = MOCK_PATIENTS[0]; // Kamala

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/[0.06] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-3.5 w-3.5 text-neutral-900" />
            <span
              className="text-[11px] font-bold uppercase tracking-[1.5px] text-neutral-800"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Central Intelligence Layer &bull; Longitudinal Health Timeline
            </span>
          </div>
          <h3 className="mt-1 text-2xl font-normal tracking-tight text-neutral-950">
            Connected Patient Healthcare Journey
          </h3>
          <p className="text-xs text-neutral-500">
            Unifies consultations, pharmacy dispensations, lab reports, AI case-taking, and adverse drug reactions.
          </p>
        </div>
      </div>

      <TimelineStream events={patient.timeline} variant="card" showSearch showFilters />
    </div>
  );
}
