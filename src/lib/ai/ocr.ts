import "server-only";
import { groq, GROQ_VISION_MODEL } from "@/lib/groq";
import type { ExtractedMedicationResult } from "@/lib/ai/extraction";

export interface ExtractedLabResultData {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  loincCode?: string;
}

export interface DocumentOcrResult {
  rawText: string;
  ocrConfidence: number;
  extractedMedicines: ExtractedMedicationResult[];
  extractedLabs: ExtractedLabResultData[];
  extractedDiagnoses: string[];
}

const DOCUMENT_SCHEMA = {
  type: "object",
  properties: {
    rawText: { type: "string", description: "The full transcribed text of the document, as literally as possible" },
    ocrConfidence: { type: "number", description: "0 to 1 confidence in the overall transcription quality" },
    extractedMedicines: {
      type: "array",
      items: {
        type: "object",
        properties: {
          rawText: { type: "string" },
          standardMolecule: { type: "string" },
          dosage: { type: "string" },
          frequency: { type: "string" },
          confidence: { type: "number" },
        },
        required: ["rawText", "standardMolecule", "dosage", "frequency", "confidence"],
        additionalProperties: false,
      },
    },
    extractedLabs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          parameter: { type: "string" },
          value: { type: "string" },
          unit: { type: "string" },
          referenceRange: { type: "string" },
          isAbnormal: { type: "boolean" },
          loincCode: { type: "string" },
        },
        required: ["parameter", "value", "unit", "referenceRange", "isAbnormal", "loincCode"],
        additionalProperties: false,
      },
    },
    extractedDiagnoses: { type: "array", items: { type: "string" } },
  },
  required: ["rawText", "ocrConfidence", "extractedMedicines", "extractedLabs", "extractedDiagnoses"],
  additionalProperties: false,
} as const;

function clampConfidence(n: unknown): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0.5;
  return Math.min(1, Math.max(0, Math.round(v * 100) / 100));
}

/**
 * Runs real vision OCR + structured extraction on an uploaded prescription/lab/discharge-summary
 * image via Groq's qwen3.6-27b (the only vision-capable model on this account). `imageDataUrl`
 * must be a `data:image/...;base64,...` URL.
 */
export async function extractMedicalDocument(imageDataUrl: string): Promise<DocumentOcrResult> {
  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_VISION_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a medical document OCR and extraction assistant for an Indian OPD. Transcribe the " +
            "uploaded image (a prescription, lab report, or discharge summary — often handwritten or a phone " +
            "photo) and extract structured data: medications (molecule/brand, dosage, frequency), lab results " +
            "(parameter, value, unit, reference range, whether abnormal), and diagnoses mentioned. Leave a field " +
            "as an empty array/string if it genuinely isn't present rather than guessing. loincCode should be an " +
            "empty string if unknown.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract all clinical information from this document." },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "medical_document_extraction", schema: DOCUMENT_SCHEMA, strict: true },
      },
      temperature: 0.1,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty completion from Groq");
    const parsed = JSON.parse(raw) as {
      rawText: string;
      ocrConfidence: number;
      extractedMedicines: ExtractedMedicationResult[];
      extractedLabs: (ExtractedLabResultData & { loincCode?: string })[];
      extractedDiagnoses: string[];
    };

    return {
      rawText: parsed.rawText,
      ocrConfidence: clampConfidence(parsed.ocrConfidence),
      extractedMedicines: parsed.extractedMedicines.map((m) => ({ ...m, confidence: clampConfidence(m.confidence) })),
      extractedLabs: parsed.extractedLabs.map((l) => ({ ...l, loincCode: l.loincCode || undefined })),
      extractedDiagnoses: parsed.extractedDiagnoses,
    };
  } catch (err) {
    console.error("extractMedicalDocument: Groq vision call failed", err);
    return {
      rawText: "AI OCR unavailable for this document — please verify manually.",
      ocrConfidence: 0.2,
      extractedMedicines: [],
      extractedLabs: [],
      extractedDiagnoses: [],
    };
  }
}
