import {
  Mic,
  Stethoscope,
  Building2,
  Pill,
  ShieldCheck,
  Sparkles,
  FileText,
  type LucideIcon,
} from "lucide-react";

export interface ModuleTheme {
  from: string;
  to: string;
  shadow: string;
  border: string;
  accent: string;
  chip: string;
}

export interface ModuleMeta {
  id: string;
  href: string;
  name: string;
  shortName: string;
  tag: string;
  description: string;
  icon: LucideIcon;
  theme: ModuleTheme;
}

export const TALKRX_MODULES: ModuleMeta[] = [
  {
    id: "case-taking",
    href: "/case-taking",
    name: "AI Case-Taking Engine & Kiosk",
    shortName: "Case-Taking",
    tag: "Voice, Touch & AYUSH",
    description:
      "Dual-mode voice and touch intake with 11+ Indic languages, adaptive branching, integrated Conventional & AYUSH Dashavidha Pariksha, and instant physician SOAP narrative.",
    icon: Mic,
    theme: {
      from: "#f0f4ff",
      to: "#e5edff",
      shadow: "rgba(37,99,235,0.08)",
      border: "rgba(59,130,246,0.18)",
      accent: "#2563eb",
      chip: "rgba(255,255,255,0.85)",
    },
  },
  {
    id: "doctor-dashboard",
    href: "/doctor-dashboard",
    name: "Doctor Clinical Dashboard",
    shortName: "Doctor Dashboard",
    tag: "60s HPI",
    description:
      "Live OPD queue, structured HPI narratives with red-flag highlights, longitudinal timeline, medication reconciliation, and an interaction-checked prescription builder.",
    icon: Stethoscope,
    theme: {
      from: "#f5f3ff",
      to: "#ede9fe",
      shadow: "rgba(109,40,217,0.08)",
      border: "rgba(139,92,246,0.18)",
      accent: "#6d28d9",
      chip: "rgba(255,255,255,0.85)",
    },
  },
  {
    id: "triage-operations",
    href: "/triage-operations",
    name: "Hospital & Clinic Operations",
    shortName: "Triage & Ops",
    tag: "Priority Queue",
    description:
      "OPD queue management, live red-flag triage broadcast, operational capacity analytics, and FHIR R4 / ABDM gateway export status.",
    icon: Building2,
    theme: {
      from: "#fff7ed",
      to: "#ffedd5",
      shadow: "rgba(234,88,12,0.08)",
      border: "rgba(249,115,22,0.18)",
      accent: "#c2410c",
      chip: "rgba(255,255,255,0.85)",
    },
  },
  {
    id: "pharmacy-network",
    href: "/pharmacy-network",
    name: "Pharmacy & Medication Network",
    shortName: "Pharmacy",
    tag: "Closed-Loop QR",
    description:
      "Minimum-data-access dispensing portal, QR consent verification, dispensation logging, and prescribed-vs-dispensed discrepancy detection.",
    icon: Pill,
    theme: {
      from: "#f0fdf4",
      to: "#dcfce7",
      shadow: "rgba(22,163,74,0.08)",
      border: "rgba(34,197,94,0.18)",
      accent: "#15803d",
      chip: "rgba(255,255,255,0.85)",
    },
  },
  {
    id: "health-passport",
    href: "/health-passport",
    name: "Patient Health Passport",
    shortName: "Health Passport",
    tag: "Consent & ABHA",
    description:
      "ABHA-linked digital Health Passport, printable emergency QR card, granular revocable consent controls, and an immutable audit ledger.",
    icon: ShieldCheck,
    theme: {
      from: "#f8fafc",
      to: "#f1f5f9",
      shadow: "rgba(15,23,42,0.08)",
      border: "rgba(100,116,139,0.2)",
      accent: "#0f172a",
      chip: "rgba(255,255,255,0.85)",
    },
  },
  {
    id: "document-intelligence",
    href: "/document-intelligence",
    name: "Prescription Document AI",
    shortName: "Document AI",
    tag: "Prescription OCR",
    description:
      "Handwritten prescription and lab report OCR digitizer with confidence scoring and patient verification before it lands on the timeline.",
    icon: FileText,
    theme: {
      from: "#fdf2f8",
      to: "#fce7f3",
      shadow: "rgba(219,39,119,0.08)",
      border: "rgba(244,114,182,0.18)",
      accent: "#be185d",
      chip: "rgba(255,255,255,0.85)",
    },
  },
];

export function getModuleById(id: string): ModuleMeta {
  const found = TALKRX_MODULES.find((m) => m.id === id);
  if (!found) throw new Error(`Unknown TalkRx module: ${id}`);
  return found;
}
