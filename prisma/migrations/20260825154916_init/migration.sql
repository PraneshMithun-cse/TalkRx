-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'DOCTOR', 'PHARMACY', 'STAFF');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Female', 'Male', 'Other');

-- CreateEnum
CREATE TYPE "IndicLanguage" AS ENUM ('hi', 'ta', 'te', 'bn', 'mr', 'kn', 'ml', 'gu', 'pa', 'od', 'en');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('waiting', 'in_case_taking', 'triage_alert', 'case_completed', 'consulting', 'discharged');

-- CreateEnum
CREATE TYPE "ProvenanceSource" AS ENUM ('patient_reported', 'doctor_prescribed', 'pharmacy_dispensed', 'document_extracted', 'ayush_assessed', 'lab_verified');

-- CreateEnum
CREATE TYPE "ConditionKind" AS ENUM ('symptom', 'condition', 'allergy', 'diagnosis');

-- CreateEnum
CREATE TYPE "MedicationStatus" AS ENUM ('active', 'completed', 'discontinued');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('prescription', 'lab_report', 'discharge_summary', 'diagnostic_scan', 'ayush_consult');

-- CreateEnum
CREATE TYPE "GranteeType" AS ENUM ('Doctor', 'Hospital', 'Pharmacy', 'Diagnostic_Lab', 'AYUSH_Practitioner');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('Read_Only', 'Write_Only', 'Full_Care_Access');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('Active', 'Revoked', 'Expired');

-- CreateEnum
CREATE TYPE "RedFlagCategory" AS ENUM ('cardiac', 'respiratory', 'stroke', 'sepsis', 'obstetric', 'paediatric', 'severe_trauma');

-- CreateEnum
CREATE TYPE "RedFlagSeverity" AS ENUM ('critical', 'high', 'moderate');

-- CreateEnum
CREATE TYPE "RedFlagStatus" AS ENUM ('active', 'acknowledged', 'resolved');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT,
    "role" "UserRole" NOT NULL,
    "name" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "organization" TEXT,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "abhaId" TEXT NOT NULL DEFAULT 'Not Linked',
    "abhaAddress" TEXT NOT NULL DEFAULT 'Not Linked',
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "phone" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "preferredLanguage" "IndicLanguage" NOT NULL DEFAULT 'en',
    "photoUrl" TEXT,
    "isReturningPatient" BOOLEAN NOT NULL DEFAULT false,
    "tokenNumber" TEXT NOT NULL DEFAULT '—',
    "department" TEXT NOT NULL DEFAULT '—',
    "hospitalName" TEXT NOT NULL DEFAULT '—',
    "queueStatus" "QueueStatus" NOT NULL DEFAULT 'waiting',
    "structuredSummary" JSONB,
    "ayushData" JSONB,
    "allergies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientCondition" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "kind" "ConditionKind" NOT NULL,
    "source" "ProvenanceSource" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "recordedBy" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "sourceAssessmentId" TEXT,
    "sourceDoctorRecordId" TEXT,

    CONSTRAINT "PatientCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtractedMedication" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "standardMolecule" TEXT NOT NULL,
    "brandName" TEXT,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "confirmedByPatient" BOOLEAN NOT NULL DEFAULT false,
    "status" "MedicationStatus" NOT NULL DEFAULT 'active',
    "source" "ProvenanceSource" NOT NULL,
    "prescribedBy" TEXT,
    "dispensedBy" TEXT,
    "dispensedAt" TIMESTAMP(3),
    "notes" TEXT,
    "sourceAssessmentId" TEXT,
    "sourceDoctorRecordId" TEXT,
    "sourceDocumentId" TEXT,

    CONSTRAINT "ExtractedMedication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfAssessmentEntry" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawText" TEXT NOT NULL,
    "aiConfidenceAvg" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SelfAssessmentEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorConsultationRecord" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "doctorName" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clinicalNotes" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,

    CONSTRAINT "DoctorConsultationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentAuthorization" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "granteeName" TEXT NOT NULL,
    "granteeType" "GranteeType" NOT NULL,
    "purpose" TEXT NOT NULL,
    "dataCategories" TEXT[],
    "accessLevel" "AccessLevel" NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTill" TIMESTAMP(3) NOT NULL,
    "status" "ConsentStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "ConsentAuthorization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessAuditLog" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessorName" TEXT NOT NULL,
    "accessorRole" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "dataAccessed" TEXT NOT NULL,
    "ipLocation" TEXT NOT NULL,

    CONSTRAINT "AccessAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "source" "ProvenanceSource" NOT NULL,
    "sourceEntity" TEXT NOT NULL,
    "doctorName" TEXT,
    "facility" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "metadata" JSONB,
    "isRedFlag" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedFlagAlert" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "category" "RedFlagCategory" NOT NULL,
    "severity" "RedFlagSeverity" NOT NULL,
    "matchedRule" TEXT NOT NULL,
    "patientStatement" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "escalatedTo" TEXT NOT NULL,
    "status" "RedFlagStatus" NOT NULL DEFAULT 'active',
    "actionRequired" TEXT NOT NULL,

    CONSTRAINT "RedFlagAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalDocument" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "date" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "doctorName" TEXT,
    "fileUrl" TEXT,
    "ocrConfidence" DOUBLE PRECISION NOT NULL,
    "extractedDiagnoses" TEXT[],
    "rawText" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MedicalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtractedLabResult" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "parameter" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "referenceRange" TEXT NOT NULL,
    "isAbnormal" BOOLEAN NOT NULL,
    "loincCode" TEXT,
    "sourceDoc" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "ExtractedLabResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_serialNumber_key" ON "Patient"("serialNumber");

-- CreateIndex
CREATE INDEX "Patient_serialNumber_idx" ON "Patient"("serialNumber");

-- CreateIndex
CREATE INDEX "Patient_abhaId_idx" ON "Patient"("abhaId");

-- CreateIndex
CREATE INDEX "PatientCondition_patientId_idx" ON "PatientCondition"("patientId");

-- CreateIndex
CREATE INDEX "ExtractedMedication_patientId_idx" ON "ExtractedMedication"("patientId");

-- CreateIndex
CREATE INDEX "SelfAssessmentEntry_patientId_idx" ON "SelfAssessmentEntry"("patientId");

-- CreateIndex
CREATE INDEX "DoctorConsultationRecord_patientId_idx" ON "DoctorConsultationRecord"("patientId");

-- CreateIndex
CREATE INDEX "ConsentAuthorization_patientId_idx" ON "ConsentAuthorization"("patientId");

-- CreateIndex
CREATE INDEX "AccessAuditLog_patientId_idx" ON "AccessAuditLog"("patientId");

-- CreateIndex
CREATE INDEX "TimelineEvent_patientId_idx" ON "TimelineEvent"("patientId");

-- CreateIndex
CREATE INDEX "RedFlagAlert_patientId_idx" ON "RedFlagAlert"("patientId");

-- CreateIndex
CREATE INDEX "MedicalDocument_patientId_idx" ON "MedicalDocument"("patientId");

-- CreateIndex
CREATE INDEX "ExtractedLabResult_documentId_idx" ON "ExtractedLabResult"("documentId");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientCondition" ADD CONSTRAINT "PatientCondition_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientCondition" ADD CONSTRAINT "PatientCondition_sourceAssessmentId_fkey" FOREIGN KEY ("sourceAssessmentId") REFERENCES "SelfAssessmentEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientCondition" ADD CONSTRAINT "PatientCondition_sourceDoctorRecordId_fkey" FOREIGN KEY ("sourceDoctorRecordId") REFERENCES "DoctorConsultationRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedMedication" ADD CONSTRAINT "ExtractedMedication_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedMedication" ADD CONSTRAINT "ExtractedMedication_sourceAssessmentId_fkey" FOREIGN KEY ("sourceAssessmentId") REFERENCES "SelfAssessmentEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedMedication" ADD CONSTRAINT "ExtractedMedication_sourceDoctorRecordId_fkey" FOREIGN KEY ("sourceDoctorRecordId") REFERENCES "DoctorConsultationRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedMedication" ADD CONSTRAINT "ExtractedMedication_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "MedicalDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfAssessmentEntry" ADD CONSTRAINT "SelfAssessmentEntry_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorConsultationRecord" ADD CONSTRAINT "DoctorConsultationRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorConsultationRecord" ADD CONSTRAINT "DoctorConsultationRecord_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentAuthorization" ADD CONSTRAINT "ConsentAuthorization_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessAuditLog" ADD CONSTRAINT "AccessAuditLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedFlagAlert" ADD CONSTRAINT "RedFlagAlert_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalDocument" ADD CONSTRAINT "MedicalDocument_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedLabResult" ADD CONSTRAINT "ExtractedLabResult_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "MedicalDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
