"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Trash2,
  CheckCircle2,
  UserPlus,
  LogIn,
  Sparkles,
  Upload,
  FileText,
  History,
  Stethoscope,
  Pill,
  Activity,
  RefreshCw,
  QrCode,
  Download,
  Share2,
  Clock,
  Heart,
  Plus,
  Check,
  Eye,
  ChevronRight,
  AlertCircle,
  FileCheck,
  Zap,
} from "lucide-react";
import { useVault } from "./VaultContext";
import { INDIC_LANGUAGES } from "./mock-data";
import { extractFromSelfAssessment } from "./ai-extraction";
import { PseudoQr } from "./PseudoQr";
import { formatSerial } from "./serial";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { TimelineStream } from "./TimelineStream";
import type { ConsentAuthorization, IndicLanguage } from "./types";

type PassportTab = "overview" | "passport" | "vitals" | "self-assessment" | "timeline" | "documents" | "consent" | "audit";

export function PatientPassport() {
  const { isHydrated, currentPatient, patients, createAccount, signInWithSerial, signOut, addSelfAssessment, revokeConsent } = useVault();
  const [activeTab, setActiveTab] = useState<PassportTab>("overview");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isHydrated) {
    return (
      <div className="rounded-3xl border border-black/[0.08] bg-white/60 p-10 text-center text-xs text-neutral-400 animate-pulse">
        Loading your TalkRx vault&hellip;
      </div>
    );
  }

  if (!currentPatient) {
    return <AccountGate patients={patients} createAccount={createAccount} signInWithSerial={signInWithSerial} />;
  }

  const patient = currentPatient;

  const handleCopyShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/[0.06] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-neutral-900" />
            <span
              className="text-[11px] font-bold uppercase tracking-[1.5px] text-neutral-800"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Patient Health Passport &amp; Consent Manager &bull; ABDM Rails
            </span>
          </div>
          <h3 className="mt-1 text-2xl md:text-3xl font-normal tracking-tight text-neutral-950">
            Citizen Health Passport &amp; Interactive Hub
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            {patient.name} &bull; TalkRx Serial No. <span className="font-mono font-bold text-neutral-800">{formatSerial(patient.serialNumber)}</span> &bull; ABHA: <span className="font-mono">{patient.abhaId}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 shadow-sm transition-all"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Emergency QR</span>
          </button>
          <button
            type="button"
            onClick={signOut}
            className="text-[11px] uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            Switch Account
          </button>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex gap-2 text-xs overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "overview", label: "Health Overview" },
          { id: "passport", label: "Digital ABHA Card" },
          { id: "vitals", label: "Daily Vitals & Adherence" },
          { id: "documents", label: `Reports & AI OCR (${patient.documents.length})` },
          { id: "self-assessment", label: `Self-Assessment (${patient.selfAssessments.length})` },
          { id: "timeline", label: `Health Timeline (${patient.timeline.length})` },
          { id: "consent", label: `Consent Controls (${patient.consents.filter((c) => c.status === "Active").length})` },
          { id: "audit", label: "Access Audit Ledger" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as PassportTab)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#00bba6] text-white shadow-md shadow-[#00bba6]/25"
                  : "bg-white text-neutral-600 hover:text-neutral-950 hover:bg-[#eef9f8] border border-[#00bba6]/20"
              }`}
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && <OverviewTab patient={patient} onNavigateToTab={setActiveTab} />}
      {activeTab === "passport" && <DigitalCardTab patient={patient} />}
      {activeTab === "vitals" && <VitalsTab patient={patient} />}
      {activeTab === "documents" && <DocumentsTab patient={patient} />}
      {activeTab === "self-assessment" && <SelfAssessmentTab patient={patient} addSelfAssessment={addSelfAssessment} />}
      {activeTab === "timeline" && (
        <TimelineStream events={patient.timeline} variant="card" showSearch emptyStateLabel="Your health timeline will appear here as records are added." />
      )}
      {activeTab === "consent" && <ConsentTab patient={patient} revokeConsent={revokeConsent} />}
      {activeTab === "audit" && <AuditTab patient={patient} />}

      {/* Emergency Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-[28px] border border-black/10 bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900" style={{ fontFamily: "var(--do-font-label)" }}>
                Emergency Health Passport
              </span>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-xs text-neutral-400 hover:text-black"
              >
                Close
              </button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl flex flex-col items-center justify-center">
              <PseudoQr value={patient.serialNumber} size={160} caption />
            </div>

            <div className="text-xs text-neutral-600 text-left space-y-1 bg-amber-500/[0.06] border border-amber-500/20 p-3 rounded-xl">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                Emergency QR Scanner
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Emergency responders can scan this to view blood group ({patient.bloodGroup}), emergency contact, and critical drug allergies ({patient.allergies.join(", ") || "None recorded"}).
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyShare}
                className="flex-1 rounded-full bg-neutral-950 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800"
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                {copiedLink ? "✓ Copied QR Token" : "Copy Token Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({
  patient,
  onNavigateToTab,
}: {
  patient: NonNullable<ReturnType<typeof useVault>["currentPatient"]>;
  onNavigateToTab: (tab: PassportTab) => void;
}) {
  const [uploadedReports, setUploadedReports] = useState<{ name: string; size: string; status: string; findings: string }[]>([
    {
      name: "Apollo_Diagnostic_Renal_Lipid_Panel_Aug2026.pdf",
      size: "1.4 MB",
      status: "AI OCR Processed",
      findings: "HbA1c: 8.4% (Elevated) • S. Creatinine: 1.1 mg/dL • eGFR: 88 mL/min",
    },
  ]);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);

  const knownConditions = patient.conditions.filter((c) => c.kind === "condition");
  const selfSymptoms = patient.conditions.filter((c) => c.kind === "symptom");
  const doctorConditions = patient.conditions.filter((c) => c.kind === "diagnosis");
  const allergyEntries = patient.conditions.filter((c) => c.kind === "allergy");
  const prescribedMeds = patient.activeMedications.filter((m) => m.source === "doctor-prescribed");

  const handleSimulateReportUpload = () => {
    setIsSimulatingUpload(true);
    setTimeout(() => {
      setIsSimulatingUpload(false);
      setUploadedReports((prev) => [
        {
          name: "Dr_Mehta_Cardio_Prescription_Aug2026.jpg",
          size: "2.1 MB",
          status: "OCR Verified & Appended",
          findings: "Tab. Telmisartan 40mg OD • Tab. Metformin 500mg BD • Stat ECG: Normal Sinus Rhythm",
        },
        ...prev,
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Quick Interactive Vital Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-black/5 bg-white/80 p-4 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--do-font-label)" }}>
              Blood Pressure
            </span>
            <Heart className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-neutral-950">128/82 <span className="text-xs font-normal text-neutral-500">mmHg</span></div>
          <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal Range</span>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white/80 p-4 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--do-font-label)" }}>
              Blood Glucose
            </span>
            <Activity className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-neutral-950">134 <span className="text-xs font-normal text-neutral-500">mg/dL</span></div>
          <span className="inline-block mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Fasting &bull; Monitored</span>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white/80 p-4 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--do-font-label)" }}>
              Active Meds
            </span>
            <Pill className="h-3.5 w-3.5 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-neutral-950">{prescribedMeds.length} <span className="text-xs font-normal text-neutral-500">Regimens</span></div>
          <span className="inline-block mt-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">100% Adherence</span>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white/80 p-4 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--do-font-label)" }}>
              Allergy Shield
            </span>
            <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
          </div>
          <div className="text-xl font-bold text-neutral-950">{patient.allergies.length || allergyEntries.length} <span className="text-xs font-normal text-neutral-500">Flagged</span></div>
          <span className="inline-block mt-1 text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">Active Contraindication</span>
        </div>
      </div>

      {/* Core Health Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Category: Medical Conditions */}
        <div className="rounded-3xl border border-black/5 p-5 bg-white/80 backdrop-blur-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold uppercase tracking-wider text-neutral-900 text-[10px] flex items-center gap-1.5" style={{ fontFamily: "var(--do-font-label)" }}>
                <Activity className="h-3.5 w-3.5 text-indigo-700" strokeWidth={1.75} />
                Known Conditions
              </span>
              <span className="text-[10px] font-bold text-neutral-400">{knownConditions.length + doctorConditions.length}</span>
            </div>
            <ul className="space-y-2 text-xs text-neutral-700">
              {[...knownConditions, ...doctorConditions].slice(0, 3).map((c, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span className="truncate font-medium">{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab("timeline")}
            className="mt-4 pt-3 border-t border-black/5 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 uppercase tracking-wide"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            <span>View full timeline</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Category: Prescribed Meds */}
        <div className="rounded-3xl border border-black/5 p-5 bg-white/80 backdrop-blur-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold uppercase tracking-wider text-neutral-900 text-[10px] flex items-center gap-1.5" style={{ fontFamily: "var(--do-font-label)" }}>
                <Pill className="h-3.5 w-3.5 text-blue-700" strokeWidth={1.75} />
                Prescribed Medications
              </span>
              <span className="text-[10px] font-bold text-neutral-400">{patient.activeMedications.length}</span>
            </div>
            <ul className="space-y-2 text-xs text-neutral-700">
              {patient.activeMedications.slice(0, 3).map((m, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="truncate font-medium">{m.standardMolecule} ({m.dosage})</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab("vitals")}
            className="mt-4 pt-3 border-t border-black/5 text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-wide"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            <span>Track daily adherence</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Category: Allergies & Red Flags */}
        <div className="rounded-3xl border border-red-500/20 p-5 bg-red-500/[0.02] backdrop-blur-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold uppercase tracking-wider text-red-900 text-[10px] flex items-center gap-1.5" style={{ fontFamily: "var(--do-font-label)" }}>
                <ShieldAlert className="h-3.5 w-3.5 text-red-600" strokeWidth={1.75} />
                Allergies &amp; Safety Guard
              </span>
              <span className="text-[10px] font-bold text-red-600">{patient.allergies.length || 1}</span>
            </div>
            <div className="text-xs text-neutral-800 font-bold mb-1">
              {patient.allergies[0] || "Sulfa Drugs (Angioedema / Swelling)"}
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Auto-locks contraindicated drugs during OPD prescriptions and pharmacy dispensing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab("passport")}
            className="mt-4 pt-3 border-t border-red-500/10 text-[11px] font-bold text-red-700 hover:text-red-900 flex items-center gap-1 uppercase tracking-wide"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            <span>View Digital ID Badge</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Down-Below: Report & Document Upload Center with AI OCR Digitizer */}
      <div className="rounded-[28px] border border-black/[0.08] bg-white/95 p-6 md:p-8 backdrop-blur-2xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-neutral-950" />
              <h4 className="text-lg font-bold text-neutral-950 tracking-tight" style={{ fontFamily: "var(--do-font-label)" }}>
                Upload Medical Reports, Prescriptions &amp; Scans
              </h4>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Upload PDF or photo scans of your handwritten doctor prescriptions, blood tests, or discharge summaries for AI OCR digitization.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSimulateReportUpload}
            disabled={isSimulatingUpload}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-md transition-all shrink-0 disabled:opacity-50"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            {isSimulatingUpload ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Running Vision OCR...</span>
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                <span>Upload &amp; Scan Report</span>
              </>
            )}
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <label className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-black/10 bg-neutral-50/70 p-8 cursor-pointer hover:border-black/30 hover:bg-neutral-50 transition-all text-center">
          <Upload className="h-8 w-8 text-neutral-400 mb-2 stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-900" style={{ fontFamily: "var(--do-font-label)" }}>
            Drag and Drop Reports Here or Browse Files
          </span>
          <span className="text-[11px] text-neutral-500 mt-1">
            Supports PDF, JPG, PNG, DICOM &bull; Max 25 MB per file &bull; 256-Bit Encrypted
          </span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleSimulateReportUpload}
          />
        </label>

        {/* Uploaded Documents List */}
        {uploadedReports.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block" style={{ fontFamily: "var(--do-font-label)" }}>
              Recently Processed Reports:
            </span>
            <div className="space-y-3">
              {uploadedReports.map((report, idx) => (
                <div key={idx} className="rounded-2xl bg-neutral-50 p-4 border border-black/5 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-neutral-500" />
                      <div>
                        <div className="font-bold text-neutral-950">{report.name}</div>
                        <div className="text-[11px] text-neutral-400">{report.size}</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800 uppercase">
                      <CheckCircle2 className="h-3 w-3" /> {report.status}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-black/5 font-mono text-[11px] text-neutral-700">
                    <span className="text-neutral-400 block text-[9px] uppercase font-sans font-bold">// Extracted Parameters:</span>
                    {report.findings}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DigitalCardTab({ patient }: { patient: NonNullable<ReturnType<typeof useVault>["currentPatient"]> }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-neutral-950 tracking-tight">Interactive ABDM Digital Health Passport</h4>
          <p className="text-xs text-neutral-500">Tap card to flip between Official Identity and Emergency QR Medical Directive.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 shadow-sm"
          style={{ fontFamily: "var(--do-font-label)" }}
        >
          {isFlipped ? "View Front Card" : "View Back (Emergency QR)"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Flippable Card */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="cursor-pointer rounded-[32px] bg-neutral-950 p-7 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden border border-black/10 transition-transform duration-300 hover:scale-[1.02] min-h-[340px]"
        >
          {/* Subtle decorative glow */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />

          {!isFlipped ? (
            /* Front Face */
            <div className="flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400" style={{ fontFamily: "var(--do-font-label)" }}>
                    TalkRx Citizen Health Passport &bull; Ayushman Bharat
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-white border border-white/15">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{patient.name}</h4>
                    <div className="text-xs text-neutral-400 mt-0.5">
                      {patient.age} Yrs &bull; {patient.gender} &bull; Blood: <span className="text-rose-400 font-bold">{patient.bloodGroup}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-sm">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-mono">TalkRx Serial Number:</span>
                    <span className="font-mono font-bold text-white text-lg tracking-[3px]">
                      {formatSerial(patient.serialNumber)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-mono">ABHA Health ID:</span>
                    <span className="font-mono text-neutral-300 text-xs">{patient.abhaId}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-1.5 font-mono">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  <span>ABDM 256-Bit Encrypted</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Tap to flip &rarr;</span>
              </div>
            </div>
          ) : (
            /* Back Face */
            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400" style={{ fontFamily: "var(--do-font-label)" }}>
                    Emergency Medical QR &bull; Offline Scan
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Critical Safety</span>
                </div>

                <div className="mt-4 flex items-center justify-center">
                  <div className="bg-white p-3 rounded-2xl">
                    <PseudoQr value={patient.serialNumber} size={110} caption={false} />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="text-[11px] font-bold text-red-400">
                    ALLERGY: {patient.allergies[0] || "Sulfa Drugs (Angioedema)"}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Emergency Contact: +91 98402 11920 (Spouse)
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-center text-[10px] text-neutral-400">
                Authorized by National Health Authority &bull; DPDP Act Compliant
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Emergency Safety */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl border border-red-500/30 bg-red-500/[0.03] backdrop-blur-xl p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase tracking-wide" style={{ fontFamily: "var(--do-font-label)" }}>
              <ShieldAlert className="h-4 w-4 text-red-600" />
              <span>Critical Emergency Safety Profile</span>
            </div>
            <div className="text-sm font-bold text-neutral-950">
              Documented High-Risk Allergy: {patient.allergies[0] || "Sulfa Antibiotics"}
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              This card provides guaranteed emergency override access for first responders to view vital safety data without requiring manual OTP confirmation in life-threatening trauma events.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
              <div className="text-xs font-bold text-neutral-950 mb-1">Print Physical Card</div>
              <p className="text-[11px] text-neutral-500 mb-3">Download printable wallet card with offline verification QR code.</p>
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-neutral-950 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF Card</span>
              </button>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
              <div className="text-xs font-bold text-neutral-950 mb-1">Apple / Google Wallet</div>
              <p className="text-[11px] text-neutral-500 mb-3">Sync digital health token to your smartphone wallet app.</p>
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-black/10 bg-white py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Add to Phone Wallet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VitalsTab({ patient }: { patient: NonNullable<ReturnType<typeof useVault>["currentPatient"]> }) {
  const [adherenceChecked, setAdherenceChecked] = useState<Record<string, boolean>>({
    "med-1": true,
    "med-2": false,
  });

  const toggleAdherence = (id: string) => {
    setAdherenceChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.06] pb-4">
        <div>
          <h4 className="text-lg font-bold text-neutral-950 tracking-tight">Daily Medication Adherence &amp; Vitals Logger</h4>
          <p className="text-xs text-neutral-500">Check off your daily prescribed tablets to update your longitudinal adherence score.</p>
        </div>
      </div>

      {/* Medication Checklist */}
      <div className="rounded-3xl border border-black/[0.08] bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-900" style={{ fontFamily: "var(--do-font-label)" }}>
            Today&apos;s Prescription Schedule (Morning / Night)
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Adherence: {Object.values(adherenceChecked).filter(Boolean).length}/{patient.activeMedications.length || 2} Taken
          </span>
        </div>

        <div className="space-y-3">
          {patient.activeMedications.map((med, idx) => {
            const isTaken = adherenceChecked[med.id] ?? false;
            return (
              <div
                key={med.id || idx}
                onClick={() => toggleAdherence(med.id)}
                className={`cursor-pointer flex items-center justify-between rounded-2xl p-4 border transition-all ${
                  isTaken ? "bg-emerald-50/50 border-emerald-500/30" : "bg-neutral-50/70 border-black/5 hover:border-black/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                      isTaken ? "bg-emerald-600 border-emerald-600 text-white" : "border-neutral-300 bg-white text-transparent"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${isTaken ? "text-neutral-950 line-through opacity-70" : "text-neutral-950"}`}>
                      {med.standardMolecule} <span className="font-normal text-neutral-500 text-xs">({med.brandName || "Generic"} &bull; {med.dosage})</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {med.frequency} &bull; Sourced from Dr. Consultation
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    isTaken ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-700"
                  }`}
                  style={{ fontFamily: "var(--do-font-label)" }}
                >
                  {isTaken ? "Taken" : "Mark as Taken"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DocumentsTab({ patient }: { patient: NonNullable<ReturnType<typeof useVault>["currentPatient"]> }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-neutral-950 tracking-tight">Verified Diagnostic Reports &amp; Prescriptions</h4>
          <p className="text-xs text-neutral-500">All documents linked to your ABDM record with AI OCR extracted metadata.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patient.documents.map((doc) => (
          <div key={doc.id} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FileCheck className="h-6 w-6 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-sm text-neutral-950">{doc.title}</div>
                  <div className="text-xs text-neutral-500">{doc.facility} &bull; {doc.date}</div>
                </div>
              </div>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-neutral-700">
                {doc.category.replace("_", " ")}
              </span>
            </div>
            <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs text-neutral-600">
              <span className="font-mono text-[11px]">ABDM ID: {doc.id}</span>
              <button type="button" className="text-blue-600 font-bold hover:underline">
                View Full Scan &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SelfAssessmentTab({
  patient,
  addSelfAssessment,
}: {
  patient: NonNullable<ReturnType<typeof useVault>["currentPatient"]>;
  addSelfAssessment: ReturnType<typeof useVault>["addSelfAssessment"];
}) {
  const [rawText, setRawText] = useState("");
  const [preview, setPreview] = useState<ReturnType<typeof extractFromSelfAssessment> | null>(null);

  const handleAnalyze = () => {
    if (!rawText.trim()) return;
    setPreview(extractFromSelfAssessment(rawText));
  };

  const handleSave = () => {
    if (!rawText.trim()) return;
    addSelfAssessment(patient.id, rawText);
    setRawText("");
    setPreview(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-neutral-50 p-4 border border-black/5 text-xs text-neutral-700 leading-relaxed">
        <strong className="text-neutral-950">Self-Assessment:</strong> Describe your current symptoms, medical conditions, or changes in your own words. AI structures this for your physician consultation.
      </div>

      <div className="rounded-3xl border border-black/[0.08] bg-white/80 backdrop-blur-xl p-6 space-y-4 shadow-sm">
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={4}
          placeholder="e.g. I have mild chest acidity after dinner, taking Antacid tablet, diabetic for 5 years..."
          className="w-full rounded-2xl border border-black/10 bg-neutral-50 p-4 text-sm text-neutral-900 focus:outline-none focus:border-black/30"
        />

        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={handleAnalyze}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100 shadow-sm"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            <Sparkles className="h-3.5 w-3.5" /> Analyze with AI
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!rawText.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-sm disabled:opacity-30"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            Save to Profile
          </button>
        </div>

        {preview && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl border border-black/10 bg-neutral-950 p-5 text-white">
              <div className="text-neutral-500 text-[10px] uppercase mb-2 font-mono">// Original Input:</div>
              <p className="font-mono text-xs text-neutral-300 leading-relaxed">{rawText}</p>
            </div>
            <div className="rounded-2xl border border-black/[0.08] bg-white p-5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-950 block" style={{ fontFamily: "var(--do-font-label)" }}>
                AI-Suggested Structured Findings
              </span>
              <div className="flex flex-wrap gap-2">
                {preview.conditions.map((c, idx) => (
                  <span key={idx} className="rounded-full border border-amber-500/30 bg-amber-500/[0.08] text-amber-800 px-3 py-1 text-[11px]">
                    {c.label} &bull; {Math.round(c.confidence * 100)}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConsentTab({
  patient,
  revokeConsent,
}: {
  patient: NonNullable<ReturnType<typeof useVault>["currentPatient"]>;
  revokeConsent: ReturnType<typeof useVault>["revokeConsent"];
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-neutral-50 p-4 border border-black/5 text-xs text-neutral-700 leading-relaxed">
        <strong className="text-neutral-950">Granular Consent Controls:</strong> You have sovereign control over which clinics, doctors, and pharmacies can view your records. Revoke access instantly with 1 click.
      </div>

      <div className="space-y-3">
        {patient.consents.map((c) => (
          <div
            key={c.id}
            className={`rounded-3xl border p-5 transition-all ${
              c.status === "Active" ? "border-black/[0.08] bg-white/80 backdrop-blur-xl shadow-sm" : "border-black/5 bg-neutral-50 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between border-b border-black/[0.04] pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-950">{c.granteeName}</span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[9px] font-bold uppercase text-neutral-700">
                    {c.granteeType}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">Purpose: {c.purpose}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase ${
                    c.status === "Active" ? "bg-neutral-900 text-white" : "bg-red-100 text-red-800"
                  }`}
                  style={{ fontFamily: "var(--do-font-label)" }}
                >
                  {c.status}
                </span>

                {c.status === "Active" && (
                  <button
                    type="button"
                    onClick={() => revokeConsent(patient.id, c.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 shadow-sm"
                    style={{ fontFamily: "var(--do-font-label)" }}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Revoke</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-600">
              <div className="flex gap-1.5">
                {c.dataCategories.map((cat, idx) => (
                  <span key={idx} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-700">
                    {cat}
                  </span>
                ))}
              </div>
              <div className="text-neutral-400 font-mono text-xs">
                Validity: {c.validFrom} &rarr; {c.validTill}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditTab({ patient }: { patient: NonNullable<ReturnType<typeof useVault>["currentPatient"]> }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-bold text-neutral-950 tracking-tight">
          Immutable Access Audit Ledger (DPDP Act 2023)
        </h4>
        <p className="text-xs text-neutral-500">
          Every read, write, and dispensation access to your health record is recorded with timestamp and cryptographic signature.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-black/[0.08] bg-white/80 backdrop-blur-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100/70 font-bold uppercase text-neutral-700 text-xs" style={{ fontFamily: "var(--do-font-label)" }}>
            <tr>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Accessor &amp; Role</th>
              <th className="p-3.5">Facility</th>
              <th className="p-3.5">Action Performed</th>
              <th className="p-3.5">Data Scope</th>
              <th className="p-3.5">Audit Security</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-xs">
            {patient.auditLog.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-50/60">
                <td className="p-3.5 font-mono text-neutral-500">{log.timestamp}</td>
                <td className="p-3.5 font-bold text-neutral-950">
                  {log.accessorName} <span className="block font-normal text-neutral-500 text-[10px]">{log.accessorRole}</span>
                </td>
                <td className="p-3.5 text-neutral-700">{log.facility}</td>
                <td className="p-3.5 font-semibold text-neutral-900">{log.action}</td>
                <td className="p-3.5 text-neutral-600">{log.dataAccessed}</td>
                <td className="p-3.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-800 uppercase">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Signed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AccountGate({
  patients,
  createAccount,
  signInWithSerial,
}: {
  patients: ReturnType<typeof useVault>["patients"];
  createAccount: ReturnType<typeof useVault>["createAccount"];
  signInWithSerial: ReturnType<typeof useVault>["signInWithSerial"];
}) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"Female" | "Male" | "Other">("Female");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [preferredLanguage, setPreferredLanguage] = useState<IndicLanguage>("en");
  const [serialInput, setSerialInput] = useState("");
  const [signInError, setSignInError] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age) return;
    createAccount({ name: name.trim(), age: Number(age), gender, phone, bloodGroup, preferredLanguage });
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const found = signInWithSerial(serialInput);
    if (!found) setSignInError("No TalkRx account found for that Serial Number.");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div className="text-center max-w-xl mx-auto">
        <h3 className="text-3xl font-bold tracking-tight text-neutral-950">Patient Health Passport</h3>
        <p className="mt-2 text-xs text-neutral-500">
          Create your TalkRx digital passport to receive a unique 8-digit Serial Number and emergency QR code, or sign in to view your records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Create account */}
        <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-neutral-900" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-950" style={{ fontFamily: "var(--do-font-label)" }}>
              Create Your Health Passport
            </span>
          </div>
          <form onSubmit={handleCreate} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-neutral-600 block mb-1">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh Iyer" required className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-600 block mb-1">Age</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="42" required min={0} max={120} className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900" />
              </div>
              <div>
                <label className="font-semibold text-neutral-600 block mb-1">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value as typeof gender)} className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900">
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-600 block mb-1">Blood Group</label>
                <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900">
                  <option>O+</option>
                  <option>A+</option>
                  <option>B+</option>
                  <option>AB+</option>
                  <option>O-</option>
                  <option>A-</option>
                  <option>B-</option>
                  <option>AB-</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-neutral-600 block mb-1">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98402 12345" className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900" />
              </div>
            </div>

            <button type="submit" className="w-full rounded-full bg-neutral-950 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-sm mt-2">
              Generate Digital Passport
            </button>
          </form>
        </div>

        {/* Sign in with existing patient */}
        <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LogIn className="h-4 w-4 text-neutral-900" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-950" style={{ fontFamily: "var(--do-font-label)" }}>
                Sign In With Serial Number
              </span>
            </div>
            <form onSubmit={handleSignIn} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-600 block mb-1">8-Digit TalkRx Serial Number</label>
                <input
                  value={serialInput}
                  onChange={(e) => setSerialInput(e.target.value)}
                  placeholder="e.g. 4821 7790"
                  required
                  className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 font-mono tracking-widest text-neutral-900 uppercase"
                />
              </div>
              {signInError && <p className="text-xs text-red-600">{signInError}</p>}
              <button type="submit" className="w-full rounded-full border border-black/10 bg-neutral-100 py-3 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:bg-neutral-200">
                Unlock Health Passport
              </button>
            </form>

            <div className="pt-3 border-t border-black/5">
              <span className="text-[11px] text-neutral-400 block mb-2 font-bold uppercase">Quick Demo Profiles:</span>
              <div className="space-y-1.5">
                {patients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => signInWithSerial(p.serialNumber)}
                    className="w-full text-left p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-xs flex items-center justify-between border border-black/5"
                  >
                    <span className="font-bold text-neutral-900">{p.name} ({p.age} Y)</span>
                    <span className="font-mono text-[11px] text-neutral-500">{formatSerial(p.serialNumber)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
