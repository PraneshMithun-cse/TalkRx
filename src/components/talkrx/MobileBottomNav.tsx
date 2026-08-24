"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Mic,
  Stethoscope,
  Building2,
  ShieldCheck,
  FileText,
  Pill,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Doctor",
      href: "/doctor-dashboard",
      icon: Stethoscope,
      isActive: pathname === "/doctor-dashboard",
    },
    {
      label: "Intake",
      href: "/case-taking",
      icon: Mic,
      isPrimary: true,
      isActive: pathname === "/case-taking",
    },
    {
      label: "Triage",
      href: "/triage-operations",
      icon: Building2,
      isActive: pathname === "/triage-operations",
    },
    {
      label: "Passport",
      href: "/health-passport",
      icon: ShieldCheck,
      isActive: pathname === "/health-passport",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-black/[0.08] bg-white/90 backdrop-blur-2xl px-3 py-2 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          if (tab.isPrimary) {
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className="flex flex-col items-center -mt-5 group"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95 ${
                    tab.isActive
                      ? "bg-[#00bba6] text-white shadow-[0_4px_15px_rgba(0,187,166,0.4)]"
                      : "bg-neutral-900 text-white shadow-neutral-900/25 group-hover:bg-[#00bba6]"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <span
                  className="mt-1 text-[10px] font-bold tracking-tight text-[#00bba6] uppercase"
                  style={{ fontFamily: "var(--do-font-label)" }}
                >
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
                tab.isActive
                  ? "text-[#00bba6] font-bold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Icon className={`h-5 w-5 ${tab.isActive ? "stroke-[2.2]" : "stroke-[1.75]"}`} />
              <span
                className="mt-1 text-[10px] uppercase tracking-tight"
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
