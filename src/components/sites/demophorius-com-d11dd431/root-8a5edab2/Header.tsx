"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TalkRxWordmark, AyushBadge, LoginIcon, HamburgerIcon } from "@/components/sites/demophorius-com-d11dd431/shared/icons";
import { X, ArrowRight, ShieldCheck, Stethoscope, Mic, Building2, Pill } from "lucide-react";

const NAV_LINKS = [
  { label: "Case-Taking", href: "/case-taking", icon: Mic },
  { label: "Doctor", href: "/doctor-dashboard", icon: Stethoscope },
  { label: "Triage & Ops", href: "/triage-operations", icon: Building2 },
  { label: "Pharmacy", href: "/pharmacy-network", icon: Pill },
  { label: "Passport", href: "/health-passport", icon: ShieldCheck },
  { label: "Document AI", href: "/document-intelligence", icon: LoginIcon },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 pt-4 pb-3 md:px-10 md:pt-6 lg:px-[72px] lg:pt-8 backdrop-blur-xl bg-white/80 transition-all border-b border-black/5">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-end gap-2 text-black">
            <TalkRxWordmark />
          </Link>
        </div>

        {/* Centered Navigation */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <nav className="flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className="text-[12px] uppercase tracking-[1.2px] font-semibold text-neutral-800 transition-colors hover:text-blue-600"
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">

          <Link
            href="/doctor-dashboard"
            aria-label="Doctor / Kiosk Portal"
            className="flex h-9 px-4 items-center justify-center rounded-full bg-neutral-950 text-white text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-all gap-1.5 shadow-sm"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            <LoginIcon className="h-3 w-3" />
            <span className="hidden sm:inline">OPD Portal</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-full bg-neutral-950 text-white lg:hidden transition-transform active:scale-95 shadow-sm"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <HamburgerIcon className="flex w-3.5 flex-col gap-0.5 text-white" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slide-down Sheet Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-[60px] z-30 block lg:hidden bg-white/95 backdrop-blur-2xl border-b border-black/10 shadow-2xl p-6 animate-fadeIn">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400" style={{ fontFamily: "var(--do-font-label)" }}>
              TalkRx Ecosystem &bull; Quick Access
            </div>

            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((n) => {
                const Icon = n.icon;
                return (
                  <Link
                    key={n.label}
                    href={n.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-2xl border border-black/5 bg-neutral-50 p-3 text-xs font-bold text-neutral-900 hover:bg-neutral-100 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-neutral-500" />
                    <span>{n.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/case-taking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#ea580c] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md"
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                <Mic className="h-4 w-4" />
                <span>Start AI Case-Taking Kiosk</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
