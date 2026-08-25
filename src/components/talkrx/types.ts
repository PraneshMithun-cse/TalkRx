export type StakeholderPortal =
  | "showcase"
  | "case-taking"
  | "doctor"
  | "hospital"
  | "pharmacy"
  | "patient"
  | "ayush"
  | "documents";

export type IndicLanguage =
  | "hi"
  | "ta"
  | "te"
  | "bn"
  | "mr"
  | "kn"
  | "ml"
  | "gu"
  | "pa"
  | "od"
  | "en";

export interface LanguageOption {
  code: IndicLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export type InputMode = "voice" | "touch" | "hybrid";

export type ProvenanceSource =
  | "patient-reported"
  | "doctor-prescribed"
  | "pharmacy-dispensed"
  | "document-extracted"
  | "ayush-assessed"
  | "lab-verified";

export interface RedFlagAlert {
  id: string;
  category: "cardiac" | "respiratory" | "stroke" | "sepsis" | "obstetric" | "paediatric" | "severe-trauma";
  severity: "critical" | "high" | "moderate";
  matchedRule: string;
  patientStatement: string;
  timestamp: string;
  escalatedTo: string;
  status: "active" | "acknowledged" | "resolved";
  actionRequired: string;
}

export interface ExtractedMedication {
  id: string;
  rawText: string;
  standardMolecule: string;
  brandName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  confidence: number;
  confirmedByPatient: boolean;
  status: "active" | "completed" | "discontinued";
  source: ProvenanceSource;
  prescribedBy?: string;
  dispensedBy?: string;
  dispensedAt?: string;
  notes?: string;
}

export interface ExtractedLabResult {
  id: string;
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  loincCode?: string;
  sourceDoc: string;
  date: string;
}

export interface MedicalDocument {
  id: string;
  title: string;
  category: "prescription" | "lab_report" | "discharge_summary" | "diagnostic_scan" | "ayush_consult";
  date: string;
  facility: string;
  doctorName?: string;
  fileUrl?: string;
  ocrConfidence: number;
  extractedMedicines: ExtractedMedication[];
  extractedLabs: ExtractedLabResult[];
  extractedDiagnoses: string[];
  rawText: string;
  verified: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  subtitle: string;
  category: "case-taking" | "consultation" | "prescription" | "dispensation" | "lab" | "document" | "ayush" | "triage";
  source: ProvenanceSource;
  sourceEntity: string;
  doctorName?: string;
  facility: string;
  description: string;
  tags: string[];
  metadata?: Record<string, string | number | boolean>;
  isRedFlag?: boolean;
}

export interface DashavidhaParikshaData {
  prakriti: {
    primaryDosha: "Vata" | "Pitta" | "Kapha" | "Vata-Pitta" | "Pitta-Vata" | "Pitta-Kapha" | "Vata-Kapha" | "Tridosha" | string;
    scores: { vata: number; pitta: number; kapha: number };
    physicalTraits: string;
    psychologicalTraits: string;
  };
  vikriti: {
    imbalancedDosha: "Vata" | "Pitta" | "Kapha" | "Sannipata" | string;
    currentDeviation: string;
    namasteMorbidityCode: string;
    whoIcd11Tm2Code: string;
  };
  sara: { tissueQuality: "Pravara (Superior)" | "Madhyama (Medium)" | "Avara (Inferior)" | string; dominantTissue: string };
  samhanana: { build: "Compact / Well-built" | "Moderate" | "Slender / Weak" | string };
  pramana: { anthropometry: "Proportionate" | "Disproportionate" | string };
  satmya: { habituation: "Sarva Rasa (All 6 tastes)" | "Mixed" | "Ek Rasa" | string };
  sattva: { mentalStrength: "Pravara (High)" | "Madhyama (Moderate)" | "Avara (Low)" | string };
  aharaShakti: { abhyavaharana: "High Appetite" | "Moderate" | "Low"; jaranaShakti: "Good Digestion" | "Sluggish" | "Impaired" };
  vyayamaShakti: { exerciseCapacity: "High" | "Moderate" | "Low" };
  vaya: { ageClassification: "Balya (Childhood)" | "Madhyama (Middle age)" | "Vriddha (Elderly)" };
  ashtavidha: {
    nadi: string;
    mutra: string;
    mala: string;
    jihva: string;
    shabda: string;
    sparsha: string;
    drik: string;
    akriti: string;
  };
  agni: "Vishamagni (Irregular)" | "Tikshnagni (Intense)" | "Mandagni (Dull)" | "Samagni (Balanced)";
  koshtha: "Krura (Hard)" | "Mridu (Soft)" | "Madhyama (Medium)";
}

export interface StructuredHpiSummary {
  chiefComplaint: string;
  duration: string;
  hpiNarrative: string;
  painCharacteristics?: {
    site: string;
    radiation?: string;
    character: string;
    severity: number;
    aggravatingFactors: string[];
    relievingFactors: string[];
  };
  pertinentPositives: string[];
  pertinentNegatives: string[];
  redFlagsDetected: RedFlagAlert[];
  allergies: { allergen: string; reaction: string; severity: "Life-Threatening" | "Moderate" | "Mild" }[];
  currentMedications: ExtractedMedication[];
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  familyHistory: string[];
  lifestyle: { smoking: string; alcohol: string; diet: string; sleep: string };
  reviewOfSystems: Record<string, string>;
  generatedAt: string;
  intakeDurationSeconds: number;
}

export interface PatientVitals {
  bloodPressure?: string;
  bloodPressureStatus?: string;
  bloodGlucose?: string;
  bloodGlucoseType?: string;
  heartRate?: string;
  spO2?: string;
  temperature?: string;
  weight?: string;
  height?: string;
}

export interface PatientProfile {
  id: string;
  serialNumber: string;
  createdAt: string;
  conditions: PatientCondition[];
  selfAssessments: SelfAssessmentEntry[];
  doctorRecords: DoctorConsultationRecord[];
  consents: ConsentAuthorization[];
  auditLog: AccessAuditLog[];
  abhaId: string;
  abhaAddress: string;
  name: string;
  age: number;
  gender: "Female" | "Male" | "Other";
  phone: string;
  bloodGroup: string;
  preferredLanguage: IndicLanguage;
  photoUrl?: string;
  isReturningPatient: boolean;
  tokenNumber: string;
  department: string;
  hospitalName: string;
  queueStatus: "waiting" | "in-case-taking" | "triage-alert" | "case-completed" | "consulting" | "discharged";
  structuredSummary?: StructuredHpiSummary;
  ayushData?: DashavidhaParikshaData;
  vitals?: PatientVitals;
  timeline: TimelineEvent[];
  documents: MedicalDocument[];
  activeMedications: ExtractedMedication[];
  allergies: string[];
}

export interface ConsentAuthorization {
  id: string;
  granteeName: string;
  granteeType: "Doctor" | "Hospital" | "Pharmacy" | "Diagnostic Lab" | "AYUSH Practitioner";
  purpose: string;
  dataCategories: ("All History" | "Active Medications" | "Lab Reports" | "Current Complaint Only" | "Prescription Write-Only" | "AYUSH Records")[];
  accessLevel: "Read-Only" | "Write-Only (Dispensation)" | "Full Care Access";
  validFrom: string;
  validTill: string;
  status: "Active" | "Revoked" | "Expired";
}

export interface AccessAuditLog {
  id: string;
  timestamp: string;
  accessorName: string;
  accessorRole: string;
  facility: string;
  action: "Viewed Full Timeline" | "Read Case Summary" | "Appended Dispensation QR" | "Uploaded Lab Report" | "Revoked Access" | "Serial-Authorized Access" | "Added Consultation Record" | "Linked Pharmacy Dispensation";
  dataAccessed: string;
  ipLocation: string;
}

export interface PatientCondition {
  id: string;
  label: string;
  kind: "symptom" | "condition" | "allergy" | "diagnosis";
  source: ProvenanceSource;
  confidence: number;
  verified: boolean;
  recordedBy?: string;
  recordedAt: string;
  notes?: string;
}

export interface SelfAssessmentEntry {
  id: string;
  submittedAt: string;
  rawText: string;
  extractedConditionIds: string[];
  extractedMedicationIds: string[];
  aiConfidenceAvg: number;
}

export interface DoctorConsultationRecord {
  id: string;
  doctorName: string;
  licenseNumber: string;
  organization: string;
  timestamp: string;
  clinicalNotes: string;
  diagnosedConditionIds: string[];
  prescribedMedicationIds: string[];
  recommendations: string;
}

export interface DoctorIdentity {
  name: string;
  licenseNumber: string;
  organization: string;
  department: string;
}

export interface CreateAccountInput {
  name: string;
  age: number;
  gender: "Female" | "Male" | "Other";
  phone: string;
  bloodGroup: string;
  preferredLanguage: IndicLanguage;
}

export interface UpdateHealthOverviewInput {
  name?: string;
  age?: number;
  gender?: "Female" | "Male" | "Other";
  phone?: string;
  bloodGroup?: string;
  abhaId?: string;
  vitals?: PatientVitals;
  allergies?: string[];
  conditions?: Array<{
    label: string;
    kind: "condition" | "diagnosis" | "symptom" | "allergy";
    notes?: string;
  }>;
  medications?: Array<{
    standardMolecule: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  doctorNotes?: string;
}
