"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions/auth-helpers";
import { loadPatient } from "@/lib/actions/vault";
import { nowParts } from "@/lib/actions/serialize";
import { extractMedicalDocument } from "@/lib/ai/ocr";
import type { PatientProfile } from "@/components/talkrx/types";

const VALID_CATEGORIES = ["prescription", "lab_report", "discharge_summary", "diagnostic_scan", "ayush_consult"] as const;

export async function uploadMedicalDocumentAction(formData: FormData): Promise<PatientProfile> {
  const user = await getCurrentUser();
  const patientId = String(formData.get("patientId") ?? "");
  if (!patientId) throw new Error("patientId is required");

  const categoryRaw = String(formData.get("category") ?? "prescription");
  const category = (VALID_CATEGORIES as readonly string[]).includes(categoryRaw)
    ? (categoryRaw as (typeof VALID_CATEGORIES)[number])
    : "prescription";
  const title = String(formData.get("title") ?? "Uploaded Document");
  const facility = String(formData.get("facility") ?? "TalkRx Digital");

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file uploaded");

  const bytes = Buffer.from(await file.arrayBuffer());
  const base64 = bytes.toString("base64");
  const dataUrl = `data:${file.type || "image/jpeg"};base64,${base64}`;

  const extraction = await extractMedicalDocument(dataUrl);
  const { date, time } = nowParts();

  await prisma.$transaction(async (tx) => {
    const doc = await tx.medicalDocument.create({
      data: {
        patientId,
        title,
        category,
        date,
        facility,
        ocrConfidence: extraction.ocrConfidence,
        extractedDiagnoses: extraction.extractedDiagnoses,
        rawText: extraction.rawText,
        verified: false,
      },
    });

    if (extraction.extractedMedicines.length) {
      await tx.extractedMedication.createMany({
        data: extraction.extractedMedicines.map((m) => ({
          patientId,
          rawText: m.rawText,
          standardMolecule: m.standardMolecule,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: "Unspecified",
          confidence: m.confidence,
          confirmedByPatient: false,
          status: "active",
          source: "document-extracted",
          sourceDocumentId: doc.id,
        })),
      });
    }

    if (extraction.extractedLabs.length) {
      await tx.extractedLabResult.createMany({
        data: extraction.extractedLabs.map((l) => ({
          documentId: doc.id,
          parameter: l.parameter,
          value: l.value,
          unit: l.unit,
          referenceRange: l.referenceRange,
          isAbnormal: l.isAbnormal,
          loincCode: l.loincCode,
          sourceDoc: title,
          date,
        })),
      });
    }

    await tx.timelineEvent.create({
      data: {
        patientId,
        date,
        time,
        title: "Medical Document Digitized",
        subtitle: title,
        category: "document",
        source: "document-extracted",
        sourceEntity: "TalkRx Document Intelligence",
        facility,
        description: `AI extracted ${extraction.extractedMedicines.length} medication(s), ${extraction.extractedLabs.length} lab result(s), and ${extraction.extractedDiagnoses.length} diagnosis mention(s) from the uploaded ${category.replace("_", " ")}.`,
        tags: ["Document-Extracted", `${Math.round(extraction.ocrConfidence * 100)}% OCR Confidence`],
      },
    });
  });

  return loadPatient(patientId);
}
