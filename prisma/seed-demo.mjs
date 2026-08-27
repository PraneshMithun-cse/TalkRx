import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.PRISMA_CONNECTION_STRING });
const prisma = new PrismaClient({ adapter });

// The real Clerk user created via `clerk users create` for demo.doctor@talkrx.dev
const DEMO_DOCTOR_CLERK_ID = "user_3IUSFCPZLzFovWPOX8mTm1HrqtD";

async function upsertUser(clerkId, data) {
  return prisma.user.upsert({ where: { clerkId }, create: { clerkId, ...data }, update: data });
}

async function upsertPatient(serialNumber, userId, data) {
  const existing = await prisma.patient.findUnique({ where: { serialNumber } });
  if (existing) {
    // Wipe dependent rows so re-running the seed doesn't accumulate duplicates.
    await prisma.$transaction([
      prisma.extractedLabResult.deleteMany({ where: { document: { patientId: existing.id } } }),
      prisma.medicalDocument.deleteMany({ where: { patientId: existing.id } }),
      prisma.extractedMedication.deleteMany({ where: { patientId: existing.id } }),
      prisma.patientCondition.deleteMany({ where: { patientId: existing.id } }),
      prisma.selfAssessmentEntry.deleteMany({ where: { patientId: existing.id } }),
      prisma.doctorConsultationRecord.deleteMany({ where: { patientId: existing.id } }),
      prisma.consentAuthorization.deleteMany({ where: { patientId: existing.id } }),
      prisma.accessAuditLog.deleteMany({ where: { patientId: existing.id } }),
      prisma.timelineEvent.deleteMany({ where: { patientId: existing.id } }),
      prisma.redFlagAlert.deleteMany({ where: { patientId: existing.id } }),
    ]);
    return prisma.patient.update({ where: { serialNumber }, data: { userId, ...data } });
  }
  return prisma.patient.create({ data: { serialNumber, userId, ...data } });
}

console.log("Seeding demo doctor account...");
const doctorUser = await upsertUser(DEMO_DOCTOR_CLERK_ID, {
  email: "demo.doctor@talkrx.dev",
  role: "DOCTOR",
  name: "Dr. Meera Sundaram",
  licenseNumber: "TN-MED-77120",
  organization: "TalkRx Demo Clinic",
  department: "General Medicine",
});
console.log("Doctor user:", doctorUser.id);

// ---------------------------------------------------------------------------
// 1. Hypertensive crisis + diabetic — full conventional case-taking, red flag,
//    documents, consents, audit log, multi-source medications.
// ---------------------------------------------------------------------------
console.log("Seeding: Meena Krishnan (crisis vitals, full record)...");
const meenaUser = await upsertUser("demo_clerk_meena", { role: "PATIENT", name: "Meena Krishnan" });
const meena = await upsertPatient("10000001", meenaUser.id, {
  name: "Meena Krishnan",
  age: 58,
  gender: "Female",
  phone: "+91 98765 10001",
  bloodGroup: "B+",
  preferredLanguage: "ta",
  abhaId: "ABHA-TN-1000-0001",
  abhaAddress: "meena.krishnan@abdm",
  tokenNumber: "A-014",
  department: "General Medicine",
  hospitalName: "TalkRx Demo Clinic",
  queueStatus: "case-completed",
  isReturningPatient: true,
  allergies: ["Penicillin"],
  structuredSummary: {
    chiefComplaint: "Severe headache with chest tightness for 2 hours",
    duration: "2 hours, acute onset",
    hpiNarrative:
      "58F with known T2DM presents with sudden severe occipital headache, chest tightness, and blurred vision. No prior similar episodes. Denies loss of consciousness.",
    painCharacteristics: {
      site: "Occipital / Retrosternal",
      character: "Throbbing headache, pressure-like chest sensation",
      severity: 8,
      aggravatingFactors: ["Exertion", "Lying flat"],
      relievingFactors: ["Rest"],
    },
    pertinentPositives: ["Severe headache", "Chest tightness", "Blurred vision", "Known diabetic"],
    pertinentNegatives: ["No loss of consciousness", "No radiating arm pain", "No fever"],
    redFlagsDetected: [
      {
        id: "rf-demo-meena-1",
        category: "cardiac",
        severity: "critical",
        matchedRule: "RULE_HTN_CRISIS_01: Systolic >=180 or Diastolic >=120 with symptomatic presentation",
        patientStatement: "Severe headache with chest tightness, blurred vision",
        timestamp: new Date().toLocaleTimeString(),
        escalatedTo: "Emergency Triage Bed #2 & Duty Medical Officer",
        status: "active",
        actionRequired: "Stat BP recheck, 12-lead ECG, IV access, physician bedside review within 5 minutes.",
      },
    ],
    allergies: [{ allergen: "Penicillin", reaction: "Skin rash / hives", severity: "Moderate" }],
    currentMedications: [],
    pastMedicalHistory: ["Type 2 Diabetes Mellitus (12 years)", "Dyslipidemia"],
    pastSurgicalHistory: ["Cholecystectomy (2018)"],
    familyHistory: ["Father — Hypertension", "Mother — Type 2 Diabetes"],
    lifestyle: { smoking: "Never", alcohol: "Occasional", diet: "Mixed, high salt intake", sleep: "5-6 hrs, disturbed" },
    reviewOfSystems: {
      Cardiovascular: "Chest tightness, no palpitations",
      Neurological: "Headache, blurred vision, no focal deficit",
      Respiratory: "No breathlessness",
    },
    generatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    intakeDurationSeconds: 287,
    vitals: {
      bloodPressure: "186/126",
      bloodPressureStatus: "Hypertensive Crisis",
      bloodGlucose: "210",
      bloodGlucoseType: "Random / Postprandial",
      heartRate: "104 bpm",
      spO2: "96%",
      temperature: "99.1 °F",
    },
  },
  conditions: {
    create: [
      { label: "Headache", kind: "symptom", source: "patient-reported", confidence: 0.9, verified: false, recordedBy: "Self-reported" },
      { label: "Type 2 Diabetes Mellitus", kind: "condition", source: "patient-reported", confidence: 0.95, verified: true, recordedBy: "Self-reported" },
      { label: "Hypertensive Crisis", kind: "diagnosis", source: "doctor-prescribed", confidence: 1, verified: true, recordedBy: "Dr. Meera Sundaram" },
    ],
  },
  medications: {
    create: [
      { rawText: "Metformin 500mg BD", standardMolecule: "Metformin", dosage: "500mg", frequency: "BD", duration: "Ongoing", confidence: 0.9, confirmedByPatient: true, status: "active", source: "patient-reported" },
      { rawText: "Amlodipine 5mg OD x 30 days", standardMolecule: "Amlodipine", dosage: "5mg", frequency: "OD", duration: "30 days", confidence: 1, confirmedByPatient: false, status: "active", source: "doctor-prescribed", prescribedBy: "Dr. Meera Sundaram (TN-MED-77120)" },
      { rawText: "Amlodipine 5mg", standardMolecule: "Amlodipine", brandName: "Amlopres 5", dosage: "5mg", frequency: "OD", duration: "30 Tablets", confidence: 0.85, confirmedByPatient: false, status: "active", source: "pharmacy-dispensed", dispensedBy: "Apollo Pharmacy #419", dispensedAt: new Date() },
    ],
  },
  selfAssessments: { create: [{ rawText: "I have a bad headache and my chest feels tight, I am diabetic for 12 years.", aiConfidenceAvg: 0.82 }] },
  documents: {
    create: [
      {
        title: "Lipid Profile Report",
        category: "lab_report",
        date: new Date().toISOString().slice(0, 10),
        facility: "TalkRx Demo Clinic",
        ocrConfidence: 0.94,
        extractedDiagnoses: ["Dyslipidemia"],
        rawText: "LIPID PROFILE\nTotal Cholesterol: 248 mg/dL (High)\nLDL: 162 mg/dL (High)\nHDL: 38 mg/dL (Low)\nTriglycerides: 210 mg/dL (High)",
        verified: true,
        extractedLabs: {
          create: [
            { parameter: "Total Cholesterol", value: "248", unit: "mg/dL", referenceRange: "<200", isAbnormal: true, sourceDoc: "Lipid Profile Report", date: new Date().toISOString().slice(0, 10) },
            { parameter: "LDL", value: "162", unit: "mg/dL", referenceRange: "<100", isAbnormal: true, sourceDoc: "Lipid Profile Report", date: new Date().toISOString().slice(0, 10) },
          ],
        },
      },
    ],
  },
  consents: {
    create: [
      {
        granteeName: "Dr. Meera Sundaram",
        granteeType: "Doctor",
        purpose: "Ongoing chronic disease management",
        dataCategories: ["All History"],
        accessLevel: "Full Care Access",
        validFrom: new Date(),
        validTill: new Date(Date.now() + 30 * 86400000),
        status: "Active",
      },
    ],
  },
  auditLog: {
    create: [
      { accessorName: "Dr. Meera Sundaram", accessorRole: "Physician", facility: "TalkRx Demo Clinic", action: "Read Case Summary", dataAccessed: "60-Second Structured Summary", ipLocation: "TalkRx Doctor Dashboard" },
    ],
  },
  timeline: {
    create: [
      { date: new Date().toISOString().slice(0, 10), time: new Date().toISOString().slice(11, 16), title: "AI Case-Taking Completed", subtitle: "Severe headache with chest tightness", category: "case-taking", source: "patient-reported", sourceEntity: "TalkRx Case-Taking Kiosk", facility: "TalkRx Demo Clinic", description: "Structured intake completed with critical red-flag escalation.", tags: ["Case-Taking", "Red-Flag"], isRedFlag: true },
    ],
  },
  redFlagAlerts: {
    create: [
      { category: "cardiac", severity: "critical", matchedRule: "RULE_HTN_CRISIS_01: Systolic >=180 or Diastolic >=120 with symptomatic presentation", patientStatement: "Severe headache with chest tightness, blurred vision", escalatedTo: "Emergency Triage Bed #2 & Duty Medical Officer", status: "active", actionRequired: "Stat BP recheck, 12-lead ECG, IV access, physician bedside review within 5 minutes." },
    ],
  },
});
console.log("  ->", meena.id);

// ---------------------------------------------------------------------------
// 2. AYUSH patient — Dashavidha Pariksha fully populated, elevated/prediabetic
//    vitals boundary case.
// ---------------------------------------------------------------------------
console.log("Seeding: Arjun Nair (AYUSH, elevated/prediabetic boundary)...");
const arjunUser = await upsertUser("demo_clerk_arjun", { role: "PATIENT", name: "Arjun Nair" });
const arjun = await upsertPatient("10000002", arjunUser.id, {
  name: "Arjun Nair",
  age: 41,
  gender: "Male",
  phone: "+91 98765 10002",
  bloodGroup: "O+",
  preferredLanguage: "ml",
  tokenNumber: "A-015",
  department: "AYUSH / Integrative Medicine",
  hospitalName: "TalkRx Demo Clinic",
  queueStatus: "case-completed",
  allergies: [],
  structuredSummary: {
    chiefComplaint: "Amlapitta (acid burning in chest & throat)",
    duration: "3 weeks, worsens after meals",
    hpiNarrative: "41M presents with burning sensation in chest and throat for 3 weeks, aggravated by spicy/sour foods, consistent with Pitta-predominant Amlapitta.",
    pertinentPositives: ["Post-meal burning sensation", "Aggravated by spicy food"],
    pertinentNegatives: ["No weight loss", "No hematemesis"],
    redFlagsDetected: [],
    allergies: [],
    currentMedications: [],
    pastMedicalHistory: [],
    pastSurgicalHistory: [],
    familyHistory: [],
    lifestyle: { smoking: "Never", alcohol: "Never", diet: "Predominantly spicy, sour, pungent food (Pitta-aggravating)", sleep: "6-7 hrs" },
    reviewOfSystems: { Gastrointestinal: "Post-meal burning, mild bloating" },
    generatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    intakeDurationSeconds: 245,
    vitals: {
      bloodPressure: "128/78",
      bloodPressureStatus: "Elevated",
      bloodGlucose: "112",
      bloodGlucoseType: "Fasting • Monitored",
      heartRate: "76 bpm",
      spO2: "98%",
      temperature: "98.4 °F",
    },
  },
  ayushData: {
    prakriti: { primaryDosha: "Pitta-Vata", scores: { vata: 32, pitta: 48, kapha: 20 }, physicalTraits: "Medium build, warm skin, prone to acidity", psychologicalTraits: "Sharp intellect, prone to irritability under stress" },
    vikriti: { imbalancedDosha: "Pitta", currentDeviation: "Aggravated Pitta — Amlapitta", namasteMorbidityCode: "NAM-AY-2.3.1", whoIcd11Tm2Code: "TM2-DA02" },
    sara: { tissueQuality: "Madhyama (Medium)", dominantTissue: "Rakta (Blood)" },
    samhanana: { build: "Moderate" },
    pramana: { anthropometry: "Proportionate" },
    satmya: { habituation: "Mixed" },
    sattva: { mentalStrength: "Madhyama (Moderate)" },
    aharaShakti: { abhyavaharana: "High Appetite", jaranaShakti: "Sluggish" },
    vyayamaShakti: { exerciseCapacity: "Moderate" },
    vaya: { ageClassification: "Madhyama (Middle age)" },
    ashtavidha: {
      nadi: "Pitta-predominant, rapid",
      mutra: "Peeta Varna (Yellowish)",
      mala: "Soft, occasionally loose",
      jihva: "Saama (coated, red tip)",
      shabda: "Normal",
      sparsha: "Ushna (warm)",
      drik: "Normal",
      akriti: "Madhyama",
    },
    agni: "Tikshnagni (Intense)",
    koshtha: "Mridu (Soft)",
  },
  conditions: {
    create: [{ label: "Amlapitta (Acid Burning)", kind: "condition", source: "ayush-assessed", confidence: 0.85, verified: false, recordedBy: "Self-reported" }],
  },
  timeline: {
    create: [
      { date: new Date().toISOString().slice(0, 10), time: new Date().toISOString().slice(11, 16), title: "AYUSH Case-Taking Completed", subtitle: "Amlapitta (acid burning)", category: "ayush", source: "ayush-assessed", sourceEntity: "TalkRx Case-Taking Kiosk", facility: "TalkRx Demo Clinic", description: "Dashavidha Pariksha completed — Pitta-predominant imbalance identified.", tags: ["AYUSH", "Dashavidha Pariksha"] },
    ],
  },
});
console.log("  ->", arjun.id);

// ---------------------------------------------------------------------------
// 3. Isolated fasting-glucose-only vitals + the SAME partial-structuredSummary
//    shape ({ vitals } only) that caused the original production crash — a
//    direct regression fixture for that bug.
// ---------------------------------------------------------------------------
console.log("Seeding: Fathima Begum (partial structuredSummary — regression fixture)...");
const fathimaUser = await upsertUser("demo_clerk_fathima", { role: "PATIENT", name: "Fathima Begum" });
const fathima = await upsertPatient("10000003", fathimaUser.id, {
  name: "Fathima Begum",
  age: 34,
  gender: "Female",
  phone: "+91 98765 10003",
  bloodGroup: "A+",
  preferredLanguage: "en",
  tokenNumber: "A-016",
  department: "General Medicine",
  hospitalName: "TalkRx Demo Clinic",
  queueStatus: "waiting",
  allergies: [],
  structuredSummary: {
    vitals: {
      bloodGlucose: "142",
      bloodGlucoseType: "Fasting",
    },
  },
});
console.log("  ->", fathima.id);

// ---------------------------------------------------------------------------
// 4. Completely empty patient — no structuredSummary, no ayushData, no
//    vitals, no medications, no documents. Freshly-onboarded edge case.
// ---------------------------------------------------------------------------
console.log("Seeding: Selvam Raj (empty edge case)...");
const selvamUser = await upsertUser("demo_clerk_selvam", { role: "PATIENT", name: "Selvam Raj" });
const selvam = await upsertPatient("10000004", selvamUser.id, {
  name: "Selvam Raj",
  age: 27,
  gender: "Male",
  phone: "+91 98765 10004",
  bloodGroup: "AB+",
  preferredLanguage: "ta",
  tokenNumber: "A-017",
  department: "—",
  hospitalName: "TalkRx Demo Clinic",
  queueStatus: "waiting",
  allergies: [],
});
console.log("  ->", selvam.id);

// ---------------------------------------------------------------------------
// 5. Normal vitals (no classification triggered), rich pharmacy/document
//    history, one revoked consent.
// ---------------------------------------------------------------------------
console.log("Seeding: Lakshmi Priya (normal vitals, rich pharmacy history)...");
const lakshmiUser = await upsertUser("demo_clerk_lakshmi", { role: "PATIENT", name: "Lakshmi Priya" });
const lakshmi = await upsertPatient("10000005", lakshmiUser.id, {
  name: "Lakshmi Priya",
  age: 45,
  gender: "Female",
  phone: "+91 98765 10005",
  bloodGroup: "O-",
  preferredLanguage: "te",
  tokenNumber: "A-018",
  department: "General Medicine",
  hospitalName: "TalkRx Demo Clinic",
  queueStatus: "discharged",
  allergies: ["Sulfa Drugs"],
  structuredSummary: {
    chiefComplaint: "Routine follow-up, feeling well",
    duration: "N/A",
    hpiNarrative: "45F here for routine follow-up of previously treated UTI. Asymptomatic, feeling well.",
    pertinentPositives: [],
    pertinentNegatives: ["No dysuria", "No fever", "No flank pain"],
    redFlagsDetected: [],
    allergies: [{ allergen: "Sulfa Drugs", reaction: "Angioedema", severity: "Life-Threatening" }],
    currentMedications: [],
    pastMedicalHistory: ["UTI (treated, 2026)"],
    pastSurgicalHistory: [],
    familyHistory: [],
    lifestyle: { smoking: "Never", alcohol: "Never", diet: "Balanced vegetarian", sleep: "7-8 hrs" },
    reviewOfSystems: { Genitourinary: "Asymptomatic" },
    generatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    intakeDurationSeconds: 96,
    vitals: {
      bloodPressure: "118/76",
      bloodPressureStatus: "Optimal Range",
      bloodGlucose: "92",
      bloodGlucoseType: "Fasting • Monitored",
      heartRate: "70 bpm",
      spO2: "99%",
      temperature: "98.6 °F",
    },
  },
  medications: {
    create: [
      { rawText: "Nitrofurantoin 100mg BD x 5 days", standardMolecule: "Nitrofurantoin", brandName: "Nitrofur 100", dosage: "100mg", frequency: "BD", duration: "5 Days", confidence: 0.85, confirmedByPatient: false, status: "completed", source: "pharmacy-dispensed", dispensedBy: "Apollo Pharmacy #419", dispensedAt: new Date(Date.now() - 20 * 86400000) },
    ],
  },
  documents: {
    create: [
      {
        title: "Discharge Summary — UTI",
        category: "discharge_summary",
        date: new Date(Date.now() - 20 * 86400000).toISOString().slice(0, 10),
        facility: "TalkRx Demo Clinic",
        doctorName: "Dr. Meera Sundaram",
        ocrConfidence: 0.97,
        extractedDiagnoses: ["Uncomplicated UTI"],
        rawText: "DISCHARGE SUMMARY\nDiagnosis: Uncomplicated UTI\nTreatment: Nitrofurantoin 100mg BD x 5 days\nFollow-up in 3 weeks.",
        verified: true,
      },
    ],
  },
  consents: {
    create: [
      { granteeName: "Apollo Pharmacy #419", granteeType: "Pharmacy", purpose: "Dispensation tracking", dataCategories: ["Active Medications"], accessLevel: "Write-Only (Dispensation)", validFrom: new Date(Date.now() - 25 * 86400000), validTill: new Date(Date.now() - 5 * 86400000), status: "Expired" },
      { granteeName: "Dr. Meera Sundaram", granteeType: "Doctor", purpose: "Follow-up care", dataCategories: ["All History"], accessLevel: "Full Care Access", validFrom: new Date(Date.now() - 25 * 86400000), validTill: new Date(Date.now() + 5 * 86400000), status: "Revoked" },
    ],
  },
  auditLog: {
    create: [
      { accessorName: "Apollo Pharmacy #419", accessorRole: "Pharmacist", facility: "Apollo Pharmacy #419", action: "Appended Dispensation QR", dataAccessed: "Active Medications", ipLocation: "TalkRx Pharmacy Network" },
    ],
  },
  timeline: {
    create: [
      { date: new Date(Date.now() - 20 * 86400000).toISOString().slice(0, 10), title: "Discharged — UTI Resolved", subtitle: "Dr. Meera Sundaram", category: "consultation", source: "doctor-prescribed", sourceEntity: "TalkRx Doctor Dashboard", doctorName: "Dr. Meera Sundaram", facility: "TalkRx Demo Clinic", description: "Uncomplicated UTI treated and resolved.", tags: ["Doctor-Verified"] },
    ],
  },
});
console.log("  ->", lakshmi.id);

console.log("\nDemo seed complete. 5 demo patients + 1 demo doctor (demo.doctor@talkrx.dev).");
await prisma.$disconnect();
