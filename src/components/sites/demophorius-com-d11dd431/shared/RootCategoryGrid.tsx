"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView } from "./use-in-view";
import { ArrowDiagonalIcon } from "./icons";
import { ROOT_CATEGORIES, type RootCategory } from "./product-categories-data";
import { ChevronLeft, ChevronRight } from "lucide-react";

function CategoryRow({ cat, isInView, delay }: { cat: RootCategory; isInView: boolean; delay: number }) {
  return (
    <div
      className={`anim-card group/card rounded-[28px] border border-black/[0.08] bg-white/90 backdrop-blur-2xl p-5 md:p-6 lg:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)] hover:border-black/20 transition-all duration-300 flex flex-col gap-5 md:flex-row lg:gap-7 w-[86vw] sm:w-[360px] md:w-auto shrink-0 snap-center ${
        isInView ? "is-inview" : ""
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Left Visual AI Context Image Card */}
      <Link
        href={cat.href}
        className="relative block h-[200px] sm:h-[220px] w-full shrink-0 overflow-hidden rounded-[20px] bg-neutral-950 md:h-auto md:w-[150px] lg:w-[170px] xl:w-[190px] group/thumb transition-transform duration-300 hover:scale-[1.02] shadow-md"
      >
        {/* Background AI Context Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cat.imageSrc}
          alt={cat.brand}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover/thumb:scale-110 opacity-80"
        />

        {/* Gradient Scrim for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 transition-opacity group-hover/thumb:opacity-75" />

        {/* Card Overlay Text */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] uppercase font-bold tracking-[1.5px] text-white/90 drop-shadow"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              {cat.tag.split("·")[0]}
            </span>
            <span
              className="h-3 w-3 rounded-full shadow-lg ring-2 ring-white/30"
              style={{ background: cat.dotColor }}
            />
          </div>
          <div>
            <div className="text-[10px] font-mono text-white/70 mb-0.5">
              Module {cat.tag.split("·")[0]}
            </div>
            <div className="text-base lg:text-lg font-bold leading-tight tracking-tight text-white drop-shadow-md group-hover/thumb:text-blue-300 transition-colors">
              {cat.brand}
            </div>
          </div>
        </div>
      </Link>

      {/* Right Details Table with Cursor Hover Text Zoom + Blue */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex items-center justify-between gap-3">
            <Link href={cat.href} className="group/title block">
              <h3
                className="text-lg lg:text-xl font-bold uppercase tracking-tight text-neutral-950 transition-all duration-200 transform origin-left group-hover/title:text-blue-600 group-hover/title:scale-[1.04]"
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                {cat.brand}
              </h3>
            </Link>
            <span
              className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-black/5"
              style={{
                backgroundColor: `${cat.dotColor}15`,
                color: cat.dotColor,
                fontFamily: "var(--do-font-label)",
              }}
            >
              {cat.tag}
            </span>
          </div>

          <hr className="mt-3 mb-2 border-t border-black/[0.08]" />

          <ul className="list-none divide-y divide-black/[0.06]">
            {cat.subcategories.map((s) => (
              <li key={s.name}>
                <Link
                  href={s.href}
                  className="group/item flex items-center justify-between py-2 transition-all"
                >
                  <span
                    className="text-[12px] lg:text-[13px] uppercase tracking-[0.5px] text-neutral-700 font-medium transition-all duration-200 transform origin-left group-hover/item:text-blue-600 group-hover/item:font-bold group-hover/item:scale-[1.04] group-hover/item:translate-x-1"
                    style={{ fontFamily: "var(--do-font-label)" }}
                  >
                    {s.name}
                  </span>
                  <span
                    className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-neutral-100/90 text-neutral-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors"
                    style={{ fontFamily: "var(--do-font-label)" }}
                  >
                    {s.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={cat.href}
          className="mt-4 flex items-center justify-between pt-3 border-t border-black/[0.06] group/btn"
        >
          <span
            className="text-xl lg:text-2xl font-bold tracking-tight text-neutral-950 transition-all duration-200 transform origin-left group-hover/btn:text-blue-600 group-hover/btn:scale-[1.05]"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            {cat.totalCount}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 group-hover/btn:text-blue-600 transition-colors">
            <span style={{ fontFamily: "var(--do-font-label)" }}>Explore Engine</span>
            <ArrowDiagonalIcon className="h-4 w-4 text-neutral-900 group-hover/btn:text-blue-600 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export function RootCategoryGrid() {
  const { ref, isInView } = useInView<HTMLDivElement>(0.1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll on mobile
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let step = 0;
    const interval = setInterval(() => {
      if (window.innerWidth < 768) {
        step = (step + 1) % ROOT_CATEGORIES.length;
        setCurrentIndex(step);
        const cardWidth = el.scrollWidth / ROOT_CATEGORIES.length;
        el.scrollTo({ left: step * cardWidth, behavior: "smooth" });
      }
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth * 0.88;
    const amount = dir === "left" ? -cardWidth : cardWidth;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="space-y-4" ref={ref}>
      {/* Mobile Swipe Navigation Bar with Arrows & Indicator Dots */}
      <div className="flex items-center justify-between md:hidden px-1">
        <div className="flex items-center gap-1.5">
          {ROOT_CATEGORIES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                setCurrentIndex(idx);
                const cardWidth = el.scrollWidth / ROOT_CATEGORIES.length;
                el.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "w-6 bg-[#00bba6]" : "w-1.5 bg-neutral-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-800 shadow-sm active:scale-90"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-800 shadow-sm active:scale-90"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Auto-Scroll Track on Mobile / 2-Column Grid on Desktop */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-1 lg:grid-cols-2 md:gap-6 lg:gap-8 md:overflow-visible scrollbar-none"
      >
        {ROOT_CATEGORIES.map((cat, i) => (
          <CategoryRow key={cat.brand} cat={cat} isInView={isInView} delay={i * 60} />
        ))}
      </div>
    </div>
  );
}
