"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  AlertTriangle,
  Clock,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Radio,
  FileCode,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { MOCK_PATIENTS } from "./mock-data";

export function HospitalOperations() {
  const [selectedQueueFilter, setSelectedQueueFilter] = useState<string>("all");
  const [fhirExported, setFhirExported] = useState(false);

  const totalPatientsToday = 142;
  const completedIntakes = 138;
  const redFlagsCaught = 4;
  const hoursCapacitySaved = "3.5 hrs";

  const handleExportFhir = () => {
    setFhirExported(true);
    setTimeout(() => {
      alert("FHIR R4 Bundle generated containing Patient, Encounter, Observation, Condition, and AllergyIntolerance resources. Exported to ABDM Gateway.");
      setFhirExported(false);
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/[0.06] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-neutral-900 animate-pulse" />
            <span
              className="text-[11px] font-bold uppercase tracking-[1.5px] text-neutral-800"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Hospital &amp; Clinic Operations &bull; Live OPD Hub
            </span>
          </div>
          <h3 className="mt-1 text-2xl font-normal tracking-tight text-neutral-950">
            OPD Intake &amp; Triage Control Center
          </h3>
          <p className="text-xs text-neutral-500">
            District Hospital Tirunelveli &bull; General Medicine &amp; AYUSH OPD Network
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportFhir}
            className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-sm"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            <FileCode className="h-3.5 w-3.5 text-neutral-300" />
            <span>{fhirExported ? "Exporting FHIR..." : "Export FHIR R4 Bundle"}</span>
          </button>
        </div>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-black/[0.08] bg-white/70 backdrop-blur-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--do-font-label)" }}>
              Patients Today
            </span>
            <Users className="h-4 w-4 stroke-[1.5]" />
          </div>
          <div className="mt-3 text-3xl font-normal tracking-tight text-neutral-950">{totalPatientsToday}</div>
          <div className="mt-1 text-xs text-neutral-500 font-medium">97.2% completed digital intake</div>
        </div>

        <div className="rounded-3xl border border-black/[0.08] bg-white/70 backdrop-blur-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--do-font-label)" }}>
              Physician Hours Gained
            </span>
            <Clock className="h-4 w-4 stroke-[1.5]" />
          </div>
          <div className="mt-3 text-3xl font-normal tracking-tight text-neutral-950">+{hoursCapacitySaved}</div>
          <div className="mt-1 text-xs text-neutral-500 font-medium">~90s saved per consultation</div>
        </div>

        <div className="rounded-3xl border border-black/[0.08] bg-white/70 backdrop-blur-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--do-font-label)" }}>
              Red-Flags Diverted
            </span>
            <ShieldAlert className="h-4 w-4 stroke-[1.5]" />
          </div>
          <div className="mt-3 text-3xl font-normal tracking-tight text-neutral-950">{redFlagsCaught}</div>
          <div className="mt-1 text-xs text-neutral-500 font-medium">Emergency Triage &lt; 3 mins</div>
        </div>

        <div className="rounded-3xl border border-black/[0.08] bg-white/70 backdrop-blur-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--do-font-label)" }}>
              ABDM Rails Sync
            </span>
            <ShieldCheck className="h-4 w-4 stroke-[1.5]" />
          </div>
          <div className="mt-3 text-3xl font-normal tracking-tight text-neutral-950">100%</div>
          <div className="mt-1 text-xs text-neutral-500 font-medium">HFR &amp; HPR Registered</div>
        </div>
      </div>

      {/* Live Priority Red-Flag Broadcast Desk */}
      <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] backdrop-blur-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            <h4
              className="text-xs font-bold text-neutral-950 uppercase tracking-[1.5px]"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Emergency Triage Priority Broadcast (Deterministic Rule Engine)
            </h4>
          </div>
          <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
            Active Priority Queue
          </span>
        </div>

        <div className="rounded-2xl bg-white/90 p-5 border border-black/5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase">
                TK-108
              </span>
              <span className="font-bold text-neutral-950 text-sm">Suresh Kumar (47y, Male)</span>
              <span className="text-sm font-mono text-neutral-500">&bull; Rule: RULE_ACS_01 (Cardiac)</span>
            </div>
            <p className="text-sm text-neutral-700 mt-1 font-mono bg-neutral-50 p-2.5 rounded-lg border border-black/5">
              &ldquo;chhati me bahut bhaari pan hai, baaye haath me dard jaa raha hai aur bahut paseena aa raha hai&rdquo;
            </p>
            <div className="mt-2 text-[11px] text-neutral-500 font-medium">
              Escalated to: <strong>Emergency Triage Bed #1 &bull; Dr. K. Balaji on duty</strong> &bull; Token priority escalated to position #1.
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-800">
              Triage Nurse Acknowledged
            </span>
          </div>
        </div>
      </div>

      {/* Live OPD Patient Queue Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-neutral-950 tracking-tight">
            Live OPD Intake &amp; Case Completion Queue
          </h4>
          <div className="flex gap-1.5 text-xs">
            {["all", "waiting", "case-completed", "triage-alert"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedQueueFilter(status)}
                className={`rounded-full px-3 py-1 font-medium uppercase text-[9px] transition-colors ${
                  selectedQueueFilter === status
                    ? "bg-black text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-black/[0.08] bg-white/80 backdrop-blur-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100/70 font-bold uppercase text-neutral-700 text-[10px]" style={{ fontFamily: "var(--do-font-label)" }}>
              <tr>
                <th className="p-3.5">Token</th>
                <th className="p-3.5">Patient Name</th>
                <th className="p-3.5">Age / Sex</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Language</th>
                <th className="p-3.5">Intake Status</th>
                <th className="p-3.5">Red-Flag Safety</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {MOCK_PATIENTS.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/60">
                  <td className="p-3.5 font-bold text-neutral-950">{p.tokenNumber}</td>
                  <td className="p-3.5 font-semibold text-neutral-800">{p.name}</td>
                  <td className="p-3.5 text-neutral-600">{p.age} / {p.gender.charAt(0)}</td>
                  <td className="p-3.5 text-neutral-600">{p.department}</td>
                  <td className="p-3.5 uppercase font-bold text-neutral-500">{p.preferredLanguage}</td>
                  <td className="p-3.5">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-bold text-neutral-800 text-[9px] uppercase">
                      {p.queueStatus}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {p.structuredSummary?.redFlagsDetected && p.structuredSummary.redFlagsDetected.length > 0 ? (
                      <span className="rounded-full bg-red-600 px-2.5 py-0.5 font-bold text-white text-[9px] uppercase">
                        CRITICAL TRIAGE
                      </span>
                    ) : (
                      <span className="text-neutral-500 font-medium">Routine Queue</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => alert(`Opening ${p.name}'s verified chart summary.`)}
                      className="text-neutral-900 hover:underline font-bold"
                    >
                      View Chart &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
