"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useInView } from "@/components/sites/demophorius-com-d11dd431/shared/use-in-view";
import { CircleArrowButton } from "@/components/sites/demophorius-com-d11dd431/shared/CircleArrowButton";
import { Mic, ArrowRight, Stethoscope, Sparkles, Clock, Zap, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Clock,
    tag: "BMJ Open 2017",
    title: "The Two-Minute Bottleneck",
    body: "70 to 80% of correct diagnoses stem from clinical history alone. Yet Indian primary care consultations average ~2 minutes. Doctors seeing 100+ patients in a morning must compress inquiry into 3 or 4 rushed questions.",
  },
  {
    icon: Zap,
    tag: "Queue Transformation",
    title: "Doctor-Time vs Patient-Time",
    body: "The scarce resource in an Indian OPD is not patient time — it is doctor time. TalkRx flips the equation: harvesting 20 minutes of queue waiting into a structured, NAMASTE & ICD-11 coded summary delivered before the consultation.",
  },
];

export function Hero() {
  const { ref, isInView } = useInView<HTMLDivElement>(0.1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Auto-scroll mobile cards smoothly
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let step = 0;
    const interval = setInterval(() => {
      if (window.innerWidth < 768) {
        step = (step + 1) % FEATURES.length;
        setActiveCardIndex(step);
        const cardWidth = el.scrollWidth / FEATURES.length;
        el.scrollTo({ left: step * cardWidth, behavior: "smooth" });
      }
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative px-5 pt-8 pb-28 md:px-10 lg:px-[72px] lg:pt-14 lg:pb-24 overflow-hidden bg-gradient-to-br from-[#f2f8ff] via-[#e6f2fe] to-[#d6ebfd]"
      ref={ref}
    >
      {/* Ambient Blue Glowing Mesh with Backdrop Blur */}
      <div
        className="pointer-events-none absolute -top-40 -left-20 h-[650px] w-[650px] rounded-full opacity-50 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(147, 197, 253, 0.3) 45%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 -right-32 h-[550px] w-[550px] rounded-full opacity-45 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(96, 165, 250, 0.22) 0%, rgba(191, 219, 254, 0.35) 50%, transparent 75%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto space-y-7 sm:space-y-10 lg:space-y-12">
        {/* Top Tracking & Headline */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <div
              className="text-[11px] sm:text-xs uppercase tracking-[2.5px] font-bold text-blue-600"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Clinical Problem Context
            </div>
          </div>

          {/* Minimalist Bold Display Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[72px] lg:leading-[76px] font-normal tracking-tight text-neutral-950">
            India’s Clinical Bottleneck
            <br />
            Is Not Knowledge. <span className="font-bold text-blue-600">It Is Minutes.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl leading-relaxed">
            TalkRx harvests 20 minutes of hospital queue waiting time into structured clinical histories, 10-fold Dashavidha Pariksha, and longitudinal Health Passports.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href="/case-taking"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_10px_25px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            <Mic className="h-4 w-4" />
            <span>Launch Case-Taking Kiosk</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/doctor-dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-blue-300/80 bg-white/90 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-blue-700 hover:bg-white shadow-sm transition-all"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            <Stethoscope className="h-4 w-4 text-blue-600" />
            <span>Doctor Console</span>
          </Link>
        </div>

        {/* Cards Section: Mobile Horizontal Reel / Desktop 2-Col Grid */}
        <div className="space-y-3">
          {/* Mobile indicator dots */}
          <div className="flex items-center gap-1.5 md:hidden">
            {FEATURES.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeCardIndex === idx ? "w-6 bg-blue-600" : "w-1.5 bg-blue-200"
                }`}
              />
            ))}
          </div>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 md:grid md:grid-cols-2 md:gap-6 lg:gap-8 md:overflow-visible scrollbar-none"
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`w-[85vw] sm:w-[360px] md:w-auto shrink-0 snap-center rounded-2xl border border-white/80 bg-white/85 p-5 sm:p-7 md:p-8 shadow-[0_10px_30px_rgba(37,99,235,0.05)] backdrop-blur-md transition-all duration-300 hover:bg-white/95 hover:shadow-[0_14px_40px_rgba(37,99,235,0.08)] ${
                    isInView ? "is-inview" : ""
                  }`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50/80 px-2.5 py-0.5 rounded-full border border-blue-200/60 font-mono">
                      {f.tag}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-neutral-950 tracking-tight">
                    {f.title}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600 font-normal">
                    {f.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Footer Info Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-blue-200/40 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Ministry of Ayush &bull; SIH26047 &bull; Smart Automation Category</span>
          </div>

          <CircleArrowButton href="#platform" label="Explore Ecosystem" />
        </div>
      </div>
    </section>
  );
}
