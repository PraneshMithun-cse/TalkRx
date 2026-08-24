"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView } from "@/components/sites/demophorius-com-d11dd431/shared/use-in-view";
import { StaggerText } from "@/components/sites/demophorius-com-d11dd431/shared/StaggerText";
import { ArrowDiagonalIcon } from "@/components/sites/demophorius-com-d11dd431/shared/icons";
import type { CtaRow } from "./types";

const ASSET_BASE = "/sites/demophorius-com-d11dd431/root-8a5edab2";

const ROWS: CtaRow[] = [
  {
    title: "MULTIMODAL CONVERSATIONAL INTAKE",
    subtitle: "11+ Indic Languages · Voice & Touch · Code-Mixed Speech Detection",
    href: "#engine",
  },
  {
    title: "DETERMINISTIC RED-FLAG TRIAGE",
    subtitle: "Rule-Based Emergency Escalation & Real-Time Nurse Alerting",
    href: "#triage",
  },
  {
    title: "DUAL-FRAMEWORK DASHAVIDHA PARIKSHA",
    subtitle: "10-Fold Ayurvedic Assessment & NAMASTE / WHO ICD-11 TM-2 Coding",
    href: "#ayush",
  },
  {
    title: "THREE-SIDED HEALTH PASSPORT",
    subtitle: "Patient Consent · Provider FHIR Dashboard · Pharmacy Dispensation Loop",
    href: "#passport",
  },
];

function Row({ row, isInView, delay }: { row: CtaRow; isInView: boolean; delay: number }) {
  return (
    <li className="group">
      <hr
        className={`draw-hr border-t border-black transition-colors duration-300 group-hover:border-blue-600 ${
          isInView ? "is-inview" : ""
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      />
      <Link
        href={row.href}
        className="flex items-center justify-between py-6 lg:py-8 transition-all"
      >
        <div className="space-y-1">
          <div
            className="text-2xl uppercase leading-tight lg:text-4xl text-neutral-950 font-normal transition-all duration-300 transform origin-left group-hover:text-blue-600 group-hover:scale-[1.03] group-hover:font-medium tracking-tight"
          >
            {row.title}
          </div>
          <div className="transition-colors duration-300 group-hover:text-blue-600/80">
            <StaggerText
              text={row.subtitle}
              isInView={isInView}
              className="mt-1 text-[13px] uppercase tracking-[1px] lg:text-[15px] text-neutral-500"
            />
          </div>
        </div>
        <ArrowDiagonalIcon className="h-6 w-6 shrink-0 text-neutral-900 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-125 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </Link>
    </li>
  );
}

export function BlockCta() {
  const { ref, isInView } = useInView<HTMLUListElement>(0.15);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let raf = 0;
    function onScroll() {
      raf = requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = (vh - rect.top) / (vh + rect.height);
        setOffset(progress);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative overflow-hidden px-6 py-16 md:px-10 lg:px-[72px] lg:py-24" ref={wrapRef}>
      <ul className="relative list-none" ref={ref}>
        {ROWS.map((row, i) => (
          <Row key={row.href} row={row} isInView={isInView} delay={i * 100} />
        ))}
      </ul>
    </section>
  );
}
