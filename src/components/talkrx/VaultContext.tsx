"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { MOCK_PATIENTS } from "./mock-data";
import { generateSerialNumber, isValidSerial } from "./serial";
import { extractFromSelfAssessment, extractFromPharmacyBill } from "./ai-extraction";
import type {
  PatientProfile,
  DoctorIdentity,
  ConsentAuthorization,
  AccessAuditLog,
  ExtractedMedication,
  TimelineEvent,
  IndicLanguage,
} from "./types";

const STORAGE_KEY = "talkrx.vault.v1";

interface VaultState {
  patients: PatientProfile[];
  currentPatientId: string | null;
  doctorIdentity: DoctorIdentity | null;
}

function nowStr(): string {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

function seedState(): VaultState {
  return {
    patients: structuredClone(MOCK_PATIENTS),
    currentPatientId: null,
    doctorIdentity: null,
  };
}

interface CreateAccountInput {
  name: string;
  age: number;
  gender: PatientProfile["gender"];
  phone: string;
  bloodGroup: string;
  preferredLanguage: IndicLanguage;
}

interface DoctorRecordInput {
  doctorName: string;
  licenseNumber: string;
  organization: string;
  clinicalNotes: string;
  diagnoses: string[];
  recommendations: string;
  prescriptions: Array<{ drugName: string; dosage: string; frequency: string; duration: string }>;
}

interface PharmacyDispenseInput {
  pharmacyName: string;
  items: Array<{ molecule: string; brand?: string; dosage: string; frequency: string; quantity: string }>;
}

interface VaultContextValue {
  isHydrated: boolean;
  patients: PatientProfile[];
  currentPatient: PatientProfile | null;
  doctorIdentity: DoctorIdentity | null;

  createAccount(input: CreateAccountInput): PatientProfile;
  signInWithSerial(serial: string): PatientProfile | null;
  signOut(): void;
  lookupPatient(query: string): PatientProfile | null;

  setDoctorIdentity(identity: DoctorIdentity): void;

  addSelfAssessment(patientId: string, rawText: string): void;

  addDoctorRecord(patientId: string, input: DoctorRecordInput): void;

  addPharmacyDispensation(serial: string, input: PharmacyDispenseInput): { ok: true; patientName: string } | { ok: false; reason: string };

  grantConsent(patientId: string, consent: Omit<ConsentAuthorization, "id" | "status">): void;
  revokeConsent(patientId: string, consentId: string): void;
  logAccess(patientId: string, entry: Omit<AccessAuditLog, "id" | "timestamp">): void;
}

const VaultContext = createContext<VaultContextValue | null>(null);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VaultState>({ patients: [], currentPatientId: null, doctorIdentity: null });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState(JSON.parse(raw) as VaultState);
      } else {
        setState(seedState());
      }
    } catch {
      setState(seedState());
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable — demo continues in-memory only
    }
  }, [state, isHydrated]);

  const updatePatient = useCallback((patientId: string, updater: (p: PatientProfile) => PatientProfile) => {
    setState((prev) => ({
      ...prev,
      patients: prev.patients.map((p) => (p.id === patientId ? updater(p) : p)),
    }));
  }, []);

  const createAccount = useCallback(
    (input: CreateAccountInput): PatientProfile => {
      let created: PatientProfile;
      setState((prev) => {
        const serial = generateSerialNumber(prev.patients.map((p) => p.serialNumber));
        created = {
          id: `pat-${serial}`,
          serialNumber: serial,
          createdAt: nowStr(),
          conditions: [],
          selfAssessments: [],
          doctorRecords: [],
          consents: [],
          auditLog: [],
          abhaId: "Not Linked",
          abhaAddress: "Not Linked",
          name: input.name,
          age: input.age,
          gender: input.gender,
          phone: input.phone,
          bloodGroup: input.bloodGroup,
          preferredLanguage: input.preferredLanguage,
          isReturningPatient: false,
          tokenNumber: "—",
          department: "—",
          hospitalName: "—",
          queueStatus: "waiting",
          timeline: [
            {
              id: `tl-create-${serial}`,
              date: nowStr().slice(0, 10),
              time: nowStr().slice(11),
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
          documents: [],
          activeMedications: [],
          allergies: [],
        };
        return { ...prev, patients: [...prev.patients, created], currentPatientId: created.id };
      });
      return created!;
    },
    []
  );

  const signInWithSerial = useCallback(
    (serial: string): PatientProfile | null => {
      const found = state.patients.find((p) => p.serialNumber === serial.trim());
      if (found) {
        setState((prev) => ({ ...prev, currentPatientId: found.id }));
        return found;
      }
      return null;
    },
    [state.patients]
  );

  const signOut = useCallback(() => {
    setState((prev) => ({ ...prev, currentPatientId: null }));
  }, []);

  const lookupPatient = useCallback(
    (query: string): PatientProfile | null => {
      const q = query.trim();
      return state.patients.find((p) => p.serialNumber === q || p.abhaId === q) || null;
    },
    [state.patients]
  );

  const setDoctorIdentity = useCallback((identity: DoctorIdentity) => {
    setState((prev) => ({ ...prev, doctorIdentity: identity }));
  }, []);

  const addSelfAssessment = useCallback(
    (patientId: string, rawText: string) => {
      const extraction = extractFromSelfAssessment(rawText);
      const timestamp = nowStr();
      const entryId = `sa-${Date.now()}`;

      updatePatient(patientId, (p) => {
        const newConditions = extraction.conditions.map((c, idx) => ({
          id: `cond-${Date.now()}-${idx}`,
          label: c.label,
          kind: c.kind,
          source: "patient-reported" as const,
          confidence: c.confidence,
          verified: false,
          recordedBy: "Self-reported",
          recordedAt: timestamp,
        }));

        const newMedications: ExtractedMedication[] = extraction.medications.map((m, idx) => ({
          id: `med-sa-${Date.now()}-${idx}`,
          rawText: m.rawText,
          standardMolecule: m.standardMolecule,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: "Unspecified",
          confidence: m.confidence,
          confirmedByPatient: true,
          status: "active",
          source: "patient-reported",
        }));

        const newAllergies = extraction.conditions
          .filter((c) => c.kind === "allergy")
          .map((c) => c.label)
          .filter((a) => !p.allergies.includes(a));

        const timelineEvent: TimelineEvent = {
          id: `tl-sa-${Date.now()}`,
          date: timestamp.slice(0, 10),
          time: timestamp.slice(11),
          title: "Self-Assessment Submitted",
          subtitle: "Patient-reported, AI-assisted extraction",
          category: "case-taking",
          source: "patient-reported",
          sourceEntity: "TalkRx Self-Assessment AI",
          facility: "TalkRx Digital",
          description: `Patient described symptoms/history in natural language. AI suggested ${extraction.conditions.length} condition(s)/symptom(s) and ${extraction.medications.length} medication(s) — unverified, pending clinical review.`,
          tags: ["Self-Assessment", `${Math.round(extraction.confidenceAvg * 100)}% Avg Confidence`],
        };

        return {
          ...p,
          conditions: [...p.conditions, ...newConditions],
          activeMedications: [...p.activeMedications, ...newMedications],
          allergies: [...p.allergies, ...newAllergies],
          selfAssessments: [
            ...p.selfAssessments,
            {
              id: entryId,
              submittedAt: timestamp,
              rawText,
              extractedConditionIds: newConditions.map((c) => c.id),
              extractedMedicationIds: newMedications.map((m) => m.id),
              aiConfidenceAvg: extraction.confidenceAvg,
            },
          ],
          timeline: [timelineEvent, ...p.timeline],
        };
      });
    },
    [updatePatient]
  );

  const addDoctorRecord = useCallback(
    (patientId: string, input: DoctorRecordInput) => {
      const timestamp = nowStr();
      const recordId = `dr-${Date.now()}`;

      updatePatient(patientId, (p) => {
        const diagnosedConditions = input.diagnoses.map((label, idx) => ({
          id: `cond-dr-${Date.now()}-${idx}`,
          label,
          kind: "diagnosis" as const,
          source: "doctor-prescribed" as const,
          confidence: 1,
          verified: true,
          recordedBy: input.doctorName,
          recordedAt: timestamp,
        }));

        const prescribedMedications: ExtractedMedication[] = input.prescriptions.map((rx, idx) => ({
          id: `med-dr-${Date.now()}-${idx}`,
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
        }));

        const timelineEvent: TimelineEvent = {
          id: `tl-dr-${Date.now()}`,
          date: timestamp.slice(0, 10),
          time: timestamp.slice(11),
          title: "Doctor Consultation Recorded",
          subtitle: `${input.doctorName}${input.organization ? ` · ${input.organization}` : ""}`,
          category: "consultation",
          source: "doctor-prescribed",
          sourceEntity: "TalkRx Doctor Dashboard",
          doctorName: input.doctorName,
          facility: input.organization || "TalkRx Connected Clinic",
          description:
            input.clinicalNotes ||
            `${input.diagnoses.length} condition(s) observed, ${input.prescriptions.length} medication(s) prescribed.`,
          tags: ["Doctor-Verified", ...(input.diagnoses.length ? [`${input.diagnoses.length} Diagnosis`] : [])],
        };

        return {
          ...p,
          conditions: [...p.conditions, ...diagnosedConditions],
          activeMedications: [...p.activeMedications, ...prescribedMedications],
          doctorRecords: [
            ...p.doctorRecords,
            {
              id: recordId,
              doctorName: input.doctorName,
              licenseNumber: input.licenseNumber,
              organization: input.organization,
              timestamp,
              clinicalNotes: input.clinicalNotes,
              diagnosedConditionIds: diagnosedConditions.map((c) => c.id),
              prescribedMedicationIds: prescribedMedications.map((m) => m.id),
              recommendations: input.recommendations,
            },
          ],
          timeline: [timelineEvent, ...p.timeline],
        };
      });
    },
    [updatePatient]
  );

  const addPharmacyDispensation = useCallback(
    (serial: string, input: PharmacyDispenseInput): { ok: true; patientName: string } | { ok: false; reason: string } => {
      if (!isValidSerial(serial)) return { ok: false, reason: "Invalid serial format" };
      const patient = state.patients.find((p) => p.serialNumber === serial.trim());
      if (!patient) return { ok: false, reason: "No TalkRx account found for that serial" };

      const timestamp = nowStr();

      updatePatient(patient.id, (p) => {
        const dispensedMedications: ExtractedMedication[] = input.items.map((item, idx) => ({
          id: `med-ph-${Date.now()}-${idx}`,
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
          dispensedAt: timestamp,
        }));

        const timelineEvent: TimelineEvent = {
          id: `tl-ph-${Date.now()}`,
          date: timestamp.slice(0, 10),
          time: timestamp.slice(11),
          title: "Pharmacy Dispensation Linked",
          subtitle: input.pharmacyName,
          category: "dispensation",
          source: "pharmacy-dispensed",
          sourceEntity: "TalkRx Pharmacy Integration",
          facility: input.pharmacyName,
          description: `${input.items.length} medication(s) dispensed and voluntarily linked via TalkRx Serial Number.`,
          tags: ["Pharmacy-Dispensed", "Serial-Linked"],
        };

        return {
          ...p,
          activeMedications: [...p.activeMedications, ...dispensedMedications],
          timeline: [timelineEvent, ...p.timeline],
        };
      });

      return { ok: true, patientName: patient.name };
    },
    [state.patients, updatePatient]
  );

  const grantConsent = useCallback(
    (patientId: string, consent: Omit<ConsentAuthorization, "id" | "status">) => {
      updatePatient(patientId, (p) => ({
        ...p,
        consents: [...p.consents, { ...consent, id: `con-${Date.now()}`, status: "Active" }],
      }));
    },
    [updatePatient]
  );

  const revokeConsent = useCallback(
    (patientId: string, consentId: string) => {
      updatePatient(patientId, (p) => ({
        ...p,
        consents: p.consents.map((c) => (c.id === consentId ? { ...c, status: "Revoked" } : c)),
      }));
    },
    [updatePatient]
  );

  const logAccess = useCallback(
    (patientId: string, entry: Omit<AccessAuditLog, "id" | "timestamp">) => {
      updatePatient(patientId, (p) => ({
        ...p,
        auditLog: [{ ...entry, id: `aud-${Date.now()}`, timestamp: nowStr() }, ...p.auditLog],
      }));
    },
    [updatePatient]
  );

  const currentPatient = state.patients.find((p) => p.id === state.currentPatientId) || null;

  const value: VaultContextValue = {
    isHydrated,
    patients: state.patients,
    currentPatient,
    doctorIdentity: state.doctorIdentity,
    createAccount,
    signInWithSerial,
    signOut,
    lookupPatient,
    setDoctorIdentity,
    addSelfAssessment,
    addDoctorRecord,
    addPharmacyDispensation,
    grantConsent,
    revokeConsent,
    logAccess,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault(): VaultContextValue {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be used within a VaultProvider");
  return ctx;
}
