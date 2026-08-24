"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { TALKRX_MODULES } from "./modules";

export function TalkRxInteractiveExperience() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on mobile
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let step = 0;
    const interval = setInterval(() => {
      if (window.innerWidth < 768) {
        step = (step + 1) % TALKRX_MODULES.length;
        const targetScroll = step * (el.scrollWidth / TALKRX_MODULES.length);
        el.scrollTo({ left: targetScroll, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = dir === "left" ? -300 : 300;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="relative px-5 py-14 md:px-10 lg:px-[72px] lg:py-20 overflow-hidden bg-[#fafbfa]" id="platform">
      {/* Calm Ambient Background Glow */}
      <div
        className="pointer-events-none absolute -top-32 -left-20 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #e2ebd4 0%, #edf3e4 40%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 -right-32 h-[500px] w-[500px] rounded-full opacity-35 blur-3xl"
        style={{ background: "radial-gradient(circle, #dbe6cc 0%, #edf4e4 50%, transparent 75%)" }}
      />

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.08] pb-6">
          <div className="space-y-2">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-neutral-900 shadow-sm"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Six Connected Modules</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[58px] font-normal tracking-tight text-neutral-950">
              Complete TalkRx Ecosystem
            </h2>
            <p className="text-sm md:text-base text-neutral-600 max-w-2xl leading-relaxed">
              TalkRx connects patients, doctors, hospitals, pharmacies, laboratories, and AYUSH providers into one unified, consent-driven intelligence layer.
            </p>
          </div>

          {/* Navigation Arrows for Mobile / Tablet */}
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-semibold uppercase tracking-[1px] text-[#556344] rounded-full border border-[#384924]/10 bg-white/70 backdrop-blur-sm px-3.5 py-1.5 mr-2 hidden sm:inline-block"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              ABDM Sandbox &bull; DPDP 2023
            </span>
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                aria-label="Scroll left"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-sm active:scale-90"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                aria-label="Scroll right"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-700 shadow-sm active:scale-90"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Auto-Scroll Carousel / Desktop 3-Column Grid */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible scrollbar-none"
        >
          {TALKRX_MODULES.map((m) => {
            const Icon = m.icon;
            const t = m.theme;
            return (
              <Link
                key={m.id}
                href={m.href}
                className="group relative flex w-[82vw] sm:w-[320px] md:w-auto shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[28px] p-6 sm:p-7 border transition-all duration-300 hover:-translate-y-1.5 bg-white"
                style={{
                  background: `linear-gradient(150deg, ${t.from} 0%, ${t.to} 100%)`,
                  borderColor: t.border,
                  boxShadow: `0 18px 45px ${t.shadow}`,
                }}
              >
                {/* glass sheen highlight */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-[28px]"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0) 55%)",
                  }}
                />

                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-2xl backdrop-blur-md border border-white/60 shadow-sm"
                      style={{ background: t.chip, color: t.accent }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold backdrop-blur-md border border-white/50"
                      style={{ background: "rgba(255,255,255,0.6)", color: t.accent }}
                    >
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-[22px] font-medium text-[#18220f] tracking-tight mb-2 leading-snug">
                    {m.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#425032] leading-relaxed">{m.description}</p>
                </div>

                <div
                  className="relative mt-6 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[1px] transition-colors"
                  style={{ color: t.accent, fontFamily: "var(--do-font-label)" }}
                >
                  <span>Open module</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
