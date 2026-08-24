"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  Scan,
} from "lucide-react";
import { MOCK_PATIENTS } from "./mock-data";

export function DocumentIntelligence() {
  const patient = MOCK_PATIENTS[0]; // Kamala
  const [selectedDocId, setSelectedDocId] = useState<string>("doc-1");

  const selectedDoc = patient.documents.find((d) => d.id === selectedDocId) || patient.documents[0];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/[0.06] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scan className="h-3.5 w-3.5 text-neutral-900" />
            <span
              className="text-[11px] font-bold uppercase tracking-[1.5px] text-neutral-800"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Medical Document Intelligence &bull; OCR &amp; Vision AI
            </span>
          </div>
          <h3 className="mt-1 text-2xl font-normal tracking-tight text-neutral-950">
            Prescription &amp; Lab Report Digitizer
          </h3>
          <p className="text-xs text-neutral-500">
            Converts physical paper records into FHIR-compliant structured data with side-by-side source verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider" style={{ fontFamily: "var(--do-font-label)" }}>
            Document:
          </span>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="rounded-full border border-black/10 bg-white/80 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            {patient.documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title} ({doc.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-side Document Verification Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original Document Source View */}
        <div className="rounded-3xl border border-black/10 bg-neutral-950 p-6 text-white space-y-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400" style={{ fontFamily: "var(--do-font-label)" }}>
                Source Physical Record (Prescription OCR)
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-neutral-300 font-mono">
                Kiosk Camera Stream
              </span>
            </div>

            <div className="mt-4 rounded-2xl bg-neutral-900/80 p-5 font-mono text-sm text-neutral-300 leading-relaxed border border-white/5">
              <div className="text-neutral-500 text-xs uppercase mb-2 font-mono">// Raw Cursive OCR Stream:</div>
              {selectedDoc.rawText}
            </div>

            <div className="mt-4 text-xs text-neutral-400 space-y-1">
              <div>Facility: <strong className="text-white">{selectedDoc.facility}</strong></div>
              <div>Date: <strong className="text-white">{selectedDoc.date}</strong></div>
              {selectedDoc.doctorName && <div>Practitioner: <strong className="text-white">{selectedDoc.doctorName}</strong></div>}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span>OCR Confidence: <strong className="text-white">{(selectedDoc.ocrConfidence * 100).toFixed(1)}%</strong></span>
            <span className="text-white font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Verifiable
            </span>
          </div>
        </div>

        {/* Right: AI-Extracted Structured Findings */}
        <div className="rounded-3xl border border-black/[0.08] bg-white/80 backdrop-blur-xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-950" style={{ fontFamily: "var(--do-font-label)" }}>
              AI-Extracted Structured Findings (FHIR R4 Coded)
            </span>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[9px] font-bold text-neutral-800 uppercase">
              Verified
            </span>
          </div>

          {/* Extracted Diagnoses */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2" style={{ fontFamily: "var(--do-font-label)" }}>
              Extracted Clinical Diagnoses:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedDoc.extractedDiagnoses.map((diag, idx) => (
                <span key={idx} className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-semibold text-neutral-900 border border-black/5">
                  {diag}
                </span>
              ))}
            </div>
          </div>

          {/* Extracted Lab Parameters */}
          {selectedDoc.extractedLabs.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2" style={{ fontFamily: "var(--do-font-label)" }}>
                Extracted Laboratory Parameters &amp; Normal Ranges:
              </span>
              <div className="space-y-2 text-xs">
                {selectedDoc.extractedLabs.map((lab) => (
                  <div key={lab.id} className="rounded-2xl bg-neutral-50 p-3.5 border border-black/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-950">{lab.parameter}</span>
                      <span className="text-neutral-500 text-[11px] block">Range: {lab.referenceRange}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${lab.isAbnormal ? "text-red-600" : "text-neutral-900"}`}>
                        {lab.value} {lab.unit}
                      </span>
                      {lab.isAbnormal && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[8px] font-bold text-red-800 block mt-0.5 uppercase">
                          Elevated
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-neutral-50 p-4 border border-black/5 text-xs text-neutral-700 leading-relaxed">
            <strong className="text-neutral-950">Standard Formulary Normalization:</strong> Raw handwritten acronym &ldquo;Tab Glycomet 500 BD&rdquo; resolved to generic molecule <strong>Metformin Hydrochloride 500mg Oral Tablet</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
