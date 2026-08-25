"use client";

import React, { useState } from "react";
import {
  Pill,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Lock,
  Link2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useVault } from "./VaultContext";
import { isValidSerial } from "./serial";
import { previewPharmacyBillAction } from "@/lib/actions/ai-preview";
import type { PharmacyBillExtractionResult } from "@/lib/ai/extraction";

export function PharmacyNetwork() {
  const { lookupPatient, addPharmacyDispensation } = useVault();
  const [scannedToken, setScannedToken] = useState<string>("ABHA-QR-CT-8891");
  const [serialInput, setSerialInput] = useState("");
  const [linkedPatient, setLinkedPatient] = useState<{ name: string; age: number } | null>(null);
  const [linkAttempted, setLinkAttempted] = useState(false);
  const [billText, setBillText] = useState("");
  const [billPreview, setBillPreview] = useState<PharmacyBillExtractionResult | null>(null);
  const [isParsingBill, setIsParsingBill] = useState(false);
  const [dispensedItems, setDispensedItems] = useState([
    {
      id: "rx-1",
      prescribedDrug: "Tab. Metformin Hydrochloride 500mg BD",
      dispensedBrand: "Glycomet 500 (USV Ltd)",
      batchNo: "AP29184",
      quantity: "60 Tablets (30 Days)",
      status: "Dispensed",
      date: "2026-08-24 18:30",
    },
    {
      id: "rx-2",
      prescribedDrug: "Tab. Telmisartan 40mg OD",
      dispensedBrand: "Telma 40 (Glenmark)",
      batchNo: "TL88219",
      quantity: "30 Tablets (30 Days)",
      status: "Dispensed",
      date: "2026-08-24 18:30",
    },
  ]);

  const [newDispense, setNewDispense] = useState({
    molecule: "Tab. Pregabalin 75mg",
    brand: "Maxgalin 75",
    batch: "MG-2026",
    qty: "14 Caps",
  });

  const handleLinkSerial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkAttempted(true);
    if (!isValidSerial(serialInput)) {
      setLinkedPatient(null);
      return;
    }
    const found = await lookupPatient(serialInput);
    setLinkedPatient(found ? { name: found.name, age: found.age } : null);
  };

  const handleParseBill = async () => {
    if (!billText.trim()) return;
    setIsParsingBill(true);
    try {
      setBillPreview(await previewPharmacyBillAction(billText));
    } finally {
      setIsParsingBill(false);
    }
  };

  const handleRecordDispensation = async (e: React.FormEvent) => {
    e.preventDefault();
    // Local dispensation record — unaffected whether or not a TalkRx Serial Number is linked.
    setDispensedItems((prev) => [
      ...prev,
      {
        id: `rx-${Date.now()}`,
        prescribedDrug: newDispense.molecule,
        dispensedBrand: newDispense.brand,
        batchNo: newDispense.batch,
        quantity: newDispense.qty,
        status: "Dispensed",
        date: new Date().toLocaleTimeString(),
      },
    ]);

    if (isValidSerial(serialInput) && linkedPatient) {
      await addPharmacyDispensation(serialInput, {
        pharmacyName: "Apollo Pharmacy #419",
        items: [{ molecule: newDispense.molecule, brand: newDispense.brand, dosage: "", frequency: "", quantity: newDispense.batch }],
      });
      alert(`Dispensation recorded and synced to ${linkedPatient.name}'s TalkRx health profile as a pharmacy-dispensed record.`);
    } else {
      alert("Dispensation event recorded and appended to Patient Health Passport with closed-loop consent.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/[0.06] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Pill className="h-3.5 w-3.5 text-neutral-900" />
            <span
              className="text-[11px] font-bold uppercase tracking-[1.5px] text-neutral-800"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Pharmacy &amp; Medication Intelligence Network &bull; B2B Integration
            </span>
          </div>
          <h3 className="mt-1 text-2xl font-normal tracking-tight text-neutral-950">
            Dispensation &amp; Adherence Gateway
          </h3>
          <p className="text-xs text-neutral-500">
            Apollo Pharmacy #419 &bull; Minimum-Data-Access Closed-Loop Gateway
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 backdrop-blur-md px-3.5 py-1.5 text-xs text-neutral-900 font-medium">
          <Lock className="h-3.5 w-3.5 text-neutral-700" />
          <span style={{ fontFamily: "var(--do-font-label)" }}>Write-Only Consent Active</span>
        </div>
      </div>

      {/* Minimum Data Access Notice */}
      <div className="rounded-2xl border border-black/5 bg-neutral-50 p-4 text-xs text-neutral-700 flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-neutral-800 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-neutral-950 uppercase text-[10px]" style={{ fontFamily: "var(--do-font-label)" }}>
            Minimum-Data-Access Principle (DPDP Act 2023 &amp; ABDM Compliant):
          </span>
          <p className="mt-0.5 leading-relaxed text-neutral-600 text-xs">
            This pharmacy terminal operates under <strong>Write-Only Dispensation Consent</strong> (#CT-8891). Pharmacies can record dispensed medications and verify active prescriptions without viewing unrelated clinical history.
          </p>
        </div>
      </div>

      {/* Optional TalkRx Serial Number Linking */}
      <div className="rounded-2xl border border-black/5 bg-neutral-50 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Link2 className="h-3.5 w-3.5 text-neutral-800" />
          <span className="text-[10px] font-bold uppercase text-neutral-950" style={{ fontFamily: "var(--do-font-label)" }}>
            TalkRx Serial Number (Optional)
          </span>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed mb-3">
          Optional — if the customer voluntarily provides their 8-digit TalkRx Serial Number, this bill also syncs to their TalkRx health profile. Leave blank to continue exactly as before.
        </p>
        <form onSubmit={handleLinkSerial} className="flex flex-col sm:flex-row gap-3">
          <input
            value={serialInput}
            onChange={(e) => { setSerialInput(e.target.value); setLinkAttempted(false); setLinkedPatient(null); }}
            placeholder="Customer's 8-digit Serial Number (optional)"
            className="flex-1 rounded-xl border border-black/10 p-2.5 text-xs font-mono tracking-widest bg-white text-neutral-900"
          />
          <button
            type="submit"
            className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:bg-neutral-100 shadow-sm shrink-0"
            style={{ fontFamily: "var(--do-font-label)" }}
          >
            Link to TalkRx
          </button>
        </form>
        {linkAttempted && linkedPatient && (
          <p className="mt-2 text-xs font-medium text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Linked: {linkedPatient.name} ({linkedPatient.age}y) &bull; bill will sync to their TalkRx profile.
          </p>
        )}
        {linkAttempted && !linkedPatient && (
          <p className="mt-2 text-xs font-medium text-amber-700 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" /> No TalkRx account found — bill will still be recorded locally, nothing else changes.
          </p>
        )}
      </div>

      {/* Optional: AI bill-text parsing preview */}
      <div className="rounded-2xl border border-black/5 bg-white/70 backdrop-blur-md p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-neutral-800" />
          <span className="text-[10px] font-bold uppercase text-neutral-950" style={{ fontFamily: "var(--do-font-label)" }}>
            Paste Bill Text to Auto-Parse (AI Preview)
          </span>
        </div>
        <textarea
          value={billText}
          onChange={(e) => setBillText(e.target.value)}
          rows={2}
          placeholder="Tab Metformin 500mg BD x 30 tabs&#10;Tab Telmisartan 40mg OD x 30 tabs"
          className="w-full rounded-xl border border-black/10 p-2.5 text-xs font-mono text-neutral-900 bg-neutral-50"
        />
        <button
          type="button"
          onClick={handleParseBill}
          disabled={isParsingBill}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100 disabled:opacity-50"
          style={{ fontFamily: "var(--do-font-label)" }}
        >
          <Sparkles className="h-3 w-3" /> {isParsingBill ? "Parsing…" : "Parse with AI"}
        </button>
        {billPreview && (
          <div className="mt-3 space-y-1.5">
            {billPreview.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg bg-neutral-50 p-2 text-[11px] border border-black/5">
                <span className="font-mono text-neutral-800">{item.standardMolecule} {item.dosage} &bull; {item.frequency} &bull; {item.quantity}</span>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-bold text-neutral-700 uppercase">
                  {Math.round(item.confidence * 100)}% Parsed
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Consent Verification Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-black/[0.08] bg-white/70 backdrop-blur-xl p-6 flex flex-col items-center text-center justify-center shadow-sm">
          <QrCode className="h-10 w-10 text-neutral-900 mb-2 stroke-[1.5]" />
          <span className="text-xs font-bold text-neutral-950 uppercase tracking-wider" style={{ fontFamily: "var(--do-font-label)" }}>
            Patient Consent QR Token
          </span>
          <span className="text-sm font-mono text-neutral-500 mt-1">{scannedToken}</span>
          <div className="mt-3 flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold text-neutral-800">
            <CheckCircle2 className="h-3 w-3" /> Valid &bull; Kamala Sundaram (58y)
          </div>
        </div>

        {/* Prescription Details for Dispensing */}
        <div className="md:col-span-2 rounded-3xl border border-black/[0.08] p-6 bg-white/80 backdrop-blur-xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900" style={{ fontFamily: "var(--do-font-label)" }}>
              Prescribed Medications Awaiting Dispensation
            </span>
            <span className="text-xs text-neutral-500 font-medium">Doctor: Dr. A. Rajan, MD</span>
          </div>

          <form onSubmit={handleRecordDispensation} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-neutral-600 block mb-1">Prescribed Molecule:</label>
              <input
                type="text"
                value={newDispense.molecule}
                onChange={(e) => setNewDispense({ ...newDispense, molecule: e.target.value })}
                className="w-full rounded-xl border border-black/10 p-2.5 bg-neutral-50 text-neutral-900"
              />
            </div>
            <div>
              <label className="font-semibold text-neutral-600 block mb-1">Brand Dispensed:</label>
              <input
                type="text"
                value={newDispense.brand}
                onChange={(e) => setNewDispense({ ...newDispense, brand: e.target.value })}
                className="w-full rounded-xl border border-black/10 p-2.5 bg-white text-neutral-900"
              />
            </div>
            <div>
              <label className="font-semibold text-neutral-600 block mb-1">Batch # &amp; Qty:</label>
              <input
                type="text"
                value={newDispense.batch}
                onChange={(e) => setNewDispense({ ...newDispense, batch: e.target.value })}
                className="w-full rounded-xl border border-black/10 p-2.5 bg-white text-neutral-900"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-sm"
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                <FileCheck className="h-3.5 w-3.5" />
                <span>Confirm &amp; Append Dispensation</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Recorded Dispensation History Table */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-neutral-950 uppercase tracking-wide" style={{ fontFamily: "var(--do-font-label)" }}>
          Closed-Loop Dispensed History (Prescribed vs Dispensed)
        </h4>

        <div className="overflow-x-auto rounded-3xl border border-black/[0.08] bg-white/80 backdrop-blur-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-100/70 font-bold uppercase text-neutral-700 text-[10px]" style={{ fontFamily: "var(--do-font-label)" }}>
              <tr>
                <th className="p-3.5">Doctor-Prescribed Regimen</th>
                <th className="p-3.5">Actually Dispensed Brand</th>
                <th className="p-3.5">Batch Number</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Passport Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {dispensedItems.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/60">
                  <td className="p-3.5 font-bold text-neutral-950">{item.prescribedDrug}</td>
                  <td className="p-3.5 text-neutral-800">{item.dispensedBrand}</td>
                  <td className="p-3.5 font-mono text-neutral-500">{item.batchNo}</td>
                  <td className="p-3.5 text-neutral-600">{item.quantity}</td>
                  <td className="p-3.5 text-neutral-400">{item.date}</td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[9px] font-bold text-neutral-800 uppercase">
                      <CheckCircle2 className="h-3 w-3 text-neutral-900" /> Appended
                    </span>
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
