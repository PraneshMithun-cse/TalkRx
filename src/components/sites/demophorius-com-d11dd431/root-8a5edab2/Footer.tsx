"use client";

import Link from "next/link";
import {
  ArrowDiagonalIcon,
  CircleArrowUpIcon,
  TalkRxWordmark,
} from "@/components/sites/demophorius-com-d11dd431/shared/icons";

export function Footer() {
  return (
    <footer className="bg-neutral-950 px-6 py-14 text-white md:px-10 lg:px-[72px] lg:py-20 border-t border-neutral-800">
      <div className="flex flex-col justify-between gap-14 lg:flex-row lg:gap-10">
        <div className="flex flex-1 flex-col justify-between">
          <Link href="/case-taking" className="group inline-block">
            <div className="text-4xl leading-tight md:text-5xl font-normal text-white">Deploy TalkRx</div>
            <div
              className="mt-3 text-[13px] uppercase tracking-[1px] text-neutral-400 lg:text-[15px]"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              ABDM Sandbox &amp; Hospital Pilot Onboarding
            </div>
            <ArrowDiagonalIcon className="mt-8 h-8 w-8 text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
          </Link>

          <div className="mt-12 flex flex-col gap-2">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                ABDM HIP &amp; HIU Registered
              </span>
            </div>
            <div className="text-xs text-neutral-500">
              Compliant with Digital Personal Data Protection (DPDP) Act 2023 &amp; FHIR R4 Standard.
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-end gap-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold tracking-tight text-white">TalkRx</span>
                <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400 tracking-wider uppercase">
                  SIH26047
                </span>
              </div>

              <div className="mt-6 flex flex-col justify-between gap-6 text-sm text-neutral-400 md:flex-row md:gap-16">
                <div className="leading-relaxed">
                  Ministry of Ayush
                  <br />
                  Smart India Hackathon
                  <br />
                  Theme: Smart Automation
                </div>
                <ul className="list-none space-y-2 text-xs">
                  <li className="flex gap-2">
                    <span className="text-neutral-500">Framework:</span>
                    <span className="text-neutral-300">Dashavidha &amp; Ashtavidha Pariksha</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-500">Vocabulary:</span>
                    <span className="text-neutral-300">NAMASTE &amp; WHO ICD-11 TM-2</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neutral-500">Architecture:</span>
                    <span className="text-neutral-300">FHIR R4 / ABDM ABHA Consent</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 text-xs text-neutral-500">
                TalkRx © 2026. Built for national-scale patient empowerment and clinical efficiency.
              </div>
            </div>

            <button
              type="button"
              aria-label="Scroll to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hidden h-14 w-14 shrink-0 items-center justify-center text-neutral-400 hover:text-white transition-all hover:-translate-y-1 md:flex"
            >
              <CircleArrowUpIcon className="h-full w-full" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
