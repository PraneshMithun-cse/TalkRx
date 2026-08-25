import "server-only";
import { Prisma } from "@prisma/client";
import type {
  PatientProfile,
  PatientCondition,
  ExtractedMedication,
  SelfAssessmentEntry,
  DoctorConsultationRecord,
  ConsentAuthorization,
  AccessAuditLog,
  TimelineEvent,
  MedicalDocument,
  ExtractedLabResult,
  StructuredHpiSummary,
  DashavidhaParikshaData,
  ProvenanceSource,
} from "@/components/talkrx/types";

export const PATIENT_INCLUDE = {
  conditions: true,
  medications: true,
  selfAssessments: true,
  doctorRecords: true,
  consents: true,
  auditLog: { orderBy: { timestamp: "desc" } },
  timeline: { orderBy: { createdAt: "desc" } },
  documents: { include: { extractedLabs: true, extractedMedicines: true } },
} satisfies Prisma.PatientInclude;

export type PatientWithRelations = Prisma.PatientGetPayload<{ include: typeof PATIENT_INCLUDE }>;

export function nowParts(): { date: string; time: string } {
  const iso = new Date().toISOString();
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) };
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 16).replace("T", " ");
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function serializePatient(p: PatientWithRelations): PatientProfile {
  const conditions: PatientCondition[] = p.conditions.map((c) => ({
    id: c.id,
    label: c.label,
    kind: c.kind,
    source: c.source as ProvenanceSource,
    confidence: c.confidence,
    verified: c.verified,
    recordedBy: c.recordedBy ?? undefined,
    recordedAt: fmt(c.recordedAt),
    notes: c.notes ?? undefined,
  }));

  const medications: ExtractedMedication[] = p.medications.map((m) => ({
    id: m.id,
    rawText: m.rawText,
    standardMolecule: m.standardMolecule,
    brandName: m.brandName ?? undefined,
    dosage: m.dosage,
    frequency: m.frequency,
    duration: m.duration,
    confidence: m.confidence,
    confirmedByPatient: m.confirmedByPatient,
    status: m.status,
    source: m.source as ProvenanceSource,
    prescribedBy: m.prescribedBy ?? undefined,
    dispensedBy: m.dispensedBy ?? undefined,
    dispensedAt: m.dispensedAt ? fmt(m.dispensedAt) : undefined,
    notes: m.notes ?? undefined,
  }));

  const selfAssessments: SelfAssessmentEntry[] = p.selfAssessments.map((sa) => ({
    id: sa.id,
    submittedAt: fmt(sa.submittedAt),
    rawText: sa.rawText,
    extractedConditionIds: p.conditions.filter((c) => c.sourceAssessmentId === sa.id).map((c) => c.id),
    extractedMedicationIds: p.medications.filter((m) => m.sourceAssessmentId === sa.id).map((m) => m.id),
    aiConfidenceAvg: sa.aiConfidenceAvg,
  }));

  const doctorRecords: DoctorConsultationRecord[] = p.doctorRecords.map((dr) => ({
    id: dr.id,
    doctorName: dr.doctorName,
    licenseNumber: dr.licenseNumber,
    organization: dr.organization,
    timestamp: fmt(dr.timestamp),
    clinicalNotes: dr.clinicalNotes,
    diagnosedConditionIds: p.conditions.filter((c) => c.sourceDoctorRecordId === dr.id).map((c) => c.id),
    prescribedMedicationIds: p.medications.filter((m) => m.sourceDoctorRecordId === dr.id).map((m) => m.id),
    recommendations: dr.recommendations,
  }));

  const consents: ConsentAuthorization[] = p.consents.map((c) => ({
    id: c.id,
    granteeName: c.granteeName,
    granteeType: c.granteeType as ConsentAuthorization["granteeType"],
    purpose: c.purpose,
    dataCategories: c.dataCategories as ConsentAuthorization["dataCategories"],
    accessLevel: c.accessLevel as ConsentAuthorization["accessLevel"],
    validFrom: fmtDate(c.validFrom),
    validTill: fmtDate(c.validTill),
    status: c.status,
  }));

  const auditLog: AccessAuditLog[] = p.auditLog.map((a) => ({
    id: a.id,
    timestamp: fmt(a.timestamp),
    accessorName: a.accessorName,
    accessorRole: a.accessorRole,
    facility: a.facility,
    action: a.action as AccessAuditLog["action"],
    dataAccessed: a.dataAccessed,
    ipLocation: a.ipLocation,
  }));

  const timeline: TimelineEvent[] = p.timeline.map((t) => ({
    id: t.id,
    date: t.date,
    time: t.time ?? undefined,
    title: t.title,
    subtitle: t.subtitle,
    category: t.category as TimelineEvent["category"],
    source: t.source as ProvenanceSource,
    sourceEntity: t.sourceEntity,
    doctorName: t.doctorName ?? undefined,
    facility: t.facility,
    description: t.description,
    tags: t.tags,
    metadata: (t.metadata as TimelineEvent["metadata"]) ?? undefined,
    isRedFlag: t.isRedFlag,
  }));

  const documents: MedicalDocument[] = p.documents.map((doc) => {
    const extractedLabs: ExtractedLabResult[] = doc.extractedLabs.map((l) => ({
      id: l.id,
      parameter: l.parameter,
      value: l.value,
      unit: l.unit,
      referenceRange: l.referenceRange,
      isAbnormal: l.isAbnormal,
      loincCode: l.loincCode ?? undefined,
      sourceDoc: l.sourceDoc,
      date: l.date,
    }));
    const extractedMedicines: ExtractedMedication[] = doc.extractedMedicines.map((m) => ({
      id: m.id,
      rawText: m.rawText,
      standardMolecule: m.standardMolecule,
      brandName: m.brandName ?? undefined,
      dosage: m.dosage,
      frequency: m.frequency,
      duration: m.duration,
      confidence: m.confidence,
      confirmedByPatient: m.confirmedByPatient,
      status: m.status,
      source: m.source as ProvenanceSource,
      prescribedBy: m.prescribedBy ?? undefined,
      dispensedBy: m.dispensedBy ?? undefined,
      dispensedAt: m.dispensedAt ? fmt(m.dispensedAt) : undefined,
      notes: m.notes ?? undefined,
    }));
    return {
      id: doc.id,
      title: doc.title,
      category: doc.category,
      date: doc.date,
      facility: doc.facility,
      doctorName: doc.doctorName ?? undefined,
      fileUrl: doc.fileUrl ?? undefined,
      ocrConfidence: doc.ocrConfidence,
      extractedMedicines,
      extractedLabs,
      extractedDiagnoses: doc.extractedDiagnoses,
      rawText: doc.rawText,
      verified: doc.verified,
    };
  });

  return {
    id: p.id,
    serialNumber: p.serialNumber,
    createdAt: fmt(p.createdAt),
    conditions,
    selfAssessments,
    doctorRecords,
    consents,
    auditLog,
    abhaId: p.abhaId,
    abhaAddress: p.abhaAddress,
    name: p.name,
    age: p.age,
    gender: p.gender,
    phone: p.phone,
    bloodGroup: p.bloodGroup,
    preferredLanguage: p.preferredLanguage,
    photoUrl: p.photoUrl ?? undefined,
    isReturningPatient: p.isReturningPatient,
    tokenNumber: p.tokenNumber,
    department: p.department,
    hospitalName: p.hospitalName,
    queueStatus: p.queueStatus as PatientProfile["queueStatus"],
    structuredSummary: (p.structuredSummary as unknown as StructuredHpiSummary) ?? undefined,
    ayushData: (p.ayushData as unknown as DashavidhaParikshaData) ?? undefined,
    timeline,
    documents,
    activeMedications: medications,
    allergies: p.allergies,
  };
}
