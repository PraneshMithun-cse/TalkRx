import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { classifyVitals } from "../src/components/talkrx/vitals-classifier";
import type { PatientProfile } from "../src/components/talkrx/types";
// `../src/lib/actions/serialize.ts` starts with `import "server-only"`, which
// unconditionally throws outside Next's RSC build — so this script reimports
// its PATIENT_INCLUDE/serializePatient logic verbatim rather than importing
// the module directly. Keep in sync with that file if it changes shape.
import { PATIENT_INCLUDE, serializePatient } from "./smoke-test-serialize";

// Mirrors the exact field-access chains used across the dashboard components,
// so this catches the same class of "Cannot read properties of undefined"
// crash the real UI would hit — without needing a browser.

let failures = 0;

function check(label: string, fn: () => void) {
  try {
    fn();
  } catch (err) {
    failures++;
    console.error(`  FAIL [${label}]:`, err instanceof Error ? err.message : err);
  }
}

function smokeTestPatient(p: PatientProfile) {
  console.log(`\n--- ${p.name} (${p.serialNumber}) ---`);

  // DoctorDashboard.tsx: allergies banner
  check("allergies.join", () => p.allergies.join(", "));

  // DoctorDashboard.tsx: red flag banner
  check("redFlagsDetected[0]", () => {
    if (p.structuredSummary?.redFlagsDetected && p.structuredSummary.redFlagsDetected.length > 0) {
      void p.structuredSummary.redFlagsDetected[0].matchedRule;
      void p.structuredSummary.redFlagsDetected[0].patientStatement;
    }
  });

  // DoctorDashboard.tsx: chief complaint / HPI + vitals classification append
  check("chiefComplaint/hpiNarrative", () => {
    void p.structuredSummary?.chiefComplaint;
    void p.structuredSummary?.duration;
    void p.structuredSummary?.hpiNarrative;
  });

  check("painCharacteristics", () => {
    if (p.structuredSummary?.painCharacteristics) {
      void p.structuredSummary.painCharacteristics.site;
      void p.structuredSummary.painCharacteristics.character;
      void p.structuredSummary.painCharacteristics.severity;
      void p.structuredSummary.painCharacteristics.aggravatingFactors.join(", ");
    }
  });

  check("pertinentPositives/Negatives", () => {
    (p.structuredSummary?.pertinentPositives ?? []).map((x) => x);
    (p.structuredSummary?.pertinentNegatives ?? []).map((x) => x);
  });

  check("pastMedical/Surgical/Family history", () => {
    (p.structuredSummary?.pastMedicalHistory ?? []).map((x) => x);
    (p.structuredSummary?.pastSurgicalHistory ?? []).map((x) => x);
    (p.structuredSummary?.familyHistory ?? []).map((x) => x);
  });

  check("reviewOfSystems", () => {
    if (p.structuredSummary?.reviewOfSystems) {
      Object.entries(p.structuredSummary.reviewOfSystems).map(([sys, findings]) => [sys, findings]);
    }
  });

  // Health Overview panel + vitals classification (new feature)
  check("classifyVitals + vitals fields", () => {
    const result = classifyVitals(p.vitals);
    void result.conditions;
    void result.narrative;
    void p.vitals?.bloodPressure;
    void p.vitals?.bloodGlucose;
    void p.vitals?.bloodGlucoseType;
    void p.vitals?.heartRate;
    void p.vitals?.spO2;
    void p.vitals?.temperature;
  });

  // Current Medications card
  check("activeMedications filter", () => {
    p.activeMedications.filter((m) => m.status === "active").map((m) => `${m.standardMolecule} ${m.dosage} ${m.frequency}`);
  });

  // AYUSH panel
  check("ayushData", () => {
    if (p.ayushData) {
      void p.ayushData.prakriti.primaryDosha;
      void p.ayushData.prakriti.physicalTraits;
      void p.ayushData.prakriti.scores.vata;
      void p.ayushData.prakriti.scores.pitta;
      void p.ayushData.prakriti.scores.kapha;
      void p.ayushData.vikriti.imbalancedDosha;
      void p.ayushData.vikriti.currentDeviation;
      void p.ayushData.vikriti.namasteMorbidityCode;
      void p.ayushData.vikriti.whoIcd11Tm2Code;
      void p.ayushData.sara.tissueQuality;
      void p.ayushData.samhanana.build;
      void p.ayushData.agni;
      void p.ayushData.koshtha;
    }
  });

  // Medication Intelligence tab
  check("activeMedications table", () => {
    p.activeMedications.map((med) => ({
      molecule: med.standardMolecule,
      brand: med.brandName || "Generic",
      dosage: med.dosage,
      dispensed: med.dispensedBy ? `Dispensed (${med.dispensedBy})` : "Self-reported / Prescribed",
    }));
  });

  // PatientPassport.tsx: vitals tab with defaults
  check("PatientPassport vitals defaults", () => {
    void (p.vitals?.bloodPressure || "128/82");
    void (p.vitals?.bloodPressureStatus || "Optimal Range");
    void (p.vitals?.bloodGlucose || "134");
    void (p.vitals?.bloodGlucoseType || "Fasting • Monitored");
    void (p.vitals?.heartRate || "72 bpm");
    void (p.vitals?.spO2 || "99%");
  });

  // PatientPassport.tsx: documents, timeline, consents, audit log
  check("documents", () => {
    p.documents.map((doc) => ({
      title: doc.title,
      category: doc.category.replace("_", " "),
      labs: doc.extractedLabs.map((l) => l.parameter),
      meds: doc.extractedMedicines.map((m) => m.standardMolecule),
      diagnoses: doc.extractedDiagnoses.join(", "),
    }));
  });

  check("timeline", () => {
    p.timeline.map((t) => `${t.date} ${t.title} ${t.tags.join(",")}`);
  });

  check("consents", () => {
    p.consents.map((c) => `${c.granteeName} ${c.dataCategories.join(",")} ${c.status}`);
  });

  check("auditLog", () => {
    p.auditLog.map((a) => `${a.timestamp} ${a.accessorName} ${a.action}`);
  });

  check("selfAssessments", () => {
    p.selfAssessments.map((sa) => `${sa.submittedAt} conf=${sa.aiConfidenceAvg}`);
  });

  check("doctorRecords", () => {
    p.doctorRecords.map((dr) => `${dr.doctorName} ${dr.diagnosedConditionIds.length} dx`);
  });

  check("conditions", () => {
    p.conditions.map((c) => `${c.label} (${c.kind}, ${c.source})`);
  });
}

async function main() {
  const patients = await prisma.patient.findMany({ include: PATIENT_INCLUDE, orderBy: { createdAt: "desc" } });
  console.log(`Smoke-testing ${patients.length} patient record(s)...`);

  for (const raw of patients) {
    const serialized = serializePatient(raw);
    smokeTestPatient(serialized);
  }

  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  await prisma.$disconnect();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(async (err) => {
  console.error("Smoke test crashed:", err);
  await prisma.$disconnect();
  process.exit(1);
});
