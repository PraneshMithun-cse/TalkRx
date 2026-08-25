"use client";

import React, { useRef, useState } from "react";
import { FileText, CheckCircle2, Scan, Upload, Loader2, Search } from "lucide-react";
import { useVault } from "./VaultContext";
import { isValidSerial } from "./serial";

const CATEGORIES = [
  { value: "prescription", label: "Prescription" },
  { value: "lab_report", label: "Lab Report" },
  { value: "discharge_summary", label: "Discharge Summary" },
  { value: "diagnostic_scan", label: "Diagnostic Scan" },
  { value: "ayush_consult", label: "AYUSH Consult" },
] as const;

export function DocumentIntelligence() {
  const { currentPatient, patients, lookupPatient, uploadMedicalDocument } = useVault();
  const isStaff = !currentPatient;

  const [targetPatientId, setTargetPatientId] = useState<string | null>(null);
  const [serialInput, setSerialInput] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["value"]>("prescription");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const patient = currentPatient ?? patients.find((p) => p.id === targetPatientId) ?? null;
  const selectedDoc = patient?.documents.find((d) => d.id === selectedDocId) ?? patient?.documents[patient.documents.length - 1];

  const handleLookupSerial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError("");
    if (!isValidSerial(serialInput)) {
      setLookupError("Enter a valid 8-digit TalkRx Serial Number.");
      return;
    }
    const found = await lookupPatient(serialInput);
    if (!found) {
      setLookupError("No TalkRx account found for that Serial Number.");
      return;
    }
    setTargetPatientId(found.id);
    setSelectedDocId(null);
  };

  const handleFileSelected = async (file: File) => {
    if (!patient) return;
    setUploadError("");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("patientId", patient.id);
      formData.append("category", category);
      formData.append("title", file.name.replace(/\.[^/.]+$/, "") || "Uploaded Document");
      formData.append("facility", "TalkRx Digital");
      await uploadMedicalDocument(formData);
      setSelectedDocId(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed — please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isStaff && !patient) {
    return (
      <div className="space-y-6">
        <div className="border-b border-black/[0.06] pb-5">
          <div className="flex items-center gap-2">
            <Scan className="h-3.5 w-3.5 text-neutral-900" />
            <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-neutral-800" style={{ fontFamily: "var(--do-font-label)" }}>
              Medical Document Intelligence &bull; OCR &amp; Vision AI
            </span>
          </div>
          <h3 className="mt-1 text-2xl font-normal tracking-tight text-neutral-950">Prescription &amp; Lab Report Digitizer</h3>
        </div>
        <form onSubmit={handleLookupSerial} className="max-w-md rounded-3xl border border-black/[0.08] bg-white p-6 space-y-3 shadow-sm">
          <label className="text-xs font-semibold text-neutral-600 block">Look up a patient by TalkRx Serial Number</label>
          <div className="flex gap-2">
            <input
              value={serialInput}
              onChange={(e) => setSerialInput(e.target.value)}
              placeholder="e.g. 4821 7790"
              className="flex-1 rounded-xl border border-black/10 p-2.5 bg-neutral-50 font-mono tracking-widest text-neutral-900 text-xs"
            />
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 px-4 text-xs font-bold uppercase text-white hover:bg-neutral-800">
              <Search className="h-3.5 w-3.5" /> Find
            </button>
          </div>
          {lookupError && <p className="text-xs text-red-600">{lookupError}</p>}
        </form>
      </div>
    );
  }

  if (!patient) {
    return <div className="p-10 text-center text-sm text-neutral-500">Loading patient record…</div>;
  }

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
            {patient.name} &bull; Converts physical paper records into FHIR-compliant structured data with side-by-side source verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {patient.documents.length > 0 && (
            <select
              value={selectedDoc?.id ?? ""}
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
          )}
        </div>
      </div>

      {/* Upload */}
      <div className="rounded-3xl border border-black/[0.08] bg-white/80 backdrop-blur-xl p-5 flex flex-wrap items-center gap-3 shadow-sm">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number]["value"])}
          className="rounded-full border border-black/10 bg-neutral-50 px-3.5 py-2 text-xs font-medium text-neutral-900"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFileSelected(file);
          }}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 disabled:opacity-50"
          style={{ fontFamily: "var(--do-font-label)" }}
        >
          {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {isUploading ? "Running Vision AI OCR…" : "Upload Document Photo"}
        </button>
        {uploadError && <span className="text-xs text-red-600">{uploadError}</span>}
      </div>

      {!selectedDoc ? (
        <div className="rounded-3xl border border-dashed border-black/10 p-12 text-center text-sm text-neutral-500">
          No documents yet — upload a prescription, lab report, or discharge summary photo above.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Original Document Source View */}
          <div className="rounded-3xl border border-black/10 bg-neutral-950 p-6 text-white space-y-4 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400" style={{ fontFamily: "var(--do-font-label)" }}>
                  Source Physical Record ({selectedDoc.category.replace("_", " ")})
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-neutral-300 font-mono">
                  Groq Vision OCR
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-neutral-900/80 p-5 font-mono text-sm text-neutral-300 leading-relaxed border border-white/5 max-h-72 overflow-y-auto whitespace-pre-wrap">
                <div className="text-neutral-500 text-xs uppercase mb-2 font-mono">{"// AI-Transcribed Document Text:"}</div>
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
                <CheckCircle2 className="h-3 w-3" /> {selectedDoc.verified ? "Verified" : "Pending Clinical Verification"}
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
                {selectedDoc.verified ? "Verified" : "AI Draft"}
              </span>
            </div>

            {/* Extracted Diagnoses */}
            {selectedDoc.extractedDiagnoses.length > 0 && (
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
            )}

            {/* Extracted Medications */}
            {selectedDoc.extractedMedicines.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2" style={{ fontFamily: "var(--do-font-label)" }}>
                  Extracted Medications:
                </span>
                <div className="space-y-1.5 text-xs">
                  {selectedDoc.extractedMedicines.map((med) => (
                    <div key={med.id} className="rounded-2xl bg-neutral-50 p-3 border border-black/5 flex items-center justify-between">
                      <span className="font-bold text-neutral-950">{med.standardMolecule}</span>
                      <span className="text-neutral-500">{med.dosage} &bull; {med.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {selectedDoc.extractedDiagnoses.length === 0 && selectedDoc.extractedMedicines.length === 0 && selectedDoc.extractedLabs.length === 0 && (
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <FileText className="h-4 w-4" /> No structured clinical data was detected in this document.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
