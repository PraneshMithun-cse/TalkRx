"use client";

import Link from "next/link";
import { useInView } from "@/components/sites/demophorius-com-d11dd431/shared/use-in-view";
import type { NewsItem } from "./types";

const ASSET_BASE = "/sites/demophorius-com-d11dd431/root-8a5edab2";

const ITEMS: NewsItem[] = [
  {
    category: "District Hospital OPD · High Footfall",
    date: "Scenario A · 45s Review",
    title: "Kamala, 58: Reconstructing 7 Prescriptions & Flagging Antidiabetic Duplications",
    href: "#engine",
    imageSrc: `${ASSET_BASE}/images/news-isbt-2026.jpg`,
    size: "large",
  },
  {
    category: "Government AYUSH OPD",
    date: "Scenario B · 14m Wait",
    title: "Ramesh: Full Dashavidha Pariksha & Agni/Koshtha NAMASTE Coded at Scale",
    href: "#ayush",
    imageSrc: `${ASSET_BASE}/images/news-30-years.jpg`,
    size: "small",
  },
  {
    category: "Emergency Triage Catch",
    date: "Scenario C · 4m Divert",
    title: "Suresh, 47: Atypical Chest Heaviness Flagged & Escalated in 3 Minutes",
    href: "#triage",
    imageSrc: `${ASSET_BASE}/images/news-world-health-day.png`,
    size: "small",
  },
];

function LargeCard({ item, isInView }: { item: NewsItem; isInView: boolean }) {
  return (
    <Link
      href={item.href}
      className={`anim-card block rounded-2xl bg-neutral-50/80 border border-neutral-100 p-6 md:p-8 hover:shadow-xl transition-all ${isInView ? "is-inview" : ""}`}
    >
      {item.category && (
        <div className="text-[12px] uppercase tracking-[1.5px] font-bold text-blue-600" style={{ fontFamily: "var(--do-font-label)" }}>
          {item.category}
        </div>
      )}
      <div className="mt-3 text-2xl font-light text-neutral-500 md:text-3xl">{item.date}</div>
      <div className="mt-2 text-xl font-semibold leading-snug text-neutral-950 md:text-2xl">{item.title}</div>
      <div className="mt-4 text-sm text-neutral-600 leading-relaxed">
        Waiting 35 minutes in queue, TalkRx captures her full history in Tamil, digitises seven prescriptions and four lab reports, reconstructs her medication timeline, and catches duplicate antidiabetics and documented sulfa allergy.
      </div>
      <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
        <span>Read Clinical Workflow</span>
        <span>&rarr;</span>
      </div>
    </Link>
  );
}

function SmallCard({ item, isInView, delay }: { item: NewsItem; isInView: boolean; delay: number }) {
  return (
    <Link
      href={item.href}
      className={`anim-card flex flex-col sm:flex-row gap-5 rounded-2xl bg-neutral-50/80 border border-neutral-100 p-5 md:p-6 hover:shadow-lg transition-all ${isInView ? "is-inview" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex flex-col justify-center">
        {item.category && (
          <div className="text-[11px] uppercase tracking-[1px] font-bold text-teal-600" style={{ fontFamily: "var(--do-font-label)" }}>
            {item.category}
          </div>
        )}
        <div className="mt-1 text-sm font-medium text-neutral-400">{item.date}</div>
        <div className="mt-1 text-base font-semibold leading-snug text-neutral-900 md:text-lg">{item.title}</div>
      </div>
    </Link>
  );
}

export function News() {
  const { ref, isInView } = useInView<HTMLDivElement>(0.1);
  const [large, ...small] = ITEMS;

  return (
    <section className="relative overflow-hidden px-6 py-16 md:px-10 lg:px-[72px] lg:py-24 border-t border-neutral-100" id="ayush">
      <div
        className="pointer-events-none absolute right-0 top-0 h-[500px] w-[600px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #a9c1ff 0%, #cdf3f6 50%, transparent 75%)" }}
      />
      <div className="relative">
        <div className="text-xs uppercase tracking-[2px] font-bold text-blue-600 mb-3" style={{ fontFamily: "var(--do-font-label)" }}>
          Field Validation
        </div>
        <h2 className={`anim-fade-up text-5xl leading-none md:text-7xl lg:text-[90px] font-normal tracking-tight text-neutral-950 ${isInView ? "is-inview" : ""}`}>
          Clinical Scenarios
        </h2>
        <p className={`anim-fade-up mt-6 max-w-xl text-base leading-relaxed text-neutral-600 lg:text-lg ${isInView ? "is-inview" : ""}`} style={{ transitionDelay: "150ms" }}>
          Illustrative clinical encounters demonstrating how TalkRx transforms history depth, AYUSH standardization, and emergency response in busy hospitals.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-2" ref={ref}>
          <LargeCard item={large} isInView={isInView} />
          <div className="flex flex-col gap-6">
            {small.map((item, i) => (
              <SmallCard key={item.title} item={item} isInView={isInView} delay={(i + 1) * 100} />
            ))}

            {/* Impact Metric Summary Card */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 p-6 text-white shadow-xl flex flex-col justify-between">
              <div className="text-[11px] uppercase tracking-widest font-bold text-blue-300">
                Measurable Impact · 100 Patients / Day
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-black text-white">+2.5 hrs</div>
                  <div className="text-xs text-blue-200 mt-0.5">Physician Clinical Capacity/Day</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">40-60</div>
                  <div className="text-xs text-blue-200 mt-0.5">Structured Points (vs 5-8 baseline)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
