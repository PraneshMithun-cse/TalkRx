"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Scale,
  Activity,
  Layers,
  Leaf,
} from "lucide-react";
import { MOCK_PATIENTS } from "./mock-data";

export function AyushModule() {
  const patient = MOCK_PATIENTS[2]; // Ramesh Sharma
  const ayush = patient.ayushData!;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"dashavidha" | "ashtavidha" | "namaste">("dashavidha");

  const namasteDictionary = [
    { code: "AYU-MOR-0419", term: "Amlapitta", description: "Hyperacidity syndrome with burning sensation in epigastrium and throat", icd11: "TM2-GA-084: Pittaja Grahani Disorder" },
    { code: "AYU-MOR-0112", term: "Sandhivata", description: "Osteoarthritis / Degenerative joint disorder with crepitus and pain", icd11: "TM2-MS-012: Vataja Sandhi Rog" },
    { code: "AYU-MOR-0881", term: "Madhumeha", description: "Diabetes Mellitus characterized by polyuria and sweet urine", icd11: "TM2-ME-009: Kaphaja Prameha" },
    { code: "AYU-MOR-0234", term: "Tamaka Shwasa", description: "Bronchial Asthma with nocturnal cough and paroxysmal dyspnoea", icd11: "TM2-RS-044: Vata-Kaphaja Shwasa" },
  ];

  const filteredNamaste = namasteDictionary.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-black/[0.08] bg-white/80 p-6 md:p-8 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.06)] space-y-8">
      {/* Precision Geometric Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Warm Ambient Glow */}
      <div
        className="pointer-events-none absolute -top-32 -left-20 h-[400px] w-[400px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(254, 215, 170, 0.6) 0%, rgba(255, 237, 213, 0.3) 50%, transparent 80%)",
        }}
      />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/[0.06] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="h-3.5 w-3.5 text-[#ea580c]" />
            <span
              className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#ea580c]"
              style={{ fontFamily: "var(--do-font-label)" }}
            >
              Ministry of Ayush &bull; SIH26047 &bull; Traditional Medicine Standardization
            </span>
          </div>
          <h3 className="mt-1 text-2xl font-normal tracking-tight text-neutral-950">
            Dashavidha Pariksha &amp; NAMASTE Coding Console
          </h3>
          <p className="text-xs text-neutral-500">
            Converts 20 minutes of OPD waiting into structured, ICD-11 aligned clinical data for Ayurvedic Vaidyas.
          </p>
        </div>

        <div className="flex gap-1.5 text-xs">
          {[
            { id: "dashavidha", label: "Dashavidha (Tenfold)" },
            { id: "ashtavidha", label: "Ashtavidha (Eightfold)" },
            { id: "namaste", label: "NAMASTE & ICD-11 TM-2" },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as "dashavidha" | "ashtavidha" | "namaste")}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "bg-white/60 text-neutral-600 hover:text-black hover:bg-white"
                }`}
                style={{ fontFamily: "var(--do-font-label)" }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="relative z-10 rounded-3xl border border-black/[0.08] bg-white/90 backdrop-blur-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-950 text-sm">{patient.name}</span>
            <span className="text-neutral-500 font-medium">({patient.age}y, {patient.gender})</span>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[9px] font-bold uppercase text-neutral-800">
              Token: {patient.tokenNumber}
            </span>
          </div>
          <p className="mt-1 text-neutral-700">
            <strong>Chief Complaint:</strong> {patient.structuredSummary?.chiefComplaint}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 font-bold text-neutral-900 border border-black/5">
            Prakriti: {ayush.prakriti.primaryDosha}
          </span>
          <span className="rounded-full bg-neutral-950 px-3 py-1 font-bold text-white">
            Vikriti: {ayush.vikriti.imbalancedDosha} Dosha
          </span>
        </div>
      </div>

      {/* Subtab 1: Dashavidha Pariksha Grid */}
      {activeSubTab === "dashavidha" && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* 1. Prakriti */}
          <div className="rounded-3xl border border-black/[0.08] bg-white/90 backdrop-blur-xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-neutral-500 text-[10px]" style={{ fontFamily: "var(--do-font-label)" }}>
                1. Prakriti (Constitution)
              </span>
              <Scale className="h-4 w-4 text-neutral-700 stroke-[1.5]" />
            </div>
            <div className="text-base font-bold text-neutral-950">{ayush.prakriti.primaryDosha}</div>
            <p className="text-neutral-600 leading-relaxed">{ayush.prakriti.physicalTraits}</p>
            <div className="pt-2 flex gap-1.5 text-[10px] font-bold">
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-neutral-800">V: {ayush.prakriti.scores.vata}%</span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-neutral-800">P: {ayush.prakriti.scores.pitta}%</span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-neutral-800">K: {ayush.prakriti.scores.kapha}%</span>
            </div>
          </div>

          {/* 2. Vikriti */}
          <div className="rounded-3xl border border-black/[0.08] bg-white/90 backdrop-blur-xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-neutral-500 text-[10px]" style={{ fontFamily: "var(--do-font-label)" }}>
                2. Vikriti (Pathology)
              </span>
              <Activity className="h-4 w-4 text-neutral-700 stroke-[1.5]" />
            </div>
            <div className="text-base font-bold text-neutral-950">{ayush.vikriti.imbalancedDosha} Imbalance</div>
            <p className="text-neutral-700 font-medium">{ayush.vikriti.currentDeviation}</p>
            <div className="mt-2 rounded-xl bg-neutral-50 p-2.5 border border-black/5 font-mono text-[10px] text-neutral-800">
              {ayush.vikriti.namasteMorbidityCode}
            </div>
          </div>

          {/* 3. Sara */}
          <div className="rounded-3xl border border-black/[0.08] bg-white/90 backdrop-blur-xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-neutral-500 text-[10px]" style={{ fontFamily: "var(--do-font-label)" }}>
                3. Sara (Tissue Quality)
              </span>
              <Layers className="h-4 w-4 text-neutral-700 stroke-[1.5]" />
            </div>
            <div className="text-sm font-bold text-neutral-950">{ayush.sara.tissueQuality}</div>
            <p className="text-neutral-600">Dominant Dhatu: <strong>{ayush.sara.dominantTissue}</strong></p>
          </div>

          {/* 4. Samhanana */}
          <div className="rounded-3xl border border-black/[0.08] bg-white/90 backdrop-blur-xl p-5 shadow-sm space-y-2">
            <span className="font-bold uppercase tracking-wider text-neutral-500 text-[10px]" style={{ fontFamily: "var(--do-font-label)" }}>
              4. Samhanana (Build)
            </span>
            <div className="text-sm font-bold text-neutral-950">{ayush.samhanana.build}</div>
            <p className="text-neutral-500">Symmetrical musculature and skeletal frame.</p>
          </div>

          {/* 5. Agni & Koshtha */}
          <div className="rounded-3xl border border-black/[0.08] bg-white/90 backdrop-blur-xl p-5 shadow-sm space-y-2">
            <span className="font-bold uppercase tracking-wider text-neutral-500 text-[10px]" style={{ fontFamily: "var(--do-font-label)" }}>
              5 &bull; 6. Agni &amp; Koshtha
            </span>
            <div>Agni: <strong>{ayush.agni}</strong></div>
            <div>Koshtha: <strong>{ayush.koshtha}</strong></div>
            <p className="text-neutral-500 mt-1">Prone to swift transit and acid pyrosis.</p>
          </div>

          {/* 7. Ahara & Vyayama Shakti */}
          <div className="rounded-3xl border border-black/[0.08] bg-white/90 backdrop-blur-xl p-5 shadow-sm space-y-2">
            <span className="font-bold uppercase tracking-wider text-neutral-500 text-[10px]" style={{ fontFamily: "var(--do-font-label)" }}>
              7 &bull; 8. Ahara &amp; Vyayama Shakti
            </span>
            <div>Appetite: <strong>{ayush.aharaShakti.abhyavaharana}</strong></div>
            <div>Digestion: <strong>{ayush.aharaShakti.jaranaShakti}</strong></div>
            <div>Exercise: <strong>{ayush.vyayamaShakti.exerciseCapacity}</strong></div>
          </div>
        </div>
      )}

      {/* Subtab 2: Ashtavidha Pariksha */}
      {activeSubTab === "ashtavidha" && (
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {Object.entries(ayush.ashtavidha).map(([key, value]) => (
            <div key={key} className="rounded-3xl border border-black/[0.08] bg-white/90 backdrop-blur-xl p-5 shadow-sm">
              <span className="font-bold uppercase tracking-wider text-neutral-400 block text-[10px] mb-1" style={{ fontFamily: "var(--do-font-label)" }}>
                {key} Pariksha
              </span>
              <p className="text-neutral-800 leading-relaxed font-medium">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 3: NAMASTE & ICD-11 TM-2 Mapper */}
      {activeSubTab === "namaste" && (
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search NAMASTE Morbidity Terminology or ICD-11 TM-2 codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-black/10 bg-white/80 backdrop-blur-md pl-10 pr-4 py-2.5 text-xs text-neutral-900 focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-black/[0.08] bg-white/90 backdrop-blur-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100/70 uppercase font-bold text-neutral-700 text-[10px]" style={{ fontFamily: "var(--do-font-label)" }}>
                <tr>
                  <th className="p-3.5">NAMASTE Term</th>
                  <th className="p-3.5">Morbidity Code</th>
                  <th className="p-3.5">Clinical Definition</th>
                  <th className="p-3.5">WHO ICD-11 TM-2 Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredNamaste.map((row) => (
                  <tr key={row.code} className="hover:bg-neutral-50/60">
                    <td className="p-3.5 font-bold text-neutral-950">{row.term}</td>
                    <td className="p-3.5 font-mono text-neutral-800">{row.code}</td>
                    <td className="p-3.5 text-neutral-600">{row.description}</td>
                    <td className="p-3.5 font-mono text-neutral-900 font-semibold">{row.icd11}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
