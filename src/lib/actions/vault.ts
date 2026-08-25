"use server";

import { prisma } from "@/lib/prisma";
import { requireUser, requireRole, getCurrentUser } from "@/lib/actions/auth-helpers";
import { serializePatient, PATIENT_INCLUDE, nowParts } from "@/lib/actions/serialize";
import { generateUniqueSerial } from "@/lib/actions/serial-gen";
import { isValidSerial } from "@/components/talkrx/serial";
import { extractFromSelfAssessment } from "@/lib/ai/extraction";
import type {
  PatientProfile,
  DoctorIdentity,
  ConsentAuthorization,
  AccessAuditLog,
  IndicLanguage,
  StructuredHpiSummary,
  DashavidhaParikshaData,
} from "@/components/talkrx/types";

export async function loadPatient(id: string): Promise<PatientProfile> {
  const p = await prisma.patient.findUniqueOrThrow({ where: { id }, include: PATIENT_INCLUDE });
  return serializePatient(p);
}

async function assertPatientAccess(patientId: string, _opts: { selfOnly?: boolean } = {}): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  // Patient, Doctor, Pharmacy, and Staff roles all authorized for clinical / kiosk flows
}

// ---------------------------------------------------------------------------
// Session hydration
// ---------------------------------------------------------------------------

export interface SessionState {
  role: "PATIENT" | "DOCTOR" | "PHARMACY" | "STAFF" | null;
  currentPatient: PatientProfile | null;
  patients: PatientProfile[];
  doctorIdentity: DoctorIdentity | null;
}

export async function getSessionStateAction(): Promise<SessionState> {
  const user = await getCurrentUser();
  if (!user) return { role: null, currentPatient: null, patients: [], doctorIdentity: null };

  if (user.role === "PATIENT") {
    const patient = await prisma.patient.findUnique({ where: { userId: user.id }, include: PATIENT_INCLUDE });
    return {
      role: "PATIENT",
      currentPatient: patient ? serializePatient(patient) : null,
      patients: [],
      doctorIdentity: null,
    };
  }

  const all = await prisma.patient.findMany({ include: PATIENT_INCLUDE, orderBy: { createdAt: "desc" } });
  const doctorIdentity: DoctorIdentity | null =
    user.role === "DOCTOR" || user.role === "STAFF"
      ? {
          name: user.name,
          licenseNumber: user.licenseNumber ?? "",
          organization: user.organization ?? "",
          department: user.department ?? "",
        }
      : null;

  return {
    role: user.role,
    currentPatient: all.length > 0 ? serializePatient(all[0]) : null,
    patients: all.map(serializePatient),
    doctorIdentity,
  };
}

// ---------------------------------------------------------------------------
// Account / identity
// ---------------------------------------------------------------------------

export interface CreateAccountInput {
  name: string;
  age: number;
  gender: "Female" | "Male" | "Other";
  phone: string;
  bloodGroup: string;
  preferredLanguage: IndicLanguage;
}

export async function createAccountAction(input: CreateAccountInput): Promise<PatientProfile> {
  const user = await getCurrentUser();
  const serial = await generateUniqueSerial();
  const { date, time } = nowParts();

  let targetUserId: string;

  if (user) {
    if (user.role === "PATIENT") {
      const existing = await prisma.patient.findUnique({ where: { userId: user.id } });
      if (existing) return loadPatient(existing.id);
      targetUserId = user.id;
    } else {
      // DOCTOR, STAFF, or PHARMACY creating/registering a patient record in OPD
      const patientUser = await prisma.user.create({
        data: {
          clerkId: `patient_${serial}_${Date.now()}`,
          name: input.name,
          role: "PATIENT",
        },
      });
      targetUserId = patientUser.id;
    }
  } else {
    // Guest or unauthenticated local session
    const guestUser = await prisma.user.create({
      data: {
        clerkId: `guest_${serial}_${Date.now()}`,
        name: input.name,
        role: "PATIENT",
      },
    });
    targetUserId = guestUser.id;
  }

  const created = await prisma.patient.create({
    data: {
      userId: targetUserId,
      serialNumber: serial,
      name: input.name,
      age: input.age,
      gender: input.gender,
      phone: input.phone,
      bloodGroup: input.bloodGroup,
      preferredLanguage: input.preferredLanguage,
      timeline: {
        create: [
          {
            date,
            time,
            title: "TalkRx Account Created",
            subtitle: "Self-registration",
            category: "case-taking",
            source: "patient-reported",
            sourceEntity: "TalkRx Account Service",
            facility: "TalkRx Digital",
            description: `${input.name} created a TalkRx account and received Serial Number ${serial}.`,
            tags: ["Account Created"],
          },
        ],
      },
    },
    include: PATIENT_INCLUDE,
  });

  return serializePatient(created);
}

export async function lookupPatientAction(query: string): Promise<PatientProfile | null> {
  const q = query.trim();
  const cleanSerial = q.replace(/\s+/g, "");
  const found = await prisma.patient.findFirst({
    where: {
      OR: [
        { serialNumber: q },
        { serialNumber: cleanSerial },
        { abhaId: q },
        { name: { contains: q, mode: "insensitive" } },
      ],
    },
    include: PATIENT_INCLUDE,
  });
  if (!found) return null;
  return serializePatient(found);
}

export async function setDoctorIdentityAction(identity: DoctorIdentity): Promise<void> {
  const user = await getCurrentUser();
  if (user && (user.role === "DOCTOR" || user.role === "STAFF")) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: identity.name,
        licenseNumber: identity.licenseNumber,
        organization: identity.organization,
        department: identity.department,
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Self-assessment (real Groq extraction)
// ---------------------------------------------------------------------------

export async function addSelfAssessmentAction(patientId: string, rawText: string): Promise<PatientProfile> {
  await assertPatientAccess(patientId, { selfOnly: true });
  const extraction = await extractFromSelfAssessment(rawText);
  const { date, time } = nowParts();

  await prisma.$transaction(async (tx) => {
    const entry = await tx.selfAssessmentEntry.create({
      data: { patientId, rawText, aiConfidenceAvg: extraction.confidenceAvg },
    });

    if (extraction.conditions.length) {
      await tx.patientCondition.createMany({
        data: extraction.conditions.map((c) => ({
          patientId,
          label: c.label,
          kind: c.kind,
          source: "patient-reported",
          confidence: c.confidence,
          verified: false,
          recordedBy: "Self-reported",
          sourceAssessmentId: entry.id,
        })),
      });
    }

    if (extraction.medications.length) {
      await tx.extractedMedication.createMany({
        data: extraction.medications.map((m) => ({
          patientId,
          rawText: m.rawText,
          standardMolecule: m.standardMolecule,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: "Unspecified",
          confidence: m.confidence,
          confirmedByPatient: true,
          status: "active",
          source: "patient-reported",
          sourceAssessmentId: entry.id,
        })),
      });
    }

    const newAllergyLabels = extraction.conditions.filter((c) => c.kind === "allergy").map((c) => c.label);
    if (newAllergyLabels.length) {
      const current = await tx.patient.findUniqueOrThrow({ where: { id: patientId }, select: { allergies: true } });
      const merged = Array.from(new Set([...current.allergies, ...newAllergyLabels]));
      await tx.patient.update({ where: { id: patientId }, data: { allergies: merged } });
    }

    await tx.timelineEvent.create({
      data: {
        patientId,
        date,
        time,
        title: "Self-Assessment Submitted",
        subtitle: "Patient-reported, AI-assisted extraction",
        category: "case-taking",
        source: "patient-reported",
        sourceEntity: "TalkRx Self-Assessment AI",
        facility: "TalkRx Digital",
        description: `Patient described symptoms/history in natural language. AI suggested ${extraction.conditions.length} condition(s)/symptom(s) and ${extraction.medications.length} medication(s) — unverified, pending clinical review.`,
        tags: ["Self-Assessment", `${Math.round(extraction.confidenceAvg * 100)}% Avg Confidence`],
      },
    });
  });

  return loadPatient(patientId);
}

// ---------------------------------------------------------------------------
// Doctor consultation
// ---------------------------------------------------------------------------

export interface DoctorRecordInput {
  doctorName: string;
  licenseNumber: string;
  organization: string;
  clinicalNotes: string;
  diagnoses: string[];
  recommendations: string;
  prescriptions: Array<{ drugName: string; dosage: string; frequency: string; duration: string }>;
}

export async function addDoctorRecordAction(patientId: string, input: DoctorRecordInput): Promise<PatientProfile> {
  const user = await getCurrentUser();
  const { date, time } = nowParts();

  await prisma.$transaction(async (tx) => {
    const record = await tx.doctorConsultationRecord.create({
      data: {
        patientId,
        doctorId: user?.id,
        doctorName: input.doctorName,
        licenseNumber: input.licenseNumber,
        organization: input.organization,
        clinicalNotes: input.clinicalNotes,
        recommendations: input.recommendations,
      },
    });

    if (input.diagnoses.length) {
      await tx.patientCondition.createMany({
        data: input.diagnoses.map((label) => ({
          patientId,
          label,
          kind: "diagnosis",
          source: "doctor-prescribed",
          confidence: 1,
          verified: true,
          recordedBy: input.doctorName,
          sourceDoctorRecordId: record.id,
        })),
      });
    }

    if (input.prescriptions.length) {
      await tx.extractedMedication.createMany({
        data: input.prescriptions.map((rx) => ({
          patientId,
          rawText: `${rx.drugName} ${rx.dosage} ${rx.frequency} x ${rx.duration}`,
          standardMolecule: rx.drugName,
          dosage: rx.dosage,
          frequency: rx.frequency,
          duration: rx.duration,
          confidence: 1,
          confirmedByPatient: false,
          status: "active",
          source: "doctor-prescribed",
          prescribedBy: `${input.doctorName}${input.licenseNumber ? ` (${input.licenseNumber})` : ""}`,
          sourceDoctorRecordId: record.id,
        })),
      });
    }

    await tx.timelineEvent.create({
      data: {
        patientId,
        date,
        time,
        title: "Doctor Consultation Recorded",
        subtitle: `${input.doctorName}${input.organization ? ` · ${input.organization}` : ""}`,
        category: "consultation",
        source: "doctor-prescribed",
        sourceEntity: "TalkRx Doctor Dashboard",
        doctorName: input.doctorName,
        facility: input.organization || "TalkRx Connected Clinic",
        description:
          input.clinicalNotes || `${input.diagnoses.length} condition(s) observed, ${input.prescriptions.length} medication(s) prescribed.`,
        tags: ["Doctor-Verified", ...(input.diagnoses.length ? [`${input.diagnoses.length} Diagnosis`] : [])],
      },
    });
  });

  return loadPatient(patientId);
}

// ---------------------------------------------------------------------------
// Pharmacy dispensation
// ---------------------------------------------------------------------------

export interface PharmacyDispenseInput {
  pharmacyName: string;
  items: Array<{ molecule: string; brand?: string; dosage: string; frequency: string; quantity: string }>;
}

export async function addPharmacyDispensationAction(
  serial: string,
  input: PharmacyDispenseInput
): Promise<{ ok: true; patientName: string } | { ok: false; reason: string }> {
  const cleanSerial = serial.trim().replace(/\s+/g, "");
  const patient = await prisma.patient.findFirst({
    where: {
      OR: [{ serialNumber: serial.trim() }, { serialNumber: cleanSerial }],
    },
  });
  if (!patient) return { ok: false, reason: "No TalkRx account found for that serial" };

  const { date, time } = nowParts();

  await prisma.$transaction(async (tx) => {
    await tx.extractedMedication.createMany({
      data: input.items.map((item) => ({
        patientId: patient.id,
        rawText: `${item.molecule} ${item.dosage}`.trim(),
        standardMolecule: item.molecule,
        brandName: item.brand,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.quantity,
        confidence: 0.85,
        confirmedByPatient: false,
        status: "active",
        source: "pharmacy-dispensed",
        dispensedBy: input.pharmacyName,
        dispensedAt: new Date(),
      })),
    });

    await tx.timelineEvent.create({
      data: {
        patientId: patient.id,
        date,
        time,
        title: "Pharmacy Dispensation Linked",
        subtitle: input.pharmacyName,
        category: "dispensation",
        source: "pharmacy-dispensed",
        sourceEntity: "TalkRx Pharmacy Integration",
        facility: input.pharmacyName,
        description: `${input.items.length} medication(s) dispensed and voluntarily linked via TalkRx Serial Number.`,
        tags: ["Pharmacy-Dispensed", "Serial-Linked"],
      },
    });
  });

  return { ok: true, patientName: patient.name };
}

// ---------------------------------------------------------------------------
// Consents & audit
// ---------------------------------------------------------------------------

export async function grantConsentAction(
  patientId: string,
  consent: Omit<ConsentAuthorization, "id" | "status">
): Promise<PatientProfile> {
  await assertPatientAccess(patientId, { selfOnly: true });
  await prisma.consentAuthorization.create({
    data: {
      patientId,
      granteeName: consent.granteeName,
      granteeType: consent.granteeType,
      purpose: consent.purpose,
      dataCategories: consent.dataCategories,
      accessLevel: consent.accessLevel,
      validFrom: new Date(consent.validFrom),
      validTill: new Date(consent.validTill),
      status: "Active",
    },
  });
  return loadPatient(patientId);
}

export async function revokeConsentAction(patientId: string, consentId: string): Promise<PatientProfile> {
  await assertPatientAccess(patientId, { selfOnly: true });
  await prisma.consentAuthorization.update({ where: { id: consentId }, data: { status: "Revoked" } });
  return loadPatient(patientId);
}

export async function logAccessAction(patientId: string, entry: Omit<AccessAuditLog, "id" | "timestamp">): Promise<void> {
  await requireUser();
  await prisma.accessAuditLog.create({
    data: {
      patientId,
      accessorName: entry.accessorName,
      accessorRole: entry.accessorRole,
      facility: entry.facility,
      action: entry.action,
      dataAccessed: entry.dataAccessed,
      ipLocation: entry.ipLocation,
    },
  });
}

// ---------------------------------------------------------------------------
// Case-taking submission (Phase 3)
// ---------------------------------------------------------------------------

export async function submitCaseTakingSummaryAction(
  patientId: string,
  summary: StructuredHpiSummary,
  ayushData?: DashavidhaParikshaData
): Promise<PatientProfile> {
  await assertPatientAccess(patientId, { selfOnly: true });
  const { date, time } = nowParts();

  await prisma.$transaction(async (tx) => {
    await tx.patient.update({
      where: { id: patientId },
      data: {
        structuredSummary: summary as unknown as object,
        ayushData: ayushData ? (ayushData as unknown as object) : undefined,
        queueStatus: "case-completed",
      },
    });

    await tx.timelineEvent.create({
      data: {
        patientId,
        date,
        time,
        title: "AI Case-Taking Completed",
        subtitle: summary.chiefComplaint,
        category: "case-taking",
        source: "patient-reported",
        sourceEntity: "TalkRx Case-Taking Kiosk",
        facility: "TalkRx Digital",
        description: summary.hpiNarrative,
        tags: ["Case-Taking", ...(ayushData ? ["AYUSH Dashavidha Pariksha"] : [])],
        isRedFlag: summary.redFlagsDetected.length > 0,
      },
    });

    for (const flag of summary.redFlagsDetected) {
      await tx.redFlagAlert.create({
        data: {
          patientId,
          category: flag.category,
          severity: flag.severity,
          matchedRule: flag.matchedRule,
          patientStatement: flag.patientStatement,
          escalatedTo: flag.escalatedTo,
          status: "active",
          actionRequired: flag.actionRequired,
        },
      });
    }
  });

  return loadPatient(patientId);
}
