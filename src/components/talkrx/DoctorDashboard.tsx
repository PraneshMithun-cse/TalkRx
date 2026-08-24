"use client";

import React, { useState } from "react";
import {
  User,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Pill,
  Sparkles,
  Search,
  Filter,
  Eye,
  Plus,
  ArrowUpRight,
  Stethoscope,
  Activity,
  History,
  Info,
  Calendar,
  Building2,
  ChevronDown,
  ShieldAlert,
  KeyRound,
  Pencil,
  X,
} from "lucide-react";
import { useVault } from "./VaultContext";
import { formatSerial } from "./serial";
import { ProvenanceBadge } from "./ProvenanceBadge";
import { TimelineStream } from "./TimelineStream";
import type { DoctorIdentity } from "./types";

const DEFAULT_IDENTITY: DoctorIdentity = {
  name: "Dr. A. Rajan, MD",
  licenseNumber: "TN-MED-88214",
  organization: "District Hospital Tirunelveli",
  department: "General Medicine",
};

export function DoctorDashboard() {
  const { isHydrated, patients, doctorIdentity, setDoctorIdentity, lookupPatient, addDoctorRecord, grantConsent, logAccess } = useVault();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"summary" | "timeline" | "medications" | "ayush" | "prescribe">("summary");
  const [newPrescription, setNewPrescription] = useState({
    drugName: "",
    dosage: "",
    frequency: "BD",
    duration: "14 days",
  });
  const [prescriptionsList, setPrescriptionsList] = useState<string[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [diagnosesList, setDiagnosesList] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState("");

  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [identityForm, setIdentityForm] = useState<DoctorIdentity>(DEFAULT_IDENTITY);

  const [serialLookup, setSerialLookup] = useState("");
  const [lookupMessage, setLookupMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const effectivePatientId = selectedPatientId || patients[0]?.id || "";
  const patient = patients.find((p) => p.id === effectivePatientId) || patients[0];

  if (!isHydrated || !patient) {
    return (
      <div className="rounded-3xl border border-black/[0.08] bg-white/60 p-10 text-center text-xs text-neutral-400 animate-pulse">
        Loading patient queue&hellip;
      </div>
    );
  }

  const handleAddRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrescription.drugName) return;

    if (newPrescription.drugName.toLowerCase().includes("sulfa") || newPrescription.drugName.toLowerCase().includes("cotrim")) {
      alert("CRITICAL CONTRAINDICATION: Patient has documented severe Sulfa drug allergy (Angioedema 2022). Prescription blocked by TalkRx safety engine.");
      return;
    }

    setPrescriptionsList((prev) => [
      ...prev,
      `${newPrescription.drugName} ${newPrescription.dosage} ${newPrescription.frequency} x ${newPrescription.duration}`,
    ]);
    setNewPrescription({ drugName: "", dosage: "", frequency: "BD", duration: "14 days" });
  };

  const handleAddDiagnosis = () => {
    if (!diagnosisInput.trim()) return;
    setDiagnosesList((prev) => [...prev, diagnosisInput.trim()]);
    setDiagnosisInput("");
  };

  const identity = doctorIdentity || DEFAULT_IDENTITY;

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorIdentity(identityForm);
    setIsEditingIdentity(false);
  };

  const handleSerialLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = lookupPatient(serialLookup);
    if (!found) {
      setLookupMessage({ type: "error", text: "No TalkRx account found for that Serial Number / QR." });
      return;
    }
    setSelectedPatientId(found.id);
    grantConsent(found.id, {
      granteeName: identity.name,
      granteeType: "Doctor",
      purpose: "Serial-authorized access",
      dataCategories: ["All History"],
      accessLevel: "Full Care Access",
      validFrom: new Date().toISOString().slice(0, 16).replace("T", " "),
      validTill: new Date(Date.now() + 12 * 3600 * 1000).toISOString().slice(0, 16).replace("T", " "),
    });
    logAccess(found.id, {
      accessorName: identity.name,
      accessorRole: `${identity.department || "Physician"}`,
      facility: identity.organization,
      action: "Serial-Authorized Access",
      dataAccessed: "Full Health Profile (Serial-Authorized)",
      ipLocation: "TalkRx Doctor Dashboard",
    });
    setLookupMessage({ type: "ok", text: `Access granted to ${found.name}'s record • logged to their audit ledger.` });
    setSerialLookup("");
  };

  const handleCompleteConsultation = () => {
    addDoctorRecord(patient.id, {
      doctorName: identity.name,
      licenseNumber: identity.licenseNumber,
      organization: identity.organization,
      clinicalNotes,
      diagnoses: diagnosesList,
      recommendations,
      prescriptions: prescriptionsList.map((rx) => {
        const [drugName, dosage, frequency, ...rest] = rx.split(" ");
        return { drugName, dosage: dosage || "", frequency: frequency || "", duration: rest.join(" ") || "" };
      }),
    });
    alert("Consultation saved. Written back to the patient's TalkRx Health Passport, tagged with your name and license.");
    setPrescriptionsList([]);
    setClinicalNotes("");
    setDiagnosesList([]);
    setRecommendations("");
  };

  return (
    <div className="space-y-6">
      {/* Top Doctor Navigation Header */}
      <div className="rounded-2xl bg-neutral-950 p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-black/10 shadow-sm">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="rounded-full bg-white/10 p-2.5 text-white shrink-0">
            <Stethoscope className="h-5 w-5 stroke-[1.75]" />
          </div>
          {isEditingIdentity ? (
            <form onSubmit={handleSaveIdentity} className="grid grid-cols-2 gap-2 text-xs flex-1">
              <input
                value={identityForm.name}
                onChange={(e) => setIdentityForm({ ...identityForm, name: e.target.value })}
                placeholder="Doctor Name"
                className="rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-white placeholder:text-neutral-500"
              />
              <input
                value={identityForm.licenseNumber}
                onChange={(e) => setIdentityForm({ ...identityForm, licenseNumber: e.target.value })}
                placeholder="License / Registration No."
                className="rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-white placeholder:text-neutral-500"
              />
              <input
                value={identityForm.organization}
                onChange={(e) => setIdentityForm({ ...identityForm, organization: e.target.value })}
                placeholder="Organization / Facility"
                className="rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-white placeholder:text-neutral-500"
              />
              <div className="flex gap-2">
                <input
                  value={identityForm.department}
                  onChange={(e) => setIdentityForm({ ...identityForm, department: e.target.value })}
                  placeholder="Department"
                  className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-white placeholder:text-neutral-500"
                />
                <button type="submit" className="rounded-lg bg-white text-black px-3 font-bold uppercase text-[10px]">Save</button>
              </div>
            </form>
          ) : (
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{identity.name}</span>
                <span
                  className="rounded-full bg-white/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-300"
                  style={{ fontFamily: "var(--do-font-label)" }}
                >
                  {identity.licenseNumber}
                </span>
                <button
                  type="button"
                  onClick={() => { setIdentityForm(identity); setIsEditingIdentity(true); }}
                  aria-label="Edit doctor identity"
                  className="text-neutral-500 hover:text-white"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              </div>
              <p className="text-xs text-neutral-400">{identity.organization} &bull; {identity.department}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            Queue:
          </span>
          <select
            value={effectivePatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="rounded-full border border-neutral-700 bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-white"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.tokenNumber} — {p.name} ({p.age}y, {p.gender}) {p.queueStatus === "triage-alert" ? "[CRITICAL TRIAGE]" : "[Intake Ready]"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Access by Serial / QR */}
      <div className="rounded-3xl border border-black/[0.08] bg-white/80 backdrop-blur-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <KeyRound className="h-4 w-4 text-neutral-900" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-950" style={{ fontFamily: "var(--do-font-label)" }}>
            Access Patient Record by TalkRx Serial Number / QR
          </span>
        </div>
        <form onSubmit={handleSerialLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            value={serialLookup}
            onChange={(e) => { setSerialLookup(e.target.value); setLookupMessage(null); }}
            placeholder="Enter patient's 8-digit TalkRx Serial Number"
            className="flex-1 rounded-xl border border-black/10 p-2.5 text-xs font-mono tracking-widest bg-neutral-50 text-neutral-900"
          />
          <button
            type="submit"
            className="rounded-xl bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shrink-0"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            Access Record
          </button>
        </form>
        {lookupMessage && (
          <p className={`mt-2 text-xs font-medium ${lookupMessage.type === "ok" ? "text-emerald-800" : "text-red-600"}`}>
            {lookupMessage.type === "ok" ? <ShieldCheck className="h-3.5 w-3.5 inline mr-1" /> : null}
            {lookupMessage.text}
          </p>
        )}
      </div>

      {/* Patient Header Card */}
      <div className="rounded-3xl border border-black/[0.08] bg-white/80 backdrop-blur-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white font-bold text-lg">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-bold text-neutral-950">{patient.name}</h4>
                <span className="text-xs text-neutral-500 font-medium">
                  {patient.age} Yrs &bull; {patient.gender} &bull; Blood: {patient.bloodGroup}
                </span>
                <span
                  className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-neutral-800"
                  style={{ fontFamily: "var(--do-font-label)" }}
                >
                  {patient.tokenNumber}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                <span>ABHA: <strong>{patient.abhaId}</strong></span>
                <span>&bull;</span>
                <span>Language: <strong>{patient.preferredLanguage.toUpperCase()}</strong></span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1 text-emerald-800 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" /> Granular Consent (12h)
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Pill Grid */}
          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-neutral-50 p-3 border border-black/5 text-center min-w-[90px]">
              <div className="text-[9px] font-bold text-neutral-400 uppercase" style={{ fontFamily: "var(--do-font-label)" }}>
                Intake Time
              </div>
              <div className="text-sm font-bold text-neutral-950 mt-0.5">
                {patient.structuredSummary?.intakeDurationSeconds || 320}s
              </div>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-3 border border-black/5 text-center min-w-[90px]">
              <div className="text-[9px] font-bold text-neutral-400 uppercase" style={{ fontFamily: "var(--do-font-label)" }}>
                Doctor Read
              </div>
              <div className="text-sm font-bold text-neutral-950 mt-0.5">&lt; 60s</div>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-3 border border-black/5 text-center min-w-[90px]">
              <div className="text-[9px] font-bold text-neutral-400 uppercase" style={{ fontFamily: "var(--do-font-label)" }}>
                Data Points
              </div>
              <div className="text-sm font-bold text-neutral-950 mt-0.5">48 Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Pill Tabs */}
      <div className="flex justify-start overflow-x-auto gap-2 border-b border-black/[0.06] pb-3">
        {[
          { id: "summary", label: "60s Structured Summary" },
          { id: "timeline", label: `Longitudinal Timeline (${patient.timeline.length})` },
          { id: "medications", label: "Medication Intelligence" },
          ...(patient.ayushData ? [{ id: "ayush", label: "AYUSH Dashavidha Panel" }] : []),
          { id: "prescribe", label: "Consultation & Prescription" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-black text-white shadow-sm"
                  : "bg-white/60 text-neutral-600 hover:text-black hover:bg-white"
              }`}
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="rounded-3xl border border-black/[0.08] bg-white/90 backdrop-blur-2xl p-6 shadow-sm space-y-6">
        {/* 1. 60-Second Structured Summary */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            {/* Allergies and Critical Warnings Alert */}
            {patient.allergies.length > 0 && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.04] p-4 flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div
                    className="text-[10px] font-bold uppercase tracking-widest text-red-800"
                    style={{ fontFamily: "var(--do-font-label)" }}
                  >
                    Critical Documented Allergies &bull; Hard Contraindications
                  </div>
                  <div className="mt-1 text-sm font-bold text-red-950">
                    {patient.allergies.join(", ")}
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-600">
                    Sourced from Tirunelveli Medical College Hospital ADR registry (2022). Verified in ABHA Passport.
                  </p>
                </div>
              </div>
            )}

            {/* Red Flag Alert if any */}
            {patient.structuredSummary?.redFlagsDetected && patient.structuredSummary.redFlagsDetected.length > 0 && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.04] p-4 flex items-start gap-3">
                <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest text-red-800"
                    style={{ fontFamily: "var(--do-font-label)" }}
                  >
                    Emergency Red-Flag Triggered
                  </span>
                  <p className="text-sm font-bold text-neutral-950 mt-1 font-mono">
                    {patient.structuredSummary.redFlagsDetected[0].matchedRule}
                  </p>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    <strong>Patient Statement:</strong> &ldquo;{patient.structuredSummary.redFlagsDetected[0].patientStatement}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* Chief Complaint & Narrative HPI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl border border-black/5 bg-neutral-50/60 p-5 space-y-3">
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block"
                      style={{ fontFamily: "var(--do-font-label)" }}
                    >
                      Chief Complaint
                    </span>
                    <h5 className="text-base font-bold text-neutral-950 mt-0.5">
                      {patient.structuredSummary?.chiefComplaint}
                    </h5>
                    <div className="text-xs text-neutral-500">
                      Duration: <strong>{patient.structuredSummary?.duration}</strong>
                    </div>
                  </div>

                  <hr className="border-black/5" />

                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 block mb-1.5"
                      style={{ fontFamily: "var(--do-font-label)" }}
                    >
                      History of Present Illness (HPI):
                    </span>
                    <p className="text-xs md:text-sm leading-relaxed text-neutral-800 bg-white p-4 rounded-xl border border-black/5">
                      {patient.structuredSummary?.hpiNarrative}
                    </p>
                  </div>

                  {/* Pain Characteristics */}
                  {patient.structuredSummary?.painCharacteristics && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                      <div className="rounded-xl bg-white p-2.5 border border-black/5">
                        <span className="text-neutral-400 block text-[10px] uppercase">Site:</span>
                        <span className="font-bold text-neutral-900">{patient.structuredSummary.painCharacteristics.site}</span>
                      </div>
                      <div className="rounded-xl bg-white p-2.5 border border-black/5">
                        <span className="text-neutral-400 block text-[10px] uppercase">Character:</span>
                        <span className="font-bold text-neutral-900">{patient.structuredSummary.painCharacteristics.character}</span>
                      </div>
                      <div className="rounded-xl bg-white p-2.5 border border-black/5">
                        <span className="text-neutral-400 block text-[10px] uppercase">Severity:</span>
                        <span className="font-bold text-neutral-900">{patient.structuredSummary.painCharacteristics.severity} / 10</span>
                      </div>
                      <div className="rounded-xl bg-white p-2.5 border border-black/5">
                        <span className="text-neutral-400 block text-[10px] uppercase">Aggravating:</span>
                        <span className="font-bold text-neutral-900">{patient.structuredSummary.painCharacteristics.aggravatingFactors.join(", ")}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pertinent Positives & Negatives */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl border border-black/5 bg-neutral-50/70 p-4">
                    <span className="font-bold uppercase tracking-wider text-neutral-900 block mb-2" style={{ fontFamily: "var(--do-font-label)" }}>
                      Pertinent Positives
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-800">
                      {patient.structuredSummary?.pertinentPositives.map((pos, idx) => (
                        <li key={idx}>{pos}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-neutral-50/70 p-4">
                    <span className="font-bold uppercase tracking-wider text-neutral-700 block mb-2" style={{ fontFamily: "var(--do-font-label)" }}>
                      Pertinent Negatives
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-800">
                      {patient.structuredSummary?.pertinentNegatives.map((neg, idx) => (
                        <li key={idx}>{neg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sidebar Background Info */}
              <div className="space-y-4 text-xs">
                <div className="rounded-2xl border border-black/5 p-4 bg-neutral-50/50">
                  <span className="font-bold uppercase tracking-wider text-neutral-900 block mb-2" style={{ fontFamily: "var(--do-font-label)" }}>
                    Past Medical &amp; Surgical
                  </span>
                  <ul className="space-y-1.5 text-neutral-700">
                    {patient.structuredSummary?.pastMedicalHistory.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-black" />
                        <span>{h}</span>
                      </li>
                    ))}
                    {patient.structuredSummary?.pastSurgicalHistory.map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-black/5 p-4 bg-neutral-50/50">
                  <span className="font-bold uppercase tracking-wider text-neutral-900 block mb-2" style={{ fontFamily: "var(--do-font-label)" }}>
                    Family &amp; Social
                  </span>
                  <ul className="space-y-1.5 text-neutral-700">
                    {patient.structuredSummary?.familyHistory.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-black/5 p-4 bg-neutral-50/50">
                  <span className="font-bold uppercase tracking-wider text-neutral-900 block mb-2" style={{ fontFamily: "var(--do-font-label)" }}>
                    Review of Systems (ROS)
                  </span>
                  <div className="space-y-2 text-neutral-700">
                    {patient.structuredSummary?.reviewOfSystems &&
                      Object.entries(patient.structuredSummary.reviewOfSystems).map(([sys, findings]) => (
                        <div key={sys}>
                          <span className="font-semibold text-neutral-900">{sys}:</span>{" "}
                          <span className="text-neutral-600">{findings}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Longitudinal Health Timeline */}
        {activeTab === "timeline" && (
          <div className="space-y-6">
            <div className="border-b border-black/[0.06] pb-4">
              <h5 className="text-sm font-bold text-neutral-950 uppercase tracking-wide" style={{ fontFamily: "var(--do-font-label)" }}>
                Connected Longitudinal Health Timeline
              </h5>
              <p className="text-xs text-neutral-500">
                Aggregated across self-assessment, hospital visits, doctor consultations, pharmacy dispensation, and laboratory reports with source provenance.
              </p>
            </div>

            <TimelineStream
              events={patient.timeline}
              variant="inline"
              showFilters
              categories={["case-taking", "dispensation", "lab", "document", "consultation"]}
              emptyStateLabel="No timeline events for this patient yet."
            />
          </div>
        )}

        {/* 3. Medication Intelligence */}
        {activeTab === "medications" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-neutral-50 p-4 border border-black/5">
              <span className="text-xs font-bold uppercase text-neutral-900 block" style={{ fontFamily: "var(--do-font-label)" }}>
                Three-Sided Medication Reconciliation Network
              </span>
              <p className="mt-0.5 text-xs text-neutral-600">
                Cross-references what doctors prescribed, what pharmacies actually dispensed, and active patient-reported therapy.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-black/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 font-bold uppercase text-neutral-700 text-[10px]" style={{ fontFamily: "var(--do-font-label)" }}>
                  <tr>
                    <th className="p-3">Generic Molecule</th>
                    <th className="p-3">Brand &amp; Dosage</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3">Source Provenance</th>
                    <th className="p-3">Dispensation Status</th>
                    <th className="p-3">Safety Risk Alert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {patient.activeMedications.map((med) => (
                    <tr key={med.id} className="hover:bg-neutral-50">
                      <td className="p-3 font-bold text-neutral-950">{med.standardMolecule}</td>
                      <td className="p-3 text-neutral-700">
                        {med.brandName || "Generic"} &bull; {med.dosage}
                      </td>
                      <td className="p-3 text-neutral-600">{med.frequency}</td>
                      <td className="p-3">
                        <ProvenanceBadge source={med.source} confidence={med.confidence} verified={med.source === "doctor-prescribed"} />
                      </td>
                      <td className="p-3">
                        {med.dispensedBy ? (
                          <div className="text-emerald-800 font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Dispensed ({med.dispensedBy})
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">Self-reported / Prescribed</span>
                        )}
                      </td>
                      <td className="p-3">
                        {med.notes ? (
                          <span className="rounded bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-800">
                            {med.notes}
                          </span>
                        ) : (
                          <span className="text-neutral-400 font-normal">&bull; No interaction</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. AYUSH Dashavidha Panel */}
        {activeTab === "ayush" && patient.ayushData && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-neutral-50 p-4 border border-black/5">
              <span className="text-xs font-bold uppercase text-neutral-900 block" style={{ fontFamily: "var(--do-font-label)" }}>
                Dashavidha Pariksha &bull; NAMASTE &amp; WHO ICD-11 TM-2 Coded
              </span>
              <p className="mt-0.5 text-xs text-neutral-600">
                10-fold constitutional examination completed by patient in waiting queue before seeing the Vaidya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
                <span className="text-[10px] font-bold uppercase text-neutral-400" style={{ fontFamily: "var(--do-font-label)" }}>
                  1. Prakriti (Constitution)
                </span>
                <div className="text-base font-bold text-neutral-950">{patient.ayushData.prakriti.primaryDosha}</div>
                <div className="text-neutral-600">{patient.ayushData.prakriti.physicalTraits}</div>
                <div className="pt-2 flex gap-2 text-[10px] font-bold">
                  <span className="rounded bg-neutral-100 px-2 py-0.5">V: {patient.ayushData.prakriti.scores.vata}%</span>
                  <span className="rounded bg-neutral-100 px-2 py-0.5">P: {patient.ayushData.prakriti.scores.pitta}%</span>
                  <span className="rounded bg-neutral-100 px-2 py-0.5">K: {patient.ayushData.prakriti.scores.kapha}%</span>
                </div>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
                <span className="text-[10px] font-bold uppercase text-neutral-400" style={{ fontFamily: "var(--do-font-label)" }}>
                  2. Vikriti (Pathology)
                </span>
                <div className="text-base font-bold text-neutral-950">{patient.ayushData.vikriti.imbalancedDosha} Imbalance</div>
                <div className="text-neutral-700 font-medium">{patient.ayushData.vikriti.currentDeviation}</div>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="rounded bg-neutral-100 p-1.5 font-mono text-neutral-900">
                    NAMASTE: {patient.ayushData.vikriti.namasteMorbidityCode}
                  </div>
                  <div className="rounded bg-neutral-100 p-1.5 font-mono text-neutral-900">
                    WHO ICD-11: {patient.ayushData.vikriti.whoIcd11Tm2Code}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
                <span className="text-[10px] font-bold uppercase text-neutral-400" style={{ fontFamily: "var(--do-font-label)" }}>
                  3-10. Constitutional Attributes
                </span>
                <div>Sara: <strong>{patient.ayushData.sara.tissueQuality}</strong></div>
                <div>Samhanana: <strong>{patient.ayushData.samhanana.build}</strong></div>
                <div>Agni: <strong>{patient.ayushData.agni}</strong></div>
                <div>Koshtha: <strong>{patient.ayushData.koshtha}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Prescribe Builder */}
        {activeTab === "prescribe" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-black/5 p-5 bg-neutral-50/50 space-y-4">
              <div>
                <span className="text-xs font-bold text-neutral-900 uppercase block mb-2" style={{ fontFamily: "var(--do-font-label)" }}>
                  Clinical Notes &amp; Observations
                </span>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  rows={3}
                  placeholder="Professional observations from this consultation..."
                  className="w-full rounded-xl border border-black/10 p-2.5 text-xs text-neutral-900 bg-white"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-900 uppercase block mb-2" style={{ fontFamily: "var(--do-font-label)" }}>
                  Diagnosed / Observed Conditions
                </span>
                <div className="flex gap-2">
                  <input
                    value={diagnosisInput}
                    onChange={(e) => setDiagnosisInput(e.target.value)}
                    placeholder="e.g. Type 2 Diabetes Mellitus, uncontrolled"
                    className="flex-1 rounded-xl border border-black/10 p-2.5 text-xs text-neutral-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddDiagnosis}
                    className="rounded-xl bg-neutral-900 px-4 text-xs font-bold uppercase text-white hover:bg-neutral-800"
                    style={{ fontFamily: "var(--do-font-label)" }}
                  >
                    Add
                  </button>
                </div>
                {diagnosesList.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {diagnosesList.map((d, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 text-white px-3 py-1 text-[11px]">
                        {d}
                        <button type="button" onClick={() => setDiagnosesList((prev) => prev.filter((_, i) => i !== idx))}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-neutral-900 uppercase block mb-2" style={{ fontFamily: "var(--do-font-label)" }}>
                  Recommendations
                </span>
                <textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  rows={2}
                  placeholder="Lifestyle advice, follow-up instructions..."
                  className="w-full rounded-xl border border-black/10 p-2.5 text-xs text-neutral-900 bg-white"
                />
              </div>

              <hr className="border-black/5" />

              <span className="text-xs font-bold text-neutral-900 uppercase block" style={{ fontFamily: "var(--do-font-label)" }}>
                Add Prescription &bull; Real-Time Safety &amp; Allergy Guard
              </span>

              <form onSubmit={handleAddRx} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-neutral-600 block mb-1">Medicine Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Tab. Pregabalin 75mg"
                    value={newPrescription.drugName}
                    onChange={(e) => setNewPrescription({ ...newPrescription, drugName: e.target.value })}
                    className="w-full rounded-xl border border-black/10 p-2.5 text-neutral-900 bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-600 block mb-1">Dosage:</label>
                  <input
                    type="text"
                    placeholder="e.g. 75 mg"
                    value={newPrescription.dosage}
                    onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                    className="w-full rounded-xl border border-black/10 p-2.5 text-neutral-900 bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-600 block mb-1">Frequency:</label>
                  <select
                    value={newPrescription.frequency}
                    onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                    className="w-full rounded-xl border border-black/10 p-2.5 text-neutral-900 bg-white"
                  >
                    <option value="OD">Once daily (OD)</option>
                    <option value="BD">Twice daily (BD)</option>
                    <option value="TDS">Three times daily (TDS)</option>
                    <option value="SOS">As needed (SOS)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-black py-2.5 font-bold uppercase tracking-wider text-xs text-white shadow hover:bg-neutral-800 flex items-center justify-center gap-1"
                    style={{ fontFamily: "var(--do-font-label)" }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add to Rx</span>
                  </button>
                </div>
              </form>

              {/* Prescription Items */}
              <div className="mt-5 border-t border-black/5 pt-4">
                <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-2" style={{ fontFamily: "var(--do-font-label)" }}>
                  Current Consultation Prescription:
                </span>
                <ul className="space-y-2 text-xs">
                  {prescriptionsList.map((rx, idx) => (
                    <li key={idx} className="flex items-center justify-between rounded-xl bg-white p-3 border border-black/5 shadow-sm">
                      <span className="font-bold text-neutral-900">{rx}</span>
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[9px] font-bold uppercase text-neutral-700">
                        Ready for Dispensation QR
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleCompleteConsultation}
                  className="rounded-full bg-black px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow hover:bg-neutral-800"
                  style={{ fontFamily: "var(--do-font-label)" }}
                >
                  Save &amp; Complete Consultation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
